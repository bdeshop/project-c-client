import { Button } from "../../../components/ui/button";
import { Input } from "../../../components/ui/input";
import { Label } from "../../../components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../../components/ui/select";
import { Loader2, X, Calendar } from "lucide-react";
import { useEffect } from "react";

interface EditUser {
  id: string;
  name?: string;
  email: string;
  password?: string;
  country?: string;
  currency?: string;
  phoneNumber?: string;
  player_id: string;
  promoCode?: string;
  bonusSelection?: string;
  birthday?: string;
  role?: string;
  status?: string;
}

interface EditUserDialogProps {
  isOpen: boolean;
  onClose: () => void;
  editUser: EditUser;
  onUserChange: (user: EditUser) => void;
  onSubmit: () => void;
  isLoading: boolean;
}

const currencies = [
  { value: "USD", label: "USD - US Dollar" },
  { value: "EUR", label: "EUR - Euro" },
  { value: "GBP", label: "GBP - British Pound" },
  { value: "JPY", label: "JPY - Japanese Yen" },
  { value: "CAD", label: "CAD - Canadian Dollar" },
  { value: "AUD", label: "AUD - Australian Dollar" },
  { value: "CHF", label: "CHF - Swiss Franc" },
  { value: "CNY", label: "CNY - Chinese Yuan" },
];

const countries = [
  { value: "US", label: "United States" },
  { value: "GB", label: "United Kingdom" },
  { value: "CA", label: "Canada" },
  { value: "AU", label: "Australia" },
  { value: "DE", label: "Germany" },
  { value: "FR", label: "France" },
  { value: "JP", label: "Japan" },
  { value: "CN", label: "China" },
  { value: "IN", label: "India" },
  { value: "BR", label: "Brazil" },
];

const bonusOptions = [
  { value: "welcome", label: "Welcome Bonus" },
  { value: "deposit", label: "Deposit Bonus" },
  { value: "no-deposit", label: "No Deposit Bonus" },
  { value: "vip", label: "VIP Bonus" },
  { value: "none", label: "No Bonus" },
];

export function EditUserDialog({
  isOpen,
  onClose,
  editUser,
  onUserChange,
  onSubmit,
  isLoading,
}: EditUserDialogProps) {
  // Handle escape key and body scroll
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener("keydown", handleEscape);
      document.body.style.overflow = "hidden";
    }

    return () => {
      document.removeEventListener("keydown", handleEscape);
      document.body.style.overflow = "unset";
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;
  console.log("editUser", editUser);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/80 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal Content */}
      <div className="relative bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-2xl mx-4 p-6 max-h-[90vh] overflow-y-auto">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
          disabled={isLoading}
        >
          <X className="h-4 w-4" />
          <span className="sr-only">Close</span>
        </button>

        {/* Header */}
        <div className="mb-6">
          <h2 className="text-lg font-semibold leading-none tracking-tight mb-2">
            Edit User
          </h2>
          <p className="text-sm text-muted-foreground">
            Update user information and permissions.
          </p>
        </div>

        {/* Form */}
        <div className="grid gap-4 mb-6">
          {/* Name Field */}
          <div className="grid gap-2">
            <Label htmlFor="edit-name">Name</Label>
            <Input
              id="edit-name"
              value={editUser.name || ""}
              onChange={(e) =>
                onUserChange({ ...editUser, name: e.target.value })
              }
              placeholder="Enter full name"
            />
          </div>

          {/* Email Field */}
          <div className="grid gap-2">
            <Label htmlFor="edit-email">Email *</Label>
            <Input
              id="edit-email"
              type="email"
              value={editUser.email}
              onChange={(e) =>
                onUserChange({ ...editUser, email: e.target.value })
              }
              placeholder="Enter email address"
              required
            />
          </div>

          {/* Player ID Field */}
          <div className="grid gap-2">
            <Label htmlFor="edit-player-id">Player ID *</Label>
            <Input
              id="edit-player-id"
              value={editUser.player_id}
              onChange={(e) =>
                onUserChange({ ...editUser, player_id: e.target.value })
              }
              placeholder="Enter unique player ID"
              required
            />
          </div>

          {/* Password Field */}
          <div className="grid gap-2">
            <Label htmlFor="edit-password">Password</Label>
            <Input
              id="edit-password"
              type="password"
              value={editUser.password || ""}
              onChange={(e) =>
                onUserChange({ ...editUser, password: e.target.value })
              }
              placeholder="Leave empty to keep current password"
            />
          </div>

          {/* Country Field */}
          <div className="grid gap-2">
            <Label htmlFor="edit-country">Country</Label>
            <Select
              value={editUser.country || ""}
              onValueChange={(value) =>
                onUserChange({ ...editUser, country: value })
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Select country" />
              </SelectTrigger>
              <SelectContent>
                {countries.map((country) => (
                  <SelectItem key={country.value} value={country.value}>
                    {country.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Currency Field */}
          <div className="grid gap-2">
            <Label htmlFor="edit-currency">Currency</Label>
            <Select
              value={editUser.currency || ""}
              onValueChange={(value) =>
                onUserChange({ ...editUser, currency: value })
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Select currency" />
              </SelectTrigger>
              <SelectContent>
                {currencies.map((currency) => (
                  <SelectItem key={currency.value} value={currency.value}>
                    {currency.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Phone Number Field */}
          <div className="grid gap-2">
            <Label htmlFor="edit-phoneNumber">Phone Number</Label>
            <Input
              id="edit-phoneNumber"
              type="tel"
              value={editUser.phoneNumber || ""}
              onChange={(e) =>
                onUserChange({ ...editUser, phoneNumber: e.target.value })
              }
              placeholder="Enter phone number"
            />
          </div>

          {/* Promo Code Field */}
          <div className="grid gap-2">
            <Label htmlFor="edit-promoCode">Promo Code</Label>
            <Input
              id="edit-promoCode"
              value={editUser.promoCode || ""}
              onChange={(e) =>
                onUserChange({ ...editUser, promoCode: e.target.value })
              }
              placeholder="Enter promo code (optional)"
            />
          </div>

          {/* Bonus Selection Field */}
          <div className="grid gap-2">
            <Label htmlFor="edit-bonusSelection">Bonus Selection</Label>
            <Select
              value={editUser.bonusSelection || ""}
              onValueChange={(value) =>
                onUserChange({ ...editUser, bonusSelection: value })
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Select bonus type" />
              </SelectTrigger>
              <SelectContent>
                {bonusOptions.map((bonus) => (
                  <SelectItem key={bonus.value} value={bonus.value}>
                    {bonus.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Birthday Field */}
          <div className="grid gap-2">
            <Label htmlFor="edit-birthday">Birthday</Label>
            <div className="relative">
              <Input
                id="edit-birthday"
                type="date"
                value={editUser.birthday || ""}
                onChange={(e) =>
                  onUserChange({ ...editUser, birthday: e.target.value })
                }
                className="pr-10"
              />
              <Calendar className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
            </div>
          </div>

          {/* Role Field */}
          <div className="grid gap-2">
            <Label htmlFor="edit-role">Role</Label>
            <Select
              value={editUser.role || ""}
              onValueChange={(value) =>
                onUserChange({ ...editUser, role: value })
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Select role" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="admin">Admin</SelectItem>
                <SelectItem value="editor">Editor</SelectItem>
                <SelectItem value="user">User</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Status Field */}
          <div className="grid gap-2">
            <Label htmlFor="edit-status">Status</Label>
            <Select
              value={editUser.status || ""}
              onValueChange={(value) =>
                onUserChange({ ...editUser, status: value })
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Select status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Active">Active</SelectItem>
                <SelectItem value="Inactive">Inactive</SelectItem>
                <SelectItem value="Banned">Banned</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Footer */}
        <div className="flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2">
          <Button variant="outline" onClick={onClose} disabled={isLoading}>
            Cancel
          </Button>
          <Button
            onClick={onSubmit}
            disabled={isLoading || !editUser.email || !editUser.player_id}
            className="gradient-primary text-white"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Updating...
              </>
            ) : (
              "Update User"
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}
