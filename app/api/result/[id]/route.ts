import { NextResponse } from "next/server";
import { redis, resultKey } from "@/lib/redis";
import type { ResultRecord } from "@/lib/types";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const record = await redis.get<ResultRecord>(resultKey(id));

  if (!record) {
    return NextResponse.json(
      { error: "결과를 찾을 수 없어요. 링크를 다시 확인해주세요." },
      { status: 404 },
    );
  }

  return NextResponse.json(record);
}
