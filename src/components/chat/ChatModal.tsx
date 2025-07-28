import { Dialog, DialogContent } from "@/components/ui/dialog";
import RealTimeChat from "./RealTimeChat";

type ChatModalProps = {
  isOpen: boolean;       // ✅ required
  onClose: () => void;   // ✅ required
  workspaceId: string;   // ✅ required
};

export default function ChatModal({ isOpen, onClose, workspaceId }: ChatModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl p-0">
        <RealTimeChat projectId={workspaceId} />
      </DialogContent>
    </Dialog>
  );
}
