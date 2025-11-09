"use client";

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";
import { Textarea } from "../../components/ui/textarea";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../../components/ui/card";
import { useCreateWithdrawMethod, UserInput } from "../../lib/queries";
import { toast } from "sonner";
import { Plus, Trash2, Upload, Save, ArrowLeft } from "lucide-react";

export default function AddWithdrawMethodPage() {
  const navigate = useNavigate();
  const createWithdrawMethod = useCreateWithdrawMethod();

  const [formData, setFormData] = useState({
    method_name_en: "",
    method_name_bd: "",
    min_withdrawal: "",
    max_withdrawal: "",
    processing_time: "",
    withdrawal_fee: "",
    fee_type: "fixed" as "fixed" | "percentage",
    text_color: "#000000",
    background_color: "#E2136E",
    button_color: "#E2136E",
    instruction_en: "",
    instruction_bd: "",
    status: "Active" as "Active" | "Inactive",
  });

  const [userInputs, setUserInputs] = useState<UserInput[]>([]);
  const [methodImage, setMethodImage] = useState<File | null>(null);
  const [withdrawalPageImage, setWithdrawalPageImage] = useState<File | null>(
    null
  );

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const addUserInput = () => {
    const newInput: UserInput = {
      name: "",
      type: "text",
      label_en: "",
      label_bd: "",
      isRequired: false,
      instruction_en: "",
      instruction_bd: "",
    };
    setUserInputs((prev) => [...prev, newInput]);
  };

  const updateUserInput = (
    index: number,
    field: keyof UserInput,
    value: string | boolean
  ) => {
    setUserInputs((prev) =>
      prev.map((input, i) =>
        i === index ? { ...input, [field]: value } : input
      )
    );
  };

  const removeUserInput = (index: number) => {
    setUserInputs((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const formDataToSend = new FormData();

    // Add form fields
    formDataToSend.append("method_name_en", formData.method_name_en);
    if (formData.method_name_bd)
      formDataToSend.append("method_name_bd", formData.method_name_bd);
    formDataToSend.append("min_withdrawal", formData.min_withdrawal);
    formDataToSend.append("max_withdrawal", formData.max_withdrawal);
    formDataToSend.append("processing_time", formData.processing_time);
    formDataToSend.append("withdrawal_fee", formData.withdrawal_fee);
    formDataToSend.append("fee_type", formData.fee_type);
    formDataToSend.append("text_color", formData.text_color);
    formDataToSend.append("background_color", formData.background_color);
    formDataToSend.append("button_color", formData.button_color);
    if (formData.instruction_en)
      formDataToSend.append("instruction_en", formData.instruction_en);
    if (formData.instruction_bd)
      formDataToSend.append("instruction_bd", formData.instruction_bd);
    formDataToSend.append("status", formData.status);

    // Add user inputs as JSON
    if (userInputs.length > 0) {
      formDataToSend.append("user_inputs", JSON.stringify(userInputs));
    }

    // Add images
    if (methodImage) {
      formDataToSend.append("method_image", methodImage);
    }
    if (withdrawalPageImage) {
      formDataToSend.append("withdrawal_page_image", withdrawalPageImage);
    }

    try {
      await createWithdrawMethod.mutateAsync(formDataToSend);
      toast.success("Withdraw method created successfully!");
      navigate("/dashboard/withdraw");
    } catch (error) {
      console.error("Withdraw method creation error:", error);
      const errorMessage =
        (error as { response?: { data?: { message?: string } } })?.response
          ?.data?.message || "Failed to create withdraw method";
      toast.error(errorMessage);
    }
  };

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="container mx-auto max-w-4xl">
        {/* Header */}
        <div className="mb-8">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate("/dashboard/withdraw")}
            className="flex items-center gap-2 mb-4"
          >
            <ArrowLeft className="h-4 w-4" />
            Back
          </Button>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
            Add Withdraw Method
          </h1>
        </div>

        {/* Main Form Card */}
        <Card className="glass-effect">
          <CardHeader>
            <CardTitle>Withdraw Method Details</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Basic Information */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-primary">
                  Basic Information
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="method_name_en">
                      Method Name (English) *
                    </Label>
                    <Input
                      id="method_name_en"
                      value={formData.method_name_en}
                      onChange={(e) =>
                        handleInputChange("method_name_en", e.target.value)
                      }
                      placeholder="bKash"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="method_name_bd">Method Name (Bangla)</Label>
                    <Input
                      id="method_name_bd"
                      value={formData.method_name_bd}
                      onChange={(e) =>
                        handleInputChange("method_name_bd", e.target.value)
                      }
                      placeholder="বিকাশ"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="min_withdrawal">Minimum Withdrawal *</Label>
                    <Input
                      id="min_withdrawal"
                      type="number"
                      value={formData.min_withdrawal}
                      onChange={(e) =>
                        handleInputChange("min_withdrawal", e.target.value)
                      }
                      placeholder="100"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="max_withdrawal">Maximum Withdrawal *</Label>
                    <Input
                      id="max_withdrawal"
                      type="number"
                      value={formData.max_withdrawal}
                      onChange={(e) =>
                        handleInputChange("max_withdrawal", e.target.value)
                      }
                      placeholder="50000"
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="processing_time">Processing Time *</Label>
                    <Input
                      id="processing_time"
                      value={formData.processing_time}
                      onChange={(e) =>
                        handleInputChange("processing_time", e.target.value)
                      }
                      placeholder="24 hours"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="status">Status</Label>
                    <select
                      id="status"
                      value={formData.status}
                      onChange={(e) =>
                        handleInputChange(
                          "status",
                          e.target.value as "Active" | "Inactive"
                        )
                      }
                      className="w-full h-10 px-3 bg-background border border-input rounded-md"
                    >
                      <option value="Active">Active</option>
                      <option value="Inactive">Inactive</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Withdrawal Fee */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-primary">
                  Withdrawal Fee
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="withdrawal_fee">Withdrawal Fee *</Label>
                    <Input
                      id="withdrawal_fee"
                      type="number"
                      value={formData.withdrawal_fee}
                      onChange={(e) =>
                        handleInputChange("withdrawal_fee", e.target.value)
                      }
                      placeholder="10"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="fee_type">Fee Type *</Label>
                    <select
                      id="fee_type"
                      value={formData.fee_type}
                      onChange={(e) =>
                        handleInputChange(
                          "fee_type",
                          e.target.value as "fixed" | "percentage"
                        )
                      }
                      className="w-full h-10 px-3 bg-background border border-input rounded-md"
                    >
                      <option value="fixed">Fixed Amount</option>
                      <option value="percentage">Percentage</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Images */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-primary">Images</h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="method_image">Method Image</Label>
                    <div className="border-2 border-dashed border-border rounded-lg p-4 text-center">
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) =>
                          setMethodImage(e.target.files?.[0] || null)
                        }
                        className="hidden"
                        id="method_image"
                      />
                      <label htmlFor="method_image" className="cursor-pointer">
                        <Upload className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
                        <p className="text-sm text-muted-foreground">
                          {methodImage
                            ? methodImage.name
                            : "Click to upload method image"}
                        </p>
                      </label>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="withdrawal_page_image">
                      Withdrawal Page Image
                    </Label>
                    <div className="border-2 border-dashed border-border rounded-lg p-4 text-center">
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) =>
                          setWithdrawalPageImage(e.target.files?.[0] || null)
                        }
                        className="hidden"
                        id="withdrawal_page_image"
                      />
                      <label
                        htmlFor="withdrawal_page_image"
                        className="cursor-pointer"
                      >
                        <Upload className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
                        <p className="text-sm text-muted-foreground">
                          {withdrawalPageImage
                            ? withdrawalPageImage.name
                            : "Click to upload page image"}
                        </p>
                      </label>
                    </div>
                  </div>
                </div>
              </div>

              {/* Colors */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-primary">
                  Color Settings
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="text_color">Text Color</Label>
                    <div className="flex gap-2">
                      <Input
                        id="text_color"
                        type="color"
                        value={formData.text_color}
                        onChange={(e) =>
                          handleInputChange("text_color", e.target.value)
                        }
                        className="w-20 h-10"
                      />
                      <Input
                        value={formData.text_color}
                        onChange={(e) =>
                          handleInputChange("text_color", e.target.value)
                        }
                        placeholder="#000000"
                        className="flex-1"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="background_color">Background Color</Label>
                    <div className="flex gap-2">
                      <Input
                        id="background_color"
                        type="color"
                        value={formData.background_color}
                        onChange={(e) =>
                          handleInputChange("background_color", e.target.value)
                        }
                        className="w-20 h-10"
                      />
                      <Input
                        value={formData.background_color}
                        onChange={(e) =>
                          handleInputChange("background_color", e.target.value)
                        }
                        placeholder="#E2136E"
                        className="flex-1"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="button_color">Button Color</Label>
                    <div className="flex gap-2">
                      <Input
                        id="button_color"
                        type="color"
                        value={formData.button_color}
                        onChange={(e) =>
                          handleInputChange("button_color", e.target.value)
                        }
                        className="w-20 h-10"
                      />
                      <Input
                        value={formData.button_color}
                        onChange={(e) =>
                          handleInputChange("button_color", e.target.value)
                        }
                        placeholder="#E2136E"
                        className="flex-1"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Instructions */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-primary">
                  Instructions
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="instruction_en">
                      Instruction (English)
                    </Label>
                    <Textarea
                      id="instruction_en"
                      value={formData.instruction_en}
                      onChange={(e) =>
                        handleInputChange("instruction_en", e.target.value)
                      }
                      placeholder="Enter account number"
                      rows={3}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="instruction_bd">Instruction (Bangla)</Label>
                    <Textarea
                      id="instruction_bd"
                      value={formData.instruction_bd}
                      onChange={(e) =>
                        handleInputChange("instruction_bd", e.target.value)
                      }
                      placeholder="অ্যাকাউন্ট নম্বর লিখুন"
                      rows={3}
                    />
                  </div>
                </div>
              </div>

              {/* User Inputs */}
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-semibold text-primary">
                    User Input Fields
                  </h3>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={addUserInput}
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Add Field
                  </Button>
                </div>

                {userInputs.map((input, index) => (
                  <Card key={index} className="p-4 bg-muted/50">
                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <h4 className="font-medium">Field {index + 1}</h4>
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => removeUserInput(index)}
                        >
                          <Trash2 className="h-4 w-4 text-red-600" />
                        </Button>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        <div className="space-y-2">
                          <Label>Field Name *</Label>
                          <Input
                            value={input.name}
                            onChange={(e) =>
                              updateUserInput(index, "name", e.target.value)
                            }
                            placeholder="account_number"
                            required
                          />
                        </div>

                        <div className="space-y-2">
                          <Label>Field Type *</Label>
                          <select
                            value={input.type}
                            onChange={(e) =>
                              updateUserInput(index, "type", e.target.value)
                            }
                            className="w-full h-10 px-3 bg-background border border-input rounded-md"
                          >
                            <option value="text">Text</option>
                            <option value="number">Number</option>
                            <option value="email">Email</option>
                            <option value="tel">Phone</option>
                          </select>
                        </div>

                        <div className="space-y-2">
                          <Label>Label (English) *</Label>
                          <Input
                            value={input.label_en}
                            onChange={(e) =>
                              updateUserInput(index, "label_en", e.target.value)
                            }
                            placeholder="Account Number"
                            required
                          />
                        </div>

                        <div className="space-y-2">
                          <Label>Label (Bangla)</Label>
                          <Input
                            value={input.label_bd}
                            onChange={(e) =>
                              updateUserInput(index, "label_bd", e.target.value)
                            }
                            placeholder="অ্যাকাউন্ট নম্বর"
                          />
                        </div>

                        <div className="space-y-2">
                          <Label>Instruction (English)</Label>
                          <Input
                            value={input.instruction_en || ""}
                            onChange={(e) =>
                              updateUserInput(
                                index,
                                "instruction_en",
                                e.target.value
                              )
                            }
                            placeholder="Enter 11 digit number"
                          />
                        </div>

                        <div className="space-y-2">
                          <Label>Instruction (Bangla)</Label>
                          <Input
                            value={input.instruction_bd || ""}
                            onChange={(e) =>
                              updateUserInput(
                                index,
                                "instruction_bd",
                                e.target.value
                              )
                            }
                            placeholder="১১ সংখ্যার নম্বর লিখুন"
                          />
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          id={`required-${index}`}
                          checked={input.isRequired}
                          onChange={(e) =>
                            updateUserInput(
                              index,
                              "isRequired",
                              e.target.checked
                            )
                          }
                          className="w-4 h-4"
                        />
                        <Label htmlFor={`required-${index}`}>
                          Required Field
                        </Label>
                      </div>
                    </div>
                  </Card>
                ))}

                {userInputs.length === 0 && (
                  <p className="text-sm text-muted-foreground text-center py-4">
                    No user input fields added yet. Click "Add Field" to create
                    one.
                  </p>
                )}
              </div>

              {/* Action Buttons */}
              <div className="flex justify-end gap-4 pt-6 border-t border-border">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => navigate("/dashboard/withdraw")}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={createWithdrawMethod.isPending}
                  className="gradient-primary"
                >
                  <Save className="h-4 w-4 mr-2" />
                  {createWithdrawMethod.isPending
                    ? "Creating..."
                    : "Create Withdraw Method"}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
