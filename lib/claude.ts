import Anthropic from "@anthropic-ai/sdk";
import { FLOWER_LIST, isFlowerId } from "./flowers";
import type { Analysis, AnswerItem } from "./types";

const client = new Anthropic();

const MODEL = "claude-sonnet-5";

const SYSTEM_PROMPT = `당신은 사람들의 마음을 다정하게 들여다보고 꽃으로 비유해 위로를 건네는 글을 쓰는 작가입니다.
답변자는 마음이 불안정하거나 위로가 필요하거나 자신을 잘 모르는 사람일 수 있습니다.
절대로 진단하거나 단정하지 말고, 답변자가 실제로 쓴 표현에 근거해서 따뜻하고 다정하게 서술하세요.
모든 문장은 존댓말로 쓰고, "그때"처럼 시기가 불분명한 표현은 쓰지 마세요.
문장은 짧고 간결하게, 군더더기 없이 쓰세요.
반드시 아래 JSON 형식으로만 답하세요. 다른 설명, 인사말, 마크다운 코드블록은 절대 포함하지 마세요.

{
  "flower": "꽃 id (아래 목록 중 하나)",
  "connection": "사용자의 실제 답변 표현을 짧게 언급하며 이 꽃의 꽃말과 어떻게 닿아 있는지 (2문장)",
  "who": "당신은 이런 사람이에요 (2~3문장)",
  "strengths": ["장점1 (1문장)", "장점2 (1문장)", "장점3 (1문장)"],
  "potential": "당신이 지닌 가능성 (2문장)"
}`;

function buildUserPrompt(answers: AnswerItem[]): string {
  const flowerList = FLOWER_LIST.map(
    (f) =>
      `- id: "${f.id}" / 이름: ${f.name}(${f.englishName}) / 꽃말: ${f.meaning} / 이런 사람에게 어울림: ${f.forWhom}`,
  ).join("\n");

  const answerList = answers
    .map((a, i) => `${i + 1}. 질문: ${a.question}\n   답변: ${a.answer}`)
    .join("\n");

  return `[고를 수 있는 꽃 6종]\n${flowerList}\n\n[답변자의 답변]\n${answerList}\n\n위 답변을 바탕으로 가장 어울리는 꽃 한 가지를 고르고, 정해진 JSON 형식으로만 답해주세요.`;
}

function extractJsonText(raw: string): string {
  const fenced = raw.match(/```(?:json)?\s*([\s\S]*?)\s*```/i);
  return (fenced ? fenced[1] : raw).trim();
}

function isValidAnalysis(value: unknown): value is Analysis {
  if (!value || typeof value !== "object") return false;
  const v = value as Record<string, unknown>;
  return (
    isFlowerId(v.flower) &&
    typeof v.connection === "string" &&
    v.connection.trim().length > 0 &&
    typeof v.who === "string" &&
    v.who.trim().length > 0 &&
    Array.isArray(v.strengths) &&
    v.strengths.length >= 2 &&
    v.strengths.every((s) => typeof s === "string" && s.trim().length > 0) &&
    typeof v.potential === "string" &&
    v.potential.trim().length > 0
  );
}

async function requestAnalysisOnce(
  answers: AnswerItem[],
): Promise<Analysis | null> {
  try {
    const response = await client.messages.create({
      model: MODEL,
      max_tokens: 2048,
      system: SYSTEM_PROMPT,
      messages: [{ role: "user", content: buildUserPrompt(answers) }],
    });

    const textBlock = response.content.find((b) => b.type === "text");
    if (!textBlock || textBlock.type !== "text") return null;

    const parsed = JSON.parse(extractJsonText(textBlock.text));
    return isValidAnalysis(parsed) ? parsed : null;
  } catch (error) {
    console.error("Claude 분석 요청 실패:", error);
    return null;
  }
}

// 꽃이 6종 밖이거나 JSON이 깨지면 한 번 더 시도하고, 그래도 실패하면 null을 돌려줍니다.
export async function requestAnalysis(
  answers: AnswerItem[],
): Promise<Analysis | null> {
  const first = await requestAnalysisOnce(answers);
  if (first) return first;
  return await requestAnalysisOnce(answers);
}
