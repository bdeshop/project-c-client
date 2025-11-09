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
import { Loader2, Calendar } from "lucide-react";

interface NewUser {
  name?: string;
  email: string;
  password: string;
  country?: string;
  currency?: string;
  phoneNumber?: string;
  player_id: string;
  promoCode?: string;
  bonusSelection?: string;
  birthday?: string;
}

interface AddUserDialogProps {
  isOpen: boolean;
  onClose: () => void;
  newUser: NewUser;
  onUserChange: (user: NewUser) => void;
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

export function AddUserDialog({
  isOpen,
  onClose,
  newUser,
  onUserChange,
  onSubmit,
  isLoading,
}: AddUserDialogProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px] max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Add New User</DialogTitle>
          <DialogDescription>
            Create a new user account with the specified details and
            preferences.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          {/* Name Field */}
          <div className="grid gap-2">
            <Label htmlFor="name">Name</Label>
            <Input
              id="name"
              value={newUser.name || ""}
              onChange={(e) =>
                onUserChange({ ...newUser, name: e.target.value })
              }
              placeholder="Enter full name"
            />
          </div>

          {/* Email Field (Required) */}
          <div className="grid gap-2">
            <Label htmlFor="email">Email *</Label>
            <Input
              id="email"
              type="email"
              value={newUser.email}
              onChange={(e) =>
                onUserChange({ ...newUser, email: e.target.value })
              }
              placeholder="Enter email address"
              required
            />
          </div>

          {/* Password Field (Required) */}
          <div className="grid gap-2">
            <Label htmlFor="password">Password *</Label>
            <Input
              id="password"
              type="password"
              value={newUser.password}
              onChange={(e) =>
                onUserChange({ ...newUser, password: e.target.value })
              }
              placeholder="Enter password"
              required
            />
          </div>

          {/* Player ID Field (Required) */}
          <div className="grid gap-2">
            <Label htmlFor="player_id">Player ID *</Label>
            <Input
              id="player_id"
              value={newUser.player_id}
              onChange={(e) =>
                onUserChange({ ...newUser, player_id: e.target.value })
              }
              placeholder="Enter unique player ID"
              required
            />
          </div>

          {/* Country Field */}
          <div className="grid gap-2">
            <Label htmlFor="country">Country</Label>
            <Select
              value={newUser.country || ""}
              onValueChange={(value) =>
                onUserChange({ ...newUser, country: value })
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
            <Label htmlFor="currency">Currency</Label>
            <Select
              value={newUser.currency || ""}
              onValueChange={(value) =>
                onUserChange({ ...newUser, currency: value })
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
            <Label htmlFor="phoneNumber">Phone Number</Label>
            <Input
              id="phoneNumber"
              type="tel"
              value={newUser.phoneNumber || ""}
              onChange={(e) =>
                onUserChange({ ...newUser, phoneNumber: e.target.value })
              }
              placeholder="Enter phone number"
            />
          </div>

          {/* Promo Code Field */}
          <div className="grid gap-2">
            <Label htmlFor="promoCode">Promo Code</Label>
            <Input
              id="promoCode"
              value={newUser.promoCode || ""}
              onChange={(e) =>
                onUserChange({ ...newUser, promoCode: e.target.value })
              }
              placeholder="Enter promo code (optional)"
            />
          </div>

          {/* Bonus Selection Field */}
          <div className="grid gap-2">
            <Label htmlFor="bonusSelection">Bonus Selection</Label>
            <Select
              value={newUser.bonusSelection || ""}
              onValueChange={(value) =>
                onUserChange({ ...newUser, bonusSelection: value })
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
            <Label htmlFor="birthday">Birthday</Label>
            <div className="relative">
              <Input
                id="birthday"
                type="date"
                value={newUser.birthday || ""}
                onChange={(e) =>
                  onUserChange({ ...newUser, birthday: e.target.value })
                }
                className="pr-10"
              />
              <Calendar className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
            </div>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose} disabled={isLoading}>
            Cancel
          </Button>
          <Button
            onClick={onSubmit}
            disabled={
              isLoading ||
              !newUser.email ||
              !newUser.password ||
              !newUser.player_id
            }
            className="gradient-primary text-white"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Creating...
              </>
            ) : (
              "Add User"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
