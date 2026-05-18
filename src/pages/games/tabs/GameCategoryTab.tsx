import { useState, useEffect, useCallback } from "react";
import {
  Plus,
  Edit,
  Trash2,
  FolderTree,
  RefreshCw,
  X,
  Save,
  ImageIcon,
  LayoutGrid,
  ChevronRight,
  Info,
  Check,
  Upload,
} from "lucide-react";
import {
  getGameCategories,
  createGameCategory,
  updateGameCategory,
  deleteGameCategory,
} from "@/config/api";
import { API_BASE_URL } from "@/config/constants";
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
import { Badge } from "@/components/ui/badge";

interface Category {
  _id: string;
  name?: string;
  nameEnglish?: string;
  nameBangla?: string;
  icon?: string;
  image?: string;
  subCategories?: Array<string | { name: string; _id: string }>;
  providerId?: string;
  games?: string[];
  order?: number;
  createdAt: string;
}

interface Provider {
  _id: string;
  name: string;
}

interface Game {
  _id: string;
  name: string;
  image: string;
  provider: {
    _id: string;
    name: string;
  };
}

const getImageUrl = (imagePath: string | undefined): string => {
  if (!imagePath) return "";
  if (imagePath.startsWith("http://") || imagePath.startsWith("https://")) {
    return imagePath;
  }
  if (imagePath.startsWith("/")) {
    return `${API_BASE_URL}${imagePath}`;
  }
  return `${API_BASE_URL}/${imagePath}`;
};

function GameCategoryTab() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [providers, setProviders] = useState<Provider[]>([]);
  const [filteredGames, setFilteredGames] = useState<Game[]>([]);
  const [loading, setLoading] = useState(false);
  const [fetchingCategories, setFetchingCategories] = useState(true);
  const [fetchingGames, setFetchingGames] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [message, setMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  const [formData, setFormData] = useState({
    nameEnglish: "",
    nameBangla: "",
    iconFile: null as File | null,
    imageFile: null as File | null,
    existingIcon: "",
    existingImage: "",
    subCategories: "",
    providerId: "",
    games: [] as string[],
    order: 0,
  });

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

  const fetchGames = useCallback(async (providerId: string) => {
    if (!providerId) {
      setFilteredGames([]);
      return;
    }
    setFetchingGames(true);
    try {
      const response = await fetch(
        `https://api.oraclegames.live/api/providers/${providerId}`,
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
      if (result.success && result.games && Array.isArray(result.games)) {
        setFilteredGames(result.games);
      }
    } catch (error) {
      console.error("Failed to fetch games:", error);
    } finally {
      setFetchingGames(false);
    }
  }, []);

  const fetchCategories = useCallback(async () => {
    setFetchingCategories(true);
    setMessage(null);
    try {
      const response = await getGameCategories();
      if (response.success && response.categories) {
        setCategories(response.categories);
      }
    } catch (error) {
      console.error("Failed to fetch categories:", error);
      setMessage({ type: "error", text: "Failed to load categories" });
    } finally {
      setFetchingCategories(false);
    }
  }, []);

  useEffect(() => {
    fetchProviders();
    fetchCategories();
  }, [fetchProviders, fetchCategories]);

  const handleIconChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) setFormData({ ...formData, iconFile: file });
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) setFormData({ ...formData, imageFile: file });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    try {
      const data = new FormData();
      data.append("nameEnglish", formData.nameEnglish);
      data.append("nameBangla", formData.nameBangla);
      if (formData.iconFile) data.append("icon", formData.iconFile);
      if (formData.imageFile) data.append("image", formData.imageFile);

      if (formData.subCategories.trim()) {
        const subCategoriesArray = formData.subCategories
          .split(",")
          .map((s) => s.trim())
          .filter((s) => s);
        data.append("subCategories", JSON.stringify(subCategoriesArray));
      }

      if (formData.providerId) data.append("providerId", formData.providerId);
      if (formData.games.length > 0)
        data.append("games", JSON.stringify(formData.games));
      data.append("order", formData.order.toString());

      if (editingId) {
        await updateGameCategory(editingId, data);
        setMessage({ type: "success", text: "Category updated successfully!" });
      } else {
        await createGameCategory(data);
        setMessage({ type: "success", text: "Category created successfully!" });
      }

      handleCancel();
      await fetchCategories();
    } catch (error) {
      setMessage({
        type: "error",
        text:
          error instanceof Error ? error.message : "Failed to save category",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (category: Category) => {
    let subCategoriesString = "";
    if (category.subCategories && category.subCategories.length > 0) {
      subCategoriesString = category.subCategories
        .map((sub) => (typeof sub === "string" ? sub : sub.name))
        .join(", ");
    }

    setFormData({
      nameEnglish: category.nameEnglish || category.name || "",
      nameBangla: category.nameBangla || "",
      iconFile: null,
      imageFile: null,
      existingIcon: category.icon || "",
      existingImage: category.image || "",
      subCategories: subCategoriesString,
      providerId: category.providerId || "",
      games: category.games || [],
      order: category.order || 0,
    });
    setEditingId(category._id);
    setIsEditing(true);
    setMessage(null);
    if (category.providerId) fetchGames(category.providerId);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this category?")) return;
    setLoading(true);
    setMessage(null);
    try {
      await deleteGameCategory(id);
      setMessage({ type: "success", text: "Category deleted successfully!" });
      await fetchCategories();
    } catch (error) {
      setMessage({
        type: "error",
        text:
          error instanceof Error ? error.message : "Failed to delete category",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setFormData({
      nameEnglish: "",
      nameBangla: "",
      iconFile: null,
      imageFile: null,
      existingIcon: "",
      existingImage: "",
      subCategories: "",
      providerId: "",
      games: [],
      order: 0,
    });
    setIsEditing(false);
    setEditingId(null);
    setFilteredGames([]);
    setMessage(null);
  };

  const handleProviderChange = (providerId: string) => {
    setFormData({ ...formData, providerId, games: [] });
    fetchGames(providerId);
  };

  const handleGameToggle = (gameId: string) => {
    setFormData((prev) => ({
      ...prev,
      games: prev.games.includes(gameId)
        ? prev.games.filter((id) => id !== gameId)
        : [...prev.games, gameId],
    }));
  };

  return (
    <div className="space-y-10 pb-16">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-brand-primary/10 text-brand-primary shadow-sm border border-brand-primary/20">
            <FolderTree size={30} />
          </div>
          <div>
            <h2 className="text-2xl font-black text-slate-900 dark:text-white uppercase tracking-tight">
              Game Categories
            </h2>
            <p className="text-slate-500 dark:text-slate-400 font-bold text-xs uppercase tracking-widest mt-0.5">
              Organize your games into intuitive sections
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            size="icon"
            onClick={fetchCategories}
            disabled={fetchingCategories}
            className="rounded-xl border-slate-200 dark:border-white/10 dark:hover:bg-white/5"
          >
            <RefreshCw
              size={18}
              className={fetchingCategories ? "animate-spin" : ""}
            />
          </Button>
          {!isEditing && (
            <Button
              onClick={() => setIsEditing(true)}
              className="rounded-xl bg-brand-primary hover:bg-brand-primary/90 text-white font-bold h-11 px-6 shadow-lg shadow-brand-primary/20"
            >
              <Plus size={18} className="mr-2" />
              Add Category
            </Button>
          )}
        </div>
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

      {/* Form Section */}
      {isEditing && (
        <div className="rounded-2xl bg-slate-900/60 backdrop-blur-md border border-white/10 p-6 shadow-xl animate-in zoom-in-95 duration-300">
          <div className="flex items-center justify-between mb-8 pb-6 border-b dark:border-white/5">
            <div className="flex items-center gap-3">
              <div className="h-10 w-1 rounded-full bg-brand-primary"></div>
              <h3 className="text-xl font-black text-slate-900 dark:text-white">
                {editingId ? "Edit Category Details" : "Create New Category"}
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

          <form onSubmit={handleSubmit} className="space-y-12">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
              <div className="space-y-3">
                <Label className="text-[11px] font-black uppercase tracking-widest text-slate-400">
                  Name (English)
                </Label>
                <Input
                  placeholder="e.g. Live Casino"
                  value={formData.nameEnglish}
                  onChange={(e) =>
                    setFormData({ ...formData, nameEnglish: e.target.value })
                  }
                  className="rounded-2xl h-12 bg-slate-50 border-slate-200 dark:bg-white/5 dark:border-white/10 font-bold"
                  required
                />
              </div>

              <div className="space-y-3">
                <Label className="text-[11px] font-black uppercase tracking-widest text-slate-400">
                  Name (Bangla)
                </Label>
                <Input
                  placeholder="e.g. লাইভ ক্যাসিনো"
                  value={formData.nameBangla}
                  onChange={(e) =>
                    setFormData({ ...formData, nameBangla: e.target.value })
                  }
                  className="rounded-2xl h-12 bg-slate-50 border-slate-200 dark:bg-white/5 dark:border-white/10 font-bold font-bengali text-lg"
                  required
                />
              </div>

              <div className="space-y-3">
                <Label className="text-[11px] font-black uppercase tracking-widest text-slate-400">
                  Display Order
                </Label>
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
                  className="rounded-2xl h-12 bg-slate-50 border-slate-200 dark:bg-white/5 dark:border-white/10 font-bold"
                />
              </div>

              <div className="space-y-3">
                <Label className="text-[11px] font-black uppercase tracking-widest text-slate-400">
                  Category Icon
                </Label>
                <div className="flex items-center gap-4">
                  {(formData.iconFile || formData.existingIcon) && (
                    <div className="h-12 w-12 rounded-xl border-2 border-slate-100 overflow-hidden bg-white dark:bg-white/5 dark:border-white/10">
                      <img
                        src={
                          formData.iconFile
                            ? URL.createObjectURL(formData.iconFile)
                            : getImageUrl(formData.existingIcon)
                        }
                        className="h-full w-full object-cover"
                        alt="Icon"
                      />
                    </div>
                  )}
                  <div className="relative flex-1">
                    <input
                      type="file"
                      onChange={handleIconChange}
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                    />
                    <div className="flex items-center gap-3 px-4 h-12 rounded-2xl border-2 border-dashed border-slate-200 bg-slate-50 dark:bg-white/5 dark:border-white/10">
                      <Upload size={16} className="text-brand-primary" />
                      <span className="text-xs font-bold text-slate-400 uppercase truncate">
                        {formData.iconFile
                          ? formData.iconFile.name
                          : "Select Icon"}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                <Label className="text-[11px] font-black uppercase tracking-widest text-slate-400">
                  Banner Image
                </Label>
                <div className="flex items-center gap-4">
                  {(formData.imageFile || formData.existingImage) && (
                    <div className="h-12 w-20 rounded-xl border-2 border-slate-100 overflow-hidden bg-white dark:bg-white/5 dark:border-white/10">
                      <img
                        src={
                          formData.imageFile
                            ? URL.createObjectURL(formData.imageFile)
                            : getImageUrl(formData.existingImage)
                        }
                        className="h-full w-full object-cover"
                        alt="Banner"
                      />
                    </div>
                  )}
                  <div className="relative flex-1">
                    <input
                      type="file"
                      onChange={handleImageChange}
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                    />
                    <div className="flex items-center gap-3 px-4 h-12 rounded-2xl border-2 border-dashed border-slate-200 bg-slate-50 dark:bg-white/5 dark:border-white/10">
                      <ImageIcon size={16} className="text-brand-primary" />
                      <span className="text-xs font-bold text-slate-400 uppercase truncate">
                        {formData.imageFile
                          ? formData.imageFile.name
                          : "Select Banner"}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                <Label className="text-[11px] font-black uppercase tracking-widest text-slate-400">
                  Sub Categories
                </Label>
                <Input
                  placeholder="Slots, Table, Live..."
                  value={formData.subCategories}
                  onChange={(e) =>
                    setFormData({ ...formData, subCategories: e.target.value })
                  }
                  className="rounded-2xl h-12 bg-slate-50 border-slate-200 dark:bg-white/5 dark:border-white/10 font-bold"
                />
                <p className="text-[10px] text-slate-400 font-bold uppercase">
                  Comma separated list
                </p>
              </div>
            </div>

            {/* Submission Actions */}
            <div className="flex flex-col sm:flex-row gap-4 pt-10">
              <Button
                type="button"
                variant="outline"
                onClick={handleCancel}
                className="flex-1 h-14 rounded-2xl font-black uppercase tracking-widest text-xs border-slate-200 dark:border-white/10"
              >
                <X size={18} className="mr-2" /> Cancel Changes
              </Button>
              <Button
                type="submit"
                disabled={loading}
                className="flex-[2] h-14 rounded-2xl bg-brand-primary hover:bg-brand-primary/90 text-white font-black uppercase tracking-widest text-xs shadow-xl shadow-brand-primary/20"
              >
                {loading ? (
                  <RefreshCw size={18} className="animate-spin mr-2" />
                ) : (
                  <Save size={18} className="mr-2" />
                )}
                {editingId ? "Update Category" : "Establish New Category"}
              </Button>
            </div>
          </form>
        </div>
      )}

      {/* Grid Display */}
      {fetchingCategories ? (
        <div className="py-24 flex flex-col items-center gap-4 text-slate-400">
          <RefreshCw
            size={48}
            className="animate-spin text-brand-primary opacity-50"
            strokeWidth={1.5}
          />
          <p className="text-xs font-black uppercase tracking-widest">
            Cataloging Categories...
          </p>
        </div>
      ) : categories.length === 0 ? (
        <div className="py-24 flex flex-col items-center text-center bg-slate-50 dark:bg-white/5 rounded-2xl border-2 border-dashed border-slate-200 dark:border-white/10">
          <FolderTree
            size={80}
            className="text-slate-300 mb-6"
            strokeWidth={1}
          />
          <h3 className="text-2xl font-black text-slate-900 dark:text-white mb-2 underline decoration-brand-primary/30 underline-offset-8">
            No Categories Found
          </h3>
          <p className="text-slate-500 max-w-sm mb-8 font-medium">
            Your library is currently empty. Start by defining your first game
            category to organize your platform.
          </p>
          <Button
            onClick={() => setIsEditing(true)}
            className="rounded-2xl bg-brand-primary h-12 px-8 font-black uppercase tracking-widest text-xs"
          >
            Begin First Integration
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {categories
            .slice()
            .sort((a, b) => (a.order || 0) - (b.order || 0))
            .map((category) => (
              <div
                key={category._id}
                className="group relative flex flex-col rounded-2xl bg-slate-900/40 border border-white/10 p-4 transition-all duration-300 hover:border-purple-500/40 hover:shadow-xl hover:shadow-purple-500/5 hover:-translate-y-1"
              >
                {/* Compact Card Cover Banner */}
                <div className="relative h-28 w-full rounded-xl overflow-hidden mb-3 border border-white/5 bg-slate-950">
                  <img
                    src={getImageUrl(category.image)}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    alt="Banner"
                    onError={(e) =>
                      (e.currentTarget.src =
                        "https://placehold.co/400x150?text=Preview")
                    }
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

                  {/* Overlay Category Icon */}
                  <div className="absolute bottom-2 left-2 h-10 w-10 p-2 rounded-lg bg-black/60 backdrop-blur-md border border-white/10 flex items-center justify-center">
                    <img
                      src={getImageUrl(category.icon)}
                      className="h-full w-full object-contain"
                      alt="Icon"
                      onError={(e) =>
                        (e.currentTarget.src =
                          "https://placehold.co/100x100?text=Icon")
                      }
                    />
                  </div>

                  {/* Overlay Action Buttons */}
                  <div className="absolute top-2 right-2 flex bg-black/60 backdrop-blur-md border border-white/10 rounded-lg p-0.5 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <button
                      onClick={() => handleEdit(category)}
                      className="p-1.5 text-purple-300 hover:text-white transition-colors"
                    >
                      <Edit size={14} />
                    </button>
                    <button
                      onClick={() => handleDelete(category._id)}
                      className="p-1.5 text-purple-300 hover:text-red-400 transition-colors"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>

                {/* Card Content */}
                <div className="flex-1 flex flex-col justify-between space-y-3">
                  <div>
                    <h3 className="text-base font-black text-white leading-tight truncate">
                      {category.nameEnglish || category.name}
                    </h3>
                    <p className="text-purple-200/60 font-bengali font-bold text-xs mt-0.5 truncate">
                      {category.nameBangla || "N/A"}
                    </p>
                  </div>

                  {/* Sub-categories Badges */}
                  <div className="flex flex-wrap gap-1 mb-1 min-h-[22px] items-center">
                    {category.subCategories &&
                    category.subCategories.length > 0 ? (
                      category.subCategories.slice(0, 2).map((sub, idx) => (
                        <Badge
                          key={idx}
                          variant="secondary"
                          className="rounded bg-white/5 border border-white/10 text-purple-200 font-bold text-[9px] uppercase tracking-wider py-0.5 px-1.5"
                        >
                          {typeof sub === "string" ? sub : sub.name}
                        </Badge>
                      ))
                    ) : (
                      <span className="text-[9px] font-semibold text-purple-300/40 uppercase italic">
                        No Sub-categories
                      </span>
                    )}
                    {category.subCategories &&
                      category.subCategories.length > 2 && (
                        <Badge
                          variant="secondary"
                          className="rounded bg-purple-500/10 border border-purple-500/20 text-purple-300 font-bold text-[9px] py-0.5 px-1.5"
                        >
                          +{category.subCategories.length - 2}
                        </Badge>
                      )}
                  </div>

                  {/* Metadata Stats */}
                  <div className="grid grid-cols-2 gap-2 pt-3 border-t border-white/5">
                    <div className="flex flex-col">
                      <span className="text-[9px] font-bold uppercase tracking-widest text-slate-400 mb-0.5">
                        Index Order
                      </span>
                      <span className="text-xs font-black text-brand-primary">
                        #{(category.order || 0).toString().padStart(2, "0")}
                      </span>
                    </div>
                    <div className="flex flex-col">
                      <span className="text-[9px] font-bold uppercase tracking-widest text-slate-400 mb-0.5">
                        Total Games
                      </span>
                      <span className="text-xs font-black text-slate-200">
                        {category.games?.length || 0} Units
                      </span>
                    </div>
                  </div>

                  {/* API Sync Tag */}
                  {category.providerId && (
                    <div className="mt-2 p-1.5 rounded-lg bg-emerald-500/5 border border-emerald-500/10 flex items-center justify-between text-[9px]">
                      <div className="flex items-center gap-1.5">
                        <span className="relative flex h-1.5 w-1.5">
                          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                          <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-emerald-500"></span>
                        </span>
                        <span className="font-black uppercase tracking-widest text-emerald-400">
                          API Active
                        </span>
                      </div>
                      <span className="font-bold text-slate-400">
                        {category.providerId.substring(0, 8)}
                      </span>
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

export default GameCategoryTab;
