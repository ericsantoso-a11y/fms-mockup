import WorkspaceDetail from "./WorkspaceDetail";

export function generateStaticParams() {
  return [{ id: "CT-00001" }];
}

export default function Page() {
  return <WorkspaceDetail />;
}
