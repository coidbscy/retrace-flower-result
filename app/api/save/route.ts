import { NextResponse } from "next/server";
import { generateId } from "@/lib/id";
import { redis, resultKey, RESULT_TTL_SECONDS } from "@/lib/redis";
import type { AnswerItem, ResultRecord } from "@/lib/types";

// 원래 RE:TRACE 사이트(다른 도메인)의 브라우저 코드가 직접 호출할 수 있도록 허용합니다.
const ALLOWED_ORIGIN = "https://re-trace-ecru.vercel.app";

function corsHeaders(): HeadersInit {
  return {
    "Access-Control-Allow-Origin": ALLOWED_ORIGIN,
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
  };
}

export async function OPTIONS() {
  return new NextResponse(null, { status: 204, headers: corsHeaders() });
}

function isAnswerItem(value: unknown): value is AnswerItem {
  if (!value || typeof value !== "object") return false;
  const v = value as Record<string, unknown>;
  return (
    typeof v.question === "string" &&
    v.question.trim().length > 0 &&
    typeof v.answer === "string" &&
    v.answer.trim().length > 0
  );
}

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  const answers = body?.answers;

  if (!Array.isArray(answers) || answers.length === 0 || !answers.every(isAnswerItem)) {
    return NextResponse.json(
      { error: "answers는 { question, answer } 형태의 배열이어야 해요." },
      { status: 400, headers: corsHeaders() },
    );
  }

  const id = generateId();
  const record: ResultRecord = {
    answers,
    analysis: null,
    createdAt: new Date().toISOString(),
  };

  await redis.set(resultKey(id), record, { ex: RESULT_TTL_SECONDS });

  return NextResponse.json({ id }, { headers: corsHeaders() });
}
