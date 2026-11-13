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
    connection: `"${firstAnswer}"라고 말씀해주신 부분이 ${flower.name}의 꽃말인 '${flower.meaning}'과 닮아 있었어요. (테스트 모드로 생성된 예시 문장이에요.) 실제 서비스에서는 Claude가 답변 전체를 읽고 이 문장을 새로 써드려요.`,
    who: `당신은 ${flower.forWhom}에 가까운 사람인 것 같아요. 이 문단은 테스트 모드 예시 문장이라 실제 분석과는 달라요. ANALYSIS_MODE를 끄면 Claude가 답변을 바탕으로 진짜 문장을 만들어드립니다.`,
    strengths: [
      "테스트 모드 예시 장점 1 (실제로는 답변에서 뽑아낸 장점이 들어가요).",
      "테스트 모드 예시 장점 2 입니다.",
      "테스트 모드 예시 장점 3 입니다.",
    ],
    potential: `${flower.name}처럼, 당신에게도 분명한 가능성이 있어요. 이 문단 역시 테스트 모드 예시이며, 실제 배포 시에는 Claude API가 답변에 근거해 작성합니다.`,
  };
}
