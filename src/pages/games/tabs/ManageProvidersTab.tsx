import { useState, useEffect, useCallback } from "react";
import {
  Image as ImageIcon,
  Upload,
  Loader2,
  AlertCircle,
  RefreshCw,
  Gamepad2,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import { apiClient } from "@/lib/api";
import { API_BASE_URL } from "@/config/constants";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";

interface Game {
  _id: string;
  nameEnglish: string;
  nameBangla: string;
  image: string;
  category?: {
    nameEnglish: string;
    nameBangla: string;
  };
}

interface Provider {
  _id: string;
  name: string;
  logo?: string;
  gameCount?: number;
  games?: Game[];
}

interface ProviderWithGames extends Provider {
  gameCount: number;
  games: Game[];
}

export default function ManageProvidersTab() {
  const [providers, setProviders] = useState<ProviderWithGames[]>([]);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState<string | null>(null);
  const [message, setMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);
  const [selectedProvider, setSelectedProvider] = useState<string | null>(null);
  const [expandedProvider, setExpandedProvider] = useState<string | null>(null);
  const [imagePreview, setImagePreview] = useState<string>("");
  const [imageFile, setImageFile] = useState<File | null>(null);

  const getFullImageUrl = (imagePath: string | undefined): string => {
    if (!imagePath) return "";
    if (imagePath.startsWith("http")) return imagePath;
    return `${API_BASE_URL}/${imagePath.startsWith("/") ? imagePath.slice(1) : imagePath}`;
  };

  const fetchProviders = useCallback(async () => {
    try {
      setLoading(true);
      const response = await apiClient.get("/providers/with-counts");
      if (response.data.success && response.data.providers) {
        setProviders(response.data.providers);
      }
    } catch (error) {
      setMessage({
        type: "error",
        text: "Failed to fetch providers",
      });
      console.error("Error fetching providers:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchProviders();
  }, [fetchProviders]);

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

  const handleUpdateImage = async (providerId: string) => {
    if (!imageFile) {
      setMessage({
        type: "error",
        text: "Please select an image first",
      });
      return;
    }

    try {
      setUpdating(providerId);
      const formData = new FormData();
      formData.append("logo", imageFile);

      const response = await apiClient.put(
        `/providers/${providerId}`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        },
      );

      if (response.data.success) {
        setMessage({
          type: "success",
          text: "Provider image updated successfully!",
        });
        setImageFile(null);
        setImagePreview("");
        setSelectedProvider(null);
        await fetchProviders();
      }
    } catch (error) {
      setMessage({
        type: "error",
        text: error instanceof Error ? error.message : "Failed to update provider image",
      });
    } finally {
      setUpdating(null);
    }
  };

  const handleCancel = () => {
    setSelectedProvider(null);
    setImageFile(null);
    setImagePreview("");
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] gap-4">
        <div className="h-12 w-12 animate-spin rounded-full border-4 border-brand-primary border-t-transparent" />
        <p className="text-muted-foreground animate-pulse font-bold tracking-widest text-sm">
          LOADING PROVIDERS...
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto space-y-8 pb-12">
      <div className="flex flex-col gap-1">
        <h2 className="text-2xl font-black text-slate-900 dark:text-white uppercase tracking-tight">
          Manage Game Providers
        </h2>
        <p className="text-slate-500 dark:text-slate-400 font-bold text-xs uppercase tracking-widest mt-0.5">
          Update provider images and view interconnected titles
        </p>
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
          <AlertCircle size={18} />
          {message.text}
        </div>
      )}

      <div className="flex justify-end">
        <Button
          onClick={fetchProviders}
          disabled={loading}
          variant="outline"
          className="rounded-xl border-slate-200 dark:border-white/10 font-black tracking-widest text-[10px] h-10 px-5"
        >
          <RefreshCw size={14} className="mr-2" />
          REFRESH
        </Button>
      </div>

      {/* Providers List */}
      <div className="space-y-4">
        {providers.map((provider) => (
          <div
            key={provider._id}
            className="rounded-3xl border bg-white shadow-sm transition-all hover:shadow-lg dark:border-white/10 dark:bg-[#1a1a1a]"
          >
            {/* Provider Header */}
            <div className="p-6">
              <div className="flex items-center gap-6">
                {/* Provider Image */}
                <div className="aspect-square w-24 rounded-2xl border-2 border-slate-200 bg-slate-50 flex items-center justify-center overflow-hidden flex-shrink-0 dark:bg-black/40 dark:border-white/10">
                  {provider.logo ? (
                    <img
                      src={getFullImageUrl(provider.logo)}
                      alt={provider.name}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        (e.target as HTMLImageElement).style.display = "none";
                      }}
                    />
                  ) : (
                    <div className="flex flex-col items-center gap-1 text-slate-400">
                      <ImageIcon size={24} strokeWidth={1.5} />
                      <span className="text-[8px] uppercase font-black">
                        No Identity
                      </span>
                    </div>
                  )}
                </div>

                {/* Provider Info */}
                <div className="flex-1">
                  <h3 className="text-xl font-black text-slate-900 dark:text-white mb-2 uppercase tracking-tight">
                    {provider.name}
                  </h3>
                  <div className="flex items-center gap-2 text-xs font-black text-slate-400 uppercase tracking-widest mb-4">
                    <Gamepad2 size={16} className="text-brand-primary" />
                    <span>{provider.gameCount} Games Integrated</span>
                  </div>

                  {/* Action Buttons */}
                  {selectedProvider === provider._id ? (
                    <div className="space-y-3">
                      <div className="space-y-2">
                        <Label
                          htmlFor={`image-${provider._id}`}
                          className="text-[10px] font-black uppercase tracking-widest text-slate-400"
                        >
                          Upload Identity Asset
                        </Label>
                        <div className="relative group">
                          <input
                            type="file"
                            id={`image-${provider._id}`}
                            accept="image/*"
                            onChange={handleImageChange}
                            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                          />
                          <div className="flex items-center justify-center gap-2 w-full py-3 border-2 border-dashed border-slate-200 rounded-xl bg-slate-50 group-hover:bg-slate-100 transition-all dark:bg-white/5 dark:border-white/10 dark:group-hover:bg-white/10">
                            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-brand-primary/10 text-brand-primary">
                              <Upload size={16} />
                            </div>
                            <div className="text-left">
                              <p className="text-[11px] font-black text-slate-700 dark:text-slate-200 uppercase tracking-widest">
                                {imageFile ? imageFile.name : "Choose File"}
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>

                      {imagePreview && (
                        <div className="aspect-square w-24 rounded-xl border-2 border-slate-200 bg-slate-50 flex items-center justify-center overflow-hidden dark:bg-black/40 dark:border-white/10">
                          <img
                            src={imagePreview}
                            alt="Preview"
                            className="w-full h-full object-cover"
                          />
                        </div>
                      )}

                      <div className="flex gap-2">
                        <Button
                          onClick={handleCancel}
                          variant="outline"
                          disabled={updating === provider._id}
                          className="flex-1 rounded-lg border-slate-200 dark:border-white/10 font-black tracking-widest text-[10px] h-9"
                        >
                          CANCEL
                        </Button>
                        <Button
                          onClick={() => handleUpdateImage(provider._id)}
                          disabled={!imageFile || updating === provider._id}
                          className="flex-1 rounded-lg font-black tracking-widest text-[10px] h-9 bg-brand-primary text-white shadow-lg shadow-brand-primary/20"
                        >
                          {updating === provider._id ? (
                            <div className="flex items-center gap-1">
                              <Loader2 size={12} className="animate-spin" />
                              <span>UPLOADING...</span>
                            </div>
                          ) : (
                            "EXECUTE UPDATE"
                          )}
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <div className="flex gap-2">
                      <Button
                        onClick={() => setSelectedProvider(provider._id)}
                        className="rounded-lg font-black tracking-widest text-[10px] h-9 bg-brand-primary text-white"
                      >
                        <Upload size={14} className="mr-2" />
                        UPDATE ASSET
                      </Button>
                      <Button
                        onClick={() =>
                          setExpandedProvider(
                            expandedProvider === provider._id
                              ? null
                              : provider._id,
                          )
                        }
                        variant="outline"
                        className="rounded-lg border-slate-200 dark:border-white/10 font-black tracking-widest text-[10px] h-9"
                      >
                        {expandedProvider === provider._id ? (
                          <>
                            <ChevronUp size={14} className="mr-2" />
                            HIDE GAMES
                          </>
                        ) : (
                          <>
                            <ChevronDown size={14} className="mr-2" />
                            VIEW COLLECTION
                          </>
                        )}
                      </Button>
                    </div>
                  )}
                </div>
              </div>

              {/* Games List */}
              {expandedProvider === provider._id && (
                <div className="mt-6 pt-6 border-t dark:border-white/10 animate-in slide-in-from-top-4 duration-300">
                  <h4 className="text-[11px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-6">
                    Interconnected Games ({provider.gameCount})
                  </h4>
                  {provider.games && provider.games.length > 0 ? (
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-6">
                      {provider.games.map((game) => (
                        <div
                          key={game._id}
                          className="group rounded-2xl overflow-hidden border border-slate-100 dark:border-white/5 hover:border-brand-primary/50 hover:shadow-xl transition-all"
                        >
                          <div className="aspect-square bg-slate-50 dark:bg-black/20 flex items-center justify-center overflow-hidden">
                            {game.image ? (
                              <img
                                src={getFullImageUrl(game.image)}
                                alt={game.nameEnglish}
                                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                                onError={(e) => {
                                  (e.target as HTMLImageElement).style.display =
                                    "none";
                                }}
                              />
                            ) : (
                              <Gamepad2 size={24} className="text-slate-300" />
                            )}
                          </div>
                          <div className="p-3">
                            <p className="text-[11px] font-black text-slate-700 dark:text-slate-200 truncate uppercase tracking-tight">
                              {game.nameEnglish}
                            </p>
                            <p className="text-[9px] font-bold text-slate-400 dark:text-slate-500 truncate uppercase tracking-widest mt-0.5">
                              {game.category?.nameEnglish || "UNCATEGORIZED"}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-[10px] font-black text-slate-400 uppercase italic">
                      Zero titles discovered in this collection cache.
                    </p>
                  )}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {providers.length === 0 && (
        <div className="flex flex-col items-center justify-center min-h-[300px] gap-4 rounded-[3rem] border-2 border-dashed border-slate-200 bg-slate-50/50 dark:bg-white/[0.02] dark:border-white/10">
          <Gamepad2 size={48} className="text-slate-200 dark:text-slate-800" />
          <p className="text-slate-400 dark:text-slate-600 font-black uppercase tracking-widest text-xs">
            Matrix Empty: No Providers Configured
          </p>
        </div>
      )}
    </div>
  );
}
