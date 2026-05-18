import { useState, useEffect } from "react";
import { useVipSettings, VipLevel, VipSettings as VipSettingsType } from "../../lib/queries";
import { useUpdateVipSettings } from "../../lib/mutations";
import { apiClient } from "../../lib/api";
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
import {
  Save,
  Trophy,
  HelpCircle,
  FileText,
  Plus,
  Trash2,
  Upload,
  Image as ImageIcon,
  ArrowRight,
  ListPlus,
  CheckCircle,
} from "lucide-react";
import { toast } from "sonner";

export function VipSettings() {
  const { data: vipSettingsData, isLoading } = useVipSettings();
  const updateVipSettings = useUpdateVipSettings();

  const [activeSubTab, setActiveSubTab] = useState<"tiers" | "rules" | "faqs" | "terms">("tiers");
  const [formData, setFormData] = useState<VipSettingsType | null>(null);
  const [uploadingImage, setUploadingImage] = useState<{
    index: number;
    type: "badge" | "privilege";
  } | null>(null);

  useEffect(() => {
    if (vipSettingsData) {
      setFormData(JSON.parse(JSON.stringify(vipSettingsData)));
    }
  }, [vipSettingsData]);

  if (isLoading || !formData) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  // Handle tier value change
  const handleTierChange = (index: number, field: keyof VipLevel, value: string | number) => {
    if (!formData) return;
    const updatedLevels = [...formData.levels];
    updatedLevels[index] = {
      ...updatedLevels[index],
      [field]: value,
    };
    setFormData({ ...formData, levels: updatedLevels });
  };

  // Image upload handler
  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>, index: number, type: "badge" | "privilege") => {
    const file = e.target.files?.[0];
    if (!file) return;

    const fd = new FormData();
    fd.append("image", file);

    setUploadingImage({ index, type });
    try {
      const response = await apiClient.post<{ url: string }>("/vip-settings/upload", fd, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      const imageUrl = response.data.url;
      handleTierChange(index, type === "badge" ? "badgeImage" : "privilegeImage", imageUrl);
      toast.success(`${type === "badge" ? "Badge" : "Privilege Card"} image uploaded successfully!`);
    } catch (error) {
      console.error("Image upload failed:", error);
      toast.error("Failed to upload image. Please try again.");
    } finally {
      setUploadingImage(null);
    }
  };

  // Upgrade rules points handlers
  const handlePointChange = (pIndex: number, value: string) => {
    if (!formData) return;
    const updatedPoints = [...formData.upgradeDescription.points];
    updatedPoints[pIndex] = value;
    setFormData({
      ...formData,
      upgradeDescription: {
        ...formData.upgradeDescription,
        points: updatedPoints,
      },
    });
  };

  const addPoint = () => {
    if (!formData) return;
    setFormData({
      ...formData,
      upgradeDescription: {
        ...formData.upgradeDescription,
        points: [...formData.upgradeDescription.points, ""],
      },
    });
  };

  const removePoint = (pIndex: number) => {
    if (!formData) return;
    const updatedPoints = formData.upgradeDescription.points.filter((_, i) => i !== pIndex);
    setFormData({
      ...formData,
      upgradeDescription: {
        ...formData.upgradeDescription,
        points: updatedPoints,
      },
    });
  };

  // FAQ handlers
  const handleFaqChange = (fIndex: number, field: "question" | "answer", value: string) => {
    if (!formData) return;
    const updatedFaqs = [...formData.faqs];
    updatedFaqs[fIndex] = {
      ...updatedFaqs[fIndex],
      [field]: value,
    };
    setFormData({ ...formData, faqs: updatedFaqs });
  };

  const addFaq = () => {
    if (!formData) return;
    setFormData({
      ...formData,
      faqs: [...formData.faqs, { question: "", answer: "" }],
    });
  };

  const removeFaq = (fIndex: number) => {
    if (!formData) return;
    const updatedFaqs = formData.faqs.filter((_, i) => i !== fIndex);
    setFormData({ ...formData, faqs: updatedFaqs });
  };

  // Terms and conditions handlers
  const handleTermChange = (tIndex: number, value: string) => {
    if (!formData) return;
    const updatedTerms = [...formData.termsAndConditions];
    updatedTerms[tIndex] = value;
    setFormData({ ...formData, termsAndConditions: updatedTerms });
  };

  const addTerm = () => {
    if (!formData) return;
    setFormData({
      ...formData,
      termsAndConditions: [...formData.termsAndConditions, ""],
    });
  };

  const removeTerm = (tIndex: number) => {
    if (!formData) return;
    const updatedTerms = formData.termsAndConditions.filter((_, i) => i !== tIndex);
    setFormData({ ...formData, termsAndConditions: updatedTerms });
  };

  // Save everything
  const handleSave = async () => {
    try {
      await updateVipSettings.mutateAsync(formData);
      toast.success("VIP settings saved successfully!");
    } catch (error) {
      console.error("Save failed:", error);
      toast.error("Failed to save VIP settings.");
    }
  };

  // Sub-tabs layout
  const subTabs = [
    { id: "tiers", label: "VIP Levels & Benefits", icon: <Trophy className="w-4 h-4" /> },
    { id: "rules", label: "Upgrade Rules", icon: <ListPlus className="w-4 h-4" /> },
    { id: "faqs", label: "FAQs Q&A", icon: <HelpCircle className="w-4 h-4" /> },
    { id: "terms", label: "Terms & Conditions", icon: <FileText className="w-4 h-4" /> },
  ] as const;

  return (
    <div className="space-y-6">
      {/* Sub tabs switcher */}
      <div className="flex flex-wrap gap-2 p-1.5 bg-slate-100 dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-800">
        {subTabs.map((tab) => (
          <Button
            key={tab.id}
            variant={activeSubTab === tab.id ? "default" : "ghost"}
            onClick={() => setActiveSubTab(tab.id)}
            className={`flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-md transition-all ${
              activeSubTab === tab.id
                ? "bg-purple-600 dark:bg-purple-700 text-white shadow-md"
                : "hover:bg-slate-200 dark:hover:bg-slate-800"
            }`}
          >
            {tab.icon}
            {tab.label}
          </Button>
        ))}
      </div>

      {/* Save panel (sticky top or just simple card header) */}
      <div className="flex justify-between items-center bg-white dark:bg-slate-950 p-4 border border-border rounded-xl shadow-sm">
        <div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100">
            VIP Page Configurations
          </h2>
          <p className="text-xs text-muted-foreground">
            Configure dynamic levels, bonuses, rules, and questions shown on your VIP page
          </p>
        </div>
        <Button
          onClick={handleSave}
          disabled={updateVipSettings.isPending}
          className="bg-gradient-to-r from-purple-600 via-blue-600 to-indigo-600 text-white shadow-md shadow-purple-500/30 hover:shadow-purple-500/50 hover:brightness-110 transition-all px-6"
        >
          <Save className="w-4 h-4 mr-2" />
          {updateVipSettings.isPending ? "Saving Settings..." : "Save VIP Settings"}
        </Button>
      </div>

      {/* 1. VIP LEVELS & BENEFITS */}
      {activeSubTab === "tiers" && (
        <div className="space-y-6">
          {formData.levels.map((level, idx) => (
            <Card key={level.levelNumber} className="border-purple-100 dark:border-purple-950/40 shadow-sm overflow-hidden">
              <CardHeader className="bg-gradient-to-r from-purple-500/10 via-blue-500/5 to-transparent py-4 border-b border-border">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="flex items-center justify-center w-8 h-8 rounded-full bg-purple-600 text-white font-bold text-sm shadow">
                      {level.levelNumber}
                    </span>
                    <div>
                      <CardTitle className="text-lg">Level {level.levelNumber}: {level.name}</CardTitle>
                      <CardDescription>Configure properties, rebates, requirements and badges</CardDescription>
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="p-6 space-y-6">
                {/* Basic Meta Details */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label>Level Name</Label>
                    <Input
                      value={level.name}
                      onChange={(e) => handleTierChange(idx, "name", e.target.value)}
                      placeholder="e.g. Bronze"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Slots Rebate (%)</Label>
                    <Input
                      value={level.slotsRebate}
                      onChange={(e) => handleTierChange(idx, "slotsRebate", e.target.value)}
                      placeholder="e.g. 0.10"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Live Casino Rebate (%)</Label>
                    <Input
                      value={level.liveCasinoRebate}
                      onChange={(e) => handleTierChange(idx, "liveCasinoRebate", e.target.value)}
                      placeholder="e.g. 0.10"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label>Sports Rebate (%)</Label>
                    <Input
                      value={level.sportRebate}
                      onChange={(e) => handleTierChange(idx, "sportRebate", e.target.value)}
                      placeholder="e.g. 0.10"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Upgrade Deposit Requirement (৳)</Label>
                    <Input
                      value={level.upgradeDepositRequirement}
                      onChange={(e) => handleTierChange(idx, "upgradeDepositRequirement", e.target.value)}
                      placeholder="e.g. ৳ 10,000"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Upgrade Turnover Requirement (৳)</Label>
                    <Input
                      value={level.upgradeTurnoverRequirement}
                      onChange={(e) => handleTierChange(idx, "upgradeTurnoverRequirement", e.target.value)}
                      placeholder="e.g. ৳ 1,00,000"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Upgrade Bonus (৳)</Label>
                    <Input
                      value={level.upgradeBonus}
                      onChange={(e) => handleTierChange(idx, "upgradeBonus", e.target.value)}
                      placeholder="e.g. ৳ 388"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Downgrade / Retention Criteria</Label>
                    <Input
                      value={level.downgradeCriteria}
                      onChange={(e) => handleTierChange(idx, "downgradeCriteria", e.target.value)}
                      placeholder="e.g. Inactive for 2 months"
                    />
                  </div>
                </div>

                {/* Badge Uploaders */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-dashed border-border">
                  {/* Badge Image */}
                  <div className="space-y-3">
                    <Label className="flex items-center gap-1.5">
                      <ImageIcon className="w-4 h-4 text-purple-500" />
                      Badge Icon (Current Status Badge)
                    </Label>
                    <div className="flex items-center gap-4 p-3 bg-slate-50 dark:bg-slate-900 border rounded-lg">
                      <div className="relative w-16 h-16 rounded-lg bg-slate-200 dark:bg-slate-800 border flex items-center justify-center overflow-hidden">
                        {level.badgeImage ? (
                          <img
                            src={level.badgeImage.startsWith("http") ? level.badgeImage : `${API_URL}${level.badgeImage}`}
                            alt={`${level.name} Badge`}
                            className="object-contain w-full h-full p-1"
                          />
                        ) : (
                          <Trophy className="w-6 h-6 text-slate-400" />
                        )}
                      </div>
                      <div className="flex-1 space-y-2">
                        <Input
                          type="file"
                          accept="image/*"
                          onChange={(e) => handleImageUpload(e, idx, "badge")}
                          className="hidden"
                          id={`badge-upload-${level.levelNumber}`}
                        />
                        <Label
                          htmlFor={`badge-upload-${level.levelNumber}`}
                          className="flex items-center justify-center gap-2 h-9 px-4 py-2 border rounded-md cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-800 text-sm transition-all"
                        >
                          <Upload className="w-4 h-4" />
                          {uploadingImage?.index === idx && uploadingImage?.type === "badge"
                            ? "Uploading..."
                            : "Upload Badge Icon"}
                        </Label>
                        <p className="text-[10px] text-muted-foreground">PNG/WebP, transparent background, square 150x150</p>
                      </div>
                    </div>
                  </div>

                  {/* Privilege Card Image */}
                  <div className="space-y-3">
                    <Label className="flex items-center gap-1.5">
                      <ImageIcon className="w-4 h-4 text-indigo-500" />
                      Privilege VIP Banner/Card Card
                    </Label>
                    <div className="flex items-center gap-4 p-3 bg-slate-50 dark:bg-slate-900 border rounded-lg">
                      <div className="relative w-28 h-16 rounded-lg bg-slate-200 dark:bg-slate-800 border flex items-center justify-center overflow-hidden">
                        {level.privilegeImage ? (
                          <img
                            src={level.privilegeImage.startsWith("http") ? level.privilegeImage : `${API_URL}${level.privilegeImage}`}
                            alt={`${level.name} Privilege Banner`}
                            className="object-cover w-full h-full"
                          />
                        ) : (
                          <span className="text-[10px] text-slate-400">No Image</span>
                        )}
                      </div>
                      <div className="flex-1 space-y-2">
                        <Input
                          type="file"
                          accept="image/*"
                          onChange={(e) => handleImageUpload(e, idx, "privilege")}
                          className="hidden"
                          id={`privilege-upload-${level.levelNumber}`}
                        />
                        <Label
                          htmlFor={`privilege-upload-${level.levelNumber}`}
                          className="flex items-center justify-center gap-2 h-9 px-4 py-2 border rounded-md cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-800 text-sm transition-all"
                        >
                          <Upload className="w-4 h-4" />
                          {uploadingImage?.index === idx && uploadingImage?.type === "privilege"
                            ? "Uploading..."
                            : "Upload Card Image"}
                        </Label>
                        <p className="text-[10px] text-muted-foreground">PNG/JPEG/WebP, recommended 350x200 pixels</p>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* 2. UPGRADE RULES & PROGRESSION */}
      {activeSubTab === "rules" && (
        <Card className="shadow-sm">
          <CardHeader>
            <CardTitle>VIP Progression Rules & Instructions</CardTitle>
            <CardDescription>
              Modify the "How to join?" block content and rules bullets shown below the rebate tables.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Block Heading</Label>
                <Input
                  value={formData.upgradeDescription.title}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      upgradeDescription: {
                        ...formData.upgradeDescription,
                        title: e.target.value,
                      },
                    })
                  }
                  placeholder="e.g. VIP LEVEL UPGRADE"
                />
              </div>
              <div className="space-y-2">
                <Label>Block Subheading</Label>
                <Input
                  value={formData.upgradeDescription.subtitle}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      upgradeDescription: {
                        ...formData.upgradeDescription,
                        subtitle: e.target.value,
                      },
                    })
                  }
                  placeholder="e.g. How to join?"
                />
              </div>
            </div>

            {/* Bullet points array */}
            <div className="space-y-4 pt-4 border-t border-border">
              <div className="flex justify-between items-center">
                <Label className="text-md font-semibold">Rule Points List</Label>
                <Button type="button" variant="outline" size="sm" onClick={addPoint} className="flex items-center gap-1.5">
                  <Plus className="w-4 h-4" />
                  Add Bullet Point
                </Button>
              </div>

              <div className="space-y-3">
                {formData.upgradeDescription.points.map((point, pIdx) => (
                  <div key={pIdx} className="flex items-start gap-3">
                    <span className="flex items-center justify-center w-6 h-6 mt-2 rounded bg-purple-100 text-purple-600 font-medium text-xs">
                      {pIdx + 1}
                    </span>
                    <div className="flex-1">
                      <Textarea
                        value={point}
                        onChange={(e) => handlePointChange(pIdx, e.target.value)}
                        placeholder={`Rule number ${pIdx + 1} details...`}
                        rows={2}
                      />
                    </div>
                    <Button
                      type="button"
                      variant="outline"
                      size="icon"
                      className="mt-2 text-destructive border-destructive/20 hover:bg-destructive/10"
                      onClick={() => removePoint(pIdx)}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* 3. FREQUENTLY ASKED QUESTIONS (FAQs) */}
      {activeSubTab === "faqs" && (
        <Card className="shadow-sm">
          <CardHeader>
            <div className="flex justify-between items-center">
              <div>
                <CardTitle>Frequently Asked Questions (FAQs)</CardTitle>
                <CardDescription>
                  Manage the dynamic Accordion FAQ list shown inside the Question block.
                </CardDescription>
              </div>
              <Button type="button" onClick={addFaq} className="flex items-center gap-1.5 bg-slate-900 text-white dark:bg-slate-100 dark:text-slate-900 hover:opacity-90">
                <Plus className="w-4 h-4" />
                Add FAQ Item
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            {formData.faqs.length === 0 ? (
              <div className="text-center py-12 text-slate-400">
                <HelpCircle className="w-12 h-12 mx-auto mb-3 opacity-30" />
                <p className="text-sm">No FAQ items defined. Click "Add FAQ Item" to create one.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {formData.faqs.map((faq, fIdx) => (
                  <div key={faq._id || fIdx} className="p-4 border rounded-xl bg-slate-50 dark:bg-slate-900/40 space-y-3">
                    <div className="flex justify-between items-center gap-4">
                      <span className="text-xs font-semibold text-purple-600 bg-purple-50 dark:bg-purple-950/40 px-2.5 py-1 rounded">
                        FAQ Question #{fIdx + 1}
                      </span>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="text-destructive hover:bg-destructive/10"
                        onClick={() => removeFaq(fIdx)}
                      >
                        <Trash2 className="w-4 h-4 mr-1" />
                        Remove Question
                      </Button>
                    </div>

                    <div className="space-y-3">
                      <div>
                        <Label className="text-xs text-slate-500">Question Text</Label>
                        <Input
                          value={faq.question}
                          onChange={(e) => handleFaqChange(fIdx, "question", e.target.value)}
                          placeholder="e.g. What is the VIP program?"
                        />
                      </div>
                      <div>
                        <Label className="text-xs text-slate-500">Answer Explanation</Label>
                        <Textarea
                          value={faq.answer}
                          onChange={(e) => handleFaqChange(fIdx, "answer", e.target.value)}
                          placeholder="Write a clear answer for members..."
                          rows={3}
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* 4. TERMS & CONDITIONS */}
      {activeSubTab === "terms" && (
        <Card className="shadow-sm">
          <CardHeader>
            <div className="flex justify-between items-center">
              <div>
                <CardTitle>Terms & Conditions (T&C)</CardTitle>
                <CardDescription>
                  Manage the bulleted Terms and Conditions list shown at the bottom of the VIP page.
                </CardDescription>
              </div>
              <Button type="button" onClick={addTerm} className="flex items-center gap-1.5 bg-slate-900 text-white dark:bg-slate-100 dark:text-slate-900 hover:opacity-90">
                <Plus className="w-4 h-4" />
                Add Term Line
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            {formData.termsAndConditions.length === 0 ? (
              <div className="text-center py-12 text-slate-400">
                <FileText className="w-12 h-12 mx-auto mb-3 opacity-30" />
                <p className="text-sm">No terms and conditions added yet. Click "Add Term Line" to write one.</p>
              </div>
            ) : (
              <div className="space-y-3">
                {formData.termsAndConditions.map((term, tIdx) => (
                  <div key={tIdx} className="flex items-start gap-3">
                    <span className="flex items-center justify-center w-6 h-6 mt-2 rounded bg-purple-50 text-purple-600 border border-purple-100 font-medium text-xs">
                      {tIdx + 1}
                    </span>
                    <div className="flex-1">
                      <Textarea
                        value={term}
                        onChange={(e) => handleTermChange(tIdx, e.target.value)}
                        placeholder={`Terms and condition line number ${tIdx + 1}...`}
                        rows={2}
                      />
                    </div>
                    <Button
                      type="button"
                      variant="outline"
                      size="icon"
                      className="mt-2 text-destructive border-destructive/20 hover:bg-destructive/10"
                      onClick={() => removeTerm(tIdx)}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
