import React, { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../../components/ui/card";
import { Breadcrumb } from "../../components/ui/breadcrumb";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";
import { API_BASE_URL } from "../../config/api";
import { Trash2, Plus, Image as ImageIcon } from "lucide-react";

interface Slide {
  titleEn: string;
  titleBn: string;
  subtitleEn: string;
  subtitleBn: string;
  image: string;
  order: number;
}

interface Feature {
  titleEn: string;
  titleBn: string;
  descriptionEn: string;
  descriptionBn: string;
  order: number;
}

interface CommissionCard {
  percentageEn: string;
  percentageBn: string;
  titleEn: string;
  titleBn: string;
  buttonTextEn: string;
  buttonTextBn: string;
}

interface CommissionLevel {
  levelEn: string;
  levelBn: string;
  depositEn: string;
  depositBn: string;
  commissionEn: string;
  commissionBn: string;
  bonusEn: string;
  bonusBn: string;
  statusEn: string;
  statusBn: string;
  dailyBonusEn: string;
  dailyBonusBn: string;
  order: number;
}

interface FooterLink {
  labelEn: string;
  labelBn: string;
  url: string;
  order: number;
}

interface FooterSocial {
  platform: string;
  icon: string;
  url: string;
  order: number;
}

interface AffiliateContent {
  _id?: string;
  slides: Slide[];
  bannerText: {
    textEn: string;
    textBn: string;
  };
  features: Feature[];
  commissionCard: CommissionCard;
  commissionLevels: CommissionLevel[];
  mainTitleEn: string;
  mainTitleBn: string;
  mainDescriptionEn: string;
  mainDescriptionBn: string;
  footerAboutEn: string;
  footerAboutBn: string;
  footerLinks: FooterLink[];
  footerSocial: FooterSocial[];
  footerCopyrightEn: string;
  footerCopyrightBn: string;
}

export function AffiliateContentPage() {
  const [content, setContent] = useState<AffiliateContent | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [activeTab, setActiveTab] = useState<
    "banner" | "slides" | "features" | "commission" | "main" | "footer"
  >("slides");
  const [newSlide, setNewSlide] = useState<Slide & { imageFile?: File }>({
    titleEn: "",
    titleBn: "",
    subtitleEn: "",
    subtitleBn: "",
    image: "",
    order: 0,
  });
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [editingLevelIndex, setEditingLevelIndex] = useState<number | null>(
    null,
  );
  const [editingLevel, setEditingLevel] = useState<CommissionLevel | null>(
    null,
  );
  const [editingFeatureIndex, setEditingFeatureIndex] = useState<number | null>(
    null,
  );
  const [editingFeature, setEditingFeature] = useState<Feature | null>(null);

  useEffect(() => {
    fetchContent();
  }, []);

  const fetchContent = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/affiliate-content`);
      const data = await response.json();
      if (data.success) {
        setContent(data.data);
      }
    } catch (error) {
      console.error("Error fetching content:", error);
    } finally {
      setLoading(false);
    }
  };

  const saveContent = async () => {
    if (!content) return;
    setSaving(true);
    try {
      const token = localStorage.getItem("authToken");
      const response = await fetch(`${API_BASE_URL}/api/affiliate-content`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(content),
      });
      const data = await response.json();
      if (data.success) {
        alert("Content saved successfully!");
        setContent(data.data);
      }
    } catch (error) {
      console.error("Error saving content:", error);
      alert("Error saving content");
    } finally {
      setSaving(false);
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setNewSlide({ ...newSlide, imageFile: file });
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
    }
  };

  const addSlide = async () => {
    if (
      !newSlide.titleEn ||
      !newSlide.titleBn ||
      !newSlide.subtitleEn ||
      !newSlide.subtitleBn ||
      !newSlide.imageFile
    ) {
      alert("Please fill all fields and select an image");
      return;
    }

    try {
      const token = localStorage.getItem("authToken");
      const formData = new FormData();
      formData.append("titleEn", newSlide.titleEn);
      formData.append("titleBn", newSlide.titleBn);
      formData.append("subtitleEn", newSlide.subtitleEn);
      formData.append("subtitleBn", newSlide.subtitleBn);
      formData.append("image", newSlide.imageFile);

      const response = await fetch(
        `${API_BASE_URL}/api/affiliate-content/slides`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: formData,
        },
      );
      const data = await response.json();
      if (data.success) {
        setContent(data.data);
        setNewSlide({
          titleEn: "",
          titleBn: "",
          subtitleEn: "",
          subtitleBn: "",
          image: "",
          order: 0,
        });
        setPreviewUrl(null);
        alert("Slide added successfully!");
      }
    } catch (error) {
      console.error("Error adding slide:", error);
      alert("Error adding slide");
    }
  };

  const deleteSlide = async (index: number) => {
    if (!window.confirm("Are you sure you want to delete this slide?")) return;

    try {
      const token = localStorage.getItem("authToken");
      const response = await fetch(
        `${API_BASE_URL}/api/affiliate-content/slides/${index}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );
      const data = await response.json();
      if (data.success) {
        setContent(data.data);
        alert("Slide deleted successfully!");
      }
    } catch (error) {
      console.error("Error deleting slide:", error);
      alert("Error deleting slide");
    }
  };

  if (loading) {
    return <div className="p-6">Loading...</div>;
  }

  if (!content) {
    return <div className="p-6">No content found</div>;
  }

  return (
    <div className="p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        <Breadcrumb items={[{ label: "Affiliate Content" }]} />

        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold text-white">
            Affiliate Content Management
          </h1>
          <Button
            onClick={saveContent}
            disabled={saving}
            className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white"
          >
            {saving ? "Saving..." : "Save All Changes"}
          </Button>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 border-b border-purple-500/20">
          {["banner", "slides", "features", "commission", "main", "footer"].map(
            (tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab as any)}
                className={`px-4 py-3 font-semibold capitalize transition-all ${
                  activeTab === tab
                    ? "border-b-2 border-purple-600 text-purple-400"
                    : "text-gray-400 hover:text-gray-300"
                }`}
              >
                {tab}
              </button>
            ),
          )}
        </div>

        {/* Slides Tab */}
        {activeTab === "slides" && (
          <div className="space-y-6">
            {/* Add New Slide Card */}
            <Card className="bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 border-purple-500/20">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <Plus className="w-5 h-5" />
                  Add New Slide
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label className="text-gray-300">Title (English)</Label>
                    <Input
                      placeholder="e.g., IPL Exclusive"
                      value={newSlide.titleEn}
                      onChange={(e) =>
                        setNewSlide({ ...newSlide, titleEn: e.target.value })
                      }
                      className="bg-slate-800 border-purple-500/30 text-white placeholder-gray-500 focus:border-purple-500"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-gray-300">Title (Bangla)</Label>
                    <Input
                      placeholder="e.g., IPL এক্সক্লুসিভ"
                      value={newSlide.titleBn}
                      onChange={(e) =>
                        setNewSlide({ ...newSlide, titleBn: e.target.value })
                      }
                      className="bg-slate-800 border-purple-500/30 text-white placeholder-gray-500 focus:border-purple-500"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-gray-300">Subtitle (English)</Label>
                    <Input
                      placeholder="e.g., 250% Daily Sports Bonus"
                      value={newSlide.subtitleEn}
                      onChange={(e) =>
                        setNewSlide({ ...newSlide, subtitleEn: e.target.value })
                      }
                      className="bg-slate-800 border-purple-500/30 text-white placeholder-gray-500 focus:border-purple-500"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-gray-300">Subtitle (Bangla)</Label>
                    <Input
                      placeholder="e.g., २५०% দৈনিক স্পোর্টস বোনাস"
                      value={newSlide.subtitleBn}
                      onChange={(e) =>
                        setNewSlide({ ...newSlide, subtitleBn: e.target.value })
                      }
                      className="bg-slate-800 border-purple-500/30 text-white placeholder-gray-500 focus:border-purple-500"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label className="text-gray-300 flex items-center gap-2">
                    <ImageIcon className="w-4 h-4" />
                    Upload Image
                  </Label>
                  <Input
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="bg-slate-800 border-purple-500/30 text-gray-300 file:bg-purple-600 file:text-white file:border-0 file:rounded file:px-3 file:py-1 cursor-pointer"
                  />
                  {previewUrl && (
                    <div className="mt-3">
                      <img
                        src={previewUrl}
                        alt="Preview"
                        className="w-full h-40 object-cover rounded-lg border border-purple-500/30"
                      />
                    </div>
                  )}
                </div>

                <Button
                  onClick={addSlide}
                  className="w-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white font-semibold"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Add Slide
                </Button>
              </CardContent>
            </Card>

            {/* Existing Slides */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-white">
                Existing Slides
              </h3>
              {content.slides.map((slide, index) => (
                <Card
                  key={index}
                  className="bg-gradient-to-br from-slate-900 via-purple-900/50 to-slate-900 border-purple-500/20"
                >
                  <CardContent className="pt-6">
                    <div className="grid grid-cols-2 gap-4 mb-4">
                      <div>
                        <p className="text-sm text-gray-400">Title (EN)</p>
                        <p className="font-semibold text-white">
                          {slide.titleEn}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-400">Title (BN)</p>
                        <p className="font-semibold text-white">
                          {slide.titleBn}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-400">Subtitle (EN)</p>
                        <p className="text-sm text-gray-300">
                          {slide.subtitleEn}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-400">Subtitle (BN)</p>
                        <p className="text-sm text-gray-300">
                          {slide.subtitleBn}
                        </p>
                      </div>
                    </div>
                    {slide.image && (
                      <div className="mb-4">
                        <img
                          src={`http://localhost:8000${slide.image}`}
                          alt={slide.titleEn}
                          className="w-full h-32 object-cover rounded-lg border border-purple-500/30"
                        />
                      </div>
                    )}
                    <Button
                      onClick={() => deleteSlide(index)}
                      className="w-full bg-red-600/20 hover:bg-red-600/30 text-red-400 border border-red-500/30"
                    >
                      <Trash2 className="w-4 h-4 mr-2" />
                      Delete Slide
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* Banner Tab */}
        {activeTab === "banner" && (
          <Card className="bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 border-purple-500/20">
            <CardHeader>
              <CardTitle className="text-white">
                Scrolling Banner Text
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label className="text-gray-300">English Text</Label>
                <textarea
                  value={content.bannerText.textEn}
                  onChange={(e) =>
                    setContent({
                      ...content,
                      bannerText: {
                        ...content.bannerText,
                        textEn: e.target.value,
                      },
                    })
                  }
                  className="w-full px-3 py-2 bg-slate-800 border border-purple-500/30 rounded-lg text-white placeholder-gray-500 focus:border-purple-500 focus:outline-none"
                  rows={3}
                />
              </div>
              <div>
                <Label className="text-gray-300">Bangla Text</Label>
                <textarea
                  value={content.bannerText.textBn}
                  onChange={(e) =>
                    setContent({
                      ...content,
                      bannerText: {
                        ...content.bannerText,
                        textBn: e.target.value,
                      },
                    })
                  }
                  className="w-full px-3 py-2 bg-slate-800 border border-purple-500/30 rounded-lg text-white placeholder-gray-500 focus:border-purple-500 focus:outline-none"
                  rows={3}
                />
              </div>
            </CardContent>
          </Card>
        )}

        {/* Features Tab */}
        {activeTab === "features" && (
          <div className="space-y-6">
            {/* Features List */}
            <div className="space-y-4">
              {content.features?.map((feature, index) => (
                <Card
                  key={index}
                  className="bg-gradient-to-br from-slate-900 via-purple-900/50 to-slate-900 border-purple-500/20"
                >
                  <CardContent className="pt-6 space-y-4">
                    <div className="flex justify-between items-start mb-4">
                      <h3 className="text-white font-semibold">
                        Feature {index + 1}
                      </h3>
                      <button
                        onClick={() => {
                          const newFeatures = content.features.filter(
                            (_, i) => i !== index,
                          );
                          setContent({ ...content, features: newFeatures });
                        }}
                        className="text-red-400 hover:text-red-300"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label className="text-gray-300">Title (EN)</Label>
                        <Input
                          value={feature.titleEn}
                          onChange={(e) => {
                            const updatedFeatures = [...content.features];
                            updatedFeatures[index].titleEn = e.target.value;
                            setContent({
                              ...content,
                              features: updatedFeatures,
                            });
                          }}
                          className="bg-slate-800 border-purple-500/30 text-white"
                          placeholder="e.g., Easy Commission"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label className="text-gray-300">Title (BN)</Label>
                        <Input
                          value={feature.titleBn}
                          onChange={(e) => {
                            const updatedFeatures = [...content.features];
                            updatedFeatures[index].titleBn = e.target.value;
                            setContent({
                              ...content,
                              features: updatedFeatures,
                            });
                          }}
                          className="bg-slate-800 border-purple-500/30 text-white"
                          placeholder="e.g., সহজ কমিশন"
                        />
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label className="text-gray-300">
                          Description (EN)
                        </Label>
                        <textarea
                          value={feature.descriptionEn}
                          onChange={(e) => {
                            const updatedFeatures = [...content.features];
                            updatedFeatures[index].descriptionEn =
                              e.target.value;
                            setContent({
                              ...content,
                              features: updatedFeatures,
                            });
                          }}
                          className="bg-slate-800 border-purple-500/30 text-white rounded px-3 py-2 min-h-24"
                          placeholder="Enter description in English"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label className="text-gray-300">
                          Description (BN)
                        </Label>
                        <textarea
                          value={feature.descriptionBn}
                          onChange={(e) => {
                            const updatedFeatures = [...content.features];
                            updatedFeatures[index].descriptionBn =
                              e.target.value;
                            setContent({
                              ...content,
                              features: updatedFeatures,
                            });
                          }}
                          className="bg-slate-800 border-purple-500/30 text-white rounded px-3 py-2 min-h-24"
                          placeholder="বাংলায় বর্ণনা লিখুন"
                        />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Add New Feature Button */}
            <Button
              onClick={() => {
                const newFeature: Feature = {
                  titleEn: "",
                  titleBn: "",
                  descriptionEn: "",
                  descriptionBn: "",
                  order: content.features.length + 1,
                };
                setContent({
                  ...content,
                  features: [...content.features, newFeature],
                });
              }}
              className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white w-full"
            >
              <Plus className="w-4 h-4 mr-2" />
              Add New Feature
            </Button>
          </div>
        )}

        {/* Commission Tab */}
        {activeTab === "commission" && (
          <div className="space-y-6">
            {/* Commission Card Section */}
            <Card className="bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 border-purple-500/20">
              <CardHeader>
                <CardTitle className="text-white">Commission Card</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-gray-300">Percentage (EN)</Label>
                    <Input
                      value={content.commissionCard.percentageEn}
                      onChange={(e) =>
                        setContent({
                          ...content,
                          commissionCard: {
                            ...content.commissionCard,
                            percentageEn: e.target.value,
                          },
                        })
                      }
                      className="bg-slate-800 border-purple-500/30 text-white"
                    />
                  </div>
                  <div>
                    <Label className="text-gray-300">Percentage (BN)</Label>
                    <Input
                      value={content.commissionCard.percentageBn}
                      onChange={(e) =>
                        setContent({
                          ...content,
                          commissionCard: {
                            ...content.commissionCard,
                            percentageBn: e.target.value,
                          },
                        })
                      }
                      className="bg-slate-800 border-purple-500/30 text-white"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Commission Levels Section */}
            <Card className="bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 border-purple-500/20">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <Plus className="w-5 h-5" />
                  Commission Levels
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Commission Levels Table */}
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-purple-500/30">
                        <th className="text-left py-2 px-3 text-gray-300">
                          Level (EN)
                        </th>
                        <th className="text-left py-2 px-3 text-gray-300">
                          Level (BN)
                        </th>
                        <th className="text-left py-2 px-3 text-gray-300">
                          Commission
                        </th>
                        <th className="text-left py-2 px-3 text-gray-300">
                          Status
                        </th>
                        <th className="text-left py-2 px-3 text-gray-300">
                          Action
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {content.commissionLevels?.map((level, index) => (
                        <tr
                          key={index}
                          className="border-b border-purple-500/20 hover:bg-purple-500/10"
                        >
                          <td className="py-3 px-3 text-white">
                            {level.levelEn}
                          </td>
                          <td className="py-3 px-3 text-white">
                            {level.levelBn}
                          </td>
                          <td className="py-3 px-3 text-white">
                            {level.commissionEn}
                          </td>
                          <td className="py-3 px-3 text-white">
                            {level.statusEn}
                          </td>
                          <td className="py-3 px-3">
                            <button
                              onClick={() => {
                                setEditingLevelIndex(index);
                                setEditingLevel(level);
                              }}
                              className="text-purple-400 hover:text-purple-300 mr-3"
                            >
                              Edit
                            </button>
                            <button
                              onClick={() => {
                                const newLevels =
                                  content.commissionLevels.filter(
                                    (_, i) => i !== index,
                                  );
                                setContent({
                                  ...content,
                                  commissionLevels: newLevels,
                                });
                              }}
                              className="text-red-400 hover:text-red-300"
                            >
                              Delete
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Edit/Add Commission Level Form */}
                {editingLevel && (
                  <div className="bg-slate-800/50 p-4 rounded-lg space-y-4 border border-purple-500/20">
                    <h3 className="text-white font-semibold">
                      {editingLevelIndex !== null
                        ? "Edit Commission Level"
                        : "Add Commission Level"}
                    </h3>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label className="text-gray-300">Level (EN)</Label>
                        <Input
                          value={editingLevel.levelEn}
                          onChange={(e) =>
                            setEditingLevel({
                              ...editingLevel,
                              levelEn: e.target.value,
                            })
                          }
                          className="bg-slate-800 border-purple-500/30 text-white"
                          placeholder="e.g., Level 1"
                        />
                      </div>
                      <div>
                        <Label className="text-gray-300">Level (BN)</Label>
                        <Input
                          value={editingLevel.levelBn}
                          onChange={(e) =>
                            setEditingLevel({
                              ...editingLevel,
                              levelBn: e.target.value,
                            })
                          }
                          className="bg-slate-800 border-purple-500/30 text-white"
                          placeholder="e.g., লেভেল ১"
                        />
                      </div>
                      <div>
                        <Label className="text-gray-300">Deposit (EN)</Label>
                        <Input
                          value={editingLevel.depositEn}
                          onChange={(e) =>
                            setEditingLevel({
                              ...editingLevel,
                              depositEn: e.target.value,
                            })
                          }
                          className="bg-slate-800 border-purple-500/30 text-white"
                          placeholder="e.g., 5 - 10 Thousand"
                        />
                      </div>
                      <div>
                        <Label className="text-gray-300">Deposit (BN)</Label>
                        <Input
                          value={editingLevel.depositBn}
                          onChange={(e) =>
                            setEditingLevel({
                              ...editingLevel,
                              depositBn: e.target.value,
                            })
                          }
                          className="bg-slate-800 border-purple-500/30 text-white"
                          placeholder="e.g., ৫ - ১০ হাজার"
                        />
                      </div>
                      <div>
                        <Label className="text-gray-300">Commission (EN)</Label>
                        <Input
                          value={editingLevel.commissionEn}
                          onChange={(e) =>
                            setEditingLevel({
                              ...editingLevel,
                              commissionEn: e.target.value,
                            })
                          }
                          className="bg-slate-800 border-purple-500/30 text-white"
                          placeholder="e.g., 25%"
                        />
                      </div>
                      <div>
                        <Label className="text-gray-300">Commission (BN)</Label>
                        <Input
                          value={editingLevel.commissionBn}
                          onChange={(e) =>
                            setEditingLevel({
                              ...editingLevel,
                              commissionBn: e.target.value,
                            })
                          }
                          className="bg-slate-800 border-purple-500/30 text-white"
                          placeholder="e.g., २५%"
                        />
                      </div>
                      <div>
                        <Label className="text-gray-300">Bonus (EN)</Label>
                        <Input
                          value={editingLevel.bonusEn}
                          onChange={(e) =>
                            setEditingLevel({
                              ...editingLevel,
                              bonusEn: e.target.value,
                            })
                          }
                          className="bg-slate-800 border-purple-500/30 text-white"
                          placeholder="e.g., 5%"
                        />
                      </div>
                      <div>
                        <Label className="text-gray-300">Bonus (BN)</Label>
                        <Input
                          value={editingLevel.bonusBn}
                          onChange={(e) =>
                            setEditingLevel({
                              ...editingLevel,
                              bonusBn: e.target.value,
                            })
                          }
                          className="bg-slate-800 border-purple-500/30 text-white"
                          placeholder="e.g., ५%"
                        />
                      </div>
                      <div>
                        <Label className="text-gray-300">Status (EN)</Label>
                        <Input
                          value={editingLevel.statusEn}
                          onChange={(e) =>
                            setEditingLevel({
                              ...editingLevel,
                              statusEn: e.target.value,
                            })
                          }
                          className="bg-slate-800 border-purple-500/30 text-white"
                          placeholder="e.g., Regular Affiliate"
                        />
                      </div>
                      <div>
                        <Label className="text-gray-300">Status (BN)</Label>
                        <Input
                          value={editingLevel.statusBn}
                          onChange={(e) =>
                            setEditingLevel({
                              ...editingLevel,
                              statusBn: e.target.value,
                            })
                          }
                          className="bg-slate-800 border-purple-500/30 text-white"
                          placeholder="e.g., সাধারণ এফিলিয়েট"
                        />
                      </div>
                      <div>
                        <Label className="text-gray-300">
                          Daily Bonus (EN)
                        </Label>
                        <Input
                          value={editingLevel.dailyBonusEn}
                          onChange={(e) =>
                            setEditingLevel({
                              ...editingLevel,
                              dailyBonusEn: e.target.value,
                            })
                          }
                          className="bg-slate-800 border-purple-500/30 text-white"
                          placeholder="e.g., 25%"
                        />
                      </div>
                      <div>
                        <Label className="text-gray-300">
                          Daily Bonus (BN)
                        </Label>
                        <Input
                          value={editingLevel.dailyBonusBn}
                          onChange={(e) =>
                            setEditingLevel({
                              ...editingLevel,
                              dailyBonusBn: e.target.value,
                            })
                          }
                          className="bg-slate-800 border-purple-500/30 text-white"
                          placeholder="e.g., २५%"
                        />
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        onClick={() => {
                          if (editingLevelIndex !== null) {
                            const newLevels = [...content.commissionLevels];
                            newLevels[editingLevelIndex] = editingLevel;
                            setContent({
                              ...content,
                              commissionLevels: newLevels,
                            });
                          } else {
                            setContent({
                              ...content,
                              commissionLevels: [
                                ...content.commissionLevels,
                                editingLevel,
                              ],
                            });
                          }
                          setEditingLevel(null);
                          setEditingLevelIndex(null);
                        }}
                        className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white"
                      >
                        {editingLevelIndex !== null ? "Update" : "Add"} Level
                      </Button>
                      <Button
                        onClick={() => {
                          setEditingLevel(null);
                          setEditingLevelIndex(null);
                        }}
                        className="bg-slate-700 hover:bg-slate-600 text-white"
                      >
                        Cancel
                      </Button>
                    </div>
                  </div>
                )}

                {/* Add New Level Button */}
                {!editingLevel && (
                  <Button
                    onClick={() => {
                      setEditingLevel({
                        levelEn: "",
                        levelBn: "",
                        depositEn: "",
                        depositBn: "",
                        commissionEn: "",
                        commissionBn: "",
                        bonusEn: "",
                        bonusBn: "",
                        statusEn: "",
                        statusBn: "",
                        dailyBonusEn: "",
                        dailyBonusBn: "",
                        order: content.commissionLevels.length + 1,
                      });
                    }}
                    className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Add New Commission Level
                  </Button>
                )}
              </CardContent>
            </Card>
          </div>
        )}

        {/* Main Tab */}
        {activeTab === "main" && (
          <Card className="bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 border-purple-500/20">
            <CardHeader>
              <CardTitle className="text-white">Main Section</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label className="text-gray-300">Title (EN)</Label>
                <Input
                  value={content.mainTitleEn}
                  onChange={(e) =>
                    setContent({ ...content, mainTitleEn: e.target.value })
                  }
                  className="bg-slate-800 border-purple-500/30 text-white"
                />
              </div>
              <div>
                <Label className="text-gray-300">Title (BN)</Label>
                <Input
                  value={content.mainTitleBn}
                  onChange={(e) =>
                    setContent({ ...content, mainTitleBn: e.target.value })
                  }
                  className="bg-slate-800 border-purple-500/30 text-white"
                />
              </div>
            </CardContent>
          </Card>
        )}

        {/* Footer Tab */}
        {activeTab === "footer" && (
          <div className="space-y-6">
            {/* Footer About Section */}
            <Card className="bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 border-purple-500/20">
              <CardHeader>
                <CardTitle className="text-white">
                  Footer About Section
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label className="text-gray-300">About Text (EN)</Label>
                  <textarea
                    value={content.footerAboutEn}
                    onChange={(e) =>
                      setContent({ ...content, footerAboutEn: e.target.value })
                    }
                    className="w-full bg-slate-800 border-purple-500/30 text-white rounded px-3 py-2 min-h-24 border"
                    placeholder="Enter footer about text in English"
                  />
                </div>
                <div>
                  <Label className="text-gray-300">About Text (BN)</Label>
                  <textarea
                    value={content.footerAboutBn}
                    onChange={(e) =>
                      setContent({ ...content, footerAboutBn: e.target.value })
                    }
                    className="w-full bg-slate-800 border-purple-500/30 text-white rounded px-3 py-2 min-h-24 border"
                    placeholder="বাংলায় ফুটার সম্পর্কে লিখুন"
                  />
                </div>
              </CardContent>
            </Card>

            {/* Footer Links Section */}
            <Card className="bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 border-purple-500/20">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <Plus className="w-5 h-5" />
                  Footer Links
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {content.footerLinks?.map((link, index) => (
                  <div
                    key={index}
                    className="bg-slate-800/50 p-4 rounded-lg space-y-3 border border-purple-500/20"
                  >
                    <div className="flex justify-between items-center mb-3">
                      <h4 className="text-white font-semibold">
                        Link {index + 1}
                      </h4>
                      <button
                        onClick={() => {
                          const newLinks = content.footerLinks.filter(
                            (_, i) => i !== index,
                          );
                          setContent({ ...content, footerLinks: newLinks });
                        }}
                        className="text-red-400 hover:text-red-300"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <Label className="text-gray-300 text-sm">
                          Label (EN)
                        </Label>
                        <Input
                          value={link.labelEn}
                          onChange={(e) => {
                            const newLinks = [...content.footerLinks];
                            newLinks[index].labelEn = e.target.value;
                            setContent({ ...content, footerLinks: newLinks });
                          }}
                          className="bg-slate-800 border-purple-500/30 text-white text-sm"
                          placeholder="e.g., Privacy"
                        />
                      </div>
                      <div>
                        <Label className="text-gray-300 text-sm">
                          Label (BN)
                        </Label>
                        <Input
                          value={link.labelBn}
                          onChange={(e) => {
                            const newLinks = [...content.footerLinks];
                            newLinks[index].labelBn = e.target.value;
                            setContent({ ...content, footerLinks: newLinks });
                          }}
                          className="bg-slate-800 border-purple-500/30 text-white text-sm"
                          placeholder="e.g., প্রাইভেসি"
                        />
                      </div>
                    </div>
                    <div>
                      <Label className="text-gray-300 text-sm">URL</Label>
                      <Input
                        value={link.url}
                        onChange={(e) => {
                          const newLinks = [...content.footerLinks];
                          newLinks[index].url = e.target.value;
                          setContent({ ...content, footerLinks: newLinks });
                        }}
                        className="bg-slate-800 border-purple-500/30 text-white text-sm"
                        placeholder="e.g., https://example.com/privacy"
                      />
                    </div>
                  </div>
                ))}
                <Button
                  onClick={() => {
                    setContent({
                      ...content,
                      footerLinks: [
                        ...content.footerLinks,
                        {
                          labelEn: "",
                          labelBn: "",
                          url: "",
                          order: content.footerLinks.length + 1,
                        },
                      ],
                    });
                  }}
                  className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white w-full"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Add Footer Link
                </Button>
              </CardContent>
            </Card>

            {/* Footer Social Section */}
            <Card className="bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 border-purple-500/20">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <Plus className="w-5 h-5" />
                  Footer Social Links
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {content.footerSocial?.map((social, index) => (
                  <div
                    key={index}
                    className="bg-slate-800/50 p-4 rounded-lg space-y-3 border border-purple-500/20"
                  >
                    <div className="flex justify-between items-center mb-3">
                      <h4 className="text-white font-semibold">
                        Social {index + 1}
                      </h4>
                      <button
                        onClick={() => {
                          const newSocial = content.footerSocial.filter(
                            (_, i) => i !== index,
                          );
                          setContent({ ...content, footerSocial: newSocial });
                        }}
                        className="text-red-400 hover:text-red-300"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <Label className="text-gray-300 text-sm">
                          Platform
                        </Label>
                        <Input
                          value={social.platform}
                          onChange={(e) => {
                            const newSocial = [...content.footerSocial];
                            newSocial[index].platform = e.target.value;
                            setContent({ ...content, footerSocial: newSocial });
                          }}
                          className="bg-slate-800 border-purple-500/30 text-white text-sm"
                          placeholder="e.g., Facebook"
                        />
                      </div>
                      <div>
                        <Label className="text-gray-300 text-sm">Icon</Label>
                        <Input
                          value={social.icon}
                          onChange={(e) => {
                            const newSocial = [...content.footerSocial];
                            newSocial[index].icon = e.target.value;
                            setContent({ ...content, footerSocial: newSocial });
                          }}
                          className="bg-slate-800 border-purple-500/30 text-white text-sm"
                          placeholder="e.g., Facebook"
                        />
                      </div>
                    </div>
                    <div>
                      <Label className="text-gray-300 text-sm">URL</Label>
                      <Input
                        value={social.url}
                        onChange={(e) => {
                          const newSocial = [...content.footerSocial];
                          newSocial[index].url = e.target.value;
                          setContent({ ...content, footerSocial: newSocial });
                        }}
                        className="bg-slate-800 border-purple-500/30 text-white text-sm"
                        placeholder="e.g., https://facebook.com/yourpage"
                      />
                    </div>
                  </div>
                ))}
                <Button
                  onClick={() => {
                    setContent({
                      ...content,
                      footerSocial: [
                        ...content.footerSocial,
                        {
                          platform: "",
                          url: "",
                          icon: "",
                          order: content.footerSocial.length + 1,
                        },
                      ],
                    });
                  }}
                  className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white w-full"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Add Social Link
                </Button>
              </CardContent>
            </Card>

            {/* Footer Copyright Section */}
            <Card className="bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 border-purple-500/20">
              <CardHeader>
                <CardTitle className="text-white">Footer Copyright</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label className="text-gray-300">Copyright Text (EN)</Label>
                  <Input
                    value={content.footerCopyrightEn}
                    onChange={(e) =>
                      setContent({
                        ...content,
                        footerCopyrightEn: e.target.value,
                      })
                    }
                    className="bg-slate-800 border-purple-500/30 text-white"
                    placeholder="e.g., Copyright © 2025. All rights reserved"
                  />
                </div>
                <div>
                  <Label className="text-gray-300">Copyright Text (BN)</Label>
                  <Input
                    value={content.footerCopyrightBn}
                    onChange={(e) =>
                      setContent({
                        ...content,
                        footerCopyrightBn: e.target.value,
                      })
                    }
                    className="bg-slate-800 border-purple-500/30 text-white"
                    placeholder="e.g., কপিরাইট © २०२५। সর্বাধিকার সংরক্ষিত"
                  />
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}
