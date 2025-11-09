import React, { useState } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../../../components/ui/card";
import { Button } from "../../../components/ui/button";
import { Input } from "../../../components/ui/input";
import { Label } from "../../../components/ui/label";
import { Switch } from "../../../components/ui/switch";
import { Badge } from "../../../components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../../../components/ui/dialog";
import {
  ReferralSettings,
  ReferralCodesWithUsers,
  UserReferralSettings,
  useReferralCodesWithUsers,
  useUserReferralSettings,
  useUpdateUserReferralSettings,
} from "../../../lib/queries";

interface SettingsTabProps {
  settings: ReferralSettings | undefined;
  isLoading: boolean;
  onUpdateSettings: (settings: ReferralSettings) => void;
  isUpdating: boolean;
}

export function SettingsTab({
  settings,
  isLoading,
  onUpdateSettings,
  isUpdating,
}: SettingsTabProps) {
  const {
    data: referralData,
    isLoading: isLoadingReferrals,
    error,
    refetch: fetchReferralData,
  } = useReferralCodesWithUsers();

  if (isLoading) {
    return <div className="text-center py-8">Loading settings...</div>;
  }

  if (!settings) {
    return <div className="text-center py-8">No settings found</div>;
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Referral Settings</CardTitle>
        </CardHeader>
        <CardContent>
          <SettingsForm
            settings={settings}
            onUpdate={onUpdateSettings}
            isUpdating={isUpdating}
          />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Referral Codes & Users</CardTitle>
          <Button
            onClick={() => fetchReferralData()}
            disabled={isLoadingReferrals}
          >
            {isLoadingReferrals ? "Refreshing..." : "Refresh Data"}
          </Button>
        </CardHeader>
        <CardContent>
          {isLoadingReferrals && (
            <div className="text-center py-8">Loading referral data...</div>
          )}

          {error && (
            <div className="text-center py-8 text-red-500">
              {error instanceof Error
                ? error.message
                : "Failed to fetch referral data"}
            </div>
          )}

          {referralData && <ReferralDataDisplay data={referralData} />}
        </CardContent>
      </Card>
    </div>
  );
}

function SettingsForm({
  settings,
  onUpdate,
  isUpdating,
}: {
  settings: ReferralSettings;
  onUpdate: (settings: ReferralSettings) => void;
  isUpdating: boolean;
}) {
  const [formData, setFormData] = useState(settings);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdate(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="signupBonus">Signup Bonus ($)</Label>
          <Input
            id="signupBonus"
            type="number"
            step="0.01"
            value={formData.signupBonus}
            onChange={(e) =>
              setFormData({
                ...formData,
                signupBonus: parseFloat(e.target.value) || 0,
              })
            }
          />
        </div>
        <div>
          <Label htmlFor="referralCommission">Referral Commission (%)</Label>
          <Input
            id="referralCommission"
            type="number"
            step="0.01"
            value={formData.referralCommission}
            onChange={(e) =>
              setFormData({
                ...formData,
                referralCommission: parseFloat(e.target.value) || 0,
              })
            }
          />
        </div>
        <div>
          <Label htmlFor="maxCommissionLimit">Max Commission Limit ($)</Label>
          <Input
            id="maxCommissionLimit"
            type="number"
            step="0.01"
            value={formData.maxCommissionLimit}
            onChange={(e) =>
              setFormData({
                ...formData,
                maxCommissionLimit: parseFloat(e.target.value) || 0,
              })
            }
          />
        </div>
        <div>
          <Label htmlFor="minWithdrawAmount">Min Withdraw Amount ($)</Label>
          <Input
            id="minWithdrawAmount"
            type="number"
            step="0.01"
            value={formData.minWithdrawAmount}
            onChange={(e) =>
              setFormData({
                ...formData,
                minWithdrawAmount: parseFloat(e.target.value) || 0,
              })
            }
          />
        </div>
      </div>
      <Button type="submit" disabled={isUpdating}>
        {isUpdating ? "Saving..." : "Update Settings"}
      </Button>
    </form>
  );
}

function ReferralDataDisplay({ data }: { data: ReferralCodesWithUsers }) {
  return (
    <div className="space-y-6">
      {/* Summary Section */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-blue-50 p-4 rounded-lg">
          <h3 className="font-semibold text-blue-800">Total Referrers</h3>
          <p className="text-2xl font-bold text-blue-600">
            {data.data.summary.totalReferrers}
          </p>
        </div>
        <div className="bg-green-50 p-4 rounded-lg">
          <h3 className="font-semibold text-green-800">Referred Users</h3>
          <p className="text-2xl font-bold text-green-600">
            {data.data.summary.totalReferredUsers}
          </p>
        </div>
        <div className="bg-purple-50 p-4 rounded-lg">
          <h3 className="font-semibold text-purple-800">Total Earnings</h3>
          <p className="text-2xl font-bold text-purple-600">
            ${data.data.summary.totalEarnings}
          </p>
        </div>
        <div className="bg-orange-50 p-4 rounded-lg">
          <h3 className="font-semibold text-orange-800">Inconsistent</h3>
          <p className="text-2xl font-bold text-orange-600">
            {data.data.summary.inconsistentReferrers}
          </p>
        </div>
      </div>

      {/* Referral Codes Section */}
      <div>
        <h3 className="text-lg font-semibold mb-4">Referral Codes Details</h3>
        <div className="space-y-4">
          {data.data.referralCodes.map((referralCode, index) => (
            <ReferralUserCard key={index} referralCode={referralCode} />
          ))}
        </div>
      </div>
    </div>
  );
}

function ReferralUserCard({
  referralCode,
}: {
  referralCode: ReferralCodesWithUsers["data"]["referralCodes"][0];
}) {
  return (
    <Card
      className={`${
        !referralCode.isConsistent ? "border-orange-200 bg-orange-50" : ""
      }`}
    >
      <CardHeader>
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="text-base">
              {referralCode.referrer.name}
            </CardTitle>
            <p className="text-sm text-gray-600">
              {referralCode.referrer.email}
            </p>
          </div>
          <div className="text-right flex flex-col items-end gap-2">
            <div className="font-mono text-lg font-bold">
              {referralCode.referrer.referralCode}
            </div>
            <div className="text-sm text-gray-600">
              Earnings: ${referralCode.referrer.referralEarnings}
            </div>
            {!referralCode.isConsistent && (
              <Badge variant="destructive" className="text-xs">
                Inconsistent
              </Badge>
            )}
            <UserSettingsDialog
              userName={referralCode.referrer.name}
              userEmail={referralCode.referrer.email}
              userId={referralCode.referrer.id}
            />
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <h4 className="font-semibold mb-2">Referred Users (Field)</h4>
            <p className="text-sm text-gray-600 mb-2">
              Count: {referralCode.referredUsers.fromReferredByField.count}
            </p>
            {referralCode.referredUsers.fromReferredByField.users.map(
              (user, userIndex: number) => (
                <div key={userIndex} className="bg-gray-50 p-2 rounded text-sm">
                  <div className="font-medium">{user.name}</div>
                  <div className="text-gray-600">{user.email}</div>
                </div>
              )
            )}
          </div>

          <div>
            <h4 className="font-semibold mb-2">Referred Users (Array)</h4>
            <p className="text-sm text-gray-600 mb-2">
              Count: {referralCode.referredUsers.fromReferredUsersArray.count}
            </p>
            {referralCode.referredUsers.fromReferredUsersArray.users.length ===
              0 && <div className="text-sm text-gray-500">No users</div>}
          </div>

          <div>
            <h4 className="font-semibold mb-2">Transactions</h4>
            <div className="text-sm">
              <div>Count: {referralCode.transactions.count}</div>
              <div>Total: ${referralCode.transactions.totalAmount}</div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function UserSettingsDialog({
  userName,
  userEmail,
  userId,
}: {
  userName: string;
  userEmail: string;
  userId: string;
}) {
  const [open, setOpen] = useState(false);

  const {
    data: userSettings,
    isLoading: isLoadingSettings,
    error: settingsError,
  } = useUserReferralSettings(userId, {
    enabled: open, // Only fetch when dialog is open
  });

  const updateUserSettings = useUpdateUserReferralSettings({
    onSuccess: () => {
      setOpen(false);
    },
  });

  const [formData, setFormData] = useState<UserReferralSettings>({
    useGlobalSettings: true,
    signupBonus: 0,
    referralCommission: 0,
    referralDepositBonus: 0,
    minWithdrawAmount: 0,
    minTransferAmount: 0,
    maxCommissionLimit: 0,
  });

  // Update form data when user settings are loaded
  React.useEffect(() => {
    if (userSettings) {
      setFormData(userSettings);
    }
  }, [userSettings]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateUserSettings.mutate({
      userId,
      settings: formData,
    });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          User Settings
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Referral Settings for {userName}</DialogTitle>
          <p className="text-sm text-gray-600">{userEmail}</p>
        </DialogHeader>

        {isLoadingSettings && (
          <div className="text-center py-8">Loading user settings...</div>
        )}

        {settingsError && (
          <div className="text-center py-8 text-red-500">
            Failed to load user settings
          </div>
        )}

        {userSettings && (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="flex items-center space-x-2">
              <Switch
                id="useGlobalSettings"
                checked={formData.useGlobalSettings}
                onCheckedChange={(checked) =>
                  setFormData({ ...formData, useGlobalSettings: checked })
                }
              />
              <Label htmlFor="useGlobalSettings">Use Global Settings</Label>
            </div>

            {!formData.useGlobalSettings && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="signupBonus">Signup Bonus ($)</Label>
                  <Input
                    id="signupBonus"
                    type="number"
                    step="0.01"
                    value={formData.signupBonus}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        signupBonus: parseFloat(e.target.value) || 0,
                      })
                    }
                  />
                </div>
                <div>
                  <Label htmlFor="referralCommission">
                    Referral Commission (%)
                  </Label>
                  <Input
                    id="referralCommission"
                    type="number"
                    step="0.01"
                    value={formData.referralCommission}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        referralCommission: parseFloat(e.target.value) || 0,
                      })
                    }
                  />
                </div>
                <div>
                  <Label htmlFor="referralDepositBonus">
                    Referral Deposit Bonus ($)
                  </Label>
                  <Input
                    id="referralDepositBonus"
                    type="number"
                    step="0.01"
                    value={formData.referralDepositBonus}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        referralDepositBonus: parseFloat(e.target.value) || 0,
                      })
                    }
                  />
                </div>
                <div>
                  <Label htmlFor="minWithdrawAmount">
                    Min Withdraw Amount ($)
                  </Label>
                  <Input
                    id="minWithdrawAmount"
                    type="number"
                    step="0.01"
                    value={formData.minWithdrawAmount}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        minWithdrawAmount: parseFloat(e.target.value) || 0,
                      })
                    }
                  />
                </div>
                <div>
                  <Label htmlFor="minTransferAmount">
                    Min Transfer Amount ($)
                  </Label>
                  <Input
                    id="minTransferAmount"
                    type="number"
                    step="0.01"
                    value={formData.minTransferAmount}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        minTransferAmount: parseFloat(e.target.value) || 0,
                      })
                    }
                  />
                </div>
                <div>
                  <Label htmlFor="maxCommissionLimit">
                    Max Commission Limit ($)
                  </Label>
                  <Input
                    id="maxCommissionLimit"
                    type="number"
                    step="0.01"
                    value={formData.maxCommissionLimit}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        maxCommissionLimit: parseFloat(e.target.value) || 0,
                      })
                    }
                  />
                </div>
              </div>
            )}

            <div className="flex justify-end space-x-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => setOpen(false)}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={updateUserSettings.isPending}>
                {updateUserSettings.isPending ? "Saving..." : "Save Settings"}
              </Button>
            </div>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
}
