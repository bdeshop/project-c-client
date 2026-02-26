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
import { Loader2, Upload } from "lucide-react";
import { toast } from "sonner";
import axios from "axios";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getImageUrl } from "@/lib/imageUrl";

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:8000/api";

interface GameCategory {
  _id: string;
  nameEnglish: string;
}

export function CreateGameTab() {
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>("");
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

  const getAuthHeader = () => {
    const token = localStorage.getItem("authToken");
    return token ? { Authorization: `Bearer ${token}` } : {};
  };

  const { data: categories = [] } = useQuery({
    queryKey: ["gameCategories"],
    queryFn: async () => {
      const response = await axios.get(`${API_BASE_URL}/game-categories`, {
        headers: getAuthHeader(),
      });
      return response.data.categories || [];
    },
  });

  const createMutation = useMutation({
    mutationFn: async () => {
      const formDataObj = new FormData();
      formDataObj.append("gameUuid", formData.gameUuid);
      formDataObj.append("nameEnglish", formData.nameEnglish);
      formDataObj.append("nameBangla", formData.nameBangla);
      formDataObj.append("category", formData.category);
      formDataObj.append("isHot", String(formData.isHot));
      formDataObj.append("isNew", String(formData.isNewGame));
      formDataObj.append("isLobby", String(formData.isLobby));
      if (imageFile) formDataObj.append("image", imageFile);

      const response = await axios.post(`${API_BASE_URL}/games`, formDataObj, {
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
      resetForm();
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Failed to create game");
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
    setImageFile(null);
    setImagePreview("");
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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (
      !formData.gameUuid ||
      !formData.nameEnglish ||
      !formData.nameBangla ||
      !formData.category
    ) {
      toast.error("Please fill all required fields");
      return;
    }
    createMutation.mutate();
  };

  return (
    <div className="max-w-2xl mx-auto">
      <div className="bg-gradient-to-br from-slate-800/50 to-purple-800/50 border border-purple-500/20 rounded-xl p-8">
        <h2 className="text-2xl font-bold text-white mb-2">
          Create Custom Game
        </h2>
        <p className="text-purple-300 text-sm mb-6">
          Create a new game with bilingual support and custom settings
        </p>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <Label className="text-purple-200 mb-2 block">
                Game UUID (Required)
              </Label>
              <Input
                placeholder="e.g., game_12345"
                value={formData.gameUuid}
                onChange={(e) =>
                  setFormData({ ...formData, gameUuid: e.target.value })
                }
                className="bg-slate-700/50 border-purple-500/30 text-white placeholder:text-purple-400"
                required
              />
            </div>

            <div>
              <Label className="text-purple-200 mb-2 block">
                Category (Required)
              </Label>
              <Select
                value={formData.category}
                onValueChange={(val) =>
                  setFormData({ ...formData, category: val })
                }
              >
                <SelectTrigger className="bg-slate-700/50 border-purple-500/30 text-white">
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent className="bg-slate-800 border-purple-500/30">
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
              <Label className="text-purple-200 mb-2 block">
                Game Name (English)
              </Label>
              <Input
                placeholder="e.g., Book of Ra"
                value={formData.nameEnglish}
                onChange={(e) =>
                  setFormData({ ...formData, nameEnglish: e.target.value })
                }
                className="bg-slate-700/50 border-purple-500/30 text-white placeholder:text-purple-400"
                required
              />
            </div>

            <div>
              <Label className="text-purple-200 mb-2 block">
                Game Name (Bangla)
              </Label>
              <Input
                placeholder="e.g., বুক অফ রা"
                value={formData.nameBangla}
                onChange={(e) =>
                  setFormData({ ...formData, nameBangla: e.target.value })
                }
                className="bg-slate-700/50 border-purple-500/30 text-white placeholder:text-purple-400"
                required
              />
            </div>
          </div>

          <div>
            <Label className="text-purple-200 mb-2 block">Game Image</Label>
            <div className="flex gap-4 items-center">
              <label className="flex-1 flex items-center justify-center border-2 border-dashed border-purple-500/30 rounded-lg p-6 cursor-pointer hover:border-purple-500/50 transition-colors">
                <div className="text-center">
                  <Upload className="w-8 h-8 text-purple-400 mx-auto mb-2" />
                  <p className="text-purple-300 text-sm">
                    Click to upload image
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
                  className="w-24 h-24 rounded object-cover"
                />
              )}
            </div>
          </div>

          <div>
            <Label className="text-purple-200 mb-4 block">Game Tags</Label>
            <div className="space-y-3">
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.isHot}
                  onChange={(e) =>
                    setFormData({ ...formData, isHot: e.target.checked })
                  }
                  className="w-4 h-4 rounded bg-slate-700/50 border-purple-500/30"
                />
                <span className="text-purple-200">
                  🔥 Mark as Hot (Featured)
                </span>
              </label>
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.isNewGame}
                  onChange={(e) =>
                    setFormData({ ...formData, isNewGame: e.target.checked })
                  }
                  className="w-4 h-4 rounded bg-slate-700/50 border-purple-500/30"
                />
                <span className="text-purple-200">✨ Mark as New</span>
              </label>
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.isLobby}
                  onChange={(e) =>
                    setFormData({ ...formData, isLobby: e.target.checked })
                  }
                  className="w-4 h-4 rounded bg-slate-700/50 border-purple-500/30"
                />
                <span className="text-purple-200">⭐ Featured in Lobby</span>
              </label>
            </div>
          </div>

          <div className="flex gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={resetForm}
              className="flex-1"
            >
              Clear Form
            </Button>
            <Button
              type="submit"
              disabled={createMutation.isPending}
              className="flex-1 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-semibold"
            >
              {createMutation.isPending ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Creating...
                </>
              ) : (
                "Create Game"
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
