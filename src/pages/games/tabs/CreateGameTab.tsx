import { useState, useEffect, useCallback } from "react";
import {
  Plus,
  X,
  Image as ImageIcon,
  Info,
  Check,
  Flame,
  Star,
  Sparkles,
  Upload,
  Loader2,
} from "lucide-react";
import { getGameCategories } from "@/config/api";
import { apiClient } from "@/lib/api";
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
import { toast } from "sonner";

interface Category {
  _id: string;
  name?: string;
  nameEnglish?: string;
  nameBangla?: string;
  icon?: string;
}

export function CreateGameTab() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  const [formData, setFormData] = useState({
    gameUuid: "",
    nameEnglish: "",
    nameBangla: "",
    imageFile: null as File | null,
    category: "",
    isHot: false,
    isNew: false,
    isLobby: false,
  });

  const [imagePreview, setImagePreview] = useState<string>("");

  const fetchCategories = useCallback(async () => {
    try {
      const response = await getGameCategories();
      if (response.success && response.categories) {
        setCategories(response.categories);
      }
    } catch (error) {
      console.error("Failed to fetch categories:", error);
    }
  }, []);

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFormData({
        ...formData,
        imageFile: file,
      });

      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    try {
      if (!formData.category) {
        throw new Error("Please select a category");
      }

      const data = new FormData();
      data.append("gameUuid", formData.gameUuid);
      data.append("nameEnglish", formData.nameEnglish);
      data.append("nameBangla", formData.nameBangla);
      if (formData.imageFile) {
        data.append("image", formData.imageFile);
      }
      data.append("category", formData.category);
      data.append("isHot", formData.isHot.toString());
      data.append("isNew", formData.isNew.toString());
      data.append("isLobby", formData.isLobby.toString());

      const response = await apiClient.post("/games", data, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      if (response.data.success) {
        toast.success("Game created successfully!");
        handleReset();
      }
    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : "Failed to create game";
      toast.error(errorMsg);
      setMessage({
        type: "error",
        text: errorMsg,
      });
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setFormData({
      gameUuid: "",
      nameEnglish: "",
      nameBangla: "",
      imageFile: null,
      category: "",
      isHot: false,
      isNew: false,
      isLobby: false,
    });
    setImagePreview("");
    setMessage(null);

    const fileInput = document.getElementById("image-upload") as HTMLInputElement;
    if (fileInput) fileInput.value = "";
  };

  const getCategoryDisplayName = (category: Category) => {
    return category.nameEnglish || category.name || "Unnamed Category";
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-12">
      <div className="flex flex-col gap-1">
        <h2 className="text-2xl font-black text-white uppercase tracking-tight">
          Create Custom Game
        </h2>
        <p className="text-purple-200/70 font-bold text-xs uppercase tracking-widest mt-0.5">
          Establish individual titles with specialized metadata
        </p>
      </div>

      {message && (
        <div
          className={`
          flex items-center gap-3 p-4 rounded-2xl border font-bold text-sm animate-in fade-in slide-in-from-top-2
          ${
            message.type === "success"
              ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-400"
              : "bg-red-500/10 border-red-500/20 text-red-400"
          }
        `}
        >
          <Info size={18} />
          {message.text}
        </div>
      )}

      <div className="rounded-[2.5rem] bg-white/5 backdrop-blur-xl border border-white/10 p-10 shadow-2xl">
        <form onSubmit={handleSubmit} className="space-y-12">
          {/* Game Information */}
          <section className="space-y-8">
            <div className="flex items-center gap-3">
              <div className="h-8 w-1.5 rounded-full bg-purple-500"></div>
              <h3 className="text-sm font-black uppercase tracking-[0.2em] text-purple-200/50">
                Core Identity
              </h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
              <div className="space-y-3">
                <Label
                  htmlFor="gameUuid"
                  className="text-[11px] font-black uppercase tracking-widest text-purple-300/50"
                >
                  System UUID <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="gameUuid"
                  placeholder="e.g. custom_aviator_01"
                  value={formData.gameUuid}
                  onChange={(e) =>
                    setFormData({ ...formData, gameUuid: e.target.value })
                  }
                  className="rounded-2xl h-12 bg-white/5 border-white/10 text-white font-bold placeholder:text-white/20 focus:ring-purple-500/50"
                  required
                />
              </div>

              <div className="space-y-3">
                <Label
                  htmlFor="category"
                  className="text-[11px] font-black uppercase tracking-widest text-purple-300/50"
                >
                  Target Category <span className="text-red-500">*</span>
                </Label>
                <Select
                  value={formData.category}
                  onValueChange={(value) =>
                    setFormData({ ...formData, category: value })
                  }
                >
                  <SelectTrigger
                    id="category"
                    className="rounded-2xl h-12 bg-white/5 border-white/10 text-white font-bold h-12"
                  >
                    <SelectValue placeholder="Select Category" />
                  </SelectTrigger>
                  <SelectContent className="rounded-2xl border-white/10 bg-slate-900 text-white">
                    {categories.map((cat) => (
                      <SelectItem
                        key={cat._id}
                        value={cat._id}
                        className="rounded-xl font-bold focus:bg-purple-500 focus:text-white"
                      >
                        {getCategoryDisplayName(cat)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-3">
                <Label
                  htmlFor="nameEnglish"
                  className="text-[11px] font-black uppercase tracking-widest text-purple-300/50"
                >
                  Name (English) <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="nameEnglish"
                  placeholder="e.g. Aviator Pro"
                  value={formData.nameEnglish}
                  onChange={(e) =>
                    setFormData({ ...formData, nameEnglish: e.target.value })
                  }
                  className="rounded-2xl h-12 bg-white/5 border-white/10 text-white font-bold placeholder:text-white/20"
                  required
                />
              </div>

              <div className="space-y-3">
                <Label
                  htmlFor="nameBangla"
                  className="text-[11px] font-black uppercase tracking-widest text-purple-300/50"
                >
                  Name (Bangla) <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="nameBangla"
                  placeholder="e.g. এভিয়েটর প্রো"
                  value={formData.nameBangla}
                  onChange={(e) =>
                    setFormData({ ...formData, nameBangla: e.target.value })
                  }
                  className="rounded-2xl h-12 bg-white/5 border-white/10 text-white font-bold placeholder:text-white/20 font-bengali text-lg"
                  required
                />
              </div>
            </div>
          </section>

          {/* Game Image */}
          <section className="space-y-8">
            <div className="flex items-center gap-3">
              <div className="h-8 w-1.5 rounded-full bg-blue-500"></div>
              <h3 className="text-sm font-black uppercase tracking-[0.2em] text-purple-200/50">
                Visual Assets
              </h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-10 items-center">
              <div className="md:col-span-1">
                <div className="aspect-[4/3] rounded-[2rem] border-2 border-dashed border-white/10 bg-white/5 flex items-center justify-center overflow-hidden group">
                  {imagePreview ? (
                    <img
                      src={imagePreview}
                      alt="Preview"
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                  ) : (
                    <div className="flex flex-col items-center gap-3 text-white/20">
                      <ImageIcon size={48} strokeWidth={1} />
                      <span className="text-[10px] uppercase font-black tracking-widest">
                        Asset Hidden
                      </span>
                    </div>
                  )}
                </div>
              </div>

              <div className="md:col-span-2 space-y-4">
                <div className="relative group">
                  <input
                    type="file"
                    id="image-upload"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                    required={!formData.imageFile}
                  />
                  <div className="flex items-center justify-center gap-5 w-full py-10 border-2 border-dashed border-white/10 rounded-[2rem] bg-white/5 group-hover:bg-white/10 transition-all duration-300">
                    <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-purple-500/20 text-purple-400 group-hover:scale-110 transition-transform">
                      <Upload size={24} />
                    </div>
                    <div className="text-left">
                      <p className="text-sm font-black text-white uppercase tracking-tight">
                        {formData.imageFile
                          ? formData.imageFile.name
                          : "Inject Visual Asset"}
                      </p>
                      <p className="text-[10px] text-purple-300/40 font-bold uppercase tracking-widest mt-1">
                        SVG, PNG, JPG (Global Standards)
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Special Tags */}
          <section className="space-y-8">
            <div className="flex items-center gap-3">
              <div className="h-8 w-1.5 rounded-full bg-emerald-500"></div>
              <h3 className="text-sm font-black uppercase tracking-[0.2em] text-purple-200/50">
                Visibility Matrix
              </h3>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              {[
                {
                  id: "isHot",
                  label: "Trending Ignite",
                  icon: Flame,
                  color: "text-orange-500",
                  bg: "bg-orange-500/10",
                  desc: "Assign high-traffic flame marker",
                },
                {
                  id: "isNew",
                  label: "Grand Launch",
                  icon: Sparkles,
                  color: "text-blue-500",
                  bg: "bg-blue-500/10",
                  desc: "Assign new arrival glow marker",
                },
                {
                  id: "isLobby",
                  label: "Lobby Pinnacle",
                  icon: Star,
                  color: "text-yellow-500",
                  bg: "bg-yellow-500/10",
                  desc: "Elevate to main hall priority",
                },
              ].map((tag) => {
                const Icon = tag.icon;
                const isSelected = formData[
                  tag.id as keyof typeof formData
                ] as boolean;
                return (
                  <div
                    key={tag.id}
                    onClick={() =>
                      setFormData({ ...formData, [tag.id]: !isSelected })
                    }
                    className={`
                      relative group flex flex-col items-center gap-5 p-8 rounded-[2.5rem] border-2 cursor-pointer transition-all duration-500
                      ${
                        isSelected
                          ? "border-purple-500 bg-purple-500/10 shadow-2xl shadow-purple-500/20 translate-y-[-4px]"
                          : "border-white/5 bg-white/5 hover:border-white/10"
                      }
                    `}
                  >
                    <div
                      className={`
                      flex h-16 w-16 items-center justify-center rounded-2xl transition-all duration-500 group-hover:scale-110
                      ${isSelected ? "bg-purple-500 text-white" : `${tag.bg} ${tag.color}`}
                    `}
                    >
                      <Icon size={32} strokeWidth={1.5} />
                    </div>
                    <div className="text-center">
                      <p
                        className={`text-[11px] font-black uppercase tracking-widest ${isSelected ? "text-white" : "text-purple-200/50"}`}
                      >
                        {tag.label}
                      </p>
                      <p className="text-[9px] font-bold text-white/20 mt-2 uppercase tracking-tighter">
                        {tag.desc}
                      </p>
                    </div>
                    <div
                      className={`
                      absolute top-5 right-5 h-7 w-7 rounded-full flex items-center justify-center border-2 transition-all duration-500
                      ${isSelected ? "bg-purple-500 border-purple-500 text-white scale-100 rotate-0" : "border-white/5 scale-0 rotate-90"}
                    `}
                    >
                      <Check size={16} strokeWidth={4} />
                    </div>
                  </div>
                );
              })}
            </div>
          </section>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row gap-5 pt-10 border-t border-white/5">
            <Button
              type="button"
              variant="outline"
              onClick={handleReset}
              disabled={loading}
              className="flex-1 h-16 rounded-[1.25rem] font-black uppercase tracking-widest text-[10px] border-white/10 text-white/50 hover:bg-white/5 hover:text-white"
            >
              <X size={18} className="mr-3" />
              Discard Parameters
            </Button>
            <Button
              type="submit"
              disabled={loading}
              className="flex-[2] h-16 rounded-[1.25rem] font-black uppercase tracking-widest text-[10px] bg-gradient-to-r from-purple-600 to-blue-600 text-white shadow-2xl shadow-purple-500/40 hover:scale-[1.02] active:scale-[0.98] transition-all duration-300"
            >
              {loading ? (
                <div className="flex items-center gap-3">
                  <Loader2 size={20} className="animate-spin" />
                  <span>Establishing Connection...</span>
                </div>
              ) : (
                <div className="flex items-center gap-3">
                  <Plus size={20} strokeWidth={3} />
                  <span>Execute Creation Phase</span>
                </div>
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
