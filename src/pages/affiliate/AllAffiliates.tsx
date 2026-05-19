import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Users,
  Search,
  CheckCircle,
  TrendingUp,
  XCircle,
  UserCheck,
  Edit2,
  Trash2,
  Filter,
} from "lucide-react";
import {
  getAllAffiliates,
  getPendingAffiliates,
  activateAffiliate,
  updateAffiliateStatus,
  deleteAffiliate,
} from "../../config/api";
import ActivateUserModal from "./ActivateUserModal";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";

interface Affiliate {
  id: string;
  userName: string;
  fullName: string;
  email?: string;
  phone: number;
  callingCode: string;
  myReferralCode: string;
  friendReferrerCode: string;
  balance: number;
  role: string;
  status: string;
  betWinCommission: number;
  betLossCommission: number;
  depositCommission: number;
  registrationCommission: number;
  totalReferrals?: number;
  activeReferrals?: number;
  totalEarnings?: number;
  pendingCommission?: number;
  createdAt: string;
}

function AllAffiliates() {
  const navigate = useNavigate();
  const [affiliates, setAffiliates] = useState<Affiliate[]>([]);
  const [pendingUsers, setPendingUsers] = useState<Affiliate[]>([]);
  const [allUsers, setAllUsers] = useState<Affiliate[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [activeTab, setActiveTab] = useState<"all" | "active" | "pending">(
    "all",
  );
  const [selectedUser, setSelectedUser] = useState<Affiliate | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        setError(null);

        if (activeTab === "all") {
          const response = await getAllAffiliates();
          const allUsersData = Array.isArray(response)
            ? response
            : response.users || [];
          setAllUsers(allUsersData);
        } else if (activeTab === "active") {
          const response = await getAllAffiliates();
          const allUsersData = Array.isArray(response)
            ? response
            : response.users || [];
          const activeUsers = allUsersData.filter(
            (user: Affiliate) => user.status !== "pending",
          );
          setAffiliates(activeUsers);
        } else {
          const response = await getPendingAffiliates();
          const data = Array.isArray(response)
            ? response
            : response.users || [];
          setPendingUsers(data);
        }
      } catch (err) {
        console.error("Error fetching data:", err);
        setError(err instanceof Error ? err.message : "Failed to fetch data");
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [activeTab]);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);

      if (activeTab === "all") {
        const response = await getAllAffiliates();
        const data = Array.isArray(response) ? response : response.users || [];
        setAllUsers(data);
      } else if (activeTab === "active") {
        const response = await getAllAffiliates();
        const allUsersData = Array.isArray(response)
          ? response
          : response.users || [];
        const activeUsers = allUsersData.filter(
          (user: Affiliate) => user.status !== "pending",
        );
        setAffiliates(activeUsers);
      } else {
        const response = await getPendingAffiliates();
        const data = Array.isArray(response) ? response : response.users || [];
        setPendingUsers(data);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch data");
    } finally {
      setLoading(false);
    }
  };

  const handleActivateUser = async (
    userId: string,
    commissions: {
      betWinCommission: number;
      betLossCommission: number;
      depositCommission: number;
      registrationCommission: number;
    },
  ) => {
    try {
      await activateAffiliate(userId, commissions);
      setSelectedUser(null);
      fetchData();
    } catch (err) {
      console.error("Error activating user:", err);
      throw err;
    }
  };

  const handleToggleStatus = async (userId: string, currentStatus: string) => {
    const newStatus = currentStatus === "active" ? "inactive" : "active";
    const confirmMessage = `Are you sure you want to ${newStatus === "active" ? "activate" : "deactivate"} this user?`;

    if (confirm(confirmMessage)) {
      try {
        await updateAffiliateStatus(userId, newStatus);
        fetchData();
      } catch (err) {
        console.error("Error updating status:", err);
        setError(
          err instanceof Error ? err.message : "Failed to update status",
        );
      }
    }
  };

  const filteredAll = (Array.isArray(allUsers) ? allUsers : []).filter(
    (user) => {
      const matchesSearch =
        user.userName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (user.email &&
          user.email.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (user.myReferralCode &&
          user.myReferralCode.toLowerCase().includes(searchTerm.toLowerCase()));

      const matchesStatus =
        filterStatus === "all" || user.status === filterStatus;

      return matchesSearch && matchesStatus;
    },
  );

  const filteredAffiliates = (
    Array.isArray(affiliates) ? affiliates : []
  ).filter((affiliate) => {
    const matchesSearch =
      affiliate.userName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (affiliate.email &&
        affiliate.email.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (affiliate.myReferralCode &&
        affiliate.myReferralCode
          .toLowerCase()
          .includes(searchTerm.toLowerCase()));

    const matchesStatus =
      filterStatus === "all" || affiliate.status === filterStatus;

    return matchesSearch && matchesStatus;
  });

  const filteredPending = (
    Array.isArray(pendingUsers) ? pendingUsers : []
  ).filter((user) => {
    const matchesSearch =
      user.userName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (user.email &&
        user.email.toLowerCase().includes(searchTerm.toLowerCase()));

    return matchesSearch;
  });

  const displayList =
    activeTab === "all"
      ? filteredAll
      : activeTab === "active"
        ? filteredAffiliates
        : filteredPending;

  const affiliatesArray = Array.isArray(allUsers) ? allUsers : [];

  const totalAffiliates = affiliatesArray.length;
  const activeAffiliates = affiliatesArray.filter(
    (a) => a.status === "active",
  ).length;
  const totalEarnings = affiliatesArray.reduce(
    (sum, a) => sum + (a.totalEarnings || 0),
    0,
  );
  const totalReferrals = affiliatesArray.reduce(
    (sum, a) => sum + (a.totalReferrals || 0),
    0,
  );

  const handleViewDetails = (id: string) => {
    navigate(`/dashboard/affiliates/${id}`);
  };

  const handleDelete = async (id: string, userName: string) => {
    if (
      confirm(
        `Are you sure you want to delete user "${userName}"? This action cannot be undone.`,
      )
    ) {
      try {
        await deleteAffiliate(id);
        setError(null);
        fetchData();
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to delete user");
      }
    }
  };

  if (loading) {
    return (
      <div className="flex h-[400px] w-full flex-col items-center justify-center gap-4">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
        <p className="text-muted-foreground animate-pulse">
          Loading affiliates...
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-8 p-6 w-full">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-primary to-secondary text-white shadow-lg shadow-primary/20">
            <Users size={32} />
          </div>
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-foreground">
              All Affiliates
            </h1>
            <p className="text-muted-foreground">
              Manage and monitor all affiliate partners
            </p>
          </div>
        </div>
      </div>

      {error && (
        <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-red-600 dark:border-red-800/50 dark:bg-red-900/10 dark:text-red-400">
          <p className="flex items-center gap-2 font-medium">
            <XCircle size={18} />
            {error}
          </p>
        </div>
      )}

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          {
            label: "Total Affiliates",
            value: totalAffiliates,
            icon: Users,
            color: "bg-blue-500/10 text-blue-600 dark:text-blue-400",
          },
          {
            label: "Active Affiliates",
            value: activeAffiliates,
            icon: CheckCircle,
            color: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400",
          },
          {
            label: "Total Referrals",
            value: totalReferrals,
            icon: TrendingUp,
            color: "bg-amber-500/10 text-amber-600 dark:text-amber-400",
          },
          {
            label: "Total Earnings",
            value: `৳${totalEarnings.toLocaleString()}`,
            icon: TrendingUp,
            color: "bg-primary/10 text-primary",
          },
        ].map((stat, idx) => (
          <div
            key={idx}
            className="rounded-2xl border bg-card p-6 shadow-sm transition-all hover:shadow-md dark:border-border dark:bg-card"
          >
            <div className="flex items-center justify-between mb-4">
              <span className="text-sm font-medium text-muted-foreground">
                {stat.label}
              </span>
              <div
                className={`flex h-10 w-10 items-center justify-center rounded-xl ${stat.color}`}
              >
                <stat.icon size={20} />
              </div>
            </div>
            <div className="text-2xl font-bold">{stat.value}</div>
          </div>
        ))}
      </div>

      {/* Main Content Card */}
      <div className="rounded-2xl border bg-card shadow-sm dark:border-border dark:bg-card">
        {/* Table Header / Tabs & Search */}
        <div className="flex flex-col border-b p-6 gap-6 dark:border-border">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="flex p-1 bg-muted rounded-xl w-fit">
              {[
                { id: "all", label: "All Users", count: allUsers.length },
                {
                  id: "active",
                  label: "Active Users",
                  count: affiliates.length,
                },
                {
                  id: "pending",
                  label: "Pending Users",
                  count: pendingUsers.length,
                },
              ].map((tab) => (
                <button
                  key={tab.id}
                  className={`px-4 py-2 text-sm font-medium rounded-lg transition-all ${
                    activeTab === tab.id
                      ? "bg-background text-foreground shadow-sm"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                  onClick={() => setActiveTab(tab.id as any)}
                >
                  {tab.label}{" "}
                  <span className="ml-1 opacity-60">({tab.count})</span>
                </button>
              ))}
            </div>

            <div className="flex flex-col sm:flex-row items-center gap-4 w-full md:w-auto">
              <div className="relative w-full sm:w-64">
                <Search
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
                  size={18}
                />
                <Input
                  className="pl-10"
                  placeholder="Search..."
                  value={searchTerm}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    setSearchTerm(e.target.value)
                  }
                />
              </div>

              {(activeTab === "active" || activeTab === "all") && (
                <Select value={filterStatus} onValueChange={setFilterStatus}>
                  <SelectTrigger className="w-full sm:w-[160px]">
                    <div className="flex items-center gap-2">
                      <Filter size={16} className="text-muted-foreground" />
                      <SelectValue placeholder="Status" />
                    </div>
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="inactive">Inactive</SelectItem>
                    <SelectItem value="pending">Pending</SelectItem>
                  </SelectContent>
                </Select>
              )}
            </div>
          </div>
        </div>

        {/* Table Content */}
        <div className="overflow-x-auto">
          {displayList.length > 0 ? (
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gradient-to-r from-primary to-secondary border-b dark:border-border">
                  <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-white">
                    User
                  </th>
                  <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-white">
                    Referral Code
                  </th>
                  {(activeTab === "active" || activeTab === "all") && (
                    <>
                      <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-white">
                        Referrals
                      </th>
                      <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-white text-center">
                        Commission Rates
                      </th>
                      <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-white">
                        Status
                      </th>
                    </>
                  )}
                  {activeTab === "pending" && (
                    <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-white">
                      Status
                    </th>
                  )}
                  <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-white text-right">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y dark:divide-border">
                {displayList.map((user) => (
                  <tr
                    key={user.id}
                    className="transition-colors hover:bg-muted/50 dark:hover:bg-muted/5"
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-4">
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-primary/20 to-secondary/20 text-primary font-bold">
                          {user.userName.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <div className="font-semibold">{user.userName}</div>
                          <div className="text-xs text-muted-foreground">
                            {user.email || `+${user.callingCode}${user.phone}`}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <code className="rounded bg-muted px-2 py-1 text-xs font-mono dark:bg-muted">
                        {user.myReferralCode || "N/A"}
                      </code>
                    </td>
                    {(activeTab === "active" || activeTab === "all") && (
                      <>
                        <td className="px-6 py-4 font-medium">
                          {user.totalReferrals || 0}
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center justify-center gap-2 flex-wrap">
                            <span className="text-[10px] bg-blue-500/10 text-blue-600 dark:text-blue-400 px-2 py-0.5 rounded-full font-bold">
                              W: {user.betWinCommission}%
                            </span>
                            <span className="text-[10px] bg-rose-500/10 text-rose-600 dark:text-rose-400 px-2 py-0.5 rounded-full font-bold">
                              L: {user.betLossCommission}%
                            </span>
                            <span className="text-[10px] bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 px-2 py-0.5 rounded-full font-bold">
                              D: {user.depositCommission}%
                            </span>
                            <span className="text-[10px] bg-amber-500/10 text-amber-600 dark:text-amber-400 px-2 py-0.5 rounded-full font-bold">
                              R: ৳{user.registrationCommission}
                            </span>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <span
                            className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-medium border ${
                              user.status === "active"
                                ? "bg-emerald-500/10 text-emerald-600 border-emerald-500/20"
                                : "bg-slate-500/10 text-slate-600 border-slate-500/20"
                            }`}
                          >
                            <span
                              className={`h-1.5 w-1.5 rounded-full ${user.status === "active" ? "bg-emerald-500" : "bg-slate-500"}`}
                            ></span>
                            {user.status.charAt(0).toUpperCase() +
                              user.status.slice(1)}
                          </span>
                        </td>
                      </>
                    )}
                    {activeTab === "pending" && (
                      <td className="px-6 py-4">
                        <span className="inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-medium border bg-amber-500/10 text-amber-600 border-amber-500/20">
                          <span className="h-1.5 w-1.5 rounded-full bg-amber-500 animate-pulse"></span>
                          Pending
                        </span>
                      </td>
                    )}
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        {activeTab === "pending" ||
                        user.status === "pending" ? (
                          <Button
                            variant="outline"
                            size="sm"
                            className="text-emerald-600 hover:text-emerald-700 hover:bg-emerald-50"
                            onClick={() => setSelectedUser(user)}
                          >
                            <UserCheck size={14} className="mr-2" />
                            Activate
                          </Button>
                        ) : (
                          <>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8 text-blue-500 hover:text-blue-600 hover:bg-blue-50"
                              onClick={() => handleViewDetails(user.id)}
                            >
                              <Edit2 size={14} />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8 text-red-500 hover:text-red-600 hover:bg-red-50"
                              onClick={() =>
                                handleDelete(user.id, user.userName)
                              }
                            >
                              <Trash2 size={14} />
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              className={
                                user.status === "active"
                                  ? "text-slate-600"
                                  : "text-emerald-600"
                              }
                              onClick={() => {
                                if (user.status === "inactive") {
                                  setSelectedUser(user);
                                } else {
                                  handleToggleStatus(user.id, user.status);
                                }
                              }}
                            >
                              {user.status === "active" ? (
                                <XCircle size={14} className="mr-2" />
                              ) : (
                                <CheckCircle size={14} className="mr-2" />
                              )}
                              {user.status === "active"
                                ? "Deactivate"
                                : "Activate"}
                            </Button>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <div className="flex flex-col items-center justify-center p-20 text-center gap-4">
              <div className="flex h-20 w-20 items-center justify-center rounded-full bg-muted">
                <Users size={40} className="text-muted-foreground" />
              </div>
              <div>
                <h3 className="text-lg font-semibold">No users found</h3>
                <p className="text-muted-foreground max-w-xs mx-auto">
                  {searchTerm
                    ? "Try adjusting your search criteria to find what you're looking for."
                    : "No affiliate partners are registered in this category at the moment."}
                </p>
              </div>
            </div>
          )}
        </div>
      </div>

      {selectedUser && (
        <ActivateUserModal
          user={selectedUser}
          onClose={() => setSelectedUser(null)}
          onActivate={handleActivateUser}
        />
      )}
    </div>
  );
}

export default AllAffiliates;
