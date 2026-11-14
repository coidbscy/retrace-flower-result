// 결과에 쓰이는 꽃 6종의 데이터를 한 곳에 모아둔 파일입니다.
// 이름, 꽃말, 설명, 본문 문구를 바꾸고 싶을 때는 이 파일만 고치면 됩니다.
//
// meaning/forWhom은 원래 정해둔 꽃말이고, additionalMeanings는 전통적인 꽃말(화훼 언어) 중에서
// 추가로 찾은 의미들입니다. essence/strengths/potential/connectionHint는 결과 페이지 본문에
// 실제로 쓰이는 문구로, 이 추가 꽃말들을 바탕으로 쓴 것입니다.

export type FlowerId =
  | "freesia"
  | "daisy"
  | "lotus"
  | "peony"
  | "lavender"
  | "sunflower";

export interface Flower {
  id: FlowerId;
  name: string;
  englishName: string;
  meaning: string;
  forWhom: string;
  /** 전통적으로 함께 전해지는 다른 꽃말들 (참고용 조사 내용) */
  additionalMeanings: string[];
  /** 답변을 이 꽃과 연결할 때 쓰는 키워드 (규칙 기반 매칭용) */
  keywords: string[];
  /** "당신은 이런 사람이에요" 본문 */
  essence: string;
  /** "당신의 장점" 목록 (3개) */
  strengths: string[];
  /** "당신이 지닌 가능성" 본문 */
  potential: string;
  /** "당신의 답변과 이 꽃" 문장 뒤에 덧붙는, 꽃말과 답변을 잇는 한 문장 */
  connectionHint: string;
  /** 보관함 "나의 꽃밭"에서, 이 꽃이 가장 많이 나왔을 때 보여주는 누적형 위로의 말 (1~2문장) */
  gardenSummary: string;
}

export const FLOWERS: Record<FlowerId, Flower> = {
  freesia: {
    id: "freesia",
    name: "프리지아",
    englishName: "Freesia",
    meaning: "새로운 시작, 첫걸음",
    forWhom: "새 환경, 도전, 시작을 앞둔 사람",
    additionalMeanings: ["순수함", "신뢰", "우정", "상쾌함"],
    keywords: ["시작", "처음", "도전", "새로운", "새출발", "입학", "입사", "이사", "변화", "용기"],
    essence:
      "당신은 새로운 길 앞에서 한 걸음을 떼어보려는 사람이에요. 두렵지 않아서가 아니라, 두려움에도 불구하고 나아가보려는 마음이 더 크기 때문일 거예요. 그 작은 용기가 지금의 당신을 여기까지 데려왔어요.",
    strengths: [
      "낯선 상황에서도 먼저 움직여보는 용기가 있어요.",
      "새로운 것을 받아들이는 마음이 유연해요.",
      "스스로를 다그치기보다, 한 걸음씩 나아가는 법을 알아요.",
    ],
    potential:
      "지금의 작은 시작이 생각보다 멀리까지 이어질 수 있어요. 프리지아의 맑은 향기처럼, 당신이 내딛는 걸음마다 주변에도 좋은 기운이 번질 거예요.",
    connectionHint: "새로운 무언가를 향해 마음이 움직이고 있다는 신호처럼 보였어요.",
    gardenSummary:
      "당신은 망설임보다 용기를 더 자주 선택해온 사람이에요. 새로운 길 앞에서 몇 번이고 다시 한 걸음을 내디뎌온 거예요.",
  },
  daisy: {
    id: "daisy",
    name: "데이지",
    englishName: "Daisy",
    meaning: "희망",
    forWhom: "작은 빛을 찾는 사람, 불안하지만 열심히 해나가는 사람",
    additionalMeanings: ["순수한 사랑", "평화", "인내"],
    keywords: ["희망", "불안", "힘들", "버티", "견디", "포기하지", "걱정", "막막"],
    essence:
      "당신은 불안한 순간에도 작은 빛을 찾아내려는 사람이에요. 모든 게 확실하지 않아도, 그 안에서 희망의 조각을 놓지 않고 있어요. 그 마음이 데이지처럼 소박하지만 단단해요.",
    strengths: [
      "힘든 와중에도 포기하지 않고 계속 나아가요.",
      "작은 희망을 발견하는 눈을 가지고 있어요.",
      "꾸밈없이 솔직한 마음으로 자신을 마주해요.",
    ],
    potential:
      "지금 품고 있는 그 작은 희망이, 시간이 지나면 당신을 지탱해주는 단단한 뿌리가 될 거예요.",
    connectionHint: "작아 보여도 분명한 희망의 빛을 붙잡고 계신 것 같았어요.",
    gardenSummary:
      "당신은 쉽게 포기하지 않는 사람이에요. 불안한 순간에도 매번 작은 희망을 붙잡아온 마음이 고스란히 쌓였어요.",
  },
  lotus: {
    id: "lotus",
    name: "연꽃",
    englishName: "Lotus",
    meaning: "청순한 마음",
    forWhom: "흐림 속에서도 맑은 사람, 혼란 속에서도 지킬 것을 지키는 사람",
    additionalMeanings: ["순결", "깨달음", "재생", "인내와 강인함"],
    keywords: ["혼란", "복잡", "흔들리지", "중심", "맑은", "진흙", "어지럽", "시끄럽"],
    essence:
      "당신은 혼란스러운 상황 속에서도 맑음을 잃지 않으려는 사람이에요. 연꽃이 흐린 물 위에서도 깨끗하게 피어나듯, 당신도 주변이 어지러워도 지킬 것은 지켜내고 있어요.",
    strengths: [
      "힘든 환경에서도 자기 자신을 잃지 않아요.",
      "혼란 속에서도 중심을 잡는 힘이 있어요.",
      "겉모습에 흔들리지 않고 본질을 보려 해요.",
    ],
    potential:
      "지금처럼 맑음을 지켜나간다면, 시간이 지날수록 더 단단하고 투명한 사람으로 피어날 거예요.",
    connectionHint: "흐려 보이는 순간에도 맑음을 지키려는 마음이 전해졌어요.",
    gardenSummary:
      "당신은 흔들리는 상황 속에서도 스스로를 잃지 않으려 애써온 사람이에요. 그 맑음을 지켜내려는 마음이 여러 번 드러났어요.",
  },
  peony: {
    id: "peony",
    name: "작약",
    englishName: "Peony",
    meaning: "수줍음",
    forWhom: "조심스럽게 피어나는 사람, 표현을 어려워하는 마음",
    additionalMeanings: ["부귀영화", "행복한 결혼", "치유"],
    keywords: ["표현", "수줍", "조심스럽", "말하기", "속마음", "부끄럽", "망설"],
    essence:
      "당신은 마음을 표현하는 데 조심스러운 사람이에요. 쉽게 꺼내 보이지 못해도, 그 안에는 섬세하고 깊은 마음이 자리하고 있어요. 작약이 천천히 겹겹이 피어나듯, 당신도 자신만의 속도로 마음을 열어가고 있어요.",
    strengths: [
      "말보다 행동으로 마음을 표현할 줄 알아요.",
      "섬세하게 주변을 살피는 다정함이 있어요.",
      "서두르지 않고 자신의 속도를 지켜요.",
    ],
    potential:
      "지금은 조심스럽게 오므리고 있어도, 때가 되면 작약처럼 풍성하고 아름답게 마음을 펼칠 수 있을 거예요.",
    connectionHint: "조심스럽지만 분명한 마음이 느껴졌어요.",
    gardenSummary:
      "당신은 서두르지 않고 자신의 속도로 마음을 열어가는 사람이에요. 조심스러움 속에 담긴 진심이 여러 번 느껴졌어요.",
  },
  lavender: {
    id: "lavender",
    name: "라벤더",
    englishName: "Lavender",
    meaning: "침묵, 기대",
    forWhom: "고요 속에서 자라는 사람, 혼자만의 시간",
    additionalMeanings: ["평온함과 치유", "침착함", "헌신"],
    keywords: ["혼자", "조용", "고요", "쉬고", "휴식", "침묵", "잠깐"],
    essence:
      "당신은 고요한 시간 속에서 자신을 돌보는 사람이에요. 소란스러운 곳보다 혼자만의 시간에서 더 깊이 숨 쉴 수 있는 사람이죠. 라벤더의 향기처럼 당신의 침묵에는 차분한 힘이 담겨 있어요.",
    strengths: [
      "혼자만의 시간을 소중히 여길 줄 알아요.",
      "조용히 스스로를 돌보는 법을 알고 있어요.",
      "서두르지 않고 마음을 가라앉히는 힘이 있어요.",
    ],
    potential: "그 고요함 속에서 조금씩 정리된 마음이, 앞으로 당신을 더 단단하게 지켜줄 거예요.",
    connectionHint: "홀로 있는 시간 속에서 스스로를 돌보고 계신 듯했어요.",
    gardenSummary:
      "당신은 고요한 시간 속에서 스스로를 돌보는 법을 아는 사람이에요. 혼자만의 시간이 당신에게 여러 번 쉼이 되어준 것 같아요.",
  },
  sunflower: {
    id: "sunflower",
    name: "해바라기",
    englishName: "Sunflower",
    meaning: "기다림, 동경",
    forWhom: "한 곳을 바라보는 사람, 꿈이나 목표가 뚜렷함",
    additionalMeanings: ["숭배와 존경", "충성", "활력"],
    keywords: ["기다리", "목표", "꿈", "바라", "동경", "원하는", "희망하는"],
    essence:
      "당신은 마음속에 분명한 목표나 동경하는 무언가를 품고 있는 사람이에요. 해바라기가 한결같이 해를 향하듯, 당신도 흔들림 없이 바라보는 방향이 있어요.",
    strengths: [
      "원하는 것을 향해 꾸준히 나아갈 줄 알아요.",
      "쉽게 흔들리지 않는 뚜렷한 마음을 가지고 있어요.",
      "기다림 속에서도 희망을 놓지 않아요.",
    ],
    potential:
      "지금의 기다림이 헛되지 않을 거예요. 해바라기가 결국 활짝 피어나듯, 당신이 바라보는 그 방향으로 반드시 나아가게 될 거예요.",
    connectionHint: "한 곳을 향한 마음이 뚜렷하게 느껴졌어요.",
    gardenSummary:
      "당신은 바라보는 방향을 쉽게 바꾸지 않는 사람이에요. 기다림 속에서도 그 마음을 여러 번 지켜왔어요.",
  },
};

// 아직 뚜렷하게 반복되는 꽃이 없을 때(여러 꽃이 똑같이 1번씩 등) 보관함에 보여주는 문구.
export const DIVERSE_GARDEN_SUMMARY =
  "당신에게는 여러 모습이 골고루 담겨 있어요. 어느 한 가지로 정의되지 않는, 다채로운 마음을 가진 사람이에요.";

export const FLOWER_LIST: Flower[] = Object.values(FLOWERS);

export const FLOWER_IDS = Object.keys(FLOWERS) as FlowerId[];

export function isFlowerId(value: unknown): value is FlowerId {
  return typeof value === "string" && (FLOWER_IDS as string[]).includes(value);
}

export function getFlower(id: FlowerId): Flower {
  return FLOWERS[id];
}
