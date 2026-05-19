import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Loader2, Check } from "lucide-react";
import { toast } from "sonner";
import axios from "axios";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getImageUrl } from "@/lib/imageUrl";

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:8000/api";
const ORACLE_API_URL = "https://api.oraclegames.live/api";
const ORACLE_API_KEY = "a8b5ca55-56a5-418d-829d-6d00afd5945f";

interface Provider {
  _id: string;
  providerCode: string;
  providerName: string;
  gameType: string;
}

interface ExternalGame {
  _id: string;
  game_code: string;
  gameName: string;
  game_type: string;
  image: string;
  provider_code: string;
}

export function BulkCreateTab() {
  const [selectedProvider, setSelectedProvider] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedGames, setSelectedGames] = useState<Set<string>>(new Set());
  const [gameTags, setGameTags] = useState<
    Record<string, { isHot: boolean; isNew: boolean; isLobby: boolean }>
  >({});

  const queryClient = useQueryClient();

  const getAuthHeader = () => {
    const token = localStorage.getItem("authToken");
    return token ? { Authorization: `Bearer ${token}` } : {};
  };

  // Fetch providers from external Oracle API
  const { data: providers = [], isLoading: providersLoading } = useQuery({
    queryKey: ["externalProviders"],
    queryFn: async () => {
      try {
        const response = await axios.get(`${ORACLE_API_URL}/providers`, {
          headers: {
            "x-dstgame-key": ORACLE_API_KEY,
            "Content-Type": "application/json",
          },
        });
        return response.data.data || [];
      } catch (error) {
        console.error("Error fetching providers:", error);
        toast.error("Failed to fetch providers from external API");
        return [];
      }
    },
  });

  // Fetch games for selected provider from external Oracle API
  const { data: externalGames = [], isLoading: gamesLoading } = useQuery({
    queryKey: ["externalProviderGames", selectedProvider],
    queryFn: async () => {
      if (!selectedProvider) return [];
      try {
        const response = await axios.get(
          `${ORACLE_API_URL}/providers/${selectedProvider}`,
          {
            headers: {
              "x-dstgame-key": ORACLE_API_KEY,
              "Content-Type": "application/json",
            },
          },
        );
        return response.data.games || [];
      } catch (error) {
        console.error("Error fetching games:", error);
        toast.error("Failed to fetch games from external API");
        return [];
      }
    },
    enabled: !!selectedProvider,
  });

  const { data: categories = [] } = useQuery({
    queryKey: ["gameCategories"],
    queryFn: async () => {
      const response = await axios.get(`${API_BASE_URL}/game-categories`, {
        headers: getAuthHeader(),
      });
      return response.data.categories || [];
    },
    staleTime: 0,
    gcTime: 1000 * 60 * 5, // 5 minutes
  });

  const bulkCreateMutation = useMutation({
    mutationFn: async () => {
      // Find the provider name from the selected provider code
      const selectedProviderObj = providers.find(
        (p: Provider) => p.providerCode === selectedProvider,
      );
      const providerName =
        selectedProviderObj?.providerName || selectedProvider;

      const gamesToCreate = Array.from(selectedGames).map((gameCode) => {
        const game = externalGames.find(
          (g: ExternalGame) => g.game_code === gameCode,
        );
        const tags = gameTags[gameCode] || {
          isHot: false,
          isNew: false,
          isLobby: false,
        };
        return {
          gameUuid: game?.game_code || gameCode,
          gameId: game?.game_code || gameCode,
          nameEnglish: game?.gameName || gameCode,
          nameBangla: game?.gameName || gameCode,
          image: game?.image || "",
          isHot: tags.isHot,
          isNew: tags.isNew,
          isLobby: tags.isLobby,
        };
      });

      const providerData = {
        name: providerName,
        logo: "/uploads/default-logo.png",
        games: gamesToCreate,
      };

      const response = await axios.post(
        `${API_BASE_URL}/games/bulk`,
        {
          categoryId: selectedCategory,
          providers: [providerData],
        },
        {
          headers: getAuthHeader(),
        },
      );
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["games"] });
      toast.success("Games created successfully");
      setSelectedGames(new Set());
      setGameTags({});
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Failed to create games");
    },
  });

  const toggleGameSelection = (gameCode: string) => {
    const newSelected = new Set(selectedGames);
    if (newSelected.has(gameCode)) {
      newSelected.delete(gameCode);
    } else {
      newSelected.add(gameCode);
    }
    setSelectedGames(newSelected);
  };

  const toggleTag = (gameCode: string, tag: "isHot" | "isNew" | "isLobby") => {
    setGameTags((prev) => ({
      ...prev,
      [gameCode]: {
        ...prev[gameCode],
        [tag]: !prev[gameCode]?.[tag],
      },
    }));
  };

  const handleBulkCreate = () => {
    if (!selectedCategory) {
      toast.error("Please select a category");
      return;
    }
    if (selectedGames.size === 0) {
      toast.error("Please select at least one game");
      return;
    }
    bulkCreateMutation.mutate();
  };

  return (
    <div className="space-y-6">
      <div className="bg-gray-800/50 border border-gray-700/50 rounded-xl p-6">
        <h2 className="text-2xl font-bold text-white mb-4">
          Bulk Create Games
        </h2>
        <p className="text-gray-400 text-sm mb-6">
          Import games from external Oracle Games API providers and create them
          in bulk
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div>
            <Label className="text-gray-300 mb-2 block">
              Select Provider
            </Label>
            {providersLoading ? (
              <div className="flex items-center justify-center p-2">
                <Loader2 className="w-4 h-4 animate-spin text-yellow-400" />
              </div>
            ) : (
              <Select
                value={selectedProvider}
                onValueChange={setSelectedProvider}
              >
                <SelectTrigger className="bg-gray-800/50 border-gray-700/50 text-white">
                  <SelectValue placeholder="Choose provider" />
                </SelectTrigger>
                <SelectContent className="bg-gray-800 border-gray-700/50">
                  {providers.map((p: Provider) => (
                    <SelectItem
                      key={p.providerCode}
                      value={p.providerCode}
                      className="text-white"
                    >
                      {p.providerName} ({p.gameType})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          </div>

          <div>
            <Label className="text-gray-300 mb-2 block">
              Select Category
            </Label>
            <Select
              value={selectedCategory}
              onValueChange={setSelectedCategory}
            >
              <SelectTrigger className="bg-gray-800/50 border-gray-700/50 text-white">
                <SelectValue placeholder="Choose category" />
              </SelectTrigger>
              <SelectContent className="bg-gray-800 border-gray-700/50">
                {categories.map((c: any) => (
                  <SelectItem key={c._id} value={c._id} className="text-white">
                    {c.nameEnglish}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {selectedProvider && (
          <div className="text-sm text-gray-400 mb-4">
            Selected: {selectedGames.size} games
          </div>
        )}
      </div>

      {gamesLoading ? (
        <div className="flex justify-center items-center py-12">
          <Loader2 className="w-8 h-8 animate-spin text-yellow-400" />
        </div>
      ) : externalGames.length === 0 ? (
        <div className="text-center py-12 bg-gray-800/50 rounded-xl border border-gray-700/50">
          <p className="text-gray-400">
            {selectedProvider
              ? "No games found for this provider"
              : "Select a provider to view games"}
          </p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {externalGames.map((game: ExternalGame) => (
              <div
                key={game._id}
                className="bg-gray-800/50 border border-gray-700/50 rounded-xl p-4 hover:border-gray-600/50 transition-all duration-300"
              >
                <div className="flex items-start gap-3 mb-3">
                  <input
                    type="checkbox"
                    checked={selectedGames.has(game.game_code)}
                    onChange={() => toggleGameSelection(game.game_code)}
                    className="w-5 h-5 rounded mt-1 cursor-pointer accent-yellow-400"
                  />
                  <div className="flex-1">
                    <img
                      src={getImageUrl(game.image)}
                      alt={game.gameName}
                      className="w-full h-24 rounded object-cover mb-2"
                    />
                    <h3 className="text-white font-semibold text-sm">
                      {game.gameName}
                    </h3>
                    <p className="text-gray-400 text-xs">{game.game_code}</p>
                    <p className="text-gray-400 text-xs mt-1">
                      Type: {game.game_type}
                    </p>
                  </div>
                </div>

                {selectedGames.has(game.game_code) && (
                  <div className="space-y-2 pt-3 border-t border-gray-700/50">
                    <label className="flex items-center gap-2 cursor-pointer text-xs">
                      <input
                        type="checkbox"
                        checked={gameTags[game.game_code]?.isHot || false}
                        onChange={() => toggleTag(game.game_code, "isHot")}
                        className="w-3 h-3 rounded accent-yellow-400"
                      />
                      <span className="text-gray-300">🔥 Hot</span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer text-xs">
                      <input
                        type="checkbox"
                        checked={gameTags[game.game_code]?.isNew || false}
                        onChange={() => toggleTag(game.game_code, "isNew")}
                        className="w-3 h-3 rounded accent-yellow-400"
                      />
                      <span className="text-gray-300">✨ New</span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer text-xs">
                      <input
                        type="checkbox"
                        checked={gameTags[game.game_code]?.isLobby || false}
                        onChange={() => toggleTag(game.game_code, "isLobby")}
                        className="w-3 h-3 rounded accent-yellow-400"
                      />
                      <span className="text-gray-300">⭐ Lobby</span>
                    </label>
                  </div>
                )}
              </div>
            ))}
          </div>

          <div className="flex justify-end pt-6">
            <Button
              onClick={handleBulkCreate}
              disabled={
                bulkCreateMutation.isPending || selectedGames.size === 0
              }
              className="bg-gradient-to-r from-yellow-400 to-yellow-500 hover:from-yellow-500 hover:to-yellow-600 text-gray-900 font-semibold"
            >
              {bulkCreateMutation.isPending ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Creating...
                </>
              ) : (
                <>
                  <Check className="w-4 h-4 mr-2" />
                  Create {selectedGames.size} Games
                </>
              )}
            </Button>
          </div>
        </>
      )}
    </div>
  );
}
