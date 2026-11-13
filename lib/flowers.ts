// 결과에 쓰이는 꽃 6종의 데이터를 한 곳에 모아둔 파일입니다.
// 이름, 꽃말, 설명 같은 문구를 바꾸고 싶을 때는 이 파일만 고치면 됩니다.

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
}

export const FLOWERS: Record<FlowerId, Flower> = {
  freesia: {
    id: "freesia",
    name: "프리지아",
    englishName: "Freesia",
    meaning: "새로운 시작, 첫걸음",
    forWhom: "새 환경, 도전, 시작을 앞둔 사람",
  },
  daisy: {
    id: "daisy",
    name: "데이지",
    englishName: "Daisy",
    meaning: "희망",
    forWhom: "작은 빛을 찾는 사람, 불안하지만 열심히 해나가는 사람",
  },
  lotus: {
    id: "lotus",
    name: "연꽃",
    englishName: "Lotus",
    meaning: "청순한 마음",
    forWhom: "흐림 속에서도 맑은 사람, 혼란 속에서도 지킬 것을 지키는 사람",
  },
  peony: {
    id: "peony",
    name: "작약",
    englishName: "Peony",
    meaning: "수줍음",
    forWhom: "조심스럽게 피어나는 사람, 표현을 어려워하는 마음",
  },
  lavender: {
    id: "lavender",
    name: "라벤더",
    englishName: "Lavender",
    meaning: "침묵, 기대",
    forWhom: "고요 속에서 자라는 사람, 혼자만의 시간",
  },
  sunflower: {
    id: "sunflower",
    name: "해바라기",
    englishName: "Sunflower",
    meaning: "기다림, 동경",
    forWhom: "한 곳을 바라보는 사람, 꿈이나 목표가 뚜렷함",
  },
};

export const FLOWER_LIST: Flower[] = Object.values(FLOWERS);

export const FLOWER_IDS = Object.keys(FLOWERS) as FlowerId[];

export function isFlowerId(value: unknown): value is FlowerId {
  return typeof value === "string" && (FLOWER_IDS as string[]).includes(value);
}

export function getFlower(id: FlowerId): Flower {
  return FLOWERS[id];
}
