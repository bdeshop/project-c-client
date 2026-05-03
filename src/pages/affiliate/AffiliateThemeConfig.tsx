import { useState, useEffect } from "react";
import { Palette, Upload, X, Check, AlertCircle, Loader2, RefreshCw, Layout, Type, MousePointer2 } from "lucide-react";
import axios from "axios";
import { API_BASE_URL } from "../../config/api";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";

interface ThemeConfig {
  logo: string | null;
  favicon: string | null;
  primaryColor: string;
  secondaryColor: string;
  accentColor: string;
  fontFamily: string;
  borderRadius: string;
  lastUpdated?: string;
}

function AffiliateThemeConfig() {
  const [config, setConfig] = useState<ThemeConfig>({
    logo: null,
    favicon: null,
    primaryColor: "#000000",
    secondaryColor: "#FFFFFF",
    accentColor: "#007BFF",
    fontFamily: "Arial, sans-serif",
    borderRadius: "4px",
  });

  const [logoPreview, setLogoPreview] = useState<string>("");
  const [faviconPreview, setFaviconPreview] = useState<string>("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [uploadingLogo, setUploadingLogo] = useState(false);
  const [uploadingFavicon, setUploadingFavicon] = useState(false);

  useEffect(() => {
    fetchConfig();
  }, []);

  const fetchConfig = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("authToken");
      const response = await axios.get(
        `${API_BASE_URL}/api/affiliate-theme-config`,
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );

      if (response.data.success && response.data.data) {
        setConfig(response.data.data);
        if (response.data.data.logo) {
          setLogoPreview(response.data.data.logo.startsWith('http') ? response.data.data.logo : `${API_BASE_URL}${response.data.data.logo}`);
        }
        if (response.data.data.favicon) {
          setFaviconPreview(response.data.data.favicon.startsWith('http') ? response.data.data.favicon : `${API_BASE_URL}${response.data.data.favicon}`);
        }
      }
    } catch (err) {
      console.error("Error fetching config:", err);
      setError("Failed to load theme configuration");
    } finally {
      setLoading(false);
    }
  };

  const validateHexColor = (color: string): boolean => {
    return /^#[0-9A-F]{6}$/i.test(color);
  };

  const handleColorChange = (field: string, value: string) => {
    setConfig((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleTextChange = (field: string, value: string) => {
    setConfig((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleLogoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!["image/png", "image/jpeg", "image/webp"].includes(file.type)) {
      setError("Logo must be PNG, JPG, or WEBP format");
      return;
    }

    if (file.size > 2 * 1024 * 1024) {
      setError("Logo size must be less than 2MB");
      return;
    }

    try {
      setUploadingLogo(true);
      setError("");

      const formData = new FormData();
      formData.append("file", file);

      const token = localStorage.getItem("authToken");
      const response = await axios.post(
        `${API_BASE_URL}/api/affiliate-theme-config/upload-logo`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        },
      );

      if (response.data.success) {
        const logoPath = response.data.data.logo;
        setConfig((prev) => ({
          ...prev,
          logo: logoPath,
        }));
        setLogoPreview(logoPath.startsWith('http') ? logoPath : `${API_BASE_URL}${logoPath}`);
        setSuccess("Logo uploaded successfully");
        setTimeout(() => setSuccess(""), 3000);
      }
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to upload logo");
    } finally {
      setUploadingLogo(false);
    }
  };

  const handleFaviconUpload = async (
    e: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!["image/png", "image/x-icon", "image/webp"].includes(file.type)) {
      setError("Favicon must be PNG, ICO, or WEBP format");
      return;
    }

    if (file.size > 1 * 1024 * 1024) {
      setError("Favicon size must be less than 1MB");
      return;
    }

    try {
      setUploadingFavicon(true);
      setError("");

      const formData = new FormData();
      formData.append("file", file);

      const token = localStorage.getItem("authToken");
      const response = await axios.post(
        `${API_BASE_URL}/api/affiliate-theme-config/upload-favicon`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        },
      );

      if (response.data.success) {
        const faviconPath = response.data.data.favicon;
        setConfig((prev) => ({
          ...prev,
          favicon: faviconPath,
        }));
        setFaviconPreview(faviconPath.startsWith('http') ? faviconPath : `${API_BASE_URL}${faviconPath}`);
        setSuccess("Favicon uploaded successfully");
        setTimeout(() => setSuccess(""), 3000);
      }
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to upload favicon");
    } finally {
      setUploadingFavicon(false);
    }
  };

  const handleSaveConfig = async () => {
    try {
      setError("");
      setSuccess("");

      if (!validateHexColor(config.primaryColor) || !validateHexColor(config.secondaryColor) || !validateHexColor(config.accentColor)) {
        setError("Colors must be in valid HEX format (e.g., #FFFFFF)");
        return;
      }

      setSaving(true);

      const token = localStorage.getItem("authToken");
      const response = await axios.put(
        `${API_BASE_URL}/api/affiliate-theme-config`,
        {
          primaryColor: config.primaryColor,
          secondaryColor: config.secondaryColor,
          accentColor: config.accentColor,
          fontFamily: config.fontFamily,
          borderRadius: config.borderRadius,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );

      if (response.data.success) {
        setSuccess("Theme configuration updated successfully");
        setTimeout(() => setSuccess(""), 3000);
      }
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to save configuration");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center p-10 space-y-4 animate-in fade-in duration-500 min-h-[400px]">
        <Loader2 className="h-10 w-10 text-primary animate-spin" />
        <p className="text-muted-foreground font-bold tracking-widest text-[10px] uppercase">
          Mapping theme tokens...
        </p>
      </div>
    );
  }

  return (
    <div className="w-full max-w-7xl mx-auto p-6 space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 uppercase">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="flex items-center gap-5">
          <div className="flex h-16 w-16 items-center justify-center rounded-[1.5rem] bg-gradient-to-br from-primary to-secondary text-white shadow-xl shadow-primary/20">
            <Palette size={32} />
          </div>
          <div>
            <h1 className="text-2xl font-black tracking-tight leading-none mb-1">
              Affiliate Branding
            </h1>
            <p className="text-muted-foreground font-medium lowercase first-letter:uppercase tracking-normal">
              Customize the visual identity of the affiliate platform
            </p>
          </div>
        </div>
        <Button variant="outline" onClick={fetchConfig} className="rounded-xl h-10 px-5 font-black text-[10px] tracking-widest">
          <RefreshCw size={14} className="mr-2" /> REFRESH
        </Button>
      </div>

      {/* Messages */}
      {(error || success) && (
        <div className="animate-in slide-in-from-top-2">
          {error && (
            <div className="flex items-center gap-3 p-4 rounded-2xl bg-destructive/10 border border-destructive/20 text-destructive">
              <AlertCircle size={18} />
              <span className="text-[10px] font-black tracking-widest flex-1">{error}</span>
              <button onClick={() => setError("")}><X size={16} /></button>
            </div>
          )}
          {success && (
            <div className="flex items-center gap-3 p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-500">
              <Check size={18} />
              <span className="text-[10px] font-black tracking-widest flex-1">{success}</span>
              <button onClick={() => setSuccess("")}><X size={16} /></button>
            </div>
          )}
        </div>
      )}

      {/* Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Visual Identity */}
        <div className="lg:col-span-2 space-y-8">
          <div className="p-8 rounded-[2.5rem] bg-card border dark:border-border shadow-sm space-y-10">
            <div className="flex items-center gap-3 text-primary">
              <Layout size={18} />
              <h2 className="text-xs font-black uppercase tracking-[0.2em]">Visual Assets</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
              {/* Logo Upload */}
              <div className="space-y-4">
                <Label className="text-[10px] font-black tracking-widest text-muted-foreground px-1 uppercase">Platform Logo</Label>
                <div className="relative group aspect-video rounded-3xl border-2 border-dashed border-border bg-muted/20 overflow-hidden transition-all hover:border-primary">
                  {logoPreview ? (
                    <div className="relative h-full w-full flex items-center justify-center p-8 bg-black/5 dark:bg-white/5">
                      <img src={logoPreview} alt="Logo" className="max-h-full max-w-full object-contain drop-shadow-2xl" />
                      <button 
                        className="absolute top-4 right-4 h-8 w-8 rounded-full bg-destructive text-white flex items-center justify-center shadow-lg hover:scale-110 transition-transform"
                        onClick={() => { setLogoPreview(""); setConfig({...config, logo: null}); }}
                      >
                        <X size={14} />
                      </button>
                    </div>
                  ) : (
                    <label className="flex flex-col items-center justify-center h-full w-full cursor-pointer p-6">
                      <input type="file" accept="image/*" onChange={handleLogoUpload} className="hidden" disabled={uploadingLogo} />
                      <Upload size={32} className="text-muted-foreground group-hover:text-primary transition-colors mb-2" />
                      <span className="text-[9px] font-black tracking-widest opacity-60">UPLOAD PRIMARY LOGO</span>
                      <span className="text-[8px] font-bold opacity-40 mt-1">PNG, WEBP (MAX 2MB)</span>
                    </label>
                  )}
                  {uploadingLogo && <div className="absolute inset-0 bg-background/80 flex items-center justify-center"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>}
                </div>
              </div>

              {/* Favicon Upload */}
              <div className="space-y-4">
                <Label className="text-[10px] font-black tracking-widest text-muted-foreground px-1 uppercase">Browser Favicon</Label>
                <div className="relative group aspect-video rounded-3xl border-2 border-dashed border-border bg-muted/20 overflow-hidden transition-all hover:border-primary">
                  {faviconPreview ? (
                    <div className="relative h-full w-full flex items-center justify-center p-8 bg-black/5 dark:bg-white/5">
                      <div className="p-4 bg-background rounded-2xl shadow-2xl"><img src={faviconPreview} alt="Favicon" className="h-12 w-12 object-contain" /></div>
                      <button 
                        className="absolute top-4 right-4 h-8 w-8 rounded-full bg-destructive text-white flex items-center justify-center shadow-lg hover:scale-110 transition-transform"
                        onClick={() => { setFaviconPreview(""); setConfig({...config, favicon: null}); }}
                      >
                        <X size={14} />
                      </button>
                    </div>
                  ) : (
                    <label className="flex flex-col items-center justify-center h-full w-full cursor-pointer p-6">
                      <input type="file" accept="image/*" onChange={handleFaviconUpload} className="hidden" disabled={uploadingFavicon} />
                      <Upload size={32} className="text-muted-foreground group-hover:text-primary transition-colors mb-2" />
                      <span className="text-[9px] font-black tracking-widest opacity-60">UPLOAD FAVICON</span>
                      <span className="text-[8px] font-bold opacity-40 mt-1">ICO, PNG (MAX 1MB)</span>
                    </label>
                  )}
                  {uploadingFavicon && <div className="absolute inset-0 bg-background/80 flex items-center justify-center"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>}
                </div>
              </div>
            </div>
          </div>

          <div className="p-8 rounded-[2.5rem] bg-card border dark:border-border shadow-sm space-y-10">
            <div className="flex items-center gap-3 text-primary">
              <Palette size={18} />
              <h2 className="text-xs font-black uppercase tracking-[0.2em]">Interface Dynamics</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
              <div className="space-y-6">
                <div className="space-y-3">
                  <Label className="text-[10px] font-black tracking-widest text-muted-foreground px-1 uppercase flex items-center gap-2">
                    <Type size={12} /> Font Family
                  </Label>
                  <Input 
                    value={config.fontFamily} 
                    onChange={(e) => handleTextChange("fontFamily", e.target.value)}
                    className="h-12 rounded-xl bg-muted/30 border-transparent font-bold focus:bg-background transition-all"
                    placeholder="e.g. Inter, system-ui"
                  />
                </div>
                <div className="space-y-3">
                  <Label className="text-[10px] font-black tracking-widest text-muted-foreground px-1 uppercase flex items-center gap-2">
                    <MousePointer2 size={12} /> Border Radius
                  </Label>
                  <Input 
                    value={config.borderRadius} 
                    onChange={(e) => handleTextChange("borderRadius", e.target.value)}
                    className="h-12 rounded-xl bg-muted/30 border-transparent font-bold focus:bg-background transition-all"
                    placeholder="e.g. 12px, 1rem"
                  />
                </div>
              </div>

              <div className="space-y-6 bg-muted/20 p-6 rounded-3xl border border-dashed border-border">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-black tracking-widest opacity-40 uppercase">Preview Mode</span>
                  <Badge variant="outline" className="font-black text-[8px] tracking-widest">LIVE RENDER</Badge>
                </div>
                <div className="space-y-4">
                  <div className="h-10 w-full flex items-center justify-center font-black text-xs shadow-xl" style={{ backgroundColor: config.primaryColor, color: config.secondaryColor, borderRadius: config.borderRadius, fontFamily: config.fontFamily }}>
                    PRIMARY ACTION
                  </div>
                  <div className="h-10 w-full flex items-center justify-center font-black text-xs border-2" style={{ borderColor: config.primaryColor, color: config.primaryColor, borderRadius: config.borderRadius, fontFamily: config.fontFamily }}>
                    SECONDARY OUTLINE
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Color tokens */}
        <div className="space-y-8">
          <div className="p-8 rounded-[2.5rem] bg-slate-900 text-white shadow-2xl space-y-10">
            <div className="flex items-center gap-3 text-primary">
              <Palette size={18} />
              <h2 className="text-xs font-black uppercase tracking-[0.2em]">Color Strategy</h2>
            </div>

            <div className="space-y-8">
              {[
                { label: "Main Brand", key: "primaryColor", desc: "Used for buttons & active states" },
                { label: "Content Background", key: "secondaryColor", desc: "Used for text on brand colors" },
                { label: "Highlight Accent", key: "accentColor", desc: "Used for badges & success indicators" },
              ].map((clr) => (
                <div key={clr.key} className="space-y-4">
                  <div className="flex items-center justify-between">
                    <Label className="text-[10px] font-black tracking-widest uppercase opacity-60 leading-none">{clr.label}</Label>
                    <span className="text-[10px] font-bold font-mono opacity-40 uppercase tracking-tighter">{(config[clr.key as keyof typeof config] as string)}</span>
                  </div>
                  <div className="flex items-center gap-4 bg-white/5 p-2 rounded-2xl border border-white/5 group hover:border-white/20 transition-all">
                    <div className="relative h-12 w-12 rounded-xl overflow-hidden shadow-inner flex-shrink-0">
                      <input 
                        type="color" 
                        value={config[clr.key as keyof typeof config] as string} 
                        onChange={(e) => handleColorChange(clr.key, e.target.value)}
                        className="absolute inset-[-10px] h-[calc(100%+20px)] w-[calc(100%+20px)] cursor-pointer"
                      />
                    </div>
                    <div className="flex-1">
                      <p className="text-[11px] font-black tracking-tight normal-case leading-tight">{clr.desc}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="h-px bg-white/10" />

            <div className="space-y-4 pt-4">
              <Button 
                onClick={handleSaveConfig} 
                disabled={saving}
                className="w-full h-14 rounded-2xl bg-primary hover:bg-primary/90 text-white font-black tracking-[0.2em] text-[10px] shadow-xl shadow-primary/20 transition-all active:scale-95"
              >
                {saving ? <Loader2 size={18} className="animate-spin mr-2" /> : <Check size={18} className="mr-2" />}
                {saving ? "PROPAGATING..." : "DEPLOY THEME"}
              </Button>
              {config.lastUpdated && (
                <p className="text-[9px] font-bold text-center opacity-40 tracking-widest">
                  LAST REVISION: {new Date(config.lastUpdated).toLocaleString()}
                </p>
              )}
            </div>
          </div>

          <div className="p-8 rounded-[2.5rem] border-2 border-dashed border-border bg-muted/10 flex flex-col items-center justify-center text-center gap-4 group hover:bg-muted/20 transition-all">
            <div className="h-12 w-12 rounded-full bg-muted flex items-center justify-center group-hover:scale-110 transition-transform">
              <RefreshCw size={24} className="text-muted-foreground opacity-40" />
            </div>
            <p className="text-[10px] font-black tracking-widest text-muted-foreground max-w-[160px] leading-relaxed">
              CHANGES MAY TAKE UP TO 5 MINUTES TO REFLECT ON THE NETWORK
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AffiliateThemeConfig;
