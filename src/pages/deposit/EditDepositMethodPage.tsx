"use client";

import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
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
import { Badge } from "../../components/ui/badge";
import {
  usePaymentMethod,
  useUpdatePaymentMethod,
  UserInput,
} from "../../lib/queries";
import { toast } from "sonner";
import { Plus, Trash2, Upload, X, Save, ArrowLeft } from "lucide-react";

export default function EditDepositMethodPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { data: paymentMethod, isLoading } = usePaymentMethod(id!);
  const updatePaymentMethod = useUpdatePaymentMethod();

  const [formData, setFormData] = useState({
    method_name_en: "",
    method_name_bd: "",
    agent_wallet_number: "",
    agent_wallet_text: "",
    gateways: [] as string[],
    text_color: "#000000",
    background_color: "#ffffff",
    button_color: "#007bff",
    instruction_en: "",
    instruction_bd: "",
    status: "Active" as "Active" | "Inactive",
  });

  const [userInputs, setUserInputs] = useState<UserInput[]>([]);
  const [methodImage, setMethodImage] = useState<File | null>(null);
  const [paymentPageImage, setPaymentPageImage] = useState<File | null>(null);
  const [gatewayInput, setGatewayInput] = useState("");

  // Load existing data when payment method is fetched
  useEffect(() => {
    if (paymentMethod) {
      setFormData({
        method_name_en: paymentMethod.method_name_en,
        method_name_bd: paymentMethod.method_name_bd,
        agent_wallet_number: paymentMethod.agent_wallet_number,
        agent_wallet_text: paymentMethod.agent_wallet_text,
        gateways: paymentMethod.gateways,
        text_color: paymentMethod.text_color,
        background_color: paymentMethod.background_color,
        button_color: paymentMethod.button_color,
        instruction_en: paymentMethod.instruction_en,
        instruction_bd: paymentMethod.instruction_bd,
        status: paymentMethod.status,
      });
      setUserInputs(paymentMethod.user_inputs || []);
    }
  }, [paymentMethod]);

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const addGateway = () => {
    if (
      gatewayInput.trim() &&
      !formData.gateways.includes(gatewayInput.trim())
    ) {
      setFormData((prev) => ({
        ...prev,
        gateways: [...prev.gateways, gatewayInput.trim()],
      }));
      setGatewayInput("");
    }
  };

  const removeGateway = (gateway: string) => {
    setFormData((prev) => ({
      ...prev,
      gateways: prev.gateways.filter((g) => g !== gateway),
    }));
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
    value: any
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
    Object.entries(formData).forEach(([key, value]) => {
      if (key === "gateways") {
        formDataToSend.append(key, JSON.stringify(value));
      } else {
        formDataToSend.append(key, value);
      }
    });

    // Add user inputs as individual form fields to avoid JSON parsing issues
    userInputs.forEach((input, index) => {
      formDataToSend.append(`user_inputs[${index}][name]`, input.name);
      formDataToSend.append(`user_inputs[${index}][type]`, input.type);
      formDataToSend.append(`user_inputs[${index}][label_en]`, input.label_en);
      formDataToSend.append(`user_inputs[${index}][label_bd]`, input.label_bd);
      formDataToSend.append(
        `user_inputs[${index}][isRequired]`,
        input.isRequired.toString()
      );
      if (input.instruction_en) {
        formDataToSend.append(
          `user_inputs[${index}][instruction_en]`,
          input.instruction_en
        );
      }
      if (input.instruction_bd) {
        formDataToSend.append(
          `user_inputs[${index}][instruction_bd]`,
          input.instruction_bd
        );
      }
    });

    // Add images only if new ones are selected
    if (methodImage) {
      formDataToSend.append("method_image", methodImage);
    }
    if (paymentPageImage) {
      formDataToSend.append("payment_page_image", paymentPageImage);
    }

    try {
      await updatePaymentMethod.mutateAsync({ id: id!, data: formDataToSend });
      toast.success("Payment method updated successfully!");
      navigate(`/dashboard/deposit/view/${id}`);
    } catch (error: unknown) {
      console.error("Payment method update error:", error);
      toast.error(
        error.response?.data?.message || "Failed to update payment method"
      );
    }
  };

  if (isLoading) {
    return (
      <div className="container mx-auto p-6">
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
      </div>
    );
  }

  if (!paymentMethod) {
    return (
      <div className="container mx-auto p-6">
        <div className="text-center py-12">
          <h2 className="text-xl font-semibold text-gray-900 mb-2">
            Payment Method Not Found
          </h2>
          <p className="text-gray-600 mb-4">
            The payment method you're trying to edit doesn't exist.
          </p>
          <Button onClick={() => navigate("/dashboard/deposit")}>
            Back to Deposit Methods
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 max-w-4xl">
      <div className="flex items-center gap-4 mb-6">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => navigate(`/dashboard/deposit/view/${id}`)}
          className="flex items-center gap-2"
        >
          <ArrowLeft className="h-4 w-4" />
          Back
        </Button>
        <h1 className="text-2xl font-bold">Edit Deposit Method</h1>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Method Names */}
          <div className="space-y-2">
            <Label htmlFor="method_name_en">Method Name (English)</Label>
            <Input
              id="method_name_en"
              value={formData.method_name_en}
              onChange={(e) =>
                handleInputChange("method_name_en", e.target.value)
              }
              placeholder="e.g., bKash"
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
              placeholder="e.g., বিকাশ"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="agent_wallet_number">Agent Wallet Number</Label>
            <Input
              id="agent_wallet_number"
              value={formData.agent_wallet_number}
              onChange={(e) =>
                handleInputChange("agent_wallet_number", e.target.value)
              }
              placeholder="01712345678"
              required
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Agent Wallet Text */}
          <div className="space-y-2">
            <Label htmlFor="agent_wallet_text">Agent Wallet Text</Label>
            <Input
              id="agent_wallet_text"
              value={formData.agent_wallet_text}
              onChange={(e) =>
                handleInputChange("agent_wallet_text", e.target.value)
              }
              placeholder="Send money to this number"
              required
            />
          </div>

          {/* Gateways */}
          <div className="space-y-2">
            <Label>Gateways</Label>
            <div className="flex gap-2">
              <Input
                value={gatewayInput}
                onChange={(e) => setGatewayInput(e.target.value)}
                placeholder="Enter gateway name"
                onKeyPress={(e) =>
                  e.key === "Enter" && (e.preventDefault(), addGateway())
                }
              />
              <Button type="button" onClick={addGateway} size="sm">
                Add
              </Button>
            </div>
            <div className="flex flex-wrap gap-2 mt-2">
              {formData.gateways.map((gateway, index) => (
                <Badge
                  key={index}
                  variant="secondary"
                  className="flex items-center gap-1"
                >
                  {gateway}
                  <X
                    className="h-3 w-3 cursor-pointer"
                    onClick={() => removeGateway(gateway)}
                  />
                </Badge>
              ))}
            </div>
          </div>
        </div>

        {/* Images */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label>Method Image</Label>
            {paymentMethod.method_image && !methodImage && (
              <div className="mb-2">
                <p className="text-sm text-gray-600 mb-2">Current image:</p>
                <img
                  src={`http://localhost:8000/${paymentMethod.method_image}`}
                  alt="Current method"
                  className="w-32 h-20 object-cover rounded border"
                />
              </div>
            )}
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center">
              <input
                type="file"
                accept="image/*"
                onChange={(e) => setMethodImage(e.target.files?.[0] || null)}
                className="hidden"
                id="method-image"
              />
              <label htmlFor="method-image" className="cursor-pointer">
                <Upload className="h-8 w-8 mx-auto mb-2 text-gray-400" />
                <p className="text-sm text-gray-600">
                  {methodImage ? methodImage.name : "Browse to change image..."}
                </p>
              </label>
            </div>
          </div>

          <div className="space-y-2">
            <Label>Payment Page Image</Label>
            {paymentMethod.payment_page_image && !paymentPageImage && (
              <div className="mb-2">
                <p className="text-sm text-gray-600 mb-2">Current image:</p>
                <img
                  src={`http://localhost:8000/${paymentMethod.payment_page_image}`}
                  alt="Current payment page"
                  className="w-32 h-20 object-cover rounded border"
                />
              </div>
            )}
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center">
              <input
                type="file"
                accept="image/*"
                onChange={(e) =>
                  setPaymentPageImage(e.target.files?.[0] || null)
                }
                className="hidden"
                id="payment-page-image"
              />
              <label htmlFor="payment-page-image" className="cursor-pointer">
                <Upload className="h-8 w-8 mx-auto mb-2 text-gray-400" />
                <p className="text-sm text-gray-600">
                  {paymentPageImage
                    ? paymentPageImage.name
                    : "Browse to change image..."}
                </p>
              </label>
            </div>
          </div>
        </div>

        {/* Colors */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="space-y-2">
            <Label htmlFor="text_color">Text Color</Label>
            <div className="flex gap-2">
              <Input
                type="color"
                id="text_color"
                value={formData.text_color}
                onChange={(e) =>
                  handleInputChange("text_color", e.target.value)
                }
                className="w-16 h-10 p-1 border rounded"
              />
              <Input
                value={formData.text_color}
                onChange={(e) =>
                  handleInputChange("text_color", e.target.value)
                }
                className="flex-1"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="background_color">Background Color</Label>
            <div className="flex gap-2">
              <Input
                type="color"
                id="background_color"
                value={formData.background_color}
                onChange={(e) =>
                  handleInputChange("background_color", e.target.value)
                }
                className="w-16 h-10 p-1 border rounded"
              />
              <Input
                value={formData.background_color}
                onChange={(e) =>
                  handleInputChange("background_color", e.target.value)
                }
                className="flex-1"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="button_color">Button Color</Label>
            <div className="flex gap-2">
              <Input
                type="color"
                id="button_color"
                value={formData.button_color}
                onChange={(e) =>
                  handleInputChange("button_color", e.target.value)
                }
                className="w-16 h-10 p-1 border rounded"
              />
              <Input
                value={formData.button_color}
                onChange={(e) =>
                  handleInputChange("button_color", e.target.value)
                }
                className="flex-1"
              />
            </div>
          </div>
        </div>

        {/* Status */}
        <div className="space-y-2">
          <Label htmlFor="status">Status</Label>
          <select
            id="status"
            value={formData.status}
            onChange={(e) => handleInputChange("status", e.target.value)}
            className="w-full p-2 border border-gray-300 rounded-md"
          >
            <option value="Active">Active</option>
            <option value="Inactive">Inactive</option>
          </select>
        </div>

        {/* Instructions */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label htmlFor="instruction_en">Instruction (English)</Label>
            <Textarea
              id="instruction_en"
              value={formData.instruction_en}
              onChange={(e) =>
                handleInputChange("instruction_en", e.target.value)
              }
              placeholder="Send money and provide transaction ID"
              rows={4}
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
              placeholder="টাকা পাঠান এবং লেনদেন আইডি প্রদান করুন"
              rows={4}
            />
          </div>
        </div>

        {/* User Input Fields */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>User Input Fields</CardTitle>
            <Button
              type="button"
              onClick={addUserInput}
              size="sm"
              className="flex items-center gap-2"
            >
              <Plus className="h-4 w-4" />
              Add New User Input
            </Button>
          </CardHeader>
          <CardContent className="space-y-4">
            {userInputs.map((input, index) => (
              <div key={index} className="border rounded-lg p-4 space-y-4">
                <div className="flex justify-between items-center">
                  <h4 className="font-medium">Input Field {index + 1}</h4>
                  <Button
                    type="button"
                    variant="destructive"
                    size="sm"
                    onClick={() => removeUserInput(index)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <Label>Name</Label>
                    <Input
                      value={input.name}
                      onChange={(e) =>
                        updateUserInput(index, "name", e.target.value)
                      }
                      placeholder="transaction_id"
                    />
                  </div>

                  <div>
                    <Label>Type</Label>
                    <select
                      value={input.type}
                      onChange={(e) =>
                        updateUserInput(index, "type", e.target.value)
                      }
                      className="w-full p-2 border border-gray-300 rounded-md"
                    >
                      <option value="text">Text</option>
                      <option value="number">Number</option>
                      <option value="email">Email</option>
                      <option value="tel">Phone</option>
                      <option value="password">Password</option>
                      <option value="textarea">Textarea</option>
                    </select>
                  </div>

                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      checked={input.isRequired}
                      onChange={(e) =>
                        updateUserInput(index, "isRequired", e.target.checked)
                      }
                      className="rounded"
                    />
                    <Label>Is Required</Label>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label>Label (EN)</Label>
                    <Input
                      value={input.label_en}
                      onChange={(e) =>
                        updateUserInput(index, "label_en", e.target.value)
                      }
                      placeholder="Transaction ID"
                    />
                  </div>

                  <div>
                    <Label>Label (BD)</Label>
                    <Input
                      value={input.label_bd}
                      onChange={(e) =>
                        updateUserInput(index, "label_bd", e.target.value)
                      }
                      placeholder="লেনদেন আইডি"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label>Instruction (EN)</Label>
                    <Input
                      value={input.instruction_en || ""}
                      onChange={(e) =>
                        updateUserInput(index, "instruction_en", e.target.value)
                      }
                      placeholder="Enter your bKash transaction ID"
                    />
                  </div>

                  <div>
                    <Label>Instruction (BD)</Label>
                    <Input
                      value={input.instruction_bd || ""}
                      onChange={(e) =>
                        updateUserInput(index, "instruction_bd", e.target.value)
                      }
                      placeholder="আপনার বিকাশ লেনদেন আইডি লিখুন"
                    />
                  </div>
                </div>
              </div>
            ))}

            {userInputs.length === 0 && (
              <div className="text-center py-8 text-gray-500">
                No user input fields added yet. Click "Add New User Input" to
                create one.
              </div>
            )}
          </CardContent>
        </Card>

        {/* Action Buttons */}
        <div className="flex justify-end gap-4 pt-6">
          <Button
            type="button"
            variant="outline"
            onClick={() => navigate(`/dashboard/deposit/view/${id}`)}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            disabled={updatePaymentMethod.isPending}
            className="flex items-center gap-2"
          >
            <Save className="h-4 w-4" />
            {updatePaymentMethod.isPending
              ? "Updating..."
              : "Update Payment Method"}
          </Button>
        </div>
      </form>
    </div>
  );
}
