import { Button } from "../../../components/ui/button";
import { Input } from "../../../components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../../components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../../../components/ui/dialog";
import { Label } from "../../../components/ui/label";
import { Loader2 } from "lucide-react";
import { useState } from "react";
import { TopWinner } from "../../../lib/queries";

interface EditTopWinner extends Partial<TopWinner> {
  _id: string;
}

interface EditTopWinnerDialogProps {
  isOpen: boolean;
  onClose: () => void;
  editTopWinner: EditTopWinner | null;
  onTopWinnerChange: (topWinner: EditTopWinner) => void;
  onSubmit: () => void;
  isLoading: boolean;
}

const gameCategories = [
  { value: "Slots", label: "Slots" },
  { value: "Casino", label: "Casino" },
  { value: "Crash", label: "Crash" },
  { value: "Table", label: "Table" },
  { value: "Sports", label: "Sports" },
];

const currencies = [
  { value: "BDT", label: "BDT - Bangladeshi Taka" },
  { value: "USD", label: "USD - US Dollar" },
  { value: "EUR", label: "EUR - Euro" },
  { value: "GBP", label: "GBP - British Pound" },
];

export function EditTopWinnerDialog({
  isOpen,
  onClose,
  editTopWinner,
  onTopWinnerChange,
  onSubmit,
  isLoading,
}: EditTopWinnerDialogProps) {
  const [errors, setErrors] = useState<Record<string, string>>({});

  if (!editTopWinner) return null;

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    if (!editTopWinner.gameName?.trim()) {
      newErrors.gameName = "Game name is required";
    }
    
    if (!editTopWinner.gameCategory) {
      newErrors.gameCategory = "Game category is required";
    }
    
    if (!editTopWinner.username?.trim()) {
      newErrors.username = "Username is required";
    }
    
    if ((editTopWinner.winAmount || 0) <= 0) {
      newErrors.winAmount = "Win amount must be greater than 0";
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (validateForm()) {
      onSubmit();
    }
  };

  const handleInputChange = (field: keyof EditTopWinner, value: string | number | boolean) => {
    onTopWinnerChange({ ...editTopWinner, [field]: value });
    
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Edit Top Winner</DialogTitle>
          <DialogDescription>
            Update the top winner record details
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="edit-gameName">Game Name</Label>
            <Input
              id="edit-gameName"
              value={editTopWinner.gameName || ""}
              onChange={(e) => handleInputChange("gameName", e.target.value)}
              placeholder="Enter game name"
              className={errors.gameName ? "border-red-500" : ""}
            />
            {errors.gameName && <p className="text-sm text-red-500">{errors.gameName}</p>}
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="edit-gameCategory">Game Category</Label>
            <Select
              value={editTopWinner.gameCategory || ""}
              onValueChange={(value) => handleInputChange("gameCategory", value)}
            >
              <SelectTrigger className={errors.gameCategory ? "border-red-500" : ""}>
                <SelectValue placeholder="Select category" />
              </SelectTrigger>
              <SelectContent>
                {gameCategories.map((category) => (
                  <SelectItem key={category.value} value={category.value}>
                    {category.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.gameCategory && <p className="text-sm text-red-500">{errors.gameCategory}</p>}
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="edit-username">Username</Label>
            <Input
              id="edit-username"
              value={editTopWinner.username || ""}
              onChange={(e) => handleInputChange("username", e.target.value)}
              placeholder="Enter username"
              className={errors.username ? "border-red-500" : ""}
            />
            {errors.username && <p className="text-sm text-red-500">{errors.username}</p>}
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="edit-winAmount">Win Amount</Label>
              <Input
                id="edit-winAmount"
                type="number"
                value={editTopWinner.winAmount || ""}
                onChange={(e) => handleInputChange("winAmount", parseFloat(e.target.value) || 0)}
                placeholder="0.00"
                className={errors.winAmount ? "border-red-500" : ""}
              />
              {errors.winAmount && <p className="text-sm text-red-500">{errors.winAmount}</p>}
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="edit-currency">Currency</Label>
              <Select
                value={editTopWinner.currency || "BDT"}
                onValueChange={(value) => handleInputChange("currency", value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select currency" />
                </SelectTrigger>
                <SelectContent>
                  {currencies.map((currency) => (
                    <SelectItem key={currency.value} value={currency.value}>
                      {currency.label.split(" - ")[0]}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="edit-multiplier">Multiplier (Optional)</Label>
              <Input
                id="edit-multiplier"
                type="number"
                value={editTopWinner.multiplier || ""}
                onChange={(e) => handleInputChange("multiplier", parseInt(e.target.value) || 0)}
                placeholder="e.g., 500"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="edit-gameImage">Game Image URL (Optional)</Label>
              <Input
                id="edit-gameImage"
                value={editTopWinner.gameImage || ""}
                onChange={(e) => handleInputChange("gameImage", e.target.value)}
                placeholder="Enter image URL"
              />
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              id="edit-isLive"
              checked={editTopWinner.isLive ?? true}
              onChange={(e) => handleInputChange("isLive", e.target.checked)}
              className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
            />
            <Label htmlFor="edit-isLive">Show in LIVE Top Winners</Label>
          </div>
        </div>
        
        <DialogFooter>
          <Button variant="outline" onClick={onClose} disabled={isLoading}>
            Cancel
          </Button>
          <Button onClick={handleSubmit} disabled={isLoading}>
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Updating...
              </>
            ) : (
              "Update Top Winner"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}