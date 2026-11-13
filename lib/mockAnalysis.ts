import { FLOWER_IDS, getFlower } from "./flowers";
import type { Analysis, AnswerItem } from "./types";

// Claude API 비용 없이 화면 흐름 전체를 테스트하기 위한 가짜 분석 생성기입니다.
// ANALYSIS_MODE=mock 환경변수가 설정됐을 때만 사용되고, Claude를 전혀 호출하지 않습니다.
function hashToIndex(text: string, length: number): number {
  let hash = 0;
  for (let i = 0; i < text.length; i++) {
    hash = (hash * 31 + text.charCodeAt(i)) >>> 0;
  }
  return hash % length;
}

export function generateMockAnalysis(answers: AnswerItem[]): Analysis {
  const joined = answers.map((a) => a.answer).join(" ");
  const flowerId = FLOWER_IDS[hashToIndex(joined, FLOWER_IDS.length)];
  const flower = getFlower(flowerId);
  const firstAnswer = answers[0]?.answer ?? "들려주신 이야기";

  return {
    flower: flowerId,
    connection: `"${firstAnswer}"라는 말씀이 ${flower.name}의 꽃말, '${flower.meaning}'과 닮아 있어요. (테스트 모드 예시 문장입니다.)`,
    who: `당신은 ${flower.forWhom}에 가까운 사람이에요. (테스트 모드 예시 문장입니다.)`,
    strengths: [
      "테스트 모드 예시 장점 1입니다.",
      "테스트 모드 예시 장점 2입니다.",
      "테스트 모드 예시 장점 3입니다.",
    ],
    potential: `${flower.name}처럼, 당신에게도 분명한 가능성이 있어요. (테스트 모드 예시 문장입니다.)`,
  };
}
