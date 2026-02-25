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
import { Plus, Edit2, Trash2, Loader2, Eye } from "lucide-react";
import { toast } from "sonner";
import axios from "axios";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

const API_BASE_URL =
  import.meta.env.VITE_API_URL || "http://localhost:5000/api";

interface Provider {
  _id: string;
  name: string;
  logo: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export function ProvidersPage() {
  const [open, setOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [logoPreview, setLogoPreview] = useState<string>("");
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    isActive: true,
  });

  const queryClient = useQueryClient();

  // Fetch providers
  const { data: providers = [], isLoading } = useQuery({
    queryKey: ["providers"],
    queryFn: async () => {
      const response = await axios.get(`${API_BASE_URL}/providers`);
      return response.data.providers || [];
    },
  });

  // Create provider
  const createMutation = useMutation({
    mutationFn: async (data: FormData) => {
      const response = await axios.post(`${API_BASE_URL}/providers`, data, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["providers"] });
      toast.success("Provider created successfully");
      setOpen(false);
      resetForm();
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Failed to create provider");
    },
  });

  // Update provider
  const updateMutation = useMutation({
    mutationFn: async (data: FormData) => {
      const response = await axios.put(
        `${API_BASE_URL}/providers/${editingId}`,
        data,
        { headers: { "Content-Type": "multipart/form-data" } },
      );
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["providers"] });
      toast.success("Provider updated successfully");
      setOpen(false);
      resetForm();
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Failed to update provider");
    },
  });

  // Delete provider
  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const response = await axios.delete(`${API_BASE_URL}/providers/${id}`);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["providers"] });
      toast.success("Provider deleted successfully");
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Failed to delete provider");
    },
  });

  const resetForm = () => {
    setFormData({ name: "", isActive: true });
    setLogoPreview("");
    setLogoFile(null);
    setEditingId(null);
  };

  const handleEdit = (provider: Provider) => {
    setFormData({
      name: provider.name,
      isActive: provider.isActive,
    });
    setLogoPreview(provider.logo);
    setEditingId(provider._id);
    setOpen(true);
  };

  const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setLogoFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setLogoPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = () => {
    if (!formData.name) {
      toast.error("Provider name is required");
      return;
    }

    if (!editingId && !logoFile) {
      toast.error("Logo is required for new providers");
      return;
    }

    const formDataToSend = new FormData();
    formDataToSend.append("name", formData.name);
    formDataToSend.append("isActive", String(formData.isActive));
    if (logoFile) {
      formDataToSend.append("logo", logoFile);
    }

    if (editingId) {
      updateMutation.mutate(formDataToSend);
    } else {
      createMutation.mutate(formDataToSend);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header with Add Button */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-white">Game Providers</h2>
          <p className="text-purple-300 text-sm mt-1">
            Manage game providers and their logos
          </p>
        </div>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button
              onClick={() => resetForm()}
              className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-semibold shadow-lg hover:shadow-purple-500/50 transition-all duration-300"
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Provider
            </Button>
          </DialogTrigger>
          <DialogContent className="bg-gradient-to-br from-slate-800 to-purple-800 border border-purple-500/20 text-white">
            <DialogHeader>
              <DialogTitle>
                {editingId ? "Edit Provider" : "Create New Provider"}
              </DialogTitle>
              <DialogDescription className="text-purple-300">
                {editingId
                  ? "Update the provider details"
                  : "Add a new game provider"}
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label className="text-purple-200">Provider Name</Label>
                <Input
                  placeholder="e.g., Pragmatic Play"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  className="bg-slate-700/50 border-purple-500/30 text-white placeholder:text-purple-400"
                />
              </div>
              <div>
                <Label className="text-purple-200">Provider Logo</Label>
                <div className="flex gap-4">
                  {logoPreview && (
                    <div className="w-20 h-20 rounded-lg bg-slate-700/50 border border-purple-500/30 flex items-center justify-center overflow-hidden">
                      <img
                        src={logoPreview}
                        alt="logo preview"
                        className="w-full h-full object-cover"
                      />
                    </div>
                  )}
                  <div className="flex-1">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleLogoChange}
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
                  "Save Provider"
                )}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Providers Grid */}
      {isLoading ? (
        <div className="flex justify-center items-center py-12">
          <Loader2 className="w-8 h-8 animate-spin text-purple-500" />
        </div>
      ) : providers.length === 0 ? (
        <div className="text-center py-12 bg-slate-800/50 rounded-xl border border-purple-500/20">
          <p className="text-purple-300">
            No providers found. Create one to get started!
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {providers.map((provider: Provider) => (
            <div
              key={provider._id}
              className="bg-gradient-to-br from-slate-800/50 to-purple-800/50 border border-purple-500/20 rounded-xl p-4 hover:border-purple-500/50 transition-all duration-300 group"
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                  <h3 className="text-white font-semibold text-lg">
                    {provider.name}
                  </h3>
                  <div className="flex items-center gap-2 mt-2">
                    <span
                      className={`text-xs px-2 py-1 rounded-full ${
                        provider.isActive
                          ? "bg-green-500/20 text-green-300"
                          : "bg-red-500/20 text-red-300"
                      }`}
                    >
                      {provider.isActive ? "Active" : "Inactive"}
                    </span>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => handleEdit(provider)}
                    className="text-blue-400 hover:text-blue-300 hover:bg-blue-500/20"
                  >
                    <Edit2 className="w-4 h-4" />
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => deleteMutation.mutate(provider._id)}
                    disabled={deleteMutation.isPending}
                    className="text-red-400 hover:text-red-300 hover:bg-red-500/20"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
              {provider.logo && (
                <div className="mt-3 p-3 bg-slate-700/50 rounded-lg flex items-center justify-center">
                  <img
                    src={provider.logo}
                    alt={provider.name}
                    className="max-w-full max-h-16 object-contain"
                  />
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
