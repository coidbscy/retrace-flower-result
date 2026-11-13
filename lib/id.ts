import { randomBytes } from "node:crypto";

// result:[id]의 [id] 부분. 16자 16진수 문자열이라 추측이 거의 불가능합니다.
export function generateId(): string {
  return randomBytes(8).toString("hex");
}
