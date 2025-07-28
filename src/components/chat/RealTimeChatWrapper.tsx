import { useParams } from "react-router-dom";
import RealTimeChat from "./RealTimeChat";

export default function RealTimeChatWrapper() {
  const { workspaceId } = useParams();
  if (!workspaceId) return <div>No workspace ID</div>;
  return <RealTimeChat projectId={workspaceId} />;
}
