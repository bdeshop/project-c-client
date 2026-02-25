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
import { Plus, Edit2, Trash2, Loader2, GripVertical } from "lucide-react";
import { toast } from "sonner";
import axios from "axios";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

const API_BASE_URL =
  import.meta.env.VITE_API_URL || "http://localhost:5000/api";

interface PopularGame {
  _id: string;
  title: string;
  redirectUrl: string;
  image: string;
  isActive: boolean;
  order: number;
  createdAt: string;
}

export function PopularGamesPage() {
  const [open, setOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [imagePreview, setImagePreview] = useState<string>("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [formData, setFormData] = useState({
    title: "",
    redirectUrl: "",
    isActive: true,
    order: 0,
  });

  const queryClient = useQueryClient();

  // Fetch popular games
  const { data: games = [], isLoading } = useQuery({
    queryKey: ["popularGames"],
    queryFn: async () => {
      const response = await axios.get(`${API_BASE_URL}/popular-games`);
      return response.data.games || [];
    },
  });

  // Create popular game
  const createMutation = useMutation({
    mutationFn: async (data: FormData) => {
      const response = await axios.post(`${API_BASE_URL}/popular-games`, data, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["popularGames"] });
      toast.success("Popular game created successfully");
      setOpen(false);
      resetForm();
    },
    onError: (error: any) => {
      toast.error(
        error.response?.data?.message || "Failed to create popular game",
      );
    },
  });

  // Update popular game
  const updateMutation = useMutation({
    mutationFn: async (data: FormData) => {
      const response = await axios.put(
        `${API_BASE_URL}/popular-games/${editingId}`,
        data,
        { headers: { "Content-Type": "multipart/form-data" } },
      );
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["popularGames"] });
      toast.success("Popular game updated successfully");
      setOpen(false);
      resetForm();
    },
    onError: (error: any) => {
      toast.error(
        error.response?.data?.message || "Failed to update popular game",
      );
    },
  });

  // Delete popular game
  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const response = await axios.delete(
        `${API_BASE_URL}/popular-games/${id}`,
      );
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["popularGames"] });
      toast.success("Popular game deleted successfully");
    },
    onError: (error: any) => {
      toast.error(
        error.response?.data?.message || "Failed to delete popular game",
      );
    },
  });

  const resetForm = () => {
    setFormData({
      title: "",
      redirectUrl: "",
      isActive: true,
      order: 0,
    });
    setImagePreview("");
    setImageFile(null);
    setEditingId(null);
  };

  const handleEdit = (game: PopularGame) => {
    setFormData({
      title: game.title,
      redirectUrl: game.redirectUrl,
      isActive: game.isActive,
      order: game.order,
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
    if (!formData.title || !formData.redirectUrl) {
      toast.error("Title and redirect URL are required");
      return;
    }

    if (!editingId && !imageFile) {
      toast.error("Image is required for new popular games");
      return;
    }

    const formDataToSend = new FormData();
    formDataToSend.append("title", formData.title);
    formDataToSend.append("redirectUrl", formData.redirectUrl);
    formDataToSend.append("isActive", String(formData.isActive));
    formDataToSend.append("order", String(formData.order));
    if (imageFile) {
      formDataToSend.append("image", imageFile);
    }

    if (editingId) {
      updateMutation.mutate(formDataToSend);
    } else {
      createMutation.mutate(formDataToSend);
    }
  };

  const sortedGames = [...games].sort((a, b) => a.order - b.order);

  return (
    <div className="space-y-6">
      {/* Header with Add Button */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-white">Popular Games</h2>
          <p className="text-purple-300 text-sm mt-1">
            Manage featured games displayed on the homepage
          </p>
        </div>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button
              onClick={() => resetForm()}
              className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-semibold shadow-lg hover:shadow-purple-500/50 transition-all duration-300"
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Popular Game
            </Button>
          </DialogTrigger>
          <DialogContent className="bg-gradient-to-br from-slate-800 to-purple-800 border border-purple-500/20 text-white">
            <DialogHeader>
              <DialogTitle>
                {editingId ? "Edit Popular Game" : "Create New Popular Game"}
              </DialogTitle>
              <DialogDescription className="text-purple-300">
                {editingId
                  ? "Update the popular game details"
                  : "Add a new featured game"}
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label className="text-purple-200">Title</Label>
                <Input
                  placeholder="e.g., Mega Jackpot"
                  value={formData.title}
                  onChange={(e) =>
                    setFormData({ ...formData, title: e.target.value })
                  }
                  className="bg-slate-700/50 border-purple-500/30 text-white placeholder:text-purple-400"
                />
              </div>
              <div>
                <Label className="text-purple-200">Redirect URL</Label>
                <Input
                  placeholder="https://example.com/game"
                  value={formData.redirectUrl}
                  onChange={(e) =>
                    setFormData({ ...formData, redirectUrl: e.target.value })
                  }
                  className="bg-slate-700/50 border-purple-500/30 text-white placeholder:text-purple-400"
                />
              </div>
              <div>
                <Label className="text-purple-200">Display Order</Label>
                <Input
                  type="number"
                  placeholder="0"
                  value={formData.order}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      order: parseInt(e.target.value) || 0,
                    })
                  }
                  className="bg-slate-700/50 border-purple-500/30 text-white placeholder:text-purple-400"
                />
              </div>
              <div>
                <Label className="text-purple-200">Game Image</Label>
                <div className="flex gap-4">
                  {imagePreview && (
                    <div className="w-24 h-24 rounded-lg bg-slate-700/50 border border-purple-500/30 flex items-center justify-center overflow-hidden">
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
                  "Save Popular Game"
                )}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Popular Games Grid */}
      {isLoading ? (
        <div className="flex justify-center items-center py-12">
          <Loader2 className="w-8 h-8 animate-spin text-purple-500" />
        </div>
      ) : sortedGames.length === 0 ? (
        <div className="text-center py-12 bg-slate-800/50 rounded-xl border border-purple-500/20">
          <p className="text-purple-300">
            No popular games found. Create one to get started!
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {sortedGames.map((game: PopularGame, index: number) => (
            <div
              key={game._id}
              className="bg-gradient-to-br from-slate-800/50 to-purple-800/50 border border-purple-500/20 rounded-xl overflow-hidden hover:border-purple-500/50 transition-all duration-300 group"
            >
              {/* Image */}
              <div className="relative h-40 bg-slate-700/50 overflow-hidden">
                <img
                  src={game.image}
                  alt={game.title}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                />
                <div className="absolute top-2 left-2 bg-purple-600 text-white px-3 py-1 rounded-full text-sm font-semibold flex items-center gap-1">
                  <GripVertical className="w-3 h-3" />#{index + 1}
                </div>
                <div
                  className={`absolute top-2 right-2 px-3 py-1 rounded-full text-xs font-semibold ${
                    game.isActive
                      ? "bg-green-500/20 text-green-300"
                      : "bg-red-500/20 text-red-300"
                  }`}
                >
                  {game.isActive ? "Active" : "Inactive"}
                </div>
              </div>

              {/* Content */}
              <div className="p-4 space-y-3">
                <div>
                  <h3 className="text-white font-semibold text-lg truncate">
                    {game.title}
                  </h3>
                  <p className="text-purple-300 text-xs truncate">
                    {game.redirectUrl}
                  </p>
                </div>

                {/* Actions */}
                <div className="flex gap-2 pt-2 border-t border-purple-500/20">
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => handleEdit(game)}
                    className="flex-1 text-blue-400 hover:text-blue-300 hover:bg-blue-500/20"
                  >
                    <Edit2 className="w-4 h-4 mr-1" />
                    Edit
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => deleteMutation.mutate(game._id)}
                    disabled={deleteMutation.isPending}
                    className="flex-1 text-red-400 hover:text-red-300 hover:bg-red-500/20"
                  >
                    <Trash2 className="w-4 h-4 mr-1" />
                    Delete
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
