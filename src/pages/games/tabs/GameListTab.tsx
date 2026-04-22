import { useState, useEffect, useCallback } from "react";
import axios from "axios";
import {
  Gamepad2,
  Info,
  Check,
  RefreshCw,
  ChevronLeft,
  ChevronRight,
  LayoutGrid,
  Search,
  Flame,
  Sparkles,
  Star,
} from "lucide-react";
import { getGameCategories } from "@/config/api";
import { API_BASE_URL } from "@/config/constants";
import { apiClient } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";

interface Game {
  _id: string;
  gameName: string;
  image: string;
  game_code: string;
  game_type: string;
  provider_code: string;
  jackpot?: string;
  freeTry?: string;
  seq?: number;
  rtp?: number;
}

interface Provider {
  _id: string;
  providerCode: string;
  providerName: string;
  gameType: string;
}

interface Category {
  _id: string;
  name?: string;
  nameEnglish?: string;
  nameBangla?: string;
  icon?: string;
}

function GameListTab() {
  const [games, setGames] = useState<Game[]>([]);
  const [providers, setProviders] = useState<Provider[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [fetchingGames, setFetchingGames] = useState(false);
  const [fetchingProviders, setFetchingProviders] = useState(true);
  const [selectedProvider, setSelectedProvider] = useState<string>("");
  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalGames, setTotalGames] = useState(0);
  const [selectedGames, setSelectedGames] = useState<Set<string>>(new Set());
  const [gameTags, setGameTags] = useState<{
    [key: string]: { isNew: boolean; isHot: boolean; isLobby: boolean };
  }>({});
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);
  const [providerImage, setProviderImage] = useState<File | null>(null);
  const [providerImagePreview, setProviderImagePreview] = useState<string>("");

  const fetchProviders = useCallback(async () => {
    setFetchingProviders(true);
    try {
      const response = await axios.get(
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
      const result = response.data;
      if (result.success && result.data && Array.isArray(result.data)) {
        setProviders(result.data);
      }
    } catch (error) {
      console.error("Failed to fetch providers:", error);
    } finally {
      setFetchingProviders(false);
    }
  }, []);

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

  const fetchGames = useCallback(async (providerCode = "") => {
    if (!providerCode) return;

    setFetchingGames(true);
    setMessage(null);
    try {
      const token = localStorage.getItem("authToken");
      const response = await axios.get(
        `https://api.oraclegames.live/api/providers/${providerCode}`,
        {
          headers: {
            "x-dstgame-key":
              "b4fb7adb955b1078d8d38b54f5ad7be8ded17cfba85c37e4faa729ddd679d379",
            "x-api-key": "a8b5ca55-56a5-418d-829d-6d00afd5945f",
            "Content-Type": "application/json",
          },
        },
      );
      const result = response.data;
      if (result.success && result.games && Array.isArray(result.games)) {
        setGames(result.games);
        setTotalGames(result.gameCount || result.games.length);
        setTotalPages(1);
        setCurrentPage(1);
      }
    } catch (error) {
      console.error("Failed to fetch games:", error);
      setMessage({ type: "error", text: "Failed to load games" });
    } finally {
      setFetchingGames(false);
    }
  }, []);

  const handleProviderImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setProviderImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setProviderImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  useEffect(() => {
    fetchProviders();
    fetchCategories();
  }, [fetchProviders, fetchCategories]);

  useEffect(() => {
    if (selectedCategory && selectedProvider) {
      const provider = providers.find((p) => p._id === selectedProvider);
      if (provider) {
        fetchGames(provider.providerCode);
      }
    } else {
      setGames([]);
      setFetchingGames(false);
    }
  }, [selectedCategory, selectedProvider, fetchGames, providers]);

  const handleCategoryChange = (categoryId: string) => {
    setSelectedCategory(categoryId);
    setSelectedProvider("");
    setGames([]);
    setSelectedGames(new Set());
    setGameTags({});
    setCurrentPage(1);
  };

  const handleProviderChange = (providerId: string) => {
    setSelectedProvider(providerId);
    setSelectedGames(new Set());
    setGameTags({});
    setCurrentPage(1);
    const provider = providers.find((p) => p._id === providerId);
    if (provider) {
      fetchGames(provider.providerCode);
    }
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 300, behavior: "smooth" });
  };

  const handleGameSelect = (gameId: string) => {
    const newSelected = new Set(selectedGames);
    if (newSelected.has(gameId)) {
      newSelected.delete(gameId);
      const newTags = { ...gameTags };
      delete newTags[gameId];
      setGameTags(newTags);
    } else {
      newSelected.add(gameId);
      setGameTags({
        ...gameTags,
        [gameId]: { isNew: false, isHot: false, isLobby: false },
      });
    }
    setSelectedGames(newSelected);
  };

  const handleTagChange = (
    gameId: string,
    tag: "isNew" | "isHot" | "isLobby",
  ) => {
    setGameTags({
      ...gameTags,
      [gameId]: {
        ...gameTags[gameId],
        [tag]: !gameTags[gameId]?.[tag],
      },
    });
  };

  const handleBulkCreate = async () => {
    if (!selectedCategory) {
      setMessage({ type: "error", text: "Please select a category first" });
      return;
    }
    if (selectedGames.size === 0) {
      setMessage({ type: "error", text: "Please select at least one game" });
      return;
    }

    setLoading(true);
    setMessage(null);

    try {
      const selectedGamesList = games.filter((g) => selectedGames.has(g._id));

      const gamesList = selectedGamesList.map((game) => ({
        gameUuid: game.game_code,
        gameId: game._id,
        name: game.gameName,
        image: game.image,
        isHot: gameTags[game._id]?.isHot || false,
        isNew: gameTags[game._id]?.isNew || false,
        isLobby: gameTags[game._id]?.isLobby || false,
      }));

      const selectedProviderObj = providers.find(
        (p) => p._id === selectedProvider,
      );

      const providersData = [
        {
          name: selectedProviderObj?.providerName || "Unknown Provider",
          providerCode: selectedProviderObj?.providerCode || "",
          logo: "",
          games: gamesList,
        },
      ];

      const formData = new FormData();
      formData.append(
        "data",
        JSON.stringify({
          categoryId: selectedCategory,
          providers: providersData,
        }),
      );

      if (providerImage) {
        formData.append("providerImage", providerImage);
      }

      const response = await apiClient.post("/games/bulk", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      const result = response.data;

      if (!result.success) {
        const errorMessage =
          result.errors && result.errors.length > 0
            ? `Failed: ${result.errors.map((e: { error: string }) => e.error).join(", ")}`
            : result.message || "Failed to create games";
        throw new Error(errorMessage);
      }

      setMessage({
        type: "success",
        text: `Successfully created ${result.totalGames} games!`,
      });
      setSelectedGames(new Set());
      setGameTags({});
      setProviderImage(null);
      setProviderImagePreview("");
    } catch (error) {
      console.error("Bulk create error:", error);
      setMessage({
        type: "error",
        text: error instanceof Error ? error.message : "Failed to create games",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSelectAllOnPage = () => {
    const newSelected = new Set(selectedGames);
    const newTags = { ...gameTags };
    games.forEach((game) => {
      newSelected.add(game._id);
      if (!newTags[game._id]) {
        newTags[game._id] = { isNew: false, isHot: false, isLobby: false };
      }
    });
    setSelectedGames(newSelected);
    setGameTags(newTags);
  };

  const handleClearSelection = () => {
    setSelectedGames(new Set());
    setGameTags({});
  };

  const canShowGames = selectedCategory && selectedProvider;

  return (
    <div className="space-y-10 pb-20">
      {/* Header Area */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-brand-primary/10 text-brand-primary shadow-sm border border-brand-primary/20">
            <Gamepad2 size={30} />
          </div>
          <div className="text-center md:text-left">
            <h2 className="text-2xl font-black text-slate-900 dark:text-white uppercase tracking-tight">
              Bulk Game Deployment
            </h2>
            <p className="text-slate-500 dark:text-slate-400 font-bold text-xs uppercase tracking-widest mt-0.5">
              Rapidly bridge individual titles to your library
            </p>
          </div>
        </div>

        {selectedGames.size > 0 && (
          <div className="flex items-center gap-3 animate-in fade-in slide-in-from-right-4">
            <Button
              variant="ghost"
              onClick={handleClearSelection}
              className="rounded-xl font-bold text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10"
            >
              Discard {selectedGames.size} selection
            </Button>
            <Button
              onClick={handleBulkCreate}
              disabled={loading}
              className="rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white font-black uppercase tracking-widest text-sm h-12 px-10 shadow-2xl shadow-emerald-500/40 border-2 border-emerald-400 hover:border-emerald-300 transition-all duration-200"
            >
              {loading ? (
                <RefreshCw className="animate-spin mr-2" size={18} />
              ) : (
                <Check className="mr-2" size={18} />
              )}
              Create Games
            </Button>
          </div>
        )}
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

      {/* Integration Control Panel */}
      <div className="rounded-[2.5rem] bg-white border border-slate-200 p-8 shadow-sm dark:bg-[#1a1a1a] dark:border-white/10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          <div className="space-y-3">
            <Label className="text-[11px] font-black uppercase tracking-widest text-slate-400">
              Step 1: Target Category
            </Label>
            <Select
              value={selectedCategory}
              onValueChange={handleCategoryChange}
            >
              <SelectTrigger className="rounded-2xl h-12 bg-slate-50 border-slate-200 dark:bg-white/5 dark:border-white/10 font-bold">
                <SelectValue placeholder="Choose target..." />
              </SelectTrigger>
              <SelectContent className="rounded-2xl border-slate-200 dark:border-white/10 dark:bg-[#1e1e1e]">
                {categories.map((cat) => (
                  <SelectItem
                    key={cat._id}
                    value={cat._id}
                    className="rounded-lg font-bold"
                  >
                    {cat.nameEnglish || cat.name}{" "}
                    {cat.nameBangla && (
                      <span className="text-slate-400 font-normal">
                        ({cat.nameBangla})
                      </span>
                    )}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-3">
            <Label className="text-[11px] font-black uppercase tracking-widest text-slate-400">
              Step 2: Source Provider
            </Label>
            <Select
              value={selectedProvider}
              onValueChange={handleProviderChange}
              disabled={!selectedCategory || fetchingProviders}
            >
              <SelectTrigger className="rounded-2xl h-12 bg-slate-50 border-slate-200 dark:bg-white/5 dark:border-white/10 font-bold">
                <SelectValue
                  placeholder={
                    selectedCategory ? "Choose source..." : "Awaiting Strategy"
                  }
                />
              </SelectTrigger>
              <SelectContent className="rounded-2xl border-slate-200 dark:border-white/10 dark:bg-[#1e1e1e]">
                {providers.map((p) => (
                  <SelectItem
                    key={p._id}
                    value={p._id}
                    className="rounded-lg font-bold"
                  >
                    {p.providerName} ({p.providerCode})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-3">
            <Label className="text-[11px] font-black uppercase tracking-widest text-slate-400">
              Step 3: Provider Logo
            </Label>
            <div className="relative">
              <input
                type="file"
                accept="image/*"
                onChange={handleProviderImageChange}
                className="hidden"
                id="provider-logo-bulk"
              />
              <label
                htmlFor="provider-logo-bulk"
                className="flex items-center justify-center h-12 rounded-2xl bg-slate-50 border-2 border-dashed border-slate-200 dark:bg-white/5 dark:border-white/10 cursor-pointer hover:border-brand-primary hover:bg-brand-primary/5 transition-all overflow-hidden"
              >
                {providerImagePreview ? (
                  <img
                    src={providerImagePreview}
                    alt="Preview"
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <span className="text-[11px] font-black uppercase tracking-widest text-slate-400">
                    Upload Identity Asset
                  </span>
                )}
              </label>
            </div>
          </div>

          <div className="col-span-1 lg:col-span-1 flex flex-col justify-end">
            <div className="flex items-center gap-6 pb-2">
              <div className="flex-1 space-y-1">
                <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">
                  Step 4: Select & Create
                </p>
                <div className="h-1.5 w-full bg-slate-100 dark:bg-white/5 rounded-full overflow-hidden">
                  <div
                    className={`h-full bg-brand-primary transition-all duration-700 ${canShowGames ? "w-full" : "w-0"}`}
                  ></div>
                </div>
              </div>
              {canShowGames && (
                <button
                  onClick={handleSelectAllOnPage}
                  className="px-4 py-2 rounded-xl bg-slate-100 dark:bg-white/5 text-[10px] font-black uppercase tracking-widest text-slate-500 hover:bg-brand-primary hover:text-white transition-all"
                >
                  Bridge Entire Page
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Results Grid Area */}
      {!canShowGames ? (
        <div className="py-24 flex flex-col items-center text-center opacity-40">
          <LayoutGrid
            size={80}
            strokeWidth={1}
            className="text-slate-300 mb-6"
          />
          <h3 className="text-xl font-black text-slate-900 dark:text-white mb-2">
            Awaiting Integration Parameters
          </h3>
          <p className="text-slate-500 max-w-sm font-medium">
            Define your target category and source provider above to begin
            cataloging titles for deployment.
          </p>
        </div>
      ) : fetchingGames ? (
        <div className="py-32 flex flex-col items-center gap-4 text-slate-400">
          <RefreshCw
            size={48}
            className="animate-spin text-brand-primary opacity-50"
            strokeWidth={1.5}
          />
          <p className="text-xs font-black uppercase tracking-widest">
            Bridging API Catalog...
          </p>
        </div>
      ) : games.length === 0 ? (
        <div className="py-24 flex flex-col items-center text-center">
          <Search size={64} className="text-slate-200 mb-6" />
          <h3 className="text-xl font-black text-slate-900 dark:text-white">
            Zero Titles Discovered
          </h3>
          <p className="text-slate-500 max-w-sm">
            We couldn't find any available titles under this provider strategy.
            Try a different source.
          </p>
        </div>
      ) : (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-6 duration-700">
          <div className="flex items-center justify-between px-2">
            <div className="flex items-center gap-2">
              <Badge
                variant="outline"
                className="rounded-lg h-6 px-2 bg-brand-primary/5 text-brand-primary border-brand-primary/20 font-black"
              >
                {totalGames} Titles Found
              </Badge>
              <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">
                Page {currentPage} of {totalPages}
              </span>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-6">
            {games.map((game) => {
              const isSelected = selectedGames.has(game._id);
              return (
                <div
                  key={game._id}
                  onClick={() => handleGameSelect(game._id)}
                  className={`
                    group relative flex flex-col rounded-[2rem] bg-white border transition-all duration-300 cursor-pointer overflow-hidden
                    ${
                      isSelected
                        ? "border-brand-primary shadow-xl shadow-brand-primary/10 -translate-y-1 bg-brand-primary/[0.02] dark:bg-brand-primary/5"
                        : "border-slate-100 hover:border-slate-300 hover:shadow-lg dark:bg-[#1a1a1a] dark:border-white/5"
                    }
                  `}
                >
                  {/* Image Container */}
                  <div className="aspect-square relative overflow-hidden bg-slate-100 dark:bg-black/40">
                    <img
                      src={
                        game.image && game.image.startsWith("http")
                          ? game.image
                          : game.image
                            ? `https://api.oraclegames.live${game.image}`
                            : "https://placehold.co/200x200?text=No+Image"
                      }
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                      alt={game.gameName}
                      onError={(e) =>
                        (e.currentTarget.src =
                          "https://placehold.co/200x200?text=Error")
                      }
                    />

                    {/* Selection Overlay */}
                    <div
                      className={`
                      absolute inset-0 bg-black/40 transition-opacity flex items-center justify-center
                      ${isSelected ? "opacity-100" : "opacity-0 group-hover:opacity-20"}
                    `}
                    >
                      <div
                        className={`
                        h-10 w-10 rounded-full flex items-center justify-center transition-all duration-300
                        ${isSelected ? "bg-white text-brand-primary scale-100" : "bg-white/50 text-white scale-75"}
                      `}
                      >
                        <Check size={24} strokeWidth={4} />
                      </div>
                    </div>
                  </div>

                  {/* Content Area */}
                  <div className="p-4 space-y-3">
                    <div className="space-y-1">
                      <h4
                        className={`text-[13px] font-black leading-tight truncate ${isSelected ? "text-brand-primary" : "text-slate-800 dark:text-slate-200"}`}
                      >
                        {game.gameName}
                      </h4>
                      <p className="text-[10px] font-bold text-slate-400 truncate uppercase">
                        {game.game_type}
                      </p>
                    </div>

                    {/* Tags UI (Only visible when selected) */}
                    {isSelected && (
                      <div
                        className="flex items-center justify-between pt-2 border-t dark:border-white/5 animate-in zoom-in-95"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <button
                          onClick={() => handleTagChange(game._id, "isNew")}
                          className={`p-1.5 rounded-lg transition-all ${gameTags[game._id]?.isNew ? "bg-emerald-100 text-emerald-600 dark:bg-emerald-500/20" : "bg-slate-50 text-slate-400 dark:bg-white/5"}`}
                          title="New Tag"
                        >
                          <Sparkles size={14} />
                        </button>
                        <button
                          onClick={() => handleTagChange(game._id, "isHot")}
                          className={`p-1.5 rounded-lg transition-all ${gameTags[game._id]?.isHot ? "bg-orange-100 text-orange-600 dark:bg-orange-500/20" : "bg-slate-50 text-slate-400 dark:bg-white/5"}`}
                          title="Hot Tag"
                        >
                          <Flame size={14} />
                        </button>
                        <button
                          onClick={() => handleTagChange(game._id, "isLobby")}
                          className={`p-1.5 rounded-lg transition-all ${gameTags[game._id]?.isLobby ? "bg-brand-primary/10 text-brand-primary" : "bg-slate-50 text-slate-400 dark:bg-white/5"}`}
                          title="Lobby Tag"
                        >
                          <Star size={14} />
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {/* New Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-6 pt-10">
              <Button
                variant="outline"
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1 || fetchingGames}
                className="rounded-xl h-12 w-12 p-0 border-slate-200 dark:border-white/10 dark:hover:bg-white/5"
              >
                <ChevronLeft size={20} />
              </Button>

              <div className="flex items-center gap-2">
                {[...Array(Math.min(5, totalPages))].map((_, i) => {
                  let pageNum = currentPage;
                  if (currentPage < 3) pageNum = i + 1;
                  else if (currentPage > totalPages - 2)
                    pageNum = totalPages - 4 + i;
                  else pageNum = currentPage - 2 + i;

                  if (pageNum < 1 || pageNum > totalPages) return null;

                  return (
                    <button
                      key={pageNum}
                      onClick={() => handlePageChange(pageNum)}
                      className={`
                        h-10 w-10 rounded-xl text-[13px] font-black transition-all
                        ${
                          currentPage === pageNum
                            ? "bg-brand-primary text-white shadow-lg shadow-brand-primary/20 scale-110"
                            : "text-slate-400 hover:bg-slate-100 dark:hover:bg-white/5"
                        }
                      `}
                    >
                      {pageNum}
                    </button>
                  );
                })}
              </div>

              <Button
                variant="outline"
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages || fetchingGames}
                className="rounded-xl h-12 w-12 p-0 border-slate-200 dark:border-white/10 dark:hover:bg-white/5"
              >
                <ChevronRight size={20} />
              </Button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default GameListTab;
