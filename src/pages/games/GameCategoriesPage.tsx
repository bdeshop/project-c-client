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
import { Plus, Edit2, Trash2, Loader2 } from "lucide-react";
import { toast } from "sonner";
import axios from "axios";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

const API_BASE_URL =
  import.meta.env.VITE_API_URL || "http://localhost:5000/api";

interface GameCategory {
  _id: string;
  nameEnglish: string;
  nameBangla: string;
  icon: string;
  image?: string;
  displayType: "providers" | "games";
  providers: string[];
  subCategories?: Array<{ _id: string; name: string }>;
  createdAt: string;
  updatedAt: string;
}

export function GameCategoriesPage() {
  const [open, setOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    nameEnglish: "",
    nameBangla: "",
    icon: "",
    image: "",
    displayType: "providers" as "providers" | "games",
  });

  const queryClient = useQueryClient();

  // Fetch categories
  const { data: categories = [], isLoading } = useQuery({
    queryKey: ["gameCategories"],
    queryFn: async () => {
      const response = await axios.get(`${API_BASE_URL}/game-categories`);
      return response.data.categories || [];
    },
  });

  // Create category
  const createMutation = useMutation({
    mutationFn: async (data: typeof formData) => {
      const response = await axios.post(
        `${API_BASE_URL}/game-categories`,
        data,
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

  // Update category
  const updateMutation = useMutation({
    mutationFn: async (data: typeof formData) => {
      const response = await axios.put(
        `${API_BASE_URL}/game-categories/${editingId}`,
        data,
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

  // Delete category
  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const response = await axios.delete(
        `${API_BASE_URL}/game-categories/${id}`,
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
      icon: "",
      image: "",
      displayType: "providers",
    });
    setEditingId(null);
  };

  const handleEdit = (category: GameCategory) => {
    setFormData({
      nameEnglish: category.nameEnglish,
      nameBangla: category.nameBangla,
      icon: category.icon,
      image: category.image || "",
      displayType: category.displayType,
    });
    setEditingId(category._id);
    setOpen(true);
  };

  const handleSubmit = () => {
    if (!formData.nameEnglish || !formData.nameBangla || !formData.icon) {
      toast.error("Please fill all required fields");
      return;
    }

    if (editingId) {
      updateMutation.mutate(formData);
    } else {
      createMutation.mutate(formData);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header with Add Button */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-white">Game Categories</h2>
          <p className="text-purple-300 text-sm mt-1">
            Create and manage game categories
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
          <DialogContent className="bg-gradient-to-br from-slate-800 to-purple-800 border border-purple-500/20 text-white">
            <DialogHeader>
              <DialogTitle>
                {editingId ? "Edit Category" : "Create New Category"}
              </DialogTitle>
              <DialogDescription className="text-purple-300">
                {editingId
                  ? "Update the category details"
                  : "Add a new game category"}
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
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
                <Label className="text-purple-200">Icon URL</Label>
                <Input
                  placeholder="https://example.com/icon.png"
                  value={formData.icon}
                  onChange={(e) =>
                    setFormData({ ...formData, icon: e.target.value })
                  }
                  className="bg-slate-700/50 border-purple-500/30 text-white placeholder:text-purple-400"
                />
              </div>
              <div>
                <Label className="text-purple-200">Image URL (Optional)</Label>
                <Input
                  placeholder="https://example.com/image.png"
                  value={formData.image}
                  onChange={(e) =>
                    setFormData({ ...formData, image: e.target.value })
                  }
                  className="bg-slate-700/50 border-purple-500/30 text-white placeholder:text-purple-400"
                />
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

      {/* Categories Grid */}
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
                      src={category.icon}
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
