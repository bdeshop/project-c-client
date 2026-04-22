import { useState, useEffect, useCallback } from "react";
import {
  Edit,
  Trash2,
  RefreshCw,
  X,
  Save,
  Search,
  Gamepad2,
  Info,
  Flame,
  Sparkles,
  Star,
  Settings,
  Clock,
} from "lucide-react";
import { getGameCategories } from "@/config/api";
import { API_BASE_URL } from "@/config/constants";
import { apiClient } from "@/lib/api";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";

interface Game {
  _id: string;
  gameId: string;
  gameUuid: string;
  gameCode?: string;
  gameName?: string;
  name?: string;
  nameEnglish?: string;
  nameBangla?: string;
  image?: string;
  category?: {
    _id: string;
    name?: string;
    nameEnglish?: string;
    nameBangla?: string;
    icon?: string;
  };
  provider?: {
    _id: string;
    name: string;
    logo?: string;
  };
  isHot: boolean;
  isNew: boolean;
  isLobby: boolean;
  rtp?: number;
  jackpot?: string;
  freeTry?: string;
  createdAt?: string;
  updatedAt: string;
}


interface Category {
  _id: string;
  name?: string;
  nameEnglish?: string;
  nameBangla?: string;
}

interface Provider {
  _id: string;
  name: string;
}

function ManageGamesTab() {
  const [games, setGames] = useState<Game[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [providers, setProviders] = useState<Provider[]>([]);
  const [loading, setLoading] = useState(false);
  const [fetchingGames, setFetchingGames] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [editingGame, setEditingGame] = useState<Game | null>(null);
  const [filterCategory, setFilterCategory] = useState<string>("all");
  const [filterProvider, setFilterProvider] = useState<string>("all");
  const [filterType, setFilterType] = useState<string>("all");
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [message, setMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [totalCount, setTotalCount] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [selectedGames, setSelectedGames] = useState<Set<string>>(new Set());

  const [formData, setFormData] = useState({
    gameId: "",
    nameEnglish: "",
    nameBangla: "",
    category: "",
    isHot: false,
    isNew: false,
    isLobby: false,
    rtp: 0,
    jackpot: "FALSE",
    freeTry: "FALSE",
  });

  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>("");

  const fetchCategories = useCallback(async () => {
    try {
      const response = await getGameCategories();
      if (response.success && response.categories) {
        setCategories(response.categories);
      }
    } catch (error) {
      console.error("Failed to fetch categories:", error);
    }
  }, []);

  const fetchProviders = useCallback(async () => {
    try {
      const response = await fetch(
        "https://api.oraclegames.live/api/providers",
        {
          headers: {
            "x-dstgame-key":
              "b4fb7adb955b1078d8d38b54f5ad7be8ded17cfba85c37e4faa729ddd679d379",
            "x-api-key": "a8b5ca55-56a5-418d-829d-6d00afd5945f",
            "Content-Type": "application/json",
          },
        },
      );
      const result = await response.json();
      if (result.success && result.data && Array.isArray(result.data)) {
        setProviders(result.data);
      }
    } catch (error) {
      console.error("Failed to fetch providers:", error);
    }
  }, []);

  const fetchGames = useCallback(async () => {
    setFetchingGames(true);
    setMessage(null);
    try {
      const params: any = {
        page: currentPage,
        limit: pageSize,
      };

      if (filterCategory !== "all") params.category = filterCategory;
      if (filterProvider !== "all") params.provider = filterProvider;
      if (filterType !== "all") params.type = filterType;

      const response = await apiClient.get("/games", { params });
      const result = response.data;

      let gamesData: Game[] = [];
      if (result.success && Array.isArray(result.games))
        gamesData = result.games;
      else if (result.success && Array.isArray(result.data))
        gamesData = result.data;

      if (result.totalCount !== undefined) setTotalCount(result.totalCount);
      if (result.totalPages !== undefined) setTotalPages(result.totalPages);

      setGames(gamesData);
    } catch (error) {
      console.error("Failed to fetch games:", error);
      setMessage({ type: "error", text: "Failed to load games" });
    } finally {
      setFetchingGames(false);
    }
  }, [filterCategory, filterProvider, filterType, currentPage, pageSize]);

  useEffect(() => {
    fetchCategories();
    fetchProviders();
  }, [fetchCategories, fetchProviders]);

  useEffect(() => {
    setCurrentPage(1);
  }, [filterCategory, filterProvider, filterType, searchTerm]);

  useEffect(() => {
    fetchGames();
  }, [fetchGames]);

  const getImageUrl = (game: Game) => {
    if (game.image && typeof game.image === "string") {
      if (game.image.startsWith("http")) {
        return game.image;
      }
      return `${API_BASE_URL}/${game.image.startsWith("/") ? game.image.slice(1) : game.image}`;
    }
    if (game.provider?.logo) {
      if (game.provider.logo.startsWith("http")) {
        return game.provider.logo;
      }
      return `${API_BASE_URL}/${game.provider.logo.startsWith("/") ? game.provider.logo.slice(1) : game.provider.logo}`;
    }
    return "https://placehold.co/100x100?text=No+Image";
  };

  const handleEdit = (game: Game) => {
    setEditingGame(game);
    setFormData({
      gameId: game.gameUuid || game.gameId || "",
      nameEnglish: game.nameEnglish || "",
      nameBangla: game.nameBangla || "",
      category: game.category?._id || "",
      isHot: game.isHot,
      isNew: game.isNew,
      isLobby: game.isLobby,
      rtp: game.rtp || 0,
      jackpot: game.jackpot || "FALSE",
      freeTry: game.freeTry || "FALSE",
    });

    setImageFile(null);
    setImagePreview(getImageUrl(game));
    setIsEditing(true);
    setMessage(null);
    window.scrollTo({ top: 300, behavior: "smooth" });
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingGame) return;

    setLoading(true);
    setMessage(null);

    try {
      const formDataToSend = new FormData();

      formDataToSend.append("gameUuid", formData.gameId);
      formDataToSend.append("gameId", formData.gameId);
      formDataToSend.append("nameEnglish", formData.nameEnglish);
      formDataToSend.append("nameBangla", formData.nameBangla);
      formDataToSend.append("category", formData.category);
      formDataToSend.append("isHot", String(formData.isHot));
      formDataToSend.append("isNew", String(formData.isNew));
      formDataToSend.append("isLobby", String(formData.isLobby));
      formDataToSend.append("rtp", String(formData.rtp));
      formDataToSend.append("jackpot", formData.jackpot);
      formDataToSend.append("freeTry", formData.freeTry);


      if (imageFile) {
        formDataToSend.append("image", imageFile);
      }

      const response = await apiClient.put(
        `/games/${editingGame._id}`,
        formDataToSend,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        },
      );

      setMessage({ type: "success", text: "Game updated successfully!" });
      setIsEditing(false);
      setEditingGame(null);
      setImageFile(null);
      setImagePreview("");
      fetchGames();
    } catch (error) {
      setMessage({
        type: "error",
        text: error instanceof Error ? error.message : "Failed to update game",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this game?")) return;

    setLoading(true);
    setMessage(null);

    try {
      await apiClient.delete(`/games/${id}`);

      setMessage({ type: "success", text: "Game deleted successfully!" });
      fetchGames();
    } catch (error) {
      setMessage({
        type: "error",
        text: error instanceof Error ? error.message : "Failed to delete game",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleBulkDelete = async () => {
    if (selectedGames.size === 0) {
      setMessage({
        type: "error",
        text: "Please select at least one game to delete",
      });
      return;
    }

    if (
      !confirm(
        `Are you sure you want to delete ${selectedGames.size} game(s)? This action cannot be undone.`,
      )
    )
      return;

    setLoading(true);
    setMessage(null);

    try {
      let successCount = 0;
      let failureCount = 0;

      for (const gameId of selectedGames) {
        try {
          await apiClient.delete(`/games/${gameId}`);
          successCount++;
        } catch {
          failureCount++;
        }
      }

      setSelectedGames(new Set());
      setMessage({
        type: successCount > 0 ? "success" : "error",
        text:
          successCount > 0
            ? `Successfully deleted ${successCount} game(s)${failureCount > 0 ? ` (${failureCount} failed)` : ""}`
            : `Failed to delete ${failureCount} game(s)`,
      });

      fetchGames();
    } catch (error) {
      setMessage({
        type: "error",
        text: error instanceof Error ? error.message : "Failed to delete games",
      });
    } finally {
      setLoading(false);
    }
  };

  const toggleGameSelection = (gameId: string) => {
    const newSelected = new Set(selectedGames);
    if (newSelected.has(gameId)) {
      newSelected.delete(gameId);
    } else {
      newSelected.add(gameId);
    }
    setSelectedGames(newSelected);
  };

  const toggleSelectAll = () => {
    if (selectedGames.size === filteredGames.length) {
      setSelectedGames(new Set());
    } else {
      setSelectedGames(new Set(filteredGames.map((g) => g._id)));
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
    setEditingGame(null);
    setFormData({
      gameId: "",
      category: "",
      isHot: false,
      isNew: false,
      isLobby: false,
    });
    setImageFile(null);
    setImagePreview("");
    setMessage(null);
  };

  const filteredGames = games.filter((game) => {
    if (!searchTerm) return true;
    const gameId = game.gameUuid || game.gameId || "";
    const gameName = game.nameEnglish || game.name || "";
    return (
      gameId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      gameName.toLowerCase().includes(searchTerm.toLowerCase())
    );
  });

  return (
    <div className="space-y-10 pb-20">
      {/* Header Area */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-brand-primary/10 text-brand-primary shadow-sm border border-brand-primary/20">
            <Settings size={30} />
          </div>
          <div>
            <h2 className="text-2xl font-black text-slate-900 dark:text-white uppercase tracking-tight">
              Main Library Console
            </h2>
            <p className="text-slate-500 dark:text-slate-400 font-bold text-xs uppercase tracking-widest mt-0.5">
              Full access to game attributes and visibility
            </p>
          </div>
        </div>

        <Button
          variant="outline"
          onClick={fetchGames}
          disabled={fetchingGames}
          className="rounded-xl border-slate-200 dark:border-white/10 dark:hover:bg-white/5 h-12 px-6 font-black uppercase tracking-widest text-xs"
        >
          <RefreshCw
            size={18}
            className={`mr-2 ${fetchingGames ? "animate-spin" : ""}`}
          />
          Sync Data
        </Button>
      </div>

      {message && (
        <div
          className={`
          flex items-center gap-3 p-4 rounded-2xl border font-bold text-sm animate-in fade-in slide-in-from-top-2
          ${
            message.type === "success"
              ? "bg-emerald-50 border-emerald-200 text-emerald-600 dark:bg-emerald-500/10 dark:border-emerald-500/20 dark:text-emerald-400"
              : "bg-red-50 border-red-200 text-red-600 dark:bg-red-500/10 dark:border-red-500/20 dark:text-red-400"
          }
        `}
        >
          <Info size={18} />
          {message.text}
        </div>
      )}

      {/* Advanced Control & Filter Panel */}
      <div className="rounded-[2.5rem] bg-white border border-slate-200 p-8 shadow-sm dark:bg-[#1a1a1a] dark:border-white/10 space-y-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          <div className="space-y-3 lg:col-span-1">
            <Label className="text-[11px] font-black uppercase tracking-widest text-slate-400">
              Search Library
            </Label>
            <div className="relative">
              <Search
                className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                size={18}
              />
              <Input
                placeholder="Name or UUID..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-12 rounded-2xl h-12 bg-slate-50 border-slate-200 dark:bg-white/5 dark:border-white/10 font-bold"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:col-span-3">
            <div className="space-y-3">
              <Label className="text-[11px] font-black uppercase tracking-widest text-slate-400">
                Category Filter
              </Label>
              <Select value={filterCategory} onValueChange={setFilterCategory}>
                <SelectTrigger className="rounded-2xl h-12 bg-slate-50 border-slate-200 dark:bg-white/5 dark:border-white/10 font-bold">
                  <SelectValue placeholder="All Categories" />
                </SelectTrigger>
                <SelectContent className="rounded-2xl border-slate-200 dark:border-white/10 dark:bg-[#1e1e1e]">
                  <SelectItem value="all" className="rounded-lg font-bold">
                    All Categories
                  </SelectItem>
                  {categories.map((cat) => (
                    <SelectItem
                      key={cat._id}
                      value={cat._id}
                      className="rounded-lg font-bold"
                    >
                      {cat.nameEnglish || cat.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-3">
              <Label className="text-[11px] font-black uppercase tracking-widest text-slate-400">
                Provider Filter
              </Label>
              <Select value={filterProvider} onValueChange={setFilterProvider}>
                <SelectTrigger className="rounded-2xl h-12 bg-slate-50 border-slate-200 dark:bg-white/5 dark:border-white/10 font-bold">
                  <SelectValue placeholder="All Providers" />
                </SelectTrigger>
                <SelectContent className="rounded-2xl border-slate-200 dark:border-white/10 dark:bg-[#1e1e1e]">
                  <SelectItem value="all" className="rounded-lg font-bold">
                    All Providers
                  </SelectItem>
                  {providers.map((p) => (
                    <SelectItem
                      key={p._id}
                      value={p._id}
                      className="rounded-lg font-bold"
                    >
                      {p.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-3">
              <Label className="text-[11px] font-black uppercase tracking-widest text-slate-400">
                Tag Strategy
              </Label>
              <Select value={filterType} onValueChange={setFilterType}>
                <SelectTrigger className="rounded-2xl h-12 bg-slate-50 border-slate-200 dark:bg-white/5 dark:border-white/10 font-bold">
                  <SelectValue placeholder="All Status Types" />
                </SelectTrigger>
                <SelectContent className="rounded-2xl border-slate-200 dark:border-white/10 dark:bg-[#1e1e1e]">
                  <SelectItem
                    value="all"
                    className="rounded-lg font-bold text-slate-500 italic"
                  >
                    No Filter
                  </SelectItem>
                  <SelectItem
                    value="hot"
                    className="rounded-lg font-bold text-orange-500"
                  >
                    🔥 Hot Titles Only
                  </SelectItem>
                  <SelectItem
                    value="new"
                    className="rounded-lg font-bold text-emerald-500"
                  >
                    ✨ New Launches Only
                  </SelectItem>
                  <SelectItem
                    value="lobby"
                    className="rounded-lg font-bold text-brand-primary"
                  >
                    ⭐ Lobby Featured
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
      </div>

      {/* Active Edit Area */}
      {isEditing && editingGame && (
        <div className="rounded-[2.5rem] bg-white border-2 border-brand-primary p-8 shadow-2xl dark:bg-[#1a1a1a] animate-in zoom-in-95 duration-300">
          <div className="flex items-center justify-between mb-8 pb-4 border-b dark:border-white/5">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-xl bg-brand-primary/10 text-brand-primary flex items-center justify-center">
                <Edit size={20} />
              </div>
              <h3 className="text-xl font-black text-slate-900 dark:text-white">
                Modify System Entry
              </h3>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={handleCancel}
              className="rounded-full hover:bg-slate-100 dark:hover:bg-white/5"
            >
              <X size={20} />
            </Button>
          </div>

          <form
            onSubmit={handleUpdate}
            className="grid grid-cols-1 md:grid-cols-3 gap-8"
          >
            <div className="space-y-3">
              <Label className="text-[11px] font-bold uppercase tracking-widest text-slate-400">
                System UUID
              </Label>
              <Input
                value={formData.gameId}
                onChange={(e) =>
                  setFormData({ ...formData, gameId: e.target.value })
                }
                className="rounded-xl font-bold bg-slate-50 dark:bg-white/5 border-slate-200 dark:border-white/10"
                required
              />
            </div>

            <div className="space-y-3">
              <Label className="text-[11px] font-bold uppercase tracking-widest text-slate-400">
                English Name
              </Label>
              <Input
                value={formData.nameEnglish}
                onChange={(e) =>
                  setFormData({ ...formData, nameEnglish: e.target.value })
                }
                className="rounded-xl font-bold bg-slate-50 dark:bg-white/5 border-slate-200 dark:border-white/10"
                required
              />
            </div>

            <div className="space-y-3">
              <Label className="text-[11px] font-bold uppercase tracking-widest text-slate-400">
                Bangla Name
              </Label>
              <Input
                value={formData.nameBangla}
                onChange={(e) =>
                  setFormData({ ...formData, nameBangla: e.target.value })
                }
                className="rounded-xl font-bold bg-slate-50 dark:bg-white/5 border-slate-200 dark:border-white/10"
                required
              />
            </div>

            <div className="space-y-3">
              <Label className="text-[11px] font-bold uppercase tracking-widest text-slate-400">
                Target Category
              </Label>
              <Select
                value={formData.category}
                onValueChange={(val) =>
                  setFormData({ ...formData, category: val })
                }
              >
                <SelectTrigger className="rounded-xl font-bold bg-slate-50 dark:bg-white/5 border-slate-200 dark:border-white/10">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="rounded-xl">
                  {categories.map((cat) => (
                    <SelectItem key={cat._id} value={cat._id}>
                      {cat.nameEnglish || cat.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-3">
              <Label className="text-[11px] font-bold uppercase tracking-widest text-slate-400">
                RTP (%)
              </Label>
              <Input
                type="number"
                value={formData.rtp}
                onChange={(e) =>
                  setFormData({ ...formData, rtp: Number(e.target.value) })
                }
                className="rounded-xl font-bold bg-slate-50 dark:bg-white/5 border-slate-200 dark:border-white/10"
              />
            </div>

            <div className="space-y-3">
              <Label className="text-[11px] font-bold uppercase tracking-widest text-slate-400">
                Jackpot
              </Label>
              <Select
                value={formData.jackpot}
                onValueChange={(val) =>
                  setFormData({ ...formData, jackpot: val })
                }
              >
                <SelectTrigger className="rounded-xl font-bold bg-slate-50 dark:bg-white/5 border-slate-200 dark:border-white/10">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="rounded-xl">
                  <SelectItem value="TRUE">Yes</SelectItem>
                  <SelectItem value="FALSE">No</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-3">
              <Label className="text-[11px] font-bold uppercase tracking-widest text-slate-400">
                Free Try
              </Label>
              <Select
                value={formData.freeTry}
                onValueChange={(val) =>
                  setFormData({ ...formData, freeTry: val })
                }
              >
                <SelectTrigger className="rounded-xl font-bold bg-slate-50 dark:bg-white/5 border-slate-200 dark:border-white/10">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="rounded-xl">
                  <SelectItem value="TRUE">Yes</SelectItem>
                  <SelectItem value="FALSE">No</SelectItem>
                </SelectContent>
              </Select>
            </div>


            <div className="space-y-3">
              <Label className="text-[11px] font-bold uppercase tracking-widest text-slate-400">
                Active Tags
              </Label>
              <div className="flex gap-4 pt-1">
                <label className="flex items-center gap-2 cursor-pointer group">
                  <Checkbox
                    checked={formData.isHot}
                    onCheckedChange={(val) =>
                      setFormData({ ...formData, isHot: !!val })
                    }
                  />
                  <span
                    className={`text-[10px] font-black uppercase px-2 py-1 rounded-md transition-all ${formData.isHot ? "bg-orange-500 text-white" : "text-slate-400"}`}
                  >
                    Hot
                  </span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer group">
                  <Checkbox
                    checked={formData.isNew}
                    onCheckedChange={(val) =>
                      setFormData({ ...formData, isNew: !!val })
                    }
                  />
                  <span
                    className={`text-[10px] font-black uppercase px-2 py-1 rounded-md transition-all ${formData.isNew ? "bg-emerald-500 text-white" : "text-slate-400"}`}
                  >
                    New
                  </span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer group">
                  <Checkbox
                    checked={formData.isLobby}
                    onCheckedChange={(val) =>
                      setFormData({ ...formData, isLobby: !!val })
                    }
                  />
                  <span
                    className={`text-[10px] font-black uppercase px-2 py-1 rounded-md transition-all ${formData.isLobby ? "bg-brand-primary text-white" : "text-slate-400"}`}
                  >
                    Lobby
                  </span>
                </label>
              </div>
            </div>

            <div className="md:col-span-3 space-y-3">
              <Label className="text-[11px] font-bold uppercase tracking-widest text-slate-400">
                Game Image
              </Label>
              <div className="flex gap-4">
                <div className="flex-1">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) {
                        setImageFile(file);
                        const reader = new FileReader();
                        reader.onloadend = () => {
                          setImagePreview(reader.result as string);
                        };
                        reader.readAsDataURL(file);
                      }
                    }}
                    className="rounded-xl font-bold bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 px-4 py-2 w-full"
                  />
                </div>
                {imagePreview && (
                  <div className="relative w-20 h-20 rounded-xl overflow-hidden border border-slate-200 dark:border-white/10">
                    <img
                      src={imagePreview}
                      alt="Preview"
                      className="w-full h-full object-cover"
                    />
                    <button
                      type="button"
                      onClick={() => {
                        setImageFile(null);
                        setImagePreview("");
                      }}
                      className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                    >
                      <X size={14} />
                    </button>
                  </div>
                )}
              </div>
            </div>

            <div className="md:col-span-3 flex justify-end gap-3 pt-6">
              <Button
                type="button"
                variant="outline"
                onClick={handleCancel}
                className="rounded-xl px-8 font-black uppercase tracking-widest text-xs h-12"
              >
                Discard
              </Button>
              <Button
                type="submit"
                disabled={loading}
                className="rounded-xl px-12 bg-brand-primary font-black uppercase tracking-widest text-xs h-12 shadow-lg shadow-brand-primary/20"
              >
                {loading ? (
                  <RefreshCw className="animate-spin mr-2" />
                ) : (
                  <Save className="mr-2" />
                )}{" "}
                Patch Entry
              </Button>
            </div>
          </form>
        </div>
      )}

      {/* Bulk Delete Alert */}
      {selectedGames.size > 0 && (
        <div className="flex items-center justify-between gap-4 p-4 rounded-xl bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/20 animate-in slide-in-from-top-2">
          <div className="flex items-center gap-3">
            <Trash2 size={18} className="text-red-600 dark:text-red-400" />
            <span className="text-sm font-black text-red-600 dark:text-red-400 uppercase tracking-widest">
              {selectedGames.size} game(s) selected for deletion
            </span>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              onClick={() => setSelectedGames(new Set())}
              disabled={loading}
              className="rounded-lg h-9 px-4 text-xs font-bold border-red-200 dark:border-red-500/20 hover:bg-red-50 dark:hover:bg-red-500/5"
            >
              Cancel
            </Button>
            <Button
              onClick={handleBulkDelete}
              disabled={loading}
              className="rounded-lg h-9 px-6 bg-red-600 hover:bg-red-700 text-white text-xs font-bold shadow-lg shadow-red-600/20"
            >
              {loading ? (
                <RefreshCw className="animate-spin mr-2" size={14} />
              ) : (
                <Trash2 className="mr-2" size={14} />
              )}
              Delete Selected
            </Button>
          </div>
        </div>
      )}

      {/* Library Table View */}
      {fetchingGames ? (
        <div className="py-24 flex flex-col items-center gap-4 text-slate-400">
          <RefreshCw
            size={48}
            className="animate-spin text-brand-primary opacity-50"
            strokeWidth={1.5}
          />
          <p className="text-xs font-black uppercase tracking-widest">
            Querying Global Matrix...
          </p>
        </div>
      ) : filteredGames.length === 0 ? (
        <div className="py-32 flex flex-col items-center text-center opacity-30">
          <Gamepad2 size={80} strokeWidth={1} className="mb-6" />
          <h3 className="text-xl font-black text-slate-900 dark:text-white">
            Zero Match Collision
          </h3>
          <p className="max-w-xs font-medium">
            No system records match your current filter parameters or search
            sequence.
          </p>
        </div>
      ) : (
        <div className="rounded-[2.5rem] bg-white border border-slate-200 dark:bg-[#1a1a1a] dark:border-white/10 overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gradient-to-r from-brand-primary to-brand-secondary border-b dark:border-white/5">
                  <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-white w-16 flex items-center justify-end pr-4">
                    <div className="h-6 w-6 rounded border-2 border-white bg-black/20 flex items-center justify-center cursor-pointer hover:bg-black/40 transition-colors">
                      <Checkbox
                        checked={
                          filteredGames.length > 0 &&
                          selectedGames.size === filteredGames.length
                        }
                        onCheckedChange={toggleSelectAll}
                        className="border-0 bg-orange-500 data-[state=checked]:bg-orange-500 data-[state=checked]:border-0 w-5 h-5"
                      />
                    </div>
                  </th>
                  <th className="px-6 py-5 text-[10px] font-black uppercase tracking-widest text-white">
                    Profile
                  </th>
                  <th className="px-6 py-5 text-[10px] font-black uppercase tracking-widest text-white">
                    Identity Details
                  </th>
                  <th className="px-6 py-5 text-[10px] font-black uppercase tracking-widest text-white">
                    Taxonomy
                  </th>
                  <th className="px-6 py-5 text-[10px] font-black uppercase tracking-widest text-white">
                    Status Tags
                  </th>
                  <th className="px-6 py-5 text-[10px] font-black uppercase tracking-widest text-white">
                    System Logs
                  </th>
                  <th className="px-6 py-5 text-[10px] font-black uppercase tracking-widest text-white text-right">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y dark:divide-white/5">
                {filteredGames.map((game) => (
                  <tr
                    key={game._id}
                    className="group hover:bg-slate-50/50 dark:hover:bg-white/[0.01] transition-colors"
                  >
                    <td className="px-6 py-5 flex items-center justify-center">
                      <div className="h-6 w-6 rounded border-2 border-slate-300 dark:border-white/30 bg-black/10 dark:bg-black/40 flex items-center justify-center cursor-pointer hover:bg-black/20 dark:hover:bg-black/50 transition-colors">
                        <Checkbox
                          checked={selectedGames.has(game._id)}
                          onCheckedChange={() => toggleGameSelection(game._id)}
                          className="border-0 bg-orange-500 data-[state=checked]:bg-orange-500 data-[state=checked]:border-0 w-5 h-5"
                        />
                      </div>
                    </td>
                    <td className="px-6 py-5">
                      <div className="h-14 w-14 rounded-2xl overflow-hidden border border-slate-100 dark:border-white/5 shadow-inner bg-slate-50 dark:bg-black/20 group-hover:scale-105 transition-transform">
                        <img
                          src={getImageUrl(game)}
                          className="h-full w-full object-cover"
                          alt="Thumb"
                          onError={(e) =>
                            (e.currentTarget.src =
                              "https://placehold.co/100x100?text=ERR")
                          }
                        />
                      </div>
                    </td>
                    <td className="px-6 py-5">
                      <div className="space-y-1">
                        <h4 className="text-sm font-black text-slate-800 dark:text-slate-100 flex items-center gap-2">
                          {game.nameEnglish || "Untitled Unit"}
                          <Badge
                            variant="outline"
                            className="h-4 text-[8px] px-1 py-0 rounded border-slate-200 dark:border-white/10 font-black"
                          >
                            LOCAL
                          </Badge>
                        </h4>
                        <div className="flex items-center gap-2">
                          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter bg-slate-100 dark:bg-white/5 px-1.5 py-0.5 rounded">
                            ID: {game.gameId}
                          </span>
                          {game.rtp !== undefined && (
                            <span className="text-[10px] font-black text-emerald-500 uppercase tracking-tighter bg-emerald-500/10 px-1.5 py-0.5 rounded">
                              RTP: {game.rtp}%
                            </span>
                          )}
                        </div>

                      </div>
                    </td>
                    <td className="px-6 py-5">
                      <div className="flex flex-col gap-1">
                        <span className="text-[11px] font-black text-slate-600 dark:text-slate-300">
                          {game.category?.nameEnglish || "Uncategorized"}
                        </span>
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                          {game.provider?.name || "UNBOUNDED"}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-5">
                      <div className="flex flex-wrap gap-1.5">
                        {game.isHot && (
                          <Badge className="bg-orange-500/10 text-orange-600 border-none shadow-none font-black text-[9px] px-2 uppercase tracking-widest">
                            <Flame size={10} className="mr-1" /> Hot
                          </Badge>
                        )}
                        {game.isNew && (
                          <Badge className="bg-emerald-500/10 text-emerald-600 border-none shadow-none font-black text-[9px] px-2 uppercase tracking-widest">
                            <Sparkles size={10} className="mr-1" /> New
                          </Badge>
                        )}
                        {game.isLobby && (
                          <Badge className="bg-brand-primary/10 text-brand-primary border-none shadow-none font-black text-[9px] px-2 uppercase tracking-widest">
                            <Star size={10} className="mr-1" /> Lobby
                          </Badge>
                        )}
                        {!game.isHot && !game.isNew && !game.isLobby && (
                          <span className="text-[10px] font-bold text-slate-300 italic px-2">
                            Neutral Status
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-5">
                      <div className="flex items-center gap-2 text-slate-400">
                        <Clock size={12} />
                        <span className="text-[10px] font-black uppercase tracking-widest">
                          {new Date(
                            game.createdAt || game.updatedAt,
                          ).toLocaleDateString(undefined, {
                            month: "short",
                            day: "numeric",
                            year: "numeric",
                          })}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-5 text-right">
                      <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleEdit(game)}
                          className="h-9 w-9 rounded-xl hover:bg-brand-primary/10 hover:text-brand-primary"
                        >
                          <Edit size={16} />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleDelete(game._id)}
                          className="h-9 w-9 rounded-xl hover:bg-red-50 hover:text-red-500 dark:hover:bg-red-500/10"
                        >
                          <Trash2 size={16} />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="px-8 py-6 bg-slate-50/50 dark:bg-white/[0.02] border-t dark:border-white/5 space-y-4">
            <div className="flex items-center justify-between mb-4">
              <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">
                Consolidated Catalog
              </span>
              <span className="text-[10px] font-black uppercase tracking-widest text-brand-primary">
                Displaying {games.length} of {totalCount} units (Page{" "}
                {currentPage} of {totalPages})
              </span>
            </div>

            <div className="flex items-center justify-between gap-4">
              <div className="flex items-center gap-2">
                <Label className="text-[10px] font-black uppercase tracking-widest text-slate-400">
                  Items per page:
                </Label>
                <Select
                  value={String(pageSize)}
                  onValueChange={(val) => {
                    setPageSize(parseInt(val));
                    setCurrentPage(1);
                  }}
                >
                  <SelectTrigger className="w-20 h-9 rounded-lg text-xs font-bold bg-slate-100 dark:bg-white/5 border-slate-200 dark:border-white/10">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="rounded-lg">
                    <SelectItem value="5" className="text-xs font-bold">
                      5
                    </SelectItem>
                    <SelectItem value="10" className="text-xs font-bold">
                      10
                    </SelectItem>
                    <SelectItem value="25" className="text-xs font-bold">
                      25
                    </SelectItem>
                    <SelectItem value="50" className="text-xs font-bold">
                      50
                    </SelectItem>
                    <SelectItem value="100" className="text-xs font-bold">
                      100
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                  disabled={currentPage === 1 || fetchingGames}
                  className="rounded-lg h-9 px-3 text-xs font-bold"
                >
                  ← Previous
                </Button>

                <div className="flex items-center gap-1">
                  {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                    let pageNum: number;
                    if (totalPages <= 5) {
                      pageNum = i + 1;
                    } else if (currentPage <= 3) {
                      pageNum = i + 1;
                    } else if (currentPage >= totalPages - 2) {
                      pageNum = totalPages - 4 + i;
                    } else {
                      pageNum = currentPage - 2 + i;
                    }
                    return (
                      <Button
                        key={pageNum}
                        variant={
                          currentPage === pageNum ? "default" : "outline"
                        }
                        size="sm"
                        onClick={() => setCurrentPage(pageNum)}
                        disabled={fetchingGames}
                        className={`rounded-lg h-9 w-9 text-xs font-bold ${
                          currentPage === pageNum
                            ? "bg-brand-primary text-white"
                            : ""
                        }`}
                      >
                        {pageNum}
                      </Button>
                    );
                  })}
                </div>

                <Button
                  variant="outline"
                  size="sm"
                  onClick={() =>
                    setCurrentPage(Math.min(totalPages, currentPage + 1))
                  }
                  disabled={currentPage === totalPages || fetchingGames}
                  className="rounded-lg h-9 px-3 text-xs font-bold"
                >
                  Next →
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default ManageGamesTab;
