import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Plus,
  Edit2,
  Trash2,
  Loader2,
  Search,
  Check,
  Gift,
  RefreshCw,
} from "lucide-react";
import { toast } from "sonner";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getAllDepositBonuses,
  createDepositBonus,
  updateDepositBonus,
  deleteDepositBonus,
  getActiveDepositMethods,
} from "@/config/api";

interface DepositBonus {
  _id: string;
  welcomeBonusName: string;
  minimumBonusBDT: number;
  bonusType: string;
  bonusCode: string;
  totalAmountBDT: number;
  percentageValue: number;
  minimumDepositBDT: number;
  wageringRequirement: number;
  validityPeriodDays: number;
  applicableTo: string;
  depositMethodId?: {
    _id: string;
    method_name_en: string;
    method_name_bd: string;
  };
  startDate: string;
  endDate: string;
  status: string;
}

export function DepositBonusPage() {
  const [open, setOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [formData, setFormData] = useState({
    welcomeBonusName: "",
    minimumBonusBDT: 0,
    bonusType: "Winnable",
    bonusCode: "",
    totalAmountBDT: 0,
    percentageValue: 0,
    minimumDepositBDT: 0,
    wageringRequirement: 0,
    validityPeriodDays: 30,
    applicableTo: "All Users",
    depositMethodId: "",
    startDate: new Date().toISOString().split("T")[0],
    endDate: "",
    status: "Active",
  });

  const queryClient = useQueryClient();

  // Fetch bonuses
  const { data: bonuses = [], isLoading } = useQuery({
    queryKey: ["depositBonuses"],
    queryFn: getAllDepositBonuses,
  });

  // Fetch deposit methods
  const { data: depositMethods = [] } = useQuery({
    queryKey: ["activeDepositMethods"],
    queryFn: getActiveDepositMethods,
  });

  // Create mutation
  const createMutation = useMutation({
    mutationFn: createDepositBonus,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["depositBonuses"] });
      toast.success("Bonus created successfully");
      setOpen(false);
      resetForm();
    },
    onError: (error: any) => {
      toast.error(error.message || "Failed to create bonus");
    },
  });

  // Update mutation
  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: any }) =>
      updateDepositBonus(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["depositBonuses"] });
      toast.success("Bonus updated successfully");
      setOpen(false);
      resetForm();
    },
    onError: (error: any) => {
      toast.error(error.message || "Failed to update bonus");
    },
  });

  // Delete mutation
  const deleteMutation = useMutation({
    mutationFn: deleteDepositBonus,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["depositBonuses"] });
      toast.success("Bonus deleted successfully");
    },
    onError: (error: any) => {
      toast.error(error.message || "Failed to delete bonus");
    },
  });

  const resetForm = () => {
    setFormData({
      welcomeBonusName: "",
      minimumBonusBDT: 0,
      bonusType: "Winnable",
      bonusCode: "",
      totalAmountBDT: 0,
      percentageValue: 0,
      minimumDepositBDT: 0,
      wageringRequirement: 0,
      validityPeriodDays: 30,
      applicableTo: "All Users",
      depositMethodId: "",
      startDate: new Date().toISOString().split("T")[0],
      endDate: "",
      status: "Active",
    });
    setEditingId(null);
  };

  const handleEdit = (bonus: DepositBonus) => {
    setFormData({
      welcomeBonusName: bonus.welcomeBonusName,
      minimumBonusBDT: bonus.minimumBonusBDT,
      bonusType: bonus.bonusType,
      bonusCode: bonus.bonusCode,
      totalAmountBDT: bonus.totalAmountBDT,
      percentageValue: bonus.percentageValue,
      minimumDepositBDT: bonus.minimumDepositBDT,
      wageringRequirement: bonus.wageringRequirement,
      validityPeriodDays: bonus.validityPeriodDays,
      applicableTo: bonus.applicableTo,
      depositMethodId: bonus.depositMethodId?._id || "",
      startDate: bonus.startDate ? bonus.startDate.split("T")[0] : "",
      endDate: bonus.endDate ? bonus.endDate.split("T")[0] : "",
      status: bonus.status,
    });
    setEditingId(bonus._id);
    setOpen(true);
  };

  const handleSubmit = () => {
    if (!formData.welcomeBonusName || !formData.bonusCode) {
      toast.error("Please fill all required fields");
      return;
    }

    const submissionData = {
      ...formData,
      depositMethodId: formData.depositMethodId === "" ? null : formData.depositMethodId,
    };

    if (editingId) {
      updateMutation.mutate({ id: editingId, data: submissionData });
    } else {
      createMutation.mutate(submissionData);
    }
  };

  const generateBonusCode = () => {
    const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    let code = "";
    for (let i = 0; i < 8; i++) {
      code += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    setFormData({ ...formData, bonusCode: code });
  };

  const filteredBonuses = bonuses.filter(
    (bonus: DepositBonus) =>
      bonus.welcomeBonusName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      bonus.bonusCode.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-white uppercase tracking-tight">
            Deposit Bonuses
          </h2>
          <p className="text-gray-400 text-sm mt-1">
            Manage your deposit bonus campaigns and wagering requirements
          </p>
        </div>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button
              onClick={() => resetForm()}
              className="bg-gradient-to-r from-yellow-400 to-yellow-500 hover:from-yellow-500 hover:to-yellow-600 text-gray-900 font-semibold shadow-lg"
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Bonus
            </Button>
          </DialogTrigger>
          <DialogContent className="bg-gray-900 border border-gray-700/50 text-white max-w-2xl overflow-y-auto max-h-[90vh]">
            <DialogHeader>
              <DialogTitle>
                {editingId ? "Edit Bonus" : "Create New Bonus"}
              </DialogTitle>
              <DialogDescription className="text-gray-400">
                Configure deposit bonus settings and wagering rules
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="text-gray-300">Bonus Name</Label>
                  <Input
                    placeholder="e.g., Welcome Bonus 100%"
                    value={formData.welcomeBonusName}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        welcomeBonusName: e.target.value,
                      })
                    }
                    className="bg-gray-800/50 border-gray-700/50 text-white"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-gray-300">Bonus Code</Label>
                  <div className="flex gap-2">
                    <Input
                      placeholder="CODE123"
                      value={formData.bonusCode}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          bonusCode: e.target.value.toUpperCase(),
                        })
                      }
                      className="bg-gray-800/50 border-gray-700/50 text-white uppercase"
                    />
                    <Button
                      type="button"
                      onClick={generateBonusCode}
                      variant="secondary"
                      size="sm"
                    >
                      Gen
                    </Button>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="text-gray-300">Bonus Type</Label>
                  <Select
                    value={formData.bonusType}
                    onValueChange={(value) =>
                      setFormData({ ...formData, bonusType: value })
                    }
                  >
                    <SelectTrigger className="bg-gray-800/50 border-gray-700/50 text-white">
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                    <SelectContent className="bg-gray-800 border-gray-700/50">
                      <SelectItem value="Winnable">Winnable</SelectItem>
                      <SelectItem value="Non-Winnable">Non-Winnable</SelectItem>
                      <SelectItem value="Hybrid">Hybrid</SelectItem>
                      <SelectItem value="Cashback">Cashback</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label className="text-gray-300">Applicable To</Label>
                  <Select
                    value={formData.applicableTo}
                    onValueChange={(value) =>
                      setFormData({ ...formData, applicableTo: value })
                    }
                  >
                    <SelectTrigger className="bg-gray-800/50 border-gray-700/50 text-white">
                      <SelectValue placeholder="Select target" />
                    </SelectTrigger>
                    <SelectContent className="bg-gray-800 border-gray-700/50">
                      <SelectItem value="All Users">All Users</SelectItem>
                      <SelectItem value="New Users Only">
                        New Users Only
                      </SelectItem>
                      <SelectItem value="Existing Users Only">
                        Existing Users Only
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label className="text-gray-300">Percentage (%)</Label>
                  <Input
                    type="number"
                    value={formData.percentageValue}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        percentageValue: Number(e.target.value),
                      })
                    }
                    className="bg-gray-800/50 border-gray-700/50 text-white"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-gray-300">Min Deposit (BDT)</Label>
                  <Input
                    type="number"
                    value={formData.minimumDepositBDT}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        minimumDepositBDT: Number(e.target.value),
                      })
                    }
                    className="bg-gray-800/50 border-gray-700/50 text-white"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-gray-300">Max Bonus (BDT)</Label>
                  <Input
                    type="number"
                    value={formData.totalAmountBDT}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        totalAmountBDT: Number(e.target.value),
                      })
                    }
                    className="bg-gray-800/50 border-gray-700/50 text-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="text-gray-300">Wagering Req. (x)</Label>
                  <Input
                    type="number"
                    value={formData.wageringRequirement}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        wageringRequirement: Number(e.target.value),
                      })
                    }
                    className="bg-gray-800/50 border-gray-700/50 text-white"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-gray-300">Validity (Days)</Label>
                  <Input
                    type="number"
                    value={formData.validityPeriodDays}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        validityPeriodDays: Number(e.target.value),
                      })
                    }
                    className="bg-gray-800/50 border-gray-700/50 text-white"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label className="text-gray-300">
                  Payment Method (Optional)
                </Label>
                <Select
                  value={formData.depositMethodId || "all"}
                  onValueChange={(value) =>
                    setFormData({
                      ...formData,
                      depositMethodId: value === "all" ? "" : value,
                    })
                  }
                >
                  <SelectTrigger className="bg-gray-800/50 border-gray-700/50 text-white">
                    <SelectValue placeholder="All Methods" />
                  </SelectTrigger>
                  <SelectContent className="bg-gray-800 border-gray-700/50">
                    <SelectItem value="all">All Methods</SelectItem>
                    {depositMethods.map((method: any) => (
                      <SelectItem key={method._id} value={method._id}>
                        {method.method_name_en}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="text-gray-300">Start Date</Label>
                  <Input
                    type="date"
                    value={formData.startDate}
                    onChange={(e) =>
                      setFormData({ ...formData, startDate: e.target.value })
                    }
                    className="bg-gray-800/50 border-gray-700/50 text-white"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-gray-300">End Date</Label>
                  <Input
                    type="date"
                    value={formData.endDate}
                    onChange={(e) =>
                      setFormData({ ...formData, endDate: e.target.value })
                    }
                    className="bg-gray-800/50 border-gray-700/50 text-white"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label className="text-gray-300">Status</Label>
                <Select
                  value={formData.status}
                  onValueChange={(value) =>
                    setFormData({ ...formData, status: value })
                  }
                >
                  <SelectTrigger className="bg-gray-800/50 border-gray-700/50 text-white">
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent className="bg-gray-800 border-gray-700/50">
                    <SelectItem value="Active">Active</SelectItem>
                    <SelectItem value="Inactive">Inactive</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <Button
                onClick={handleSubmit}
                disabled={createMutation.isPending || updateMutation.isPending}
                className="w-full bg-gradient-to-r from-yellow-400 to-yellow-500 hover:from-yellow-500 hover:to-yellow-600 text-gray-900 font-semibold h-12 mt-4"
              >
                {createMutation.isPending || updateMutation.isPending ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Saving...
                  </>
                ) : (
                  "Save Bonus"
                )}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
        <Input
          placeholder="Search bonuses by name or code..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10 bg-gray-800/50 border-gray-700/50 text-white placeholder:text-gray-400"
        />
      </div>

      {isLoading ? (
        <div className="flex justify-center items-center py-24">
          <Loader2 className="w-12 h-12 animate-spin text-yellow-400" />
        </div>
      ) : filteredBonuses.length === 0 ? (
        <div className="text-center py-24 bg-gray-800/50 rounded-[2rem] border border-gray-700/50">
          <div className="bg-yellow-400/10 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4 border border-yellow-400/20">
            <Gift className="w-10 h-10 text-yellow-400" />
          </div>
          <p className="text-gray-400 font-medium">
            {bonuses.length === 0
              ? "No bonuses found. Create your first campaign!"
              : "No bonuses match your search."}
          </p>
        </div>
      ) : (
        <div className="bg-gray-800/50 rounded-[2rem] border border-gray-700/50 overflow-hidden shadow-2xl">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-700/50 bg-yellow-400">
                  <th className="px-6 py-4 text-left text-xs font-black uppercase tracking-widest text-gray-900">
                    Name / Code
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-black uppercase tracking-widest text-gray-900">
                    Value
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-black uppercase tracking-widest text-gray-900">
                    Rules
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-black uppercase tracking-widest text-gray-900">
                    Target
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-black uppercase tracking-widest text-gray-900">
                    Status
                  </th>
                  <th className="px-6 py-4 text-right text-xs font-black uppercase tracking-widest text-gray-900">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-700/30">
                {filteredBonuses.map((bonus: DepositBonus) => (
                  <tr
                    key={bonus._id}
                    className="hover:bg-gray-700/30 transition-colors group"
                  >
                    <td className="px-6 py-4">
                      <div>
                        <p className="text-white font-bold group-hover:text-yellow-400 transition-colors">
                          {bonus.welcomeBonusName}
                        </p>
                        <p className="text-gray-400 text-xs font-mono bg-gray-800 inline-block px-2 py-0.5 rounded mt-1">
                          {bonus.bonusCode}
                        </p>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-white font-bold">
                        {bonus.percentageValue}%
                      </div>
                      <p className="text-gray-400 text-xs mt-1">
                        Max: ৳{bonus.totalAmountBDT}
                      </p>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-white text-xs">
                        <span className="text-gray-400">Min Dep:</span> ৳
                        {bonus.minimumDepositBDT}
                      </div>
                      <div className="text-white text-xs mt-1">
                        <span className="text-gray-400">Wager:</span>{" "}
                        {bonus.wageringRequirement}x
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-gray-300 text-xs">
                        {bonus.applicableTo}
                      </p>
                      {bonus.depositMethodId && (
                        <p className="text-gray-500 text-[10px] mt-1">
                          {bonus.depositMethodId.method_name_en}
                        </p>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border ${
                          bonus.status === "Active"
                            ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
                            : "bg-slate-700/50 text-slate-400 border-slate-600/30"
                        }`}
                      >
                        {bonus.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex justify-end gap-2">
                        <Button
                          size="icon"
                          variant="ghost"
                          onClick={() => handleEdit(bonus)}
                          className="h-8 w-8 text-yellow-400 hover:text-yellow-300 hover:bg-yellow-400/20"
                        >
                          <Edit2 size={14} />
                        </Button>
                        <Button
                          size="icon"
                          variant="ghost"
                          onClick={() => {
                            if (
                              window.confirm(
                                "Are you sure you want to delete this bonus?",
                              )
                            ) {
                              deleteMutation.mutate(bonus._id);
                            }
                          }}
                          disabled={deleteMutation.isPending}
                          className="h-8 w-8 text-red-400 hover:text-red-300 hover:bg-red-500/20"
                        >
                          <Trash2 size={14} />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
