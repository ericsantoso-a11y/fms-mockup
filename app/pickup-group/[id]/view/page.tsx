import ViewContent from "./ViewContent";

export function generateStaticParams() {
  return Array.from({ length: 12 }, (_, i) => ({ id: String(i + 1) }));
}

export default function Page() {
  return <ViewContent />;
}
