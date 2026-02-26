import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Search,
  Edit2,
  Trash2,
  Loader2,
  Flame,
  Sparkles,
  Star,
} from "lucide-react";
import { toast } from "sonner";
import axios from "axios";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getImageUrl } from "@/lib/imageUrl";

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:8000/api";

interface Game {
  _id: string;
  gameUuid: string;
  nameEnglish: string;
  nameBangla: string;
  image: string;
  category: { _id: string; nameEnglish: string };
  provider?: { _id: string; name: string };
  isHot: boolean;
  isNewGame: boolean;
  isLobby: boolean;
}

interface GameCategory {
  _id: string;
  nameEnglish: string;
}

interface Provider {
  _id: string;
  name: string;
}

export function ManageGamesTab() {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterCategory, setFilterCategory] = useState("all");
  const [filterProvider, setFilterProvider] = useState("all");
  const [filterType, setFilterType] = useState("all");
  const [editingGame, setEditingGame] = useState<Game | null>(null);
  const [editFormData, setEditFormData] = useState({
    nameEnglish: "",
    nameBangla: "",
  });
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>("");

  const queryClient = useQueryClient();

  const getAuthHeader = () => {
    const token = localStorage.getItem("authToken");
    return token ? { Authorization: `Bearer ${token}` } : {};
  };

  const { data: games = [], isLoading: gamesLoading } = useQuery({
    queryKey: ["games", filterCategory, filterProvider, filterType],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (filterCategory !== "all") params.append("category", filterCategory);
      if (filterProvider !== "all") params.append("provider", filterProvider);
      if (filterType !== "all") params.append("type", filterType);

      const response = await axios.get(`${API_BASE_URL}/games?${params}`, {
        headers: getAuthHeader(),
      });
      return response.data.games || [];
    },
  });

  const { data: categories = [] } = useQuery({
    queryKey: ["gameCategories"],
    queryFn: async () => {
      const response = await axios.get(`${API_BASE_URL}/game-categories`, {
        headers: getAuthHeader(),
      });
      return response.data.categories || [];
    },
  });

  const { data: providers = [] } = useQuery({
    queryKey: ["providers"],
    queryFn: async () => {
      const response = await axios.get(`${API_BASE_URL}/providers`, {
        headers: getAuthHeader(),
      });
      return response.data.providers || [];
    },
  });

  const updateMutation = useMutation({
    mutationFn: async (data: Partial<Game>) => {
      if (!editingGame) throw new Error("No game selected");

      // If there's an image file, use FormData
      if (imageFile) {
        const formDataObj = new FormData();
        formDataObj.append(
          "nameEnglish",
          editFormData.nameEnglish || data.nameEnglish || "",
        );
        formDataObj.append(
          "nameBangla",
          editFormData.nameBangla || data.nameBangla || "",
        );
        formDataObj.append("image", imageFile);

        const response = await axios.put(
          `${API_BASE_URL}/games/${editingGame._id}`,
          formDataObj,
          {
            headers: {
              ...getAuthHeader(),
              "Content-Type": "multipart/form-data",
            },
          },
        );
        return response.data;
      } else {
        // Otherwise send as JSON
        const response = await axios.put(
          `${API_BASE_URL}/games/${editingGame._id}`,
          data,
          {
            headers: getAuthHeader(),
          },
        );
        return response.data;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["games"] });
      toast.success("Game updated successfully");
      setEditingGame(null);
      setImageFile(null);
      setImagePreview("");
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Failed to update game");
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const response = await axios.delete(`${API_BASE_URL}/games/${id}`, {
        headers: getAuthHeader(),
      });
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["games"] });
      toast.success("Game deleted successfully");
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Failed to delete game");
    },
  });

  const filteredGames = games.filter((game: Game) => {
    if (!searchTerm) return true;
    return (
      game.gameUuid.toLowerCase().includes(searchTerm.toLowerCase()) ||
      game.nameEnglish.toLowerCase().includes(searchTerm.toLowerCase())
    );
  });

  const handleToggleTag = (
    game: Game,
    tag: "isHot" | "isNewGame" | "isLobby",
  ) => {
    const updateData: any = { ...game };
    updateData[tag] = !game[tag];

    // Map isNewGame to isNew for API
    if (tag === "isNewGame") {
      updateData.isNew = !game.isNewGame;
      delete updateData.isNewGame;
    }

    updateMutation.mutate(updateData);
  };

  const handleEditGame = (game: Game) => {
    setEditingGame(game);
    setEditFormData({
      nameEnglish: game.nameEnglish,
      nameBangla: game.nameBangla,
    });
    setImagePreview(getImageUrl(game.image));
    setImageFile(null);
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => setImagePreview(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const handleSaveEdit = () => {
    if (!editFormData.nameEnglish || !editFormData.nameBangla) {
      toast.error("Please fill all required fields");
      return;
    }
    updateMutation.mutate(editFormData);
  };

  return (
    <div className="space-y-6">
      {/* Filters */}
      <div className="bg-slate-800/50 rounded-xl p-4 space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <Label className="text-purple-200 text-sm mb-2 block">
              Search Games
            </Label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-purple-400" />
              <Input
                placeholder="Search by name or UUID..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 bg-slate-700/50 border-purple-500/30 text-white placeholder:text-purple-400"
              />
            </div>
          </div>

          <div>
            <Label className="text-purple-200 text-sm mb-2 block">
              Category
            </Label>
            <Select value={filterCategory} onValueChange={setFilterCategory}>
              <SelectTrigger className="bg-slate-700/50 border-purple-500/30 text-white">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-slate-800 border-purple-500/30">
                <SelectItem value="all" className="text-white">
                  All Categories
                </SelectItem>
                {categories.map((cat: GameCategory) => (
                  <SelectItem
                    key={cat._id}
                    value={cat._id}
                    className="text-white"
                  >
                    {cat.nameEnglish}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label className="text-purple-200 text-sm mb-2 block">
              Provider
            </Label>
            <Select value={filterProvider} onValueChange={setFilterProvider}>
              <SelectTrigger className="bg-slate-700/50 border-purple-500/30 text-white">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-slate-800 border-purple-500/30">
                <SelectItem value="all" className="text-white">
                  All Providers
                </SelectItem>
                {providers.map((p: Provider) => (
                  <SelectItem key={p._id} value={p._id} className="text-white">
                    {p.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label className="text-purple-200 text-sm mb-2 block">Type</Label>
            <Select value={filterType} onValueChange={setFilterType}>
              <SelectTrigger className="bg-slate-700/50 border-purple-500/30 text-white">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-slate-800 border-purple-500/30">
                <SelectItem value="all" className="text-white">
                  All Types
                </SelectItem>
                <SelectItem value="hot" className="text-orange-400">
                  🔥 Hot
                </SelectItem>
                <SelectItem value="new" className="text-green-400">
                  ✨ New
                </SelectItem>
                <SelectItem value="lobby" className="text-blue-400">
                  ⭐ Lobby
                </SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      {/* Games Table */}
      {gamesLoading ? (
        <div className="flex justify-center items-center py-12">
          <Loader2 className="w-8 h-8 animate-spin text-purple-500" />
        </div>
      ) : filteredGames.length === 0 ? (
        <div className="text-center py-12 bg-slate-800/50 rounded-xl border border-purple-500/20">
          <p className="text-purple-300">No games found</p>
        </div>
      ) : (
        <div className="overflow-x-auto bg-gradient-to-br from-slate-800/50 to-purple-800/50 border border-purple-500/20 rounded-xl">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-purple-500/20 bg-purple-500/10">
                <th className="text-left py-3 px-4 text-purple-300 font-semibold">
                  Game
                </th>
                <th className="text-left py-3 px-4 text-purple-300 font-semibold">
                  Category
                </th>
                <th className="text-left py-3 px-4 text-purple-300 font-semibold">
                  Provider
                </th>
                <th className="text-left py-3 px-4 text-purple-300 font-semibold">
                  Tags
                </th>
                <th className="text-right py-3 px-4 text-purple-300 font-semibold">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {filteredGames.map((game: Game) => (
                <tr
                  key={game._id}
                  className="border-b border-purple-500/10 hover:bg-purple-500/5 transition-colors"
                >
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-3">
                      <img
                        src={getImageUrl(game.image)}
                        alt={game.nameEnglish}
                        className="w-10 h-10 rounded object-cover"
                      />
                      <div>
                        <p className="text-white font-medium">
                          {game.nameEnglish}
                        </p>
                        <p className="text-purple-300 text-xs">
                          {game.gameUuid}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="py-3 px-4 text-purple-300">
                    {game.category.nameEnglish}
                  </td>
                  <td className="py-3 px-4 text-purple-300">
                    {game.provider?.name || "N/A"}
                  </td>
                  <td className="py-3 px-4">
                    <div className="flex gap-1 flex-wrap">
                      <Button
                        size="sm"
                        variant={game.isHot ? "default" : "outline"}
                        onClick={() => handleToggleTag(game, "isHot")}
                        className={`text-xs ${
                          game.isHot ? "bg-orange-500 hover:bg-orange-600" : ""
                        }`}
                      >
                        <Flame className="w-3 h-3" />
                      </Button>
                      <Button
                        size="sm"
                        variant={game.isNewGame ? "default" : "outline"}
                        onClick={() => handleToggleTag(game, "isNewGame")}
                        className={`text-xs ${
                          game.isNewGame
                            ? "bg-green-500 hover:bg-green-600"
                            : ""
                        }`}
                      >
                        <Sparkles className="w-3 h-3" />
                      </Button>
                      <Button
                        size="sm"
                        variant={game.isLobby ? "default" : "outline"}
                        onClick={() => handleToggleTag(game, "isLobby")}
                        className={`text-xs ${
                          game.isLobby ? "bg-blue-500 hover:bg-blue-600" : ""
                        }`}
                      >
                        <Star className="w-3 h-3" />
                      </Button>
                    </div>
                  </td>
                  <td className="py-3 px-4 text-right">
                    <div className="flex justify-end gap-2">
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => handleEditGame(game)}
                        className="text-blue-400 hover:text-blue-300 hover:bg-blue-500/20"
                      >
                        <Edit2 className="w-4 h-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => {
                          if (
                            confirm(
                              "Are you sure you want to delete this game?",
                            )
                          ) {
                            deleteMutation.mutate(game._id);
                          }
                        }}
                        disabled={deleteMutation.isPending}
                        className="text-red-400 hover:text-red-300 hover:bg-red-500/20"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Edit Game Dialog */}
      <Dialog
        open={!!editingGame}
        onOpenChange={(open) => !open && setEditingGame(null)}
      >
        <DialogContent className="bg-gradient-to-br from-slate-800 to-purple-800 border border-purple-500/20 text-white max-w-2xl">
          <DialogHeader>
            <DialogTitle>Edit Game</DialogTitle>
            <DialogDescription className="text-purple-300">
              Update game details and image
            </DialogDescription>
          </DialogHeader>
          {editingGame && (
            <div className="space-y-4 max-h-[70vh] overflow-y-auto">
              <div>
                <Label className="text-purple-200">Game Name (English)</Label>
                <Input
                  value={editFormData.nameEnglish}
                  onChange={(e) =>
                    setEditFormData({
                      ...editFormData,
                      nameEnglish: e.target.value,
                    })
                  }
                  className="bg-slate-700/50 border-purple-500/30 text-white placeholder:text-purple-400"
                />
              </div>
              <div>
                <Label className="text-purple-200">Game Name (Bangla)</Label>
                <Input
                  value={editFormData.nameBangla}
                  onChange={(e) =>
                    setEditFormData({
                      ...editFormData,
                      nameBangla: e.target.value,
                    })
                  }
                  className="bg-slate-700/50 border-purple-500/30 text-white placeholder:text-purple-400"
                />
              </div>
              <div>
                <Label className="text-purple-200">Game Image (Optional)</Label>
                <div className="flex gap-2 items-end">
                  <label className="flex-1 flex items-center justify-center border-2 border-dashed border-purple-500/30 rounded-lg p-4 cursor-pointer hover:border-purple-500/50 transition-colors">
                    <div className="text-center">
                      <p className="text-purple-300 text-sm">
                        Click to upload new image
                      </p>
                    </div>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageChange}
                      className="hidden"
                    />
                  </label>
                  {imagePreview && (
                    <img
                      src={imagePreview}
                      alt="preview"
                      className="w-20 h-20 rounded object-cover"
                    />
                  )}
                </div>
              </div>
              <div className="flex gap-3 pt-4">
                <Button
                  variant="outline"
                  onClick={() => setEditingGame(null)}
                  className="flex-1"
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleSaveEdit}
                  disabled={updateMutation.isPending}
                  className="flex-1 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-semibold"
                >
                  {updateMutation.isPending ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    "Save Changes"
                  )}
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
