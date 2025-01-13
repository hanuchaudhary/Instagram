import { useState } from "react"
import { MoreVertical, AlertCircle } from 'lucide-react'
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Textarea } from "@/components/ui/textarea"
import { ToolsStore } from "@/store/ToolsStore/useToolsStore"
import { ReportType } from "@/types/TypeInterfaces"

interface ReportButtonProps {
  reportType: ReportType
  reportTargetTitle: string
  reportedId: string
  postId?: number
}

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
}

export function ReportButton({
  reportType,
  reportTargetTitle,
  reportedId,
  postId,
}: ReportButtonProps) {
  const [isReportOpen, setIsReportOpen] = useState(false)
  const [selectedReason, setSelectedReason] = useState<string>("")
  const [detailReason, setDetailReason] = useState<string>("")
  const { createReport, isLoading } = ToolsStore()

  const handleReportClick = () => {
    setIsReportOpen(true)
  }

  const handleReportSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    const finalReason = detailReason
      ? `${selectedReason} | ${detailReason}`
      : selectedReason

  createReport({
      reportedId: reportedId,
      targetId: postId?.toString(),
      reason: finalReason,
      type: reportType,
    })

    setIsReportOpen(false)
  }

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon">
            <MoreVertical className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem onClick={handleReportClick}>
            <AlertCircle className="mr-2 h-4 w-4" />
            Report
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <Dialog open={isReportOpen} onOpenChange={setIsReportOpen}>
        <DialogContent className="sm:max-w-[425px] z-[99999]">
          <DialogHeader>
            <DialogTitle>
              Report {reportType.toLowerCase()} "{reportTargetTitle}"
            </DialogTitle>
            <DialogDescription>
              Please select a reason for reporting this. Your report will be
              reviewed by our team.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleReportSubmit}>
            <div className="grid gap-4 py-4">
              <RadioGroup
                value={selectedReason}
                onValueChange={setSelectedReason}
              >
                {reportReasons[reportType].map((reason) => (
                  <div key={reason.id} className="flex items-center space-x-2">
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
                onClick={() => setIsReportOpen(false)}
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
    </>
  )
}

