import { Redis } from "@upstash/redis";

// Vercel Marketplace의 Upstash Redis 연동이 UPSTASH_REDIS_REST_URL / _TOKEN
// 환경변수를 자동으로 주입해주기 때문에 fromEnv()만으로 연결이 끝납니다.
export const redis = Redis.fromEnv();

export const RESULT_TTL_SECONDS = 60 * 60 * 24 * 30; // 30일

export function resultKey(id: string): string {
  return `result:${id}`;
}
