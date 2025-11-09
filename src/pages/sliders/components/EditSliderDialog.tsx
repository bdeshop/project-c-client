import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "../../../components/ui/dialog";
import { Button } from "../../../components/ui/button";
import { Input } from "../../../components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../../components/ui/select";
import { Label } from "../../../components/ui/label";
import { Slider } from "../../../lib/queries";

// Extended Slider type to include image file for editing
interface EditableSlider extends Slider {
  image?: File;
}

interface EditSliderDialogProps {
  isOpen: boolean;
  onClose: () => void;
  editSlider: Slider | null;
  onSliderChange: (slider: Slider | null) => void;
  onSubmit: () => void;
  isLoading: boolean;
}

export function EditSliderDialog({
  isOpen,
  onClose,
  editSlider,
  onSliderChange,
  onSubmit,
  isLoading,
}: EditSliderDialogProps) {
  const [title, setTitle] = useState("");
  const [status, setStatus] = useState<"active" | "inactive">("active");
  const [image, setImage] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [existingImageUrl, setExistingImageUrl] = useState<string | null>(null);

  useEffect(() => {
    if (editSlider) {
      setTitle(editSlider.title);
      setStatus(editSlider.status as "active" | "inactive");
      // Add base URL to the existing image URL for proper display
      const fullImageUrl = editSlider.imageUrl.startsWith("http")
        ? editSlider.imageUrl
        : `http://localhost:8000${editSlider.imageUrl}`;
      setExistingImageUrl(fullImageUrl);
      setImage(null);
      setPreviewUrl(null);
    }
  }, [editSlider]);

  // Update the parent component's state when local state changes
  useEffect(() => {
    if (editSlider) {
      const updatedSlider: EditableSlider = {
        ...editSlider,
        title,
        status,
      };

      // Include image if a new one was selected
      if (image) {
        updatedSlider.image = image;
      }

      onSliderChange(updatedSlider);
    }
  }, [title, status, image, editSlider, onSliderChange]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setImage(file);

    if (file) {
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
    } else {
      setPreviewUrl(null);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Edit Slider</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="edit-title">Title</Label>
            <Input
              id="edit-title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter slider title"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="edit-status">Status</Label>
            <Select
              value={status}
              onValueChange={(value: "active" | "inactive") => setStatus(value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="inactive">Inactive</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Current Image</Label>
            {existingImageUrl && !previewUrl && (
              <div className="mt-2">
                <img
                  src={existingImageUrl}
                  alt="Current slider"
                  className="w-full h-32 object-cover rounded-md"
                />
              </div>
            )}
            {previewUrl && (
              <div className="mt-2">
                <img
                  src={previewUrl}
                  alt="New preview"
                  className="w-full h-32 object-cover rounded-md"
                />
              </div>
            )}
            <Label htmlFor="edit-image">Change Image</Label>
            <Input
              id="edit-image"
              type="file"
              accept="image/*"
              onChange={handleImageChange}
            />
          </div>

          <div className="flex justify-end space-x-2">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? "Updating..." : "Update Slider"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
