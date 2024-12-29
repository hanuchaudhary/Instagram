import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Textarea } from "@/components/ui/textarea";
import { useState, useEffect } from "react";
import { MoreHorizontal, TriangleAlert } from "lucide-react";
import { ToolsStore } from "@/store/ToolsStore/useToolsStore";
import { ReportType } from "@/types/TypeInterfaces";
import { ShareButton, ShareType } from "./ShareButton";

const reportReasons = {
  POST: [
    { id: "spam", label: "Spam" },
    { id: "inappropriate", label: "Inappropriate content" },
    { id: "violence", label: "Violence" },
    { id: "copyright", label: "Copyright violation" },
  ],
  USER: [
    { id: "fake", label: "Fake account" },
    { id: "spam", label: "Posting spam" },
    { id: "inappropriate", label: "Inappropriate behavior" },
    { id: "harassment", label: "Harassment" },
  ],
  COMMENT: [
    { id: "spam", label: "Spam" },
    { id: "hate", label: "Hate speech" },
    { id: "harassment", label: "Harassment" },
    { id: "inappropriate", label: "Inappropriate content" },
  ],
};

interface ReportPopupProps {
  reportType: ReportType;
  reportTargetTitle: string;
  targetId: string;
  reportedId: string;
  shareType : ShareType
}

export default function ReportShareDialog({
  reportTargetTitle,
  reportType,
  reportedId,
  targetId,
  shareType
}: ReportPopupProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedReason, setSelectedReason] = useState<string>("");
  const [detailReason, setDetailReason] = useState<string>("");
  const { createReport, isLoading } = ToolsStore();

  useEffect(() => {
    if (!isOpen) {
      setSelectedReason("");
      setDetailReason("");
    }
  }, [isOpen]);

  const handleOnSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const finalReason = detailReason
      ? `${selectedReason} | ${detailReason}`
      : selectedReason;

    createReport({
      reason: finalReason,
      targetId: targetId,
      reportedId: reportedId,
      type: reportType,
    });

    setIsOpen(false);
  };
  return (
    <div>
      <button>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <MoreHorizontal size={24} />
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuGroup>
              <DropdownMenuItem onClick={() => setIsOpen(true)}>
                <TriangleAlert className=" h-4 w-4" /> Report
              </DropdownMenuItem>
              <DropdownMenuItem>
                <ShareButton shareType={shareType} />
              </DropdownMenuItem>
            </DropdownMenuGroup>
          </DropdownMenuContent>
        </DropdownMenu>
      </button>
      {isOpen && (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle className="">
                Report {reportType.toLowerCase()} "{reportTargetTitle}"
              </DialogTitle>
              <DialogDescription>
                Please select a reason for reporting this. Your report will be
                reviewed by our team.
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleOnSubmit}>
              <div className="grid gap-4 py-4">
                <RadioGroup
                  value={selectedReason}
                  onValueChange={setSelectedReason}
                >
                  {reportReasons[reportType].map((reason) => (
                    <div
                      key={reason.id}
                      className="flex items-center space-x-2"
                    >
                      <RadioGroupItem value={reason.id} id={reason.id} />
                      <Label htmlFor={reason.id}>{reason.label}</Label>
                    </div>
                  ))}
                </RadioGroup>
                <div className="grid w-full gap-1.5">
                  <Label htmlFor="details">Additional details (optional)</Label>
                  <Textarea
                    id="details"
                    placeholder="Provide any additional context..."
                    value={detailReason}
                    onChange={(e) => setDetailReason(e.target.value)}
                  />
                </div>
              </div>
              <DialogFooter>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsOpen(false)}
                >
                  Cancel
                </Button>
                <Button type="submit" disabled={isLoading || !selectedReason}>
                  {isLoading ? "Submitting..." : "Submit Report"}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}
