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
import { UpcomingMatch } from "../../../lib/queries";

interface EditUpcomingMatch extends Partial<UpcomingMatch> {
  _id: string;
}

interface EditUpcomingMatchDialogProps {
  isOpen: boolean;
  onClose: () => void;
  editUpcomingMatch: EditUpcomingMatch | null;
  onUpcomingMatchChange: (upcomingMatch: EditUpcomingMatch) => void;
  onSubmit: () => void;
  isLoading: boolean;
}

const matchCategories = [
  { value: "Cricket", label: "Cricket" },
  { value: "Football", label: "Football" },
  { value: "Tennis", label: "Tennis" },
  { value: "Basketball", label: "Basketball" },
];

const matchTypes = [
  { value: "T20", label: "T20" },
  { value: "ODI", label: "ODI" },
  { value: "Test", label: "Test" },
  { value: "Football", label: "Football" },
  { value: "Tennis", label: "Tennis" },
  { value: "Basketball", label: "Basketball" },
];

export function EditUpcomingMatchDialog({
  isOpen,
  onClose,
  editUpcomingMatch,
  onUpcomingMatchChange,
  onSubmit,
  isLoading,
}: EditUpcomingMatchDialogProps) {
  const [errors, setErrors] = useState<Record<string, string>>({});

  if (!editUpcomingMatch) return null;

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    if (!editUpcomingMatch.matchType) {
      newErrors.matchType = "Match type is required";
    }
    
    if (!editUpcomingMatch.matchDate) {
      newErrors.matchDate = "Match date is required";
    }
    
    if (!editUpcomingMatch.category) {
      newErrors.category = "Category is required";
    }
    
    if (!editUpcomingMatch.teamA?.name?.trim()) {
      newErrors.teamAName = "Team A name is required";
    }
    
    if (!editUpcomingMatch.teamB?.name?.trim()) {
      newErrors.teamBName = "Team B name is required";
    }
    
    if ((editUpcomingMatch.teamA?.odds || 0) <= 0) {
      newErrors.teamAOdds = "Team A odds must be greater than 0";
    }
    
    if ((editUpcomingMatch.teamB?.odds || 0) <= 0) {
      newErrors.teamBOdds = "Team B odds must be greater than 0";
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (validateForm()) {
      onSubmit();
    }
  };

  const handleInputChange = (field: keyof EditUpcomingMatch, value: string | boolean) => {
    onUpcomingMatchChange({ ...editUpcomingMatch, [field]: value });
    
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  };

  const handleTeamAChange = (field: string, value: string | number) => {
    const updatedTeamA = { 
      ...editUpcomingMatch.teamA, 
      [field]: value 
    } as UpcomingMatch['teamA'];
    
    onUpcomingMatchChange({ 
      ...editUpcomingMatch, 
      teamA: updatedTeamA 
    });
    
    // Clear error when user starts typing
    const errorKey = `teamA${field.charAt(0).toUpperCase() + field.slice(1)}`;
    if (errors[errorKey]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[errorKey];
        return newErrors;
      });
    }
  };

  const handleTeamBChange = (field: string, value: string | number) => {
    const updatedTeamB = { 
      ...editUpcomingMatch.teamB, 
      [field]: value 
    } as UpcomingMatch['teamB'];
    
    onUpcomingMatchChange({ 
      ...editUpcomingMatch, 
      teamB: updatedTeamB 
    });
    
    // Clear error when user starts typing
    const errorKey = `teamB${field.charAt(0).toUpperCase() + field.slice(1)}`;
    if (errors[errorKey]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[errorKey];
        return newErrors;
      });
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Edit Upcoming Match</DialogTitle>
          <DialogDescription>
            Update the upcoming match details
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-6 py-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="edit-matchType">Match Type</Label>
              <Select
                value={editUpcomingMatch.matchType || ""}
                onValueChange={(value) => handleInputChange("matchType", value)}
              >
                <SelectTrigger className={errors.matchType ? "border-red-500" : ""}>
                  <SelectValue placeholder="Select match type" />
                </SelectTrigger>
                <SelectContent>
                  {matchTypes.map((type) => (
                    <SelectItem key={type.value} value={type.value}>
                      {type.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.matchType && <p className="text-sm text-red-500">{errors.matchType}</p>}
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="edit-category">Category</Label>
              <Select
                value={editUpcomingMatch.category || ""}
                onValueChange={(value) => handleInputChange("category", value)}
              >
                <SelectTrigger className={errors.category ? "border-red-500" : ""}>
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  {matchCategories.map((category) => (
                    <SelectItem key={category.value} value={category.value}>
                      {category.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.category && <p className="text-sm text-red-500">{errors.category}</p>}
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="edit-matchDate">Match Date & Time</Label>
            <Input
              id="edit-matchDate"
              type="datetime-local"
              value={editUpcomingMatch.matchDate?.slice(0, 16) || ""}
              onChange={(e) => handleInputChange("matchDate", e.target.value)}
              className={errors.matchDate ? "border-red-500" : ""}
            />
            {errors.matchDate && <p className="text-sm text-red-500">{errors.matchDate}</p>}
          </div>
          
          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              id="edit-isLive"
              checked={editUpcomingMatch.isLive ?? false}
              onChange={(e) => handleInputChange("isLive", e.target.checked)}
              className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
            />
            <Label htmlFor="edit-isLive">Match is currently LIVE</Label>
          </div>
          
          <div className="border-t pt-6">
            <h3 className="text-lg font-medium mb-4">Team A Details</h3>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="edit-teamAName">Team Name</Label>
                <Input
                  id="edit-teamAName"
                  value={editUpcomingMatch.teamA?.name || ""}
                  onChange={(e) => handleTeamAChange("name", e.target.value)}
                  placeholder="Enter team name"
                  className={errors.teamAName ? "border-red-500" : ""}
                />
                {errors.teamAName && <p className="text-sm text-red-500">{errors.teamAName}</p>}
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="edit-teamAFlag">Flag Image URL (Optional)</Label>
                  <Input
                    id="edit-teamAFlag"
                    value={editUpcomingMatch.teamA?.flagImage || ""}
                    onChange={(e) => handleTeamAChange("flagImage", e.target.value)}
                    placeholder="Enter image URL"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="edit-teamAOdds">Odds</Label>
                  <Input
                    id="edit-teamAOdds"
                    type="number"
                    step="0.01"
                    value={editUpcomingMatch.teamA?.odds || ""}
                    onChange={(e) => handleTeamAChange("odds", parseFloat(e.target.value) || 0)}
                    placeholder="e.g., 2.34"
                    className={errors.teamAOdds ? "border-red-500" : ""}
                  />
                  {errors.teamAOdds && <p className="text-sm text-red-500">{errors.teamAOdds}</p>}
                </div>
              </div>
            </div>
          </div>
          
          <div className="border-t pt-6">
            <h3 className="text-lg font-medium mb-4">Team B Details</h3>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="edit-teamBName">Team Name</Label>
                <Input
                  id="edit-teamBName"
                  value={editUpcomingMatch.teamB?.name || ""}
                  onChange={(e) => handleTeamBChange("name", e.target.value)}
                  placeholder="Enter team name"
                  className={errors.teamBName ? "border-red-500" : ""}
                />
                {errors.teamBName && <p className="text-sm text-red-500">{errors.teamBName}</p>}
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="edit-teamBFlag">Flag Image URL (Optional)</Label>
                  <Input
                    id="edit-teamBFlag"
                    value={editUpcomingMatch.teamB?.flagImage || ""}
                    onChange={(e) => handleTeamBChange("flagImage", e.target.value)}
                    placeholder="Enter image URL"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="edit-teamBOdds">Odds</Label>
                  <Input
                    id="edit-teamBOdds"
                    type="number"
                    step="0.01"
                    value={editUpcomingMatch.teamB?.odds || ""}
                    onChange={(e) => handleTeamBChange("odds", parseFloat(e.target.value) || 0)}
                    placeholder="e.g., 3.44"
                    className={errors.teamBOdds ? "border-red-500" : ""}
                  />
                  {errors.teamBOdds && <p className="text-sm text-red-500">{errors.teamBOdds}</p>}
                </div>
              </div>
            </div>
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
              "Update Match"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}