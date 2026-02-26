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
  DialogTrigger,
} from "@/components/ui/dialog";
import { Plus, Edit2, Trash2, Loader2, Image as ImageIcon } from "lucide-react";
import { toast } from "sonner";
import axios from "axios";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getImageUrl } from "@/lib/imageUrl";

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:8000/api";

interface GameCategory {
  _id: string;
  nameEnglish: string;
  nameBangla: string;
  icon: string;
  image?: string;
  displayType: "providers" | "games";
}

export function GameCategoriesTab() {
  const [open, setOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [iconFile, setIconFile] = useState<File | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [iconPreview, setIconPreview] = useState<string>("");
  const [imagePreview, setImagePreview] = useState<string>("");
  const [formData, setFormData] = useState({
    nameEnglish: "",
    nameBangla: "",
    displayType: "providers" as "providers" | "games",
  });

  const queryClient = useQueryClient();

  const getAuthHeader = () => {
    const token = localStorage.getItem("authToken");
    return token ? { Authorization: `Bearer ${token}` } : {};
  };

  const { data: categories = [], isLoading } = useQuery({
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
      formDataObj.append("nameEnglish", formData.nameEnglish);
      formDataObj.append("nameBangla", formData.nameBangla);
      formDataObj.append("displayType", formData.displayType);
      if (iconFile) formDataObj.append("icon", iconFile);
      if (imageFile) formDataObj.append("image", imageFile);

      const response = await axios.post(
        `${API_BASE_URL}/game-categories`,
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
      queryClient.invalidateQueries({ queryKey: ["gameCategories"] });
      toast.success("Category created successfully");
      setOpen(false);
      resetForm();
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Failed to create category");
    },
  });

  const updateMutation = useMutation({
    mutationFn: async () => {
      const formDataObj = new FormData();
      formDataObj.append("nameEnglish", formData.nameEnglish);
      formDataObj.append("nameBangla", formData.nameBangla);
      formDataObj.append("displayType", formData.displayType);
      if (iconFile) formDataObj.append("icon", iconFile);
      if (imageFile) formDataObj.append("image", imageFile);

      const response = await axios.put(
        `${API_BASE_URL}/game-categories/${editingId}`,
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
      queryClient.invalidateQueries({ queryKey: ["gameCategories"] });
      toast.success("Category updated successfully");
      setOpen(false);
      resetForm();
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Failed to update category");
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const response = await axios.delete(
        `${API_BASE_URL}/game-categories/${id}`,
        {
          headers: getAuthHeader(),
        },
      );
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["gameCategories"] });
      toast.success("Category deleted successfully");
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Failed to delete category");
    },
  });

  const resetForm = () => {
    setFormData({
      nameEnglish: "",
      nameBangla: "",
      displayType: "providers",
    });
    setIconFile(null);
    setImageFile(null);
    setIconPreview("");
    setImagePreview("");
    setEditingId(null);
  };

  const handleEdit = (category: GameCategory) => {
    setFormData({
      nameEnglish: category.nameEnglish,
      nameBangla: category.nameBangla,
      displayType: category.displayType,
    });
    setIconPreview(category.icon);
    setImagePreview(category.image || "");
    setEditingId(category._id);
    setOpen(true);
  };

  const handleIconChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setIconFile(file);
      const reader = new FileReader();
      reader.onloadend = () => setIconPreview(reader.result as string);
      reader.readAsDataURL(file);
    }
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
    if (!formData.nameEnglish || !formData.nameBangla) {
      toast.error("Please fill all required fields");
      return;
    }
    if (!iconFile && !iconPreview) {
      toast.error("Please provide an icon");
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
          <h2 className="text-2xl font-bold text-white">Game Categories</h2>
          <p className="text-purple-300 text-sm mt-1">
            Create and manage game categories with bilingual support
          </p>
        </div>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button
              onClick={() => resetForm()}
              className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-semibold shadow-lg hover:shadow-purple-500/50 transition-all duration-300"
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Category
            </Button>
          </DialogTrigger>
          <DialogContent className="bg-gradient-to-br from-slate-800 to-purple-800 border border-purple-500/20 text-white max-w-2xl">
            <DialogHeader>
              <DialogTitle>
                {editingId ? "Edit Category" : "Create New Category"}
              </DialogTitle>
              <DialogDescription className="text-purple-300">
                {editingId
                  ? "Update the category details"
                  : "Add a new game category with bilingual support"}
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 max-h-[70vh] overflow-y-auto">
              <div>
                <Label className="text-purple-200">
                  Category Name (English)
                </Label>
                <Input
                  placeholder="e.g., Slots"
                  value={formData.nameEnglish}
                  onChange={(e) =>
                    setFormData({ ...formData, nameEnglish: e.target.value })
                  }
                  className="bg-slate-700/50 border-purple-500/30 text-white placeholder:text-purple-400"
                />
              </div>
              <div>
                <Label className="text-purple-200">
                  Category Name (Bangla)
                </Label>
                <Input
                  placeholder="e.g., স্লট"
                  value={formData.nameBangla}
                  onChange={(e) =>
                    setFormData({ ...formData, nameBangla: e.target.value })
                  }
                  className="bg-slate-700/50 border-purple-500/30 text-white placeholder:text-purple-400"
                />
              </div>
              <div>
                <Label className="text-purple-200">Icon (Required)</Label>
                <div className="flex gap-2 items-end">
                  <Input
                    type="file"
                    accept="image/*"
                    onChange={handleIconChange}
                    className="bg-slate-700/50 border-purple-500/30 text-white flex-1"
                  />
                  {iconPreview && (
                    <img
                      src={iconPreview}
                      alt="icon preview"
                      className="w-10 h-10 rounded object-cover"
                    />
                  )}
                </div>
              </div>
              <div>
                <Label className="text-purple-200">
                  Banner Image (Optional)
                </Label>
                <div className="flex gap-2 items-end">
                  <Input
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="bg-slate-700/50 border-purple-500/30 text-white flex-1"
                  />
                  {imagePreview && (
                    <img
                      src={imagePreview}
                      alt="image preview"
                      className="w-10 h-10 rounded object-cover"
                    />
                  )}
                </div>
              </div>
              <div>
                <Label className="text-purple-200">Display Type</Label>
                <Select
                  value={formData.displayType}
                  onValueChange={(value: "providers" | "games") =>
                    setFormData({ ...formData, displayType: value })
                  }
                >
                  <SelectTrigger className="bg-slate-700/50 border-purple-500/30 text-white">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-slate-800 border-purple-500/30">
                    <SelectItem value="providers" className="text-white">
                      Providers
                    </SelectItem>
                    <SelectItem value="games" className="text-white">
                      Games
                    </SelectItem>
                  </SelectContent>
                </Select>
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
                  "Save Category"
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
      ) : categories.length === 0 ? (
        <div className="text-center py-12 bg-slate-800/50 rounded-xl border border-purple-500/20">
          <p className="text-purple-300">
            No categories found. Create one to get started!
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {categories.map((category: GameCategory) => (
            <div
              key={category._id}
              className="bg-gradient-to-br from-slate-800/50 to-purple-800/50 border border-purple-500/20 rounded-xl p-4 hover:border-purple-500/50 transition-all duration-300 group"
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                  <h3 className="text-white font-semibold text-lg">
                    {category.nameEnglish}
                  </h3>
                  <p className="text-purple-300 text-sm">
                    {category.nameBangla}
                  </p>
                </div>
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => handleEdit(category)}
                    className="text-blue-400 hover:text-blue-300 hover:bg-blue-500/20"
                  >
                    <Edit2 className="w-4 h-4" />
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => deleteMutation.mutate(category._id)}
                    disabled={deleteMutation.isPending}
                    className="text-red-400 hover:text-red-300 hover:bg-red-500/20"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
              <div className="space-y-2 text-sm">
                <div className="flex items-center gap-2">
                  <span className="text-purple-400">Type:</span>
                  <span className="text-white bg-purple-500/20 px-2 py-1 rounded">
                    {category.displayType}
                  </span>
                </div>
                {category.icon && (
                  <div className="flex items-center gap-2">
                    <span className="text-purple-400">Icon:</span>
                    <img
                      src={getImageUrl(category.icon)}
                      alt="icon"
                      className="w-6 h-6 rounded"
                    />
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
