import { FLOWER_LIST, getFlower, type FlowerId } from "./flowers";
import type { Analysis, AnswerItem } from "./types";

// Claude API를 호출하지 않고, 답변 속 키워드로 가장 어울리는 꽃을 고른 뒤
// lib/flowers.ts에 미리 써둔 본문으로 결과를 만듭니다.
// ANALYSIS_MODE=mock 환경변수가 설정됐을 때 쓰입니다 (Anthropic 크레딧이 없을 때의 실제 서비스 경로).

function hashToIndex(text: string, length: number): number {
  let hash = 0;
  for (let i = 0; i < text.length; i++) {
    hash = (hash * 31 + text.charCodeAt(i)) >>> 0;
  }
  return hash % length;
}

/** 답변 전체 텍스트에서 각 꽃의 키워드가 몇 번 나오는지 세어 가장 잘 맞는 꽃을 고릅니다.
 *  아무 키워드도 없으면 답변 내용을 기반으로 한 해시로 고정된 꽃을 고릅니다(같은 답변엔 늘 같은 꽃). */
function pickFlowerId(answers: AnswerItem[]): FlowerId {
  const joined = answers.map((a) => a.answer).join(" ");

  const scores = FLOWER_LIST.map((flower) => ({
    id: flower.id,
    score: flower.keywords.reduce(
      (count, keyword) => count + (joined.includes(keyword) ? 1 : 0),
      0,
    ),
  }));

  const best = scores.reduce((a, b) => (b.score > a.score ? b : a));
  if (best.score > 0) return best.id;

  return FLOWER_LIST[hashToIndex(joined, FLOWER_LIST.length)].id;
}

export function generateMockAnalysis(answers: AnswerItem[]): Analysis {
  const flowerId = pickFlowerId(answers);
  const flower = getFlower(flowerId);
  const firstAnswer = answers[0]?.answer ?? "들려주신 이야기";

  return {
    flower: flowerId,
    connection: `"${firstAnswer}"라는 말씀이 ${flower.name}의 꽃말인 '${flower.meaning}'과 닮아 있었어요. ${flower.connectionHint}`,
    who: flower.essence,
    strengths: flower.strengths,
    potential: flower.potential,
  };
}
