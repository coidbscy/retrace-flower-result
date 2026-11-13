import { NextResponse } from "next/server";
import { requestAnalysis } from "@/lib/claude";
import { redis, resultKey, RESULT_TTL_SECONDS } from "@/lib/redis";
import type { ResultRecord } from "@/lib/types";

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  const id = body?.id;

  if (typeof id !== "string" || id.length === 0) {
    return NextResponse.json({ error: "id가 필요해요." }, { status: 400 });
  }

  const key = resultKey(id);
  const record = await redis.get<ResultRecord>(key);

  if (!record) {
    return NextResponse.json(
      { error: "결과를 찾을 수 없어요. 링크를 다시 확인해주세요." },
      { status: 404 },
    );
  }

  // 이미 분석된 결과가 있으면 같은 결과를 그대로 돌려줍니다.
  if (record.analysis) {
    return NextResponse.json({ analysis: record.analysis });
  }

  const analysis = await requestAnalysis(record.answers);

  if (!analysis) {
    return NextResponse.json(
      { error: "꽃을 피우는 데 어려움이 있었어요. 잠시 후 다시 시도해주세요." },
      { status: 502 },
    );
  }

  const updated: ResultRecord = { ...record, analysis };
  await redis.set(key, updated, { ex: RESULT_TTL_SECONDS });

  return NextResponse.json({ analysis });
}
