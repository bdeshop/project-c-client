"use client";

import { useParams, useNavigate } from "react-router-dom";
import { Button } from "../../components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../../components/ui/card";
import { Badge } from "../../components/ui/badge";
import { usePaymentMethod } from "../../lib/queries";
import {
  ArrowLeft,
  Edit,
  Wallet,
  Globe,
  Palette,
  Settings,
  FileText,
} from "lucide-react";
import { API_URL } from "../../lib/api";

export default function ViewDepositMethodPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { data: paymentMethod, isLoading, error } = usePaymentMethod(id!);

  if (isLoading) {
    return (
      <div className="container mx-auto p-6">
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
      </div>
    );
  }

  if (error || !paymentMethod) {
    return (
      <div className="container mx-auto p-6">
        <div className="text-center py-12">
          <h2 className="text-xl font-semibold text-gray-900 mb-2">
            Payment Method Not Found
          </h2>
          <p className="text-gray-600 mb-4">
            The payment method you're looking for doesn't exist.
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
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate("/dashboard/deposit")}
            className="flex items-center gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Back
          </Button>
          <h1 className="text-2xl font-bold">Payment Method Details</h1>
        </div>
        <Button
          onClick={() => navigate(`/dashboard/deposit/edit/${id}`)}
          className="flex items-center gap-2"
        >
          <Edit className="h-4 w-4" />
          Edit Method
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Details */}
        <div className="lg:col-span-2 space-y-6">
          {/* Basic Information */}
          <Card>
            <CardHeader className="flex flex-row items-center gap-2">
              <Wallet className="h-5 w-5" />
              <CardTitle>Basic Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-500">
                    Method Name (English)
                  </label>
                  <p className="text-lg font-semibold">
                    {paymentMethod.method_name_en}
                  </p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">
                    Method Name (Bangla)
                  </label>
                  <p className="text-lg font-semibold">
                    {paymentMethod.method_name_bd}
                  </p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">
                    Agent Wallet Number
                  </label>
                  <p className="text-lg font-mono">
                    {paymentMethod.agent_wallet_number}
                  </p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">
                    Status
                  </label>
                  <div>
                    <Badge
                      variant={
                        paymentMethod.status === "Active"
                          ? "default"
                          : "secondary"
                      }
                    >
                      {paymentMethod.status}
                    </Badge>
                  </div>
                </div>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">
                  Agent Wallet Text
                </label>
                <p className="text-base">{paymentMethod.agent_wallet_text}</p>
              </div>
            </CardContent>
          </Card>

          {/* Gateways */}
          <Card>
            <CardHeader className="flex flex-row items-center gap-2">
              <Globe className="h-5 w-5" />
              <CardTitle>Gateways</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {paymentMethod.gateways.map((gateway, index) => (
                  <Badge key={index} variant="outline">
                    {gateway}
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Instructions */}
          <Card>
            <CardHeader className="flex flex-row items-center gap-2">
              <FileText className="h-5 w-5" />
              <CardTitle>Instructions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-sm font-medium text-gray-500">
                  English Instructions
                </label>
                <p className="text-base whitespace-pre-wrap">
                  {paymentMethod.instruction_en}
                </p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">
                  Bangla Instructions
                </label>
                <p className="text-base whitespace-pre-wrap">
                  {paymentMethod.instruction_bd}
                </p>
              </div>
            </CardContent>
          </Card>

          {/* User Input Fields */}
          {paymentMethod.user_inputs &&
            paymentMethod.user_inputs.length > 0 && (
              <Card>
                <CardHeader className="flex flex-row items-center gap-2">
                  <Settings className="h-5 w-5" />
                  <CardTitle>User Input Fields</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {paymentMethod.user_inputs.map((input, index) => (
                      <div key={index} className="border rounded-lg p-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <label className="text-sm font-medium text-gray-500">
                              Field Name
                            </label>
                            <p className="font-medium">{input.name}</p>
                          </div>
                          <div>
                            <label className="text-sm font-medium text-gray-500">
                              Type
                            </label>
                            <Badge variant="outline">{input.type}</Badge>
                          </div>
                          <div>
                            <label className="text-sm font-medium text-gray-500">
                              Label (EN)
                            </label>
                            <p>{input.label_en}</p>
                          </div>
                          <div>
                            <label className="text-sm font-medium text-gray-500">
                              Label (BD)
                            </label>
                            <p>{input.label_bd}</p>
                          </div>
                          {input.instruction_en && (
                            <div>
                              <label className="text-sm font-medium text-gray-500">
                                Instruction (EN)
                              </label>
                              <p className="text-sm text-gray-600">
                                {input.instruction_en}
                              </p>
                            </div>
                          )}
                          {input.instruction_bd && (
                            <div>
                              <label className="text-sm font-medium text-gray-500">
                                Instruction (BD)
                              </label>
                              <p className="text-sm text-gray-600">
                                {input.instruction_bd}
                              </p>
                            </div>
                          )}
                          <div>
                            <label className="text-sm font-medium text-gray-500">
                              Required
                            </label>
                            <Badge
                              variant={
                                input.isRequired ? "default" : "secondary"
                              }
                            >
                              {input.isRequired ? "Yes" : "No"}
                            </Badge>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Colors */}
          <Card>
            <CardHeader className="flex flex-row items-center gap-2">
              <Palette className="h-5 w-5" />
              <CardTitle>Colors</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-500">
                  Text Color
                </label>
                <div className="flex items-center gap-2">
                  <div
                    className="w-6 h-6 rounded border"
                    style={{ backgroundColor: paymentMethod.text_color }}
                  ></div>
                  <span className="font-mono text-sm">
                    {paymentMethod.text_color}
                  </span>
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-500">
                  Background Color
                </label>
                <div className="flex items-center gap-2">
                  <div
                    className="w-6 h-6 rounded border"
                    style={{ backgroundColor: paymentMethod.background_color }}
                  ></div>
                  <span className="font-mono text-sm">
                    {paymentMethod.background_color}
                  </span>
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-500">
                  Button Color
                </label>
                <div className="flex items-center gap-2">
                  <div
                    className="w-6 h-6 rounded border"
                    style={{ backgroundColor: paymentMethod.button_color }}
                  ></div>
                  <span className="font-mono text-sm">
                    {paymentMethod.button_color}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Images */}
          <Card>
            <CardHeader>
              <CardTitle>Images</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {paymentMethod.method_image && (
                <div>
                  <label className="text-sm font-medium text-gray-500">
                    Method Image
                  </label>
                  <img
                    src={`${API_URL}/${paymentMethod.method_image}`}
                    alt="Method"
                    className="w-full h-32 object-cover rounded-lg border mt-2"
                  />
                </div>
              )}
              {paymentMethod.payment_page_image && (
                <div>
                  <label className="text-sm font-medium text-gray-500">
                    Payment Page Image
                  </label>
                  <img
                    src={`${API_URL}/${paymentMethod.payment_page_image}`}
                    alt="Payment Page"
                    className="w-full h-32 object-cover rounded-lg border mt-2"
                  />
                </div>
              )}
              {!paymentMethod.method_image &&
                !paymentMethod.payment_page_image && (
                  <p className="text-gray-500 text-sm">No images uploaded</p>
                )}
            </CardContent>
          </Card>

          {/* Metadata */}
          <Card>
            <CardHeader>
              <CardTitle>Metadata</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <div>
                <label className="text-sm font-medium text-gray-500">
                  Created
                </label>
                <p className="text-sm">
                  {new Date(paymentMethod.createdAt).toLocaleString()}
                </p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">
                  Updated
                </label>
                <p className="text-sm">
                  {new Date(paymentMethod.updatedAt).toLocaleString()}
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
