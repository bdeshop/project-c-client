import { useState, useEffect } from "react";
import {
  Plus,
  Edit2,
  Trash2,
  Wallet,
  RefreshCw,
  Info,
  Layout,
  Settings,
  Palette,
  CheckCircle2,
  AlertCircle,
  Upload,
  ChevronRight,
  Loader2,
  X,
} from "lucide-react";
import {
  getAllAffiliateWithdrawMethods,
  createAffiliateWithdrawMethod,
  updateAffiliateWithdrawMethod,
  deleteAffiliateWithdrawMethod,
} from "../../config/api";
import { API_BASE_URL } from "../../config/api"; // Note: Ensure API_BASE_URL is exported from api.ts or constants.ts
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface UserInputField {
  fieldLabelEn: string;
  fieldLabelBn: string;
  fieldType: "text" | "number" | "textarea";
  required: boolean;
}

interface Colors {
  textColor: string;
  backgroundColor: string;
  buttonColor: string;
}

interface WithdrawMethod {
  _id: string;
  methodNameEn: string;
  methodNameBn: string;
  minimumWithdrawal: number;
  maximumWithdrawal: number;
  processingTime: string;
  withdrawalFee: number;
  feeType: "Fixed" | "Percentage";
  status: "Active" | "Inactive";
  methodImage?: string;
  withdrawPageImage?: string;
  colors?: Colors;
  instructionEn?: string;
  instructionBn?: string;
  userInputFields?: UserInputField[];
  createdAt: string;
  updatedAt: string;
}

function AffiliatePaymentMethods() {
  const [methods, setMethods] = useState<WithdrawMethod[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [message, setMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);
  const [formData, setFormData] = useState({
    methodNameEn: "",
    methodNameBn: "",
    minimumWithdrawal: "",
    maximumWithdrawal: "",
    processingTime: "",
    withdrawalFee: "",
    feeType: "Fixed" as "Fixed" | "Percentage",
    status: "Active" as "Active" | "Inactive",
    instructionEn: "",
    instructionBn: "",
    textColor: "#000000",
    backgroundColor: "#FFFFFF",
    buttonColor: "#FFFFFF",
  });
  const [userInputFields, setUserInputFields] = useState<UserInputField[]>([]);
  const [methodImage, setMethodImage] = useState<File | null>(null);
  const [withdrawPageImage, setWithdrawPageImage] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const getImageUrl = (imagePath?: string) => {
    if (!imagePath) return "";
    if (imagePath.startsWith("http")) return imagePath;
    return `${API_BASE_URL}${imagePath}`;
  };

  useEffect(() => {
    fetchMethods();
  }, []);

  const fetchMethods = async () => {
    try {
      setLoading(true);
      const response = await getAllAffiliateWithdrawMethods();
      setMethods(response.data || response || []);
    } catch (error) {
      setMessage({
        type: "error",
        text: error instanceof Error ? error.message : "Failed to load payment methods",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleAddField = () => {
    setUserInputFields([
      ...userInputFields,
      {
        fieldLabelEn: "",
        fieldLabelBn: "",
        fieldType: "text",
        required: false,
      },
    ]);
  };

  const handleRemoveField = (index: number) => {
    setUserInputFields(userInputFields.filter((_, i) => i !== index));
  };

  const handleFieldChange = (
    index: number,
    key: keyof UserInputField,
    value: string | boolean,
  ) => {
    const updated = [...userInputFields];
    updated[index] = { ...updated[index], [key]: value } as UserInputField;
    setUserInputFields(updated);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    const form = new FormData();
    form.append("methodNameEn", formData.methodNameEn);
    form.append("methodNameBn", formData.methodNameBn);
    form.append("minimumWithdrawal", formData.minimumWithdrawal);
    form.append("maximumWithdrawal", formData.maximumWithdrawal);
    form.append("processingTime", formData.processingTime);
    form.append("withdrawalFee", formData.withdrawalFee);
    form.append("feeType", formData.feeType);
    form.append("status", formData.status);
    form.append("instructionEn", formData.instructionEn);
    form.append("instructionBn", formData.instructionBn);
    form.append(
      "colors",
      JSON.stringify({
        textColor: formData.textColor,
        backgroundColor: formData.backgroundColor,
        buttonColor: formData.buttonColor,
      }),
    );
    form.append("userInputFields", JSON.stringify(userInputFields));

    if (methodImage) form.append("methodImage", methodImage);
    if (withdrawPageImage) form.append("withdrawPageImage", withdrawPageImage);

    try {
      if (editingId) {
        await updateAffiliateWithdrawMethod(editingId, form);
        setMessage({ type: "success", text: "Gateway updated successfully" });
      } else {
        await createAffiliateWithdrawMethod(form);
        setMessage({ type: "success", text: "Gateway created successfully" });
      }
      setShowModal(false);
      resetForm();
      fetchMethods();
    } catch (error) {
      setMessage({
        type: "error",
        text: error instanceof Error ? error.message : "Failed to save gateway",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetForm = () => {
    setFormData({
      methodNameEn: "",
      methodNameBn: "",
      minimumWithdrawal: "",
      maximumWithdrawal: "",
      processingTime: "",
      withdrawalFee: "",
      feeType: "Fixed",
      status: "Active",
      instructionEn: "",
      instructionBn: "",
      textColor: "#000000",
      backgroundColor: "#FFFFFF",
      buttonColor: "#FFFFFF",
    });
    setUserInputFields([]);
    setMethodImage(null);
    setWithdrawPageImage(null);
    setEditingId(null);
  };

  const handleEdit = (method: WithdrawMethod) => {
    setFormData({
      methodNameEn: method.methodNameEn,
      methodNameBn: method.methodNameBn,
      minimumWithdrawal: method.minimumWithdrawal.toString(),
      maximumWithdrawal: method.maximumWithdrawal.toString(),
      processingTime: method.processingTime,
      withdrawalFee: method.withdrawalFee.toString(),
      feeType: method.feeType,
      status: method.status,
      instructionEn: method.instructionEn || "",
      instructionBn: method.instructionBn || "",
      textColor: method.colors?.textColor || "#000000",
      backgroundColor: method.colors?.backgroundColor || "#FFFFFF",
      buttonColor: method.colors?.buttonColor || "#FFFFFF",
    });
    setUserInputFields(method.userInputFields || []);
    setEditingId(method._id);
    setShowModal(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this payment gateway?")) return;
    try {
      await deleteAffiliateWithdrawMethod(id);
      setMessage({ type: "success", text: "Gateway removed successfully" });
      fetchMethods();
    } catch (error) {
      setMessage({
        type: "error",
        text: error instanceof Error ? error.message : "Failed to delete gateway",
      });
    }
  };

  if (loading) {
    return (
      <div className="flex h-[400px] w-full flex-col items-center justify-center gap-4">
        <Loader2 className="h-10 w-10 animate-spin text-primary" />
        <p className="text-muted-foreground animate-pulse font-medium uppercase tracking-widest text-xs">Syncing gateways...</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-8 p-6 w-full uppercase">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-primary to-secondary text-white shadow-lg shadow-primary/20">
            <Wallet size={32} />
          </div>
          <div>
            <h1 className="text-2xl font-black tracking-tight leading-none mb-1">Affiliate Payments</h1>
            <p className="text-muted-foreground font-medium lowercase first-letter:uppercase tracking-normal">
              Manage withdrawal channels for your affiliate network
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            size="sm"
            onClick={fetchMethods}
            className="rounded-xl border-border font-bold tracking-widest text-[10px] h-10 px-5"
          >
            <RefreshCw size={14} className="mr-2" /> REFRESH
          </Button>
          <Button
            size="sm"
            onClick={() => { resetForm(); setShowModal(true); }}
            className="rounded-xl bg-gradient-to-r from-primary to-secondary text-white shadow-lg shadow-primary/20 font-bold tracking-widest text-[10px] h-10 px-6 border-none"
          >
            <Plus size={16} className="mr-2" /> ADD CHANNEL
          </Button>
        </div>
      </div>

      {message && (
        <div className={`rounded-2xl border p-4 flex items-center gap-3 animate-in slide-in-from-top-2 ${
          message.type === "success" 
            ? "bg-emerald-500/10 text-emerald-500 border-emerald-500/20" 
            : "bg-destructive/10 text-destructive border-destructive/20"
        }`}>
          {message.type === "success" ? <CheckCircle2 size={18} /> : <AlertCircle size={18} />}
          <p className="font-black text-[10px] tracking-widest">{message.text.toUpperCase()}</p>
        </div>
      )}

      {methods.length === 0 ? (
        <div className="flex flex-col items-center justify-center p-20 text-center gap-6 border-2 border-dashed rounded-[2.5rem] bg-muted/20 border-muted-foreground/10">
          <Wallet size={48} className="text-muted-foreground opacity-20" />
          <div className="space-y-2">
            <h3 className="text-xl font-black tracking-widest">NO CHANNELS DEFINED</h3>
            <p className="text-muted-foreground max-w-sm mx-auto text-xs font-medium lowercase first-letter:uppercase tracking-normal">
              You haven't configured any withdrawal methods for affiliates yet.
            </p>
          </div>
          <Button onClick={() => setShowModal(true)} variant="outline" className="h-12 rounded-2xl font-black tracking-widest text-[10px] px-8">
            CREATE FIRST GATEWAY
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {methods.map((method) => (
            <div key={method._id} className="group relative flex flex-col overflow-hidden rounded-[2.5rem] border bg-card shadow-sm transition-all hover:shadow-2xl hover:shadow-primary/10 dark:border-border">
              {/* Status Badge */}
              <div className="absolute top-6 right-6 z-10">
                <Badge className={`rounded-full px-3 py-1 font-black tracking-widest text-[9px] border-2 shadow-sm ${
                  method.status === "Active" 
                    ? "bg-emerald-500/10 text-emerald-500 border-emerald-500/20" 
                    : "bg-slate-500/10 text-slate-400 border-slate-500/20"
                }`}>
                  <span className={`mr-1.5 h-1.5 w-1.5 rounded-full ${method.status === "Active" ? "bg-emerald-500" : "bg-slate-500"}`} />
                  {method.status.toUpperCase()}
                </Badge>
              </div>

              {/* Image Section */}
              <div className="aspect-[2/1] overflow-hidden bg-muted relative">
                {method.methodImage ? (
                  <img src={getImageUrl(method.methodImage)} alt={method.methodNameEn} className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110" />
                ) : (
                  <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-primary/10 to-secondary/10">
                    <Wallet size={48} className="text-primary opacity-20" />
                  </div>
                )}
                <div className="absolute inset-x-0 bottom-0 h-full bg-gradient-to-t from-black/80 via-black/20 to-transparent flex items-end p-8">
                  <div className="space-y-1">
                    <h3 className="text-xl font-black text-white tracking-tight leading-none">{method.methodNameEn}</h3>
                    <p className="text-[10px] font-black text-primary tracking-widest">{method.methodNameBn}</p>
                  </div>
                </div>
              </div>

              {/* Content Section */}
              <div className="flex flex-col p-8 gap-8">
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-4 rounded-2xl bg-muted/50 space-y-1">
                    <p className="text-[9px] font-black text-muted-foreground opacity-60">MIN LIMIT</p>
                    <p className="font-black text-sm tracking-tighter">৳{method.minimumWithdrawal.toLocaleString()}</p>
                  </div>
                  <div className="p-4 rounded-2xl bg-muted/50 space-y-1">
                    <p className="text-[9px] font-black text-muted-foreground opacity-60">SPEED</p>
                    <p className="font-black text-sm tracking-tighter truncate">{method.processingTime}</p>
                  </div>
                </div>

                <div className="flex items-center justify-between border-t border-dashed dark:border-border pt-6">
                  <span className="text-[10px] font-black text-muted-foreground tracking-widest">SYSTEM FEE</span>
                  <Badge variant="outline" className="rounded-xl font-black text-[11px] tracking-tight border-2 px-3">
                    {method.withdrawalFee}{method.feeType === "Fixed" ? "৳" : "%"}
                  </Badge>
                </div>

                <div className="flex items-center gap-3">
                  <Button 
                    variant="outline" 
                    className="flex-1 rounded-2xl h-12 border-2 font-black tracking-widest text-[9px] hover:bg-primary/5 hover:text-primary hover:border-primary/20 transition-all"
                    onClick={() => handleEdit(method)}
                  >
                    <Edit2 size={14} className="mr-2" /> CONFIGURE
                  </Button>
                  <Button 
                    variant="outline" 
                    className="h-12 w-12 rounded-2xl border-2 text-destructive hover:bg-destructive/5 hover:border-destructive/20 transition-all"
                    onClick={() => handleDelete(method._id)}
                  >
                    <Trash2 size={16} />
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Configuration Modal */}
      <Dialog open={showModal} onOpenChange={(open) => !open && setShowModal(false)}>
        <DialogContent className="max-w-4xl p-0 overflow-hidden border-none bg-transparent shadow-none [&>button]:hidden">
          <div className="bg-card dark:bg-card rounded-[2.5rem] overflow-hidden flex flex-col max-h-[90vh] shadow-2xl border dark:border-border">
            <div className="p-8 border-b dark:border-border flex items-center justify-between bg-muted/30">
              <div className="flex items-center gap-4">
                <div className="h-12 w-12 rounded-2xl bg-primary flex items-center justify-center text-white shadow-lg shadow-primary/20">
                  <Settings size={22} />
                </div>
                <div>
                  <h2 className="text-xl font-black tracking-tight">{editingId ? "Update Gateway" : "Define Gateway"}</h2>
                  <p className="text-[10px] font-black text-muted-foreground tracking-widest">AFFILIATE WITHDRAWAL SYSTEM</p>
                </div>
              </div>
              <Button variant="ghost" size="icon" onClick={() => setShowModal(false)} className="rounded-full hover:bg-destructive/10 hover:text-destructive">
                <X size={24} />
              </Button>
            </div>

            <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto scrollbar-thin">
              <Tabs defaultValue="structure" className="w-full">
                <div className="px-8 pt-4 border-b dark:border-border bg-muted/10">
                  <TabsList className="bg-transparent gap-8 h-12 p-0">
                    {[
                      { value: "structure", label: "STRUCTURE", icon: Layout },
                      { value: "aesthetics", label: "AESTHETICS", icon: Palette },
                      { value: "inputs", label: "USER INPUTS", icon: Info },
                    ].map((tab) => (
                      <TabsTrigger 
                        key={tab.value} 
                        value={tab.value} 
                        className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent text-[10px] font-black tracking-[0.2em] h-full px-2 transition-all gap-2"
                      >
                        <tab.icon size={14} /> {tab.label}
                      </TabsTrigger>
                    ))}
                  </TabsList>
                </div>

                <div className="p-8 pb-12">
                  <TabsContent value="structure" className="space-y-10 animate-in fade-in duration-500">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                      <div className="space-y-6">
                        <div className="space-y-2">
                          <Label className="text-[10px] font-black tracking-widest text-muted-foreground px-1">GATEWAY LABEL (EN) *</Label>
                          <Input placeholder="e.g. bKash Premier" value={formData.methodNameEn} onChange={(e) => setFormData({...formData, methodNameEn: e.target.value})} className="h-12 rounded-xl bg-muted/50 border-transparent font-bold" />
                        </div>
                        <div className="space-y-2">
                          <Label className="text-[10px] font-black tracking-widest text-muted-foreground px-1">GATEWAY LABEL (BN) *</Label>
                          <Input placeholder="বিকাশ" value={formData.methodNameBn} onChange={(e) => setFormData({...formData, methodNameBn: e.target.value})} className="h-12 rounded-xl bg-muted/50 border-transparent font-bold" />
                        </div>
                        <div className="space-y-2">
                          <Label className="text-[10px] font-black tracking-widest text-muted-foreground px-1">SETTLEMENT SPEED *</Label>
                          <Input placeholder="e.g. 5-10 Minutes" value={formData.processingTime} onChange={(e) => setFormData({...formData, processingTime: e.target.value})} className="h-12 rounded-xl bg-muted/50 border-transparent font-bold" />
                        </div>
                      </div>
                      <div className="space-y-6">
                        <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label className="text-[10px] font-black tracking-widest text-muted-foreground px-1">MIN (৳)</Label>
                            <Input type="number" placeholder="500" value={formData.minimumWithdrawal} onChange={(e) => setFormData({...formData, minimumWithdrawal: e.target.value})} className="h-12 rounded-xl bg-muted/50 border-transparent font-bold" />
                          </div>
                          <div className="space-y-2">
                            <Label className="text-[10px] font-black tracking-widest text-muted-foreground px-1">MAX (৳)</Label>
                            <Input type="number" placeholder="25000" value={formData.maximumWithdrawal} onChange={(e) => setFormData({...formData, maximumWithdrawal: e.target.value})} className="h-12 rounded-xl bg-muted/50 border-transparent font-bold" />
                          </div>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label className="text-[10px] font-black tracking-widest text-muted-foreground px-1">SYSTEM FEE</Label>
                            <Input type="number" placeholder="0" value={formData.withdrawalFee} onChange={(e) => setFormData({...formData, withdrawalFee: e.target.value})} className="h-12 rounded-xl bg-muted/50 border-transparent font-bold" />
                          </div>
                          <div className="space-y-2">
                            <Label className="text-[10px] font-black tracking-widest text-muted-foreground px-1">FEE TYPE</Label>
                            <Select value={formData.feeType} onValueChange={(val: any) => setFormData({...formData, feeType: val})}>
                              <SelectTrigger className="h-12 rounded-xl bg-muted/50 border-transparent font-bold"><SelectValue /></SelectTrigger>
                              <SelectContent className="rounded-xl"><SelectItem value="Fixed">FIXED (৳)</SelectItem><SelectItem value="Percentage">PERCENT (%)</SelectItem></SelectContent>
                            </Select>
                          </div>
                        </div>
                        <div className="space-y-2">
                          <Label className="text-[10px] font-black tracking-widest text-muted-foreground px-1">GATEWAY STATUS</Label>
                          <Select value={formData.status} onValueChange={(val: any) => setFormData({...formData, status: val})}>
                            <SelectTrigger className="h-12 rounded-xl bg-muted/50 border-transparent font-bold"><SelectValue /></SelectTrigger>
                            <SelectContent className="rounded-xl"><SelectItem value="Active">ACTIVE</SelectItem><SelectItem value="Inactive">INACTIVE</SelectItem></SelectContent>
                          </Select>
                        </div>
                      </div>
                    </div>
                  </TabsContent>

                  <TabsContent value="aesthetics" className="space-y-10 animate-in fade-in duration-500">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                      <div className="space-y-8">
                        <div className="space-y-4">
                          <Label className="text-[10px] font-black tracking-widest text-muted-foreground px-1">CHANNEL ICON</Label>
                          <div className="relative group aspect-video rounded-3xl border-2 border-dashed flex flex-col items-center justify-center transition-all hover:border-primary hover:bg-primary/5 cursor-pointer overflow-hidden">
                            <input type="file" className="absolute inset-0 opacity-0 cursor-pointer" onChange={(e) => setMethodImage(e.target.files?.[0] || null)} />
                            <Upload className="text-muted-foreground group-hover:text-primary transition-colors" size={24} />
                            <span className="text-[9px] font-black tracking-widest mt-2 opacity-60">DRAG OR CLICK TO UPLOAD</span>
                            {methodImage && <Badge className="mt-2 font-black text-[8px] bg-primary">{methodImage.name}</Badge>}
                          </div>
                        </div>
                        <div className="space-y-4">
                          <Label className="text-[10px] font-black tracking-widest text-muted-foreground px-1">BANNER IMAGE</Label>
                          <div className="relative group aspect-video rounded-3xl border-2 border-dashed flex flex-col items-center justify-center transition-all hover:border-primary hover:bg-primary/5 cursor-pointer overflow-hidden">
                            <input type="file" className="absolute inset-0 opacity-0 cursor-pointer" onChange={(e) => setWithdrawPageImage(e.target.files?.[0] || null)} />
                            <Upload className="text-muted-foreground group-hover:text-primary transition-colors" size={24} />
                            <span className="text-[9px] font-black tracking-widest mt-2 opacity-60">DRAG OR CLICK TO UPLOAD</span>
                            {withdrawPageImage && <Badge className="mt-2 font-black text-[8px] bg-primary">{withdrawPageImage.name}</Badge>}
                          </div>
                        </div>
                      </div>
                      <div className="flex flex-col justify-center space-y-6">
                        <div className="p-8 rounded-[2rem] bg-slate-900 text-white shadow-2xl space-y-8">
                          <h4 className="text-[10px] font-black tracking-widest text-primary">VISUAL THEME</h4>
                          <div className="space-y-6">
                            {[
                              { label: "TYPOGRAPHY", key: "textColor" },
                              { label: "BACKGROUND", key: "backgroundColor" },
                              { label: "ACTION COLOR", key: "buttonColor" },
                            ].map((clr) => (
                              <div key={clr.key} className="flex items-center justify-between">
                                <Label className="text-[10px] font-black tracking-widest opacity-60">{clr.label}</Label>
                                <div className="flex items-center gap-3 bg-white/5 p-1 rounded-full pr-3">
                                  <input 
                                    type="color" 
                                    value={formData[clr.key as keyof typeof formData] as string} 
                                    onChange={(e) => setFormData({...formData, [clr.key]: e.target.value})}
                                    className="h-8 w-8 rounded-full border-none cursor-pointer bg-transparent" 
                                  />
                                  <span className="text-[10px] font-bold font-mono opacity-80 uppercase">{(formData[clr.key as keyof typeof formData] as string)}</span>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  </TabsContent>

                  <TabsContent value="inputs" className="space-y-8 animate-in fade-in duration-500">
                    <div className="flex items-center justify-between">
                      <div className="space-y-1">
                        <h3 className="text-sm font-black tracking-widest">GATEWAY FIELDS</h3>
                        <p className="text-[10px] font-bold text-muted-foreground uppercase">Define what data affiliates must provide</p>
                      </div>
                      <Button type="button" onClick={handleAddField} className="rounded-xl h-10 px-6 font-black text-[9px] tracking-widest shadow-primary/10">
                        <Plus size={14} className="mr-2" /> ADD FIELD
                      </Button>
                    </div>

                    <div className="space-y-4">
                      {userInputFields.length === 0 ? (
                        <div className="p-10 border-2 border-dashed rounded-3xl text-center flex flex-col items-center gap-3 opacity-40 bg-muted/10">
                          <Layout size={32} />
                          <p className="text-[10px] font-black tracking-widest">NO CUSTOM FIELDS DEFINED</p>
                        </div>
                      ) : (
                        userInputFields.map((field, index) => (
                          <div key={index} className="p-6 rounded-3xl border bg-muted/20 flex flex-col md:flex-row gap-6 items-end group relative transition-all hover:bg-muted/30">
                            <button type="button" onClick={() => handleRemoveField(index)} className="absolute -top-3 -right-3 h-8 w-8 rounded-full bg-destructive text-white shadow-lg opacity-0 group-hover:opacity-100 transition-all flex items-center justify-center">
                              <X size={16} />
                            </button>
                            <div className="flex-1 space-y-2">
                              <Label className="text-[9px] font-black tracking-widest text-muted-foreground uppercase px-1">LABEL (EN)</Label>
                              <Input placeholder="e.g. Account Number" value={field.fieldLabelEn} onChange={(e) => handleFieldChange(index, "fieldLabelEn", e.target.value)} className="h-11 rounded-xl bg-background border-none font-bold" />
                            </div>
                            <div className="flex-1 space-y-2">
                              <Label className="text-[9px] font-black tracking-widest text-muted-foreground uppercase px-1">LABEL (BN)</Label>
                              <Input placeholder="অ্যাকাউন্ট নম্বর" value={field.fieldLabelBn} onChange={(e) => handleFieldChange(index, "fieldLabelBn", e.target.value)} className="h-11 rounded-xl bg-background border-none font-bold" />
                            </div>
                            <div className="w-full md:w-32 space-y-2">
                              <Label className="text-[9px] font-black tracking-widest text-muted-foreground uppercase px-1">TYPE</Label>
                              <Select value={field.fieldType} onValueChange={(val: any) => handleFieldChange(index, "fieldType", val)}>
                                <SelectTrigger className="h-11 rounded-xl bg-background border-none font-bold"><SelectValue /></SelectTrigger>
                                <SelectContent className="rounded-xl"><SelectItem value="text">TEXT</SelectItem><SelectItem value="number">NUMBER</SelectItem><SelectItem value="textarea">TEXTAREA</SelectItem></SelectContent>
                              </Select>
                            </div>
                            <label className="flex items-center gap-3 h-11 px-4 cursor-pointer">
                              <input type="checkbox" checked={field.required} onChange={(e) => handleFieldChange(index, "required", e.target.checked)} className="h-4 w-4 accent-primary" />
                              <span className="text-[9px] font-black tracking-widest uppercase opacity-60">REQUIRED</span>
                            </label>
                          </div>
                        ))
                      )}
                    </div>
                  </TabsContent>
                </div>
              </Tabs>
            </form>

            <DialogFooter className="p-8 border-t dark:border-border bg-muted/30">
              <div className="flex items-center justify-between w-full">
                <p className="text-[9px] font-black text-muted-foreground opacity-60 tracking-widest">ENSURE ALL FIELDS ARE VALIDATED</p>
                <div className="flex gap-4">
                  <Button variant="ghost" onClick={() => setShowModal(false)} className="rounded-xl h-12 px-8 font-black text-[10px] tracking-widest">DISCARD</Button>
                  <Button onClick={handleSubmit} disabled={isSubmitting} className="rounded-xl h-12 px-10 font-black text-[10px] tracking-widest shadow-xl shadow-primary/20 border-none">
                    {isSubmitting ? <Loader2 className="animate-spin mr-2 h-4 w-4" /> : editingId ? <Edit2 className="mr-2 h-4 w-4" /> : <Plus className="mr-2 h-4 w-4" />}
                    {isSubmitting ? "SYNCING..." : editingId ? "UPDATE CHANNEL" : "CREATE CHANNEL"}
                  </Button>
                </div>
              </div>
            </DialogFooter>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default AffiliatePaymentMethods;
