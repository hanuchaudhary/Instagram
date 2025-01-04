import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useState } from "react"

interface ShareDialogProps {
  isOpen: boolean
  onClose: () => void
  shareType: "userprofile" | "post"
  shareUrl: string
}

export function ShareDialog({ isOpen, onClose, shareType, shareUrl }: ShareDialogProps) {
  const [copied, setCopied] = useState(false)

  const handleCopy = () => {
    navigator.clipboard.writeText(shareUrl)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Share {shareType === "userprofile" ? "Profile" : "Post"}</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="share-link" className="text-right">
              Link
            </Label>
            <Input
              id="share-link"
              value={shareUrl}
              readOnly
              className="col-span-3"
            />
          </div>
        </div>
        <DialogFooter>
          <Button onClick={handleCopy}>
            {copied ? "Copied!" : "Copy Link"}
          </Button>
          {shareType === "post" && (
            <>
              <Button>Share on Twitter</Button>
              <Button>Share on Facebook</Button>
            </>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

