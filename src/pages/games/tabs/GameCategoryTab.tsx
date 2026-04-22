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
        <div className="rounded-[2.5rem] bg-white border border-slate-200 p-8 shadow-2xl dark:bg-[#1a1a1a] dark:border-white/10 animate-in zoom-in-95 duration-300">
          <div className="flex items-center justify-between mb-10 pb-6 border-b dark:border-white/5">
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

            {/* Provider and Games Integration */}
            <section className="space-y-6 pt-6 border-t dark:border-white/5">
              <div className="flex items-center gap-2 mb-6">
                <div className="h-2 w-2 rounded-full bg-brand-primary"></div>
                <h4 className="text-sm font-black uppercase tracking-widest text-slate-800 dark:text-slate-200">
                  Provider & Game Sync
                </h4>
              </div>

              <div className="space-y-6">
                <div className="max-w-md space-y-3">
                  <Label className="text-[11px] font-black uppercase tracking-widest text-slate-400">
                    Target Provider
                  </Label>
                  <Select
                    value={formData.providerId}
                    onValueChange={handleProviderChange}
                  >
                    <SelectTrigger className="rounded-2xl h-12 bg-slate-50 border-slate-200 dark:bg-white/5 dark:border-white/10 font-bold">
                      <SelectValue placeholder="Select a game provider" />
                    </SelectTrigger>
                    <SelectContent className="rounded-2xl border-slate-200 dark:border-white/10 dark:bg-[#1e1e1e]">
                      <SelectItem value="none" className="rounded-lg">
                        None (Static Category)
                      </SelectItem>
                      {providers.map((p) => (
                        <SelectItem
                          key={p._id}
                          value={p._id}
                          className="rounded-lg font-bold"
                        >
                          {p.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {formData.providerId && (
                  <div className="space-y-4 animate-in slide-in-from-top-2">
                    <div className="flex items-center justify-between">
                      <Label className="text-[11px] font-black uppercase tracking-widest text-brand-primary">
                        Select Games ({formData.games.length} Selected)
                      </Label>
                      <div className="flex gap-4">
                        <button
                          type="button"
                          onClick={() =>
                            setFormData((p) => ({
                              ...p,
                              games: filteredGames.map((g) => g._id),
                            }))
                          }
                          className="text-[10px] font-black uppercase text-brand-primary hover:underline"
                        >
                          Select All
                        </button>
                        <button
                          type="button"
                          onClick={() =>
                            setFormData((p) => ({ ...p, games: [] }))
                          }
                          className="text-[10px] font-black uppercase text-slate-400 hover:text-red-500 hover:underline"
                        >
                          Clear selection
                        </button>
                      </div>
                    </div>

                    <div className="max-h-[300px] overflow-y-auto rounded-3xl border border-slate-100 dark:border-white/5 p-4 grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-3 bg-slate-50/50 dark:bg-black/20">
                      {fetchingGames ? (
                        <div className="col-span-full py-12 flex flex-col items-center gap-3 text-slate-400">
                          <RefreshCw size={32} className="animate-spin" />
                          <span className="text-[10px] font-black uppercase tracking-widest">
                            Bridging Game API...
                          </span>
                        </div>
                      ) : filteredGames.length > 0 ? (
                        filteredGames.map((game) => {
                          const isSelected = formData.games.includes(game._id);
                          return (
                            <div
                              key={game._id}
                              onClick={() => handleGameToggle(game._id)}
                              className={`
                                relative group flex flex-col gap-2 p-2 rounded-2xl cursor-pointer transition-all
                                ${isSelected ? "bg-brand-primary/10 ring-1 ring-brand-primary/30" : "hover:bg-white dark:hover:bg-white/5"}
                              `}
                            >
                              <div className="aspect-square rounded-xl overflow-hidden bg-slate-200">
                                <img
                                  src={
                                    game.image && game.image.startsWith("http")
                                      ? game.image
                                      : `https://api.oraclegames.live${game.image}`
                                  }
                                  className="w-full h-full object-cover transition-transform group-hover:scale-110"
                                  alt={game.name}
                                />
                              </div>
                              <span
                                className={`text-[9px] font-bold text-center truncate px-1 ${isSelected ? "text-brand-primary" : "text-slate-500"}`}
                              >
                                {game.name}
                              </span>
                              {isSelected && (
                                <div className="absolute top-1 right-1 h-5 w-5 rounded-full bg-brand-primary text-white flex items-center justify-center shadow-md">
                                  <Check size={10} strokeWidth={4} />
                                </div>
                              )}
                            </div>
                          );
                        })
                      ) : (
                        <div className="col-span-full py-12 text-center text-slate-400">
                          <LayoutGrid
                            size={32}
                            className="mx-auto mb-2 opacity-20"
                          />
                          <p className="text-[10px] font-black uppercase tracking-widest">
                            No games found for this provider
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </section>

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
        <div className="py-32 flex flex-col items-center text-center bg-slate-50 dark:bg-white/5 rounded-[3rem] border-2 border-dashed border-slate-200 dark:border-white/10">
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
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
          {categories
            .slice()
            .sort((a, b) => (a.order || 0) - (b.order || 0))
            .map((category) => (
              <div
                key={category._id}
                className="group relative flex flex-col rounded-[2.5rem] bg-white border border-slate-200 p-6 transition-all duration-500 hover:shadow-2xl hover:shadow-brand-primary/10 hover:translate-y-[-8px] dark:bg-[#1a1a1a] dark:border-white/10"
              >
                <div className="flex items-start justify-between mb-6">
                  <div className="flex items-center gap-4">
                    <div className="h-16 w-16 p-3 rounded-2xl bg-slate-50 dark:bg-black/30 border border-slate-100 dark:border-white/5 shadow-inner transition-transform group-hover:scale-110">
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
                    <div>
                      <h3 className="text-lg font-black text-slate-900 dark:text-white leading-tight underline decoration-transparent group-hover:decoration-brand-primary/30 transition-all">
                        {category.nameEnglish || category.name}
                      </h3>
                      <p className="text-slate-400 font-bengali font-bold text-sm mt-0.5">
                        {category.nameBangla || "N/A"}
                      </p>
                    </div>
                  </div>
                  <div className="flex bg-slate-100/50 dark:bg-white/5 rounded-full p-1 opacity-0 group-hover:opacity-100 transition-all">
                    <button
                      onClick={() => handleEdit(category)}
                      className="p-2 text-slate-600 dark:text-slate-400 hover:text-brand-primary transition-colors"
                    >
                      <Edit size={16} />
                    </button>
                    <button
                      onClick={() => handleDelete(category._id)}
                      className="p-2 text-slate-600 dark:text-slate-400 hover:text-red-500 transition-colors"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>

                <div className="relative aspect-[16/9] rounded-3xl overflow-hidden mb-6 border-4 border-slate-50 dark:border-white/5 shadow-sm">
                  <img
                    src={getImageUrl(category.image)}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    alt="Banner"
                    onError={(e) =>
                      (e.currentTarget.src =
                        "https://placehold.co/400x225?text=Preview")
                    }
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-6">
                    <p className="text-[10px] font-black text-white uppercase tracking-widest flex items-center gap-2">
                      Visual Architecture{" "}
                      <ChevronRight
                        size={10}
                        className="text-brand-primary"
                        strokeWidth={4}
                      />
                    </p>
                  </div>
                </div>

                <div className="flex-1 space-y-4">
                  <div className="flex flex-wrap gap-2">
                    {category.subCategories &&
                    category.subCategories.length > 0 ? (
                      category.subCategories.slice(0, 3).map((sub, idx) => (
                        <Badge
                          key={idx}
                          variant="secondary"
                          className="rounded-lg bg-slate-100 text-slate-600 dark:bg-white/5 dark:text-slate-400 font-bold text-[9px] uppercase tracking-wider py-1"
                        >
                          {typeof sub === "string" ? sub : sub.name}
                        </Badge>
                      ))
                    ) : (
                      <span className="text-[10px] font-black uppercase text-slate-300 italic">
                        No Sub-Architecture defined
                      </span>
                    )}
                    {category.subCategories &&
                      category.subCategories.length > 3 && (
                        <span className="text-[9px] font-black text-slate-400 bg-slate-50 dark:bg-white/5 px-2 py-1 rounded-lg">
                          +{category.subCategories.length - 3}
                        </span>
                      )}
                  </div>

                  <div className="grid grid-cols-2 gap-3 pt-4 border-t dark:border-white/5">
                    <div className="flex flex-col">
                      <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">
                        Index Order
                      </span>
                      <span className="text-sm font-black text-brand-primary">
                        #{(category.order || 0).toString().padStart(2, "0")}
                      </span>
                    </div>
                    <div className="flex flex-col">
                      <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">
                        Total Payload
                      </span>
                      <span className="text-sm font-black text-slate-700 dark:text-slate-200">
                        {category.games?.length || 0} Units
                      </span>
                    </div>
                  </div>
                </div>

                {category.providerId && (
                  <div className="mt-6 p-3 rounded-2xl bg-brand-primary/5 border border-brand-primary/10 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <RefreshCw size={12} className="text-brand-primary" />
                      <span className="text-[10px] font-black uppercase text-brand-primary tracking-widest">
                        Active API Sync
                      </span>
                    </div>
                    <span className="text-[9px] font-bold text-slate-500 bg-white/50 px-2 py-0.5 rounded-full">
                      {category.providerId.substring(0, 8)}...
                    </span>
                  </div>
                )}
              </div>
            ))}
        </div>
      )}
    </div>
  );
}

export default GameCategoryTab;
