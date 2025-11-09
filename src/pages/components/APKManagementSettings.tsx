import { useState } from "react";
import {
  useAPKFiles,
  useUploadAPK,
  useUpdateAPK,
  useToggleAPKStatus,
  useDeleteAPK,
  APKFile,
} from "../../lib/queries";
import { API_URL } from "../../lib/api";
import { Button } from "../../components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../../components/ui/card";
import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";
import { Textarea } from "../../components/ui/textarea";
import { Badge } from "../../components/ui/badge";
import {
  Upload,
  Download,
  Trash2,
  Edit,
  Power,
  FileText,
  CheckCircle,
  XCircle,
} from "lucide-react";
import { toast } from "sonner";

export function APKManagementSettings() {
  const { data: apkData, isLoading } = useAPKFiles();
  const uploadAPK = useUploadAPK();
  const updateAPK = useUpdateAPK();
  const toggleStatus = useToggleAPKStatus();
  const deleteAPK = useDeleteAPK();

  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploadForm, setUploadForm] = useState({
    version: "",
    description: "",
    customName: "",
  });
  const [editingAPK, setEditingAPK] = useState<APKFile | null>(null);
  const [editForm, setEditForm] = useState({
    version: "",
    description: "",
  });

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.name.endsWith(".apk")) {
        setSelectedFile(file);
      } else {
        toast.error("Please select a valid APK file");
      }
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      toast.error("Please select an APK file");
      return;
    }

    const formData = new FormData();
    formData.append("apk", selectedFile);
    if (uploadForm.version) formData.append("version", uploadForm.version);
    if (uploadForm.description)
      formData.append("description", uploadForm.description);
    if (uploadForm.customName)
      formData.append("customName", uploadForm.customName);

    try {
      await uploadAPK.mutateAsync(formData);
      toast.success("APK uploaded successfully!");
      setSelectedFile(null);
      setUploadForm({ version: "", description: "", customName: "" });
      // Reset file input
      const fileInput = document.getElementById(
        "apk-file-input"
      ) as HTMLInputElement;
      if (fileInput) fileInput.value = "";
    } catch (error) {
      console.error("Upload error:", error);
      const errorMessage =
        (error as { response?: { data?: { message?: string } } })?.response
          ?.data?.message || "Failed to upload APK";
      toast.error(errorMessage);
    }
  };

  const handleEdit = (apk: APKFile) => {
    setEditingAPK(apk);
    setEditForm({
      version: apk.version || "",
      description: apk.description || "",
    });
  };

  const handleUpdate = async () => {
    if (!editingAPK) return;

    try {
      await updateAPK.mutateAsync({
        id: editingAPK._id,
        data: editForm,
      });
      toast.success("APK updated successfully!");
      setEditingAPK(null);
    } catch (error) {
      console.error("Update error:", error);
      const errorMessage =
        (error as { response?: { data?: { message?: string } } })?.response
          ?.data?.message || "Failed to update APK";
      toast.error(errorMessage);
    }
  };

  const handleToggleStatus = async (id: string) => {
    try {
      await toggleStatus.mutateAsync(id);
      toast.success("APK status updated!");
    } catch (error) {
      console.error("Toggle error:", error);
      toast.error("Failed to toggle APK status");
    }
  };

  const handleDelete = async (id: string, filename: string) => {
    if (window.confirm(`Are you sure you want to delete ${filename}?`)) {
      try {
        await deleteAPK.mutateAsync(id);
        toast.success("APK deleted successfully!");
      } catch (error) {
        console.error("Delete error:", error);
        toast.error("Failed to delete APK");
      }
    }
  };

  const handleDownload = (apk: APKFile) => {
    window.open(`${API_URL}${apk.downloadUrl}`, "_blank");
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  const apkFiles = apkData?.data?.data || [];

  return (
    <div className="space-y-6">
      {/* Upload Section */}
      <Card className="glass-effect">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Upload className="h-5 w-5" />
            Upload New APK
          </CardTitle>
          <CardDescription>
            Upload Android APK files (max 200MB). Only .apk files are accepted.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="apk-file-input">APK File *</Label>
            <Input
              id="apk-file-input"
              type="file"
              accept=".apk"
              onChange={handleFileSelect}
              className="cursor-pointer"
            />
            {selectedFile && (
              <p className="text-sm text-muted-foreground">
                Selected: {selectedFile.name} (
                {(selectedFile.size / 1024 / 1024).toFixed(2)} MB)
              </p>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="version">Version (Optional)</Label>
              <Input
                id="version"
                value={uploadForm.version}
                onChange={(e) =>
                  setUploadForm({ ...uploadForm, version: e.target.value })
                }
                placeholder="1.0.0"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="customName">Custom Filename (Optional)</Label>
              <Input
                id="customName"
                value={uploadForm.customName}
                onChange={(e) =>
                  setUploadForm({ ...uploadForm, customName: e.target.value })
                }
                placeholder="myapp (without .apk)"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description (Optional)</Label>
            <Textarea
              id="description"
              value={uploadForm.description}
              onChange={(e) =>
                setUploadForm({ ...uploadForm, description: e.target.value })
              }
              placeholder="Latest version with bug fixes..."
              rows={3}
            />
          </div>

          <Button
            onClick={handleUpload}
            disabled={!selectedFile || uploadAPK.isPending}
            className="gradient-primary"
          >
            <Upload className="h-4 w-4 mr-2" />
            {uploadAPK.isPending ? "Uploading..." : "Upload APK"}
          </Button>
        </CardContent>
      </Card>

      {/* APK List Section */}
      <Card className="glass-effect">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Uploaded APK Files ({apkFiles.length})
          </CardTitle>
          <CardDescription>
            Manage your uploaded APK files. Users can download active APKs.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {apkFiles.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              <FileText className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>No APK files uploaded yet</p>
            </div>
          ) : (
            <div className="space-y-4">
              {apkFiles.map((apk) => (
                <div
                  key={apk._id}
                  className="border border-border rounded-lg p-4 space-y-3"
                >
                  {editingAPK?._id === apk._id ? (
                    // Edit Mode
                    <div className="space-y-3">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        <div className="space-y-2">
                          <Label>Version</Label>
                          <Input
                            value={editForm.version}
                            onChange={(e) =>
                              setEditForm({
                                ...editForm,
                                version: e.target.value,
                              })
                            }
                            placeholder="1.0.0"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label>Description</Label>
                          <Input
                            value={editForm.description}
                            onChange={(e) =>
                              setEditForm({
                                ...editForm,
                                description: e.target.value,
                              })
                            }
                            placeholder="Description..."
                          />
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          onClick={handleUpdate}
                          disabled={updateAPK.isPending}
                        >
                          Save
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => setEditingAPK(null)}
                        >
                          Cancel
                        </Button>
                      </div>
                    </div>
                  ) : (
                    // View Mode
                    <>
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <h3 className="font-semibold text-lg">
                              {apk.filename}
                            </h3>
                            <Badge
                              variant={apk.isActive ? "default" : "secondary"}
                              className={
                                apk.isActive
                                  ? "bg-green-500 hover:bg-green-600"
                                  : ""
                              }
                            >
                              {apk.isActive ? (
                                <CheckCircle className="h-3 w-3 mr-1" />
                              ) : (
                                <XCircle className="h-3 w-3 mr-1" />
                              )}
                              {apk.isActive ? "Active" : "Inactive"}
                            </Badge>
                          </div>
                          <div className="text-sm text-muted-foreground space-y-1">
                            {apk.version && (
                              <p>
                                <span className="font-medium">Version:</span>{" "}
                                {apk.version}
                              </p>
                            )}
                            <p>
                              <span className="font-medium">Size:</span>{" "}
                              {apk.sizeInMB}
                            </p>
                            <p>
                              <span className="font-medium">Downloads:</span>{" "}
                              {apk.downloadCount}
                            </p>
                            {apk.description && (
                              <p>
                                <span className="font-medium">
                                  Description:
                                </span>{" "}
                                {apk.description}
                              </p>
                            )}
                            <p>
                              <span className="font-medium">Uploaded:</span>{" "}
                              {new Date(apk.createdAt).toLocaleDateString()}
                            </p>
                          </div>
                        </div>
                      </div>

                      <div className="flex flex-wrap gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleDownload(apk)}
                        >
                          <Download className="h-4 w-4 mr-1" />
                          Download
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleEdit(apk)}
                        >
                          <Edit className="h-4 w-4 mr-1" />
                          Edit
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleToggleStatus(apk._id)}
                          disabled={toggleStatus.isPending}
                        >
                          <Power className="h-4 w-4 mr-1" />
                          {apk.isActive ? "Deactivate" : "Activate"}
                        </Button>
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() => handleDelete(apk._id, apk.filename)}
                          disabled={deleteAPK.isPending}
                        >
                          <Trash2 className="h-4 w-4 mr-1" />
                          Delete
                        </Button>
                      </div>
                    </>
                  )}
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Info Card */}
      <Card className="glass-effect">
        <CardHeader>
          <CardTitle className="text-lg">Usage Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 text-sm text-muted-foreground">
          <p>• Maximum file size: 200MB</p>
          <p>• Only .apk files are accepted</p>
          <p>• Active APKs are available for public download</p>
          <p>• Download count is tracked automatically</p>
          <p>• You can have multiple versions uploaded</p>
          <p>• Only active APKs appear in the "latest" endpoint</p>
        </CardContent>
      </Card>
    </div>
  );
}
