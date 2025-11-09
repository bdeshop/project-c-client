import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "../../../components/ui/dialog";
import { Button } from "../../../components/ui/button";
import { Input } from "../../../components/ui/input";
import { Label } from "../../../components/ui/label";
import { useUpdateBannerText } from "../../../lib/mutations";
import { useBannerText } from "../../../lib/queries";
import { BannerText } from "../../../lib/queries";

interface EditBannerTextDialogProps {
  isOpen: boolean;
  onClose: () => void;
}

export function EditBannerTextDialog({ isOpen, onClose }: EditBannerTextDialogProps) {
  const { data: bannerText } = useBannerText();
  const updateBannerTextMutation = useUpdateBannerText();
  
  const [englishText, setEnglishText] = useState(bannerText?.englishText || "");
  const [banglaText, setBanglaText] = useState(bannerText?.banglaText || "");

  // Update local state when bannerText changes
  useEffect(() => {
    if (bannerText) {
      setEnglishText(bannerText.englishText);
      setBanglaText(bannerText.banglaText);
    }
  }, [bannerText]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateBannerTextMutation.mutate(
      { englishText, banglaText },
      {
        onSuccess: () => {
          onClose();
        },
      }
    );
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Edit Banner Text</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="englishText">English Text</Label>
            <Input
              id="englishText"
              value={englishText}
              onChange={(e) => setEnglishText(e.target.value)}
              placeholder="Enter English banner text"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="banglaText">Bangla Text</Label>
            <Input
              id="banglaText"
              value={banglaText}
              onChange={(e) => setBanglaText(e.target.value)}
              placeholder="Enter Bangla banner text"
            />
          </div>
          <div className="flex justify-end space-x-2">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={updateBannerTextMutation.isPending}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={updateBannerTextMutation.isPending}
            >
              {updateBannerTextMutation.isPending ? "Saving..." : "Save"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}