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
import { Plus, Edit2, Trash2, Loader2, Search, Check } from "lucide-react";
import { toast } from "sonner";
import axios from "axios";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

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
  createdAt: string;
}

interface GameCategory {
  _id: string;
  nameEnglish: string;
}

export function GamesListPage() {
  const [open, setOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [imagePreview, setImagePreview] = useState<string>("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [formData, setFormData] = useState({
    gameUuid: "",
    nameEnglish: "",
    nameBangla: "",
    category: "",
    isHot: false,
    isNewGame: false,
    isLobby: false,
  });

  const queryClient = useQueryClient();

  // Get auth token
  const getAuthHeader = () => {
    const token = localStorage.getItem("authToken");
    return token ? { Authorization: `Bearer ${token}` } : {};
  };

  // Fetch games
  const { data: games = [], isLoading } = useQuery({
    queryKey: ["games"],
    queryFn: async () => {
      const response = await axios.get(`${API_BASE_URL}/games`, {
        headers: getAuthHeader(),
      });
      return response.data.games || [];
    },
  });

  // Fetch categories
  const { data: categories = [] } = useQuery({
    queryKey: ["gameCategories"],
    queryFn: async () => {
      const response = await axios.get(`${API_BASE_URL}/game-categories`, {
        headers: getAuthHeader(),
      });
      return response.data.categories || [];
    },
  });

  // Create game
  const createMutation = useMutation({
    mutationFn: async (data: FormData) => {
      const response = await axios.post(`${API_BASE_URL}/games`, data, {
        headers: {
          ...getAuthHeader(),
          "Content-Type": "multipart/form-data",
        },
      });
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["games"] });
      toast.success("Game created successfully");
      setOpen(false);
      resetForm();
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Failed to create game");
    },
  });

  // Update game
  const updateMutation = useMutation({
    mutationFn: async (data: FormData) => {
      const response = await axios.put(
        `${API_BASE_URL}/games/${editingId}`,
        data,
        {
          headers: {
            ...getAuthHeader(),
            "Content-Type": "multipart/form-data",
          },
        },
      );
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["games"] });
      toast.success("Game updated successfully");
      setOpen(false);
      resetForm();
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Failed to update game");
    },
  });

  // Delete game
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

  const resetForm = () => {
    setFormData({
      gameUuid: "",
      nameEnglish: "",
      nameBangla: "",
      category: "",
      isHot: false,
      isNewGame: false,
      isLobby: false,
    });
    setImagePreview("");
    setImageFile(null);
    setEditingId(null);
  };

  const handleEdit = (game: Game) => {
    setFormData({
      gameUuid: game.gameUuid,
      nameEnglish: game.nameEnglish,
      nameBangla: game.nameBangla,
      category: game.category._id,
      isHot: game.isHot,
      isNewGame: game.isNewGame,
      isLobby: game.isLobby,
    });
    setImagePreview(game.image);
    setEditingId(game._id);
    setOpen(true);
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = () => {
    if (
      !formData.gameUuid ||
      !formData.nameEnglish ||
      !formData.nameBangla ||
      !formData.category
    ) {
      toast.error("Please fill all required fields");
      return;
    }

    if (!editingId && !imageFile) {
      toast.error("Game image is required");
      return;
    }

    const formDataToSend = new FormData();
    formDataToSend.append("gameUuid", formData.gameUuid);
    formDataToSend.append("nameEnglish", formData.nameEnglish);
    formDataToSend.append("nameBangla", formData.nameBangla);
    formDataToSend.append("category", formData.category);
    formDataToSend.append("isHot", String(formData.isHot));
    formDataToSend.append("isNew", String(formData.isNewGame));
    formDataToSend.append("isLobby", String(formData.isLobby));
    if (imageFile) {
      formDataToSend.append("image", imageFile);
    }

    if (editingId) {
      updateMutation.mutate(formDataToSend);
    } else {
      createMutation.mutate(formDataToSend);
    }
  };

  const filteredGames = games.filter(
    (game: Game) =>
      game.nameEnglish.toLowerCase().includes(searchTerm.toLowerCase()) ||
      game.gameUuid.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  return (
    <div className="space-y-6">
      {/* Header with Add Button */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-white">Games</h2>
          <p className="text-purple-300 text-sm mt-1">
            Manage all games in the system
          </p>
        </div>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button
              onClick={() => resetForm()}
              className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-semibold shadow-lg hover:shadow-purple-500/50 transition-all duration-300"
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Game
            </Button>
          </DialogTrigger>
          <DialogContent className="bg-gradient-to-br from-slate-800 to-purple-800 border border-purple-500/20 text-white max-w-2xl">
            <DialogHeader>
              <DialogTitle>
                {editingId ? "Edit Game" : "Create New Game"}
              </DialogTitle>
              <DialogDescription className="text-purple-300">
                {editingId ? "Update the game details" : "Add a new game"}
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 max-h-96 overflow-y-auto">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-purple-200">Game UUID</Label>
                  <Input
                    placeholder="e.g., game_001"
                    value={formData.gameUuid}
                    onChange={(e) =>
                      setFormData({ ...formData, gameUuid: e.target.value })
                    }
                    className="bg-slate-700/50 border-purple-500/30 text-white placeholder:text-purple-400"
                    disabled={!!editingId}
                  />
                </div>
                <div>
                  <Label className="text-purple-200">Category</Label>
                  <Select
                    value={formData.category}
                    onValueChange={(value) =>
                      setFormData({ ...formData, category: value })
                    }
                  >
                    <SelectTrigger className="bg-slate-700/50 border-purple-500/30 text-white">
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent className="bg-slate-800 border-purple-500/30">
                      {categories.map((cat: GameCategory) => (
                        <SelectItem key={cat._id} value={cat._id}>
                          {cat.nameEnglish}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div>
                <Label className="text-purple-200">Game Name (English)</Label>
                <Input
                  placeholder="e.g., Mega Slots"
                  value={formData.nameEnglish}
                  onChange={(e) =>
                    setFormData({ ...formData, nameEnglish: e.target.value })
                  }
                  className="bg-slate-700/50 border-purple-500/30 text-white placeholder:text-purple-400"
                />
              </div>
              <div>
                <Label className="text-purple-200">Game Name (Bangla)</Label>
                <Input
                  placeholder="e.g., মেগা স্লট"
                  value={formData.nameBangla}
                  onChange={(e) =>
                    setFormData({ ...formData, nameBangla: e.target.value })
                  }
                  className="bg-slate-700/50 border-purple-500/30 text-white placeholder:text-purple-400"
                />
              </div>
              <div>
                <Label className="text-purple-200">Game Image</Label>
                <div className="flex gap-4">
                  {imagePreview && (
                    <div className="w-20 h-20 rounded-lg bg-slate-700/50 border border-purple-500/30 flex items-center justify-center overflow-hidden">
                      <img
                        src={imagePreview}
                        alt="preview"
                        className="w-full h-full object-cover"
                      />
                    </div>
                  )}
                  <div className="flex-1">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageChange}
                      className="w-full px-3 py-2 bg-slate-700/50 border border-purple-500/30 rounded-lg text-white text-sm file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-sm file:font-semibold file:bg-purple-600 file:text-white hover:file:bg-purple-700"
                    />
                  </div>
                </div>
              </div>
              <div className="space-y-3">
                <Label className="text-purple-200">Game Flags</Label>
                <div className="space-y-2">
                  <div
                    className="flex items-center space-x-3 p-2 rounded-lg hover:bg-purple-500/10 cursor-pointer transition-colors"
                    onClick={() =>
                      setFormData({ ...formData, isHot: !formData.isHot })
                    }
                  >
                    <div
                      className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-all ${
                        formData.isHot
                          ? "bg-purple-600 border-purple-600"
                          : "border-purple-400"
                      }`}
                    >
                      {formData.isHot && (
                        <Check className="w-3 h-3 text-white" />
                      )}
                    </div>
                    <Label className="text-purple-200 cursor-pointer">
                      Mark as Hot Game
                    </Label>
                  </div>
                  <div
                    className="flex items-center space-x-3 p-2 rounded-lg hover:bg-purple-500/10 cursor-pointer transition-colors"
                    onClick={() =>
                      setFormData({
                        ...formData,
                        isNewGame: !formData.isNewGame,
                      })
                    }
                  >
                    <div
                      className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-all ${
                        formData.isNewGame
                          ? "bg-purple-600 border-purple-600"
                          : "border-purple-400"
                      }`}
                    >
                      {formData.isNewGame && (
                        <Check className="w-3 h-3 text-white" />
                      )}
                    </div>
                    <Label className="text-purple-200 cursor-pointer">
                      Mark as New Game
                    </Label>
                  </div>
                  <div
                    className="flex items-center space-x-3 p-2 rounded-lg hover:bg-purple-500/10 cursor-pointer transition-colors"
                    onClick={() =>
                      setFormData({ ...formData, isLobby: !formData.isLobby })
                    }
                  >
                    <div
                      className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-all ${
                        formData.isLobby
                          ? "bg-purple-600 border-purple-600"
                          : "border-purple-400"
                      }`}
                    >
                      {formData.isLobby && (
                        <Check className="w-3 h-3 text-white" />
                      )}
                    </div>
                    <Label className="text-purple-200 cursor-pointer">
                      Show in Lobby
                    </Label>
                  </div>
                </div>
              </div>
              <Button
                onClick={handleSubmit}
                disabled={createMutation.isPending || updateMutation.isPending}
                className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-semibold"
              >
                {createMutation.isPending || updateMutation.isPending ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Saving...
                  </>
                ) : (
                  "Save Game"
                )}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Search Bar */}
      <div className="relative">
        <Search className="absolute left-3 top-3 w-5 h-5 text-purple-400" />
        <Input
          placeholder="Search games by name or UUID..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10 bg-slate-800/50 border-purple-500/30 text-white placeholder:text-purple-400"
        />
      </div>

      {/* Games Table */}
      {isLoading ? (
        <div className="flex justify-center items-center py-12">
          <Loader2 className="w-8 h-8 animate-spin text-purple-500" />
        </div>
      ) : filteredGames.length === 0 ? (
        <div className="text-center py-12 bg-slate-800/50 rounded-xl border border-purple-500/20">
          <p className="text-purple-300">
            {games.length === 0
              ? "No games found. Create one to get started!"
              : "No games match your search."}
          </p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-purple-500/20 bg-purple-500/10">
                <th className="px-4 py-3 text-left text-purple-200 font-semibold">
                  Game
                </th>
                <th className="px-4 py-3 text-left text-purple-200 font-semibold">
                  UUID
                </th>
                <th className="px-4 py-3 text-left text-purple-200 font-semibold">
                  Category
                </th>
                <th className="px-4 py-3 text-left text-purple-200 font-semibold">
                  Flags
                </th>
                <th className="px-4 py-3 text-right text-purple-200 font-semibold">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {filteredGames.map((game: Game) => (
                <tr
                  key={game._id}
                  className="border-b border-purple-500/10 hover:bg-purple-500/10 transition-colors"
                >
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <img
                        src={game.image}
                        alt={game.nameEnglish}
                        className="w-10 h-10 rounded object-cover"
                      />
                      <div>
                        <p className="text-white font-semibold">
                          {game.nameEnglish}
                        </p>
                        <p className="text-purple-300 text-sm">
                          {game.nameBangla}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-purple-300">{game.gameUuid}</td>
                  <td className="px-4 py-3 text-purple-300">
                    {game.category.nameEnglish}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex gap-1">
                      {game.isHot && (
                        <span className="text-xs bg-red-500/20 text-red-300 px-2 py-1 rounded">
                          Hot
                        </span>
                      )}
                      {game.isNewGame && (
                        <span className="text-xs bg-green-500/20 text-green-300 px-2 py-1 rounded">
                          New
                        </span>
                      )}
                      {game.isLobby && (
                        <span className="text-xs bg-blue-500/20 text-blue-300 px-2 py-1 rounded">
                          Lobby
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <div className="flex justify-end gap-2">
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => handleEdit(game)}
                        className="text-blue-400 hover:text-blue-300 hover:bg-blue-500/20"
                      >
                        <Edit2 className="w-4 h-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => deleteMutation.mutate(game._id)}
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
    </div>
  );
}
