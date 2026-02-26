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
import { Plus, Edit2, Trash2, Loader2, Upload } from "lucide-react";
import { toast } from "sonner";
import axios from "axios";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getImageUrl } from "@/lib/imageUrl";

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:8000/api";

interface PopularGame {
  _id: string;
  title: string;
  redirectUrl: string;
  image: string;
  isActive: boolean;
  order: number;
}

export function PopularGamesTab() {
  const [open, setOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>("");
  const [formData, setFormData] = useState({
    title: "",
    redirectUrl: "",
    isActive: true,
    order: 0,
  });

  const queryClient = useQueryClient();

  const getAuthHeader = () => {
    const token = localStorage.getItem("authToken");
    return token ? { Authorization: `Bearer ${token}` } : {};
  };

  const { data: games = [], isLoading } = useQuery({
    queryKey: ["popularGames"],
    queryFn: async () => {
      const response = await axios.get(
        `${API_BASE_URL}/popular-games/admin/all`,
        {
          headers: getAuthHeader(),
        },
      );
      return response.data.games || [];
    },
  });

  const createMutation = useMutation({
    mutationFn: async () => {
      const formDataObj = new FormData();
      formDataObj.append("title", formData.title);
      formDataObj.append("redirectUrl", formData.redirectUrl);
      formDataObj.append("isActive", String(formData.isActive));
      formDataObj.append("order", String(formData.order));
      if (imageFile) formDataObj.append("image", imageFile);

      const response = await axios.post(
        `${API_BASE_URL}/popular-games`,
        formDataObj,
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

  const updateMutation = useMutation({
    mutationFn: async () => {
      const formDataObj = new FormData();
      formDataObj.append("title", formData.title);
      formDataObj.append("redirectUrl", formData.redirectUrl);
      formDataObj.append("isActive", String(formData.isActive));
      formDataObj.append("order", String(formData.order));
      if (imageFile) formDataObj.append("image", imageFile);

      const response = await axios.put(
        `${API_BASE_URL}/popular-games/${editingId}`,
        formDataObj,
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

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const response = await axios.delete(
        `${API_BASE_URL}/popular-games/${id}`,
        {
          headers: getAuthHeader(),
        },
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
    setImageFile(null);
    setImagePreview("");
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
      reader.onloadend = () => setImagePreview(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = () => {
    if (!formData.title || !formData.redirectUrl) {
      toast.error("Please fill all required fields");
      return;
    }
    if (!imageFile && !imagePreview) {
      toast.error("Please provide an image");
      return;
    }
    if (editingId) {
      updateMutation.mutate();
    } else {
      createMutation.mutate();
    }
  };

  return (
    <div className="space-y-6">
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
          <DialogContent className="bg-gradient-to-br from-slate-800 to-purple-800 border border-purple-500/20 text-white max-w-2xl">
            <DialogHeader>
              <DialogTitle>
                {editingId ? "Edit Popular Game" : "Add Popular Game"}
              </DialogTitle>
              <DialogDescription className="text-purple-300">
                {editingId
                  ? "Update the popular game details"
                  : "Add a new featured game to the homepage"}
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 max-h-[70vh] overflow-y-auto">
              <div>
                <Label className="text-purple-200">Title (Required)</Label>
                <Input
                  placeholder="e.g., Book of Ra"
                  value={formData.title}
                  onChange={(e) =>
                    setFormData({ ...formData, title: e.target.value })
                  }
                  className="bg-slate-700/50 border-purple-500/30 text-white placeholder:text-purple-400"
                />
              </div>
              <div>
                <Label className="text-purple-200">
                  Redirect URL (Required)
                </Label>
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
                <Label className="text-purple-200">Game Image (Required)</Label>
                <div className="flex gap-2 items-end">
                  <label className="flex-1 flex items-center justify-center border-2 border-dashed border-purple-500/30 rounded-lg p-4 cursor-pointer hover:border-purple-500/50 transition-colors">
                    <div className="text-center">
                      <Upload className="w-6 h-6 text-purple-400 mx-auto mb-1" />
                      <p className="text-purple-300 text-xs">Click to upload</p>
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
                      className="w-16 h-16 rounded object-cover"
                    />
                  )}
                </div>
              </div>
              <div>
                <Label className="text-purple-200">Display Order</Label>
                <Input
                  type="number"
                  value={formData.order}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      order: parseInt(e.target.value),
                    })
                  }
                  className="bg-slate-700/50 border-purple-500/30 text-white"
                />
              </div>
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.isActive}
                  onChange={(e) =>
                    setFormData({ ...formData, isActive: e.target.checked })
                  }
                  className="w-4 h-4 rounded bg-slate-700/50 border-purple-500/30"
                />
                <span className="text-purple-200">Active</span>
              </label>
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

      {isLoading ? (
        <div className="flex justify-center items-center py-12">
          <Loader2 className="w-8 h-8 animate-spin text-purple-500" />
        </div>
      ) : games.length === 0 ? (
        <div className="text-center py-12 bg-slate-800/50 rounded-xl border border-purple-500/20">
          <p className="text-purple-300">
            No popular games found. Add one to get started!
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {games.map((game: PopularGame) => (
            <div
              key={game._id}
              className="bg-gradient-to-br from-slate-800/50 to-purple-800/50 border border-purple-500/20 rounded-xl overflow-hidden hover:border-purple-500/50 transition-all duration-300 group"
            >
              <div className="relative">
                <img
                  src={getImageUrl(game.image)}
                  alt={game.title}
                  className="w-full h-32 object-cover"
                />
                <div className="absolute top-2 right-2 flex gap-1">
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => handleEdit(game)}
                    className="text-blue-400 hover:text-blue-300 hover:bg-blue-500/20 opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <Edit2 className="w-4 h-4" />
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => {
                      if (
                        confirm("Are you sure you want to delete this game?")
                      ) {
                        deleteMutation.mutate(game._id);
                      }
                    }}
                    disabled={deleteMutation.isPending}
                    className="text-red-400 hover:text-red-300 hover:bg-red-500/20 opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
              <div className="p-4">
                <h3 className="text-white font-semibold mb-2">{game.title}</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex items-center gap-2">
                    <span className="text-purple-400">Order:</span>
                    <span className="text-white bg-purple-500/20 px-2 py-1 rounded">
                      {game.order}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-purple-400">Status:</span>
                    <span
                      className={`px-2 py-1 rounded text-xs font-semibold ${
                        game.isActive
                          ? "bg-green-500/20 text-green-300"
                          : "bg-red-500/20 text-red-300"
                      }`}
                    >
                      {game.isActive ? "Active" : "Inactive"}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
