import { useState } from "react"
import { MoreVertical, Copy, AlertCircle } from 'lucide-react'
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
import { useParams } from "react-router-dom"
import { toast } from "sonner"

type ShareType = "profile" | "post"

interface ShareReportButtonProps {
  shareType: ShareType
  reportType: ReportType
  reportTargetTitle: string
  targetId: string
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

export function ShareReportButton({
  shareType,
  reportType,
  reportTargetTitle,
  targetId,
  reportedId,
  postId,
}: ShareReportButtonProps) {
  const [isReportOpen, setIsReportOpen] = useState(false)
  const [selectedReason, setSelectedReason] = useState<string>("")
  const [detailReason, setDetailReason] = useState<string>("")
  const { createReport, isLoading } = ToolsStore()
  const params = useParams()

  const handleShare = () => {
    const baseUrl = window.location.origin
    let shareUrl = ""

    if (shareType === "profile") {
      shareUrl = `${baseUrl}/user/${params.username}`
    } else if (shareType === "post") {
      shareUrl = `${baseUrl}/post/${postId}`
    }

    navigator.clipboard.writeText(shareUrl).then(() => {
      toast.success("Link copied to clipboard "+ shareUrl)
    }).catch((err) => {
      console.error('Failed to copy: ', err)
      toast.error("Failed to copy link")
    })
  }

  const handleReportClick = () => {
    setIsReportOpen(true)
  }

  const handleReportSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    const finalReason = detailReason
      ? `${selectedReason} | ${detailReason}`
      : selectedReason

    createReport({
      reason: finalReason,
      targetId: targetId,
      reportedId: reportedId,
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
          <DropdownMenuItem onClick={handleShare}>
            <Copy className="mr-2 h-4 w-4" />
            Copy Link
          </DropdownMenuItem>
          <DropdownMenuItem onClick={handleReportClick}>
            <AlertCircle className="mr-2 h-4 w-4" />
            Report
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <Dialog open={isReportOpen} onOpenChange={setIsReportOpen}>
        <DialogContent className="sm:max-w-[425px]">
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

