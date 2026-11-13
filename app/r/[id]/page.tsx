import ResultView from "@/components/ResultView";

// 매 요청마다 id에 맞는 결과를 가져와야 하므로 정적 프리렌더링을 끕니다.
export const instant = false;

export default async function ResultPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return <ResultView id={id} />;
}
