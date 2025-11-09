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
import { useWithdrawMethod } from "../../lib/queries";
import {
  ArrowLeft,
  Edit,
  TrendingUp,
  Palette,
  FileText,
  DollarSign,
  Clock,
  Users,
} from "lucide-react";
import { API_URL } from "../../lib/api";

export default function ViewWithdrawMethodPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { data: withdrawMethodData, isLoading, error } = useWithdrawMethod(id!);

  if (isLoading) {
    return (
      <div className="container mx-auto p-6">
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      </div>
    );
  }

  if (error || !withdrawMethodData?.data?.data) {
    return (
      <div className="container mx-auto p-6">
        <div className="text-center py-12">
          <h2 className="text-xl font-semibold text-foreground mb-2">
            Withdraw Method Not Found
          </h2>
          <p className="text-muted-foreground mb-4">
            The withdraw method you're looking for doesn't exist.
          </p>
          <Button onClick={() => navigate("/dashboard/withdraw")}>
            Back to Withdraw Methods
          </Button>
        </div>
      </div>
    );
  }

  const method = withdrawMethodData.data.data;

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="container mx-auto max-w-6xl">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate("/dashboard/withdraw")}
              className="flex items-center gap-2"
            >
              <ArrowLeft className="h-4 w-4" />
              Back
            </Button>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              Withdraw Method Details
            </h1>
          </div>
          <Button
            onClick={() => navigate(`/dashboard/withdraw/edit/${id}`)}
            className="flex items-center gap-2 gradient-primary"
          >
            <Edit className="h-4 w-4" />
            Edit Method
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Details */}
          <div className="lg:col-span-2 space-y-6">
            {/* Basic Information */}
            <Card className="glass-effect">
              <CardHeader className="flex flex-row items-center gap-2">
                <TrendingUp className="h-5 w-5 text-primary" />
                <CardTitle>Basic Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">
                      Method Name (English)
                    </label>
                    <p className="text-lg font-semibold">
                      {method.method_name_en}
                    </p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">
                      Method Name (Bangla)
                    </label>
                    <p className="text-lg font-semibold">
                      {method.method_name_bd || "N/A"}
                    </p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">
                      Status
                    </label>
                    <div>
                      <Badge
                        variant={
                          method.status === "Active" ? "default" : "secondary"
                        }
                        className={
                          method.status === "Active"
                            ? "bg-green-500 hover:bg-green-600"
                            : "bg-gray-500"
                        }
                      >
                        {method.status}
                      </Badge>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Withdrawal Limits */}
            <Card className="glass-effect">
              <CardHeader className="flex flex-row items-center gap-2">
                <DollarSign className="h-5 w-5 text-primary" />
                <CardTitle>Withdrawal Limits & Fees</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">
                      Minimum Withdrawal
                    </label>
                    <p className="text-2xl font-bold text-green-600">
                      ৳{method.min_withdrawal.toLocaleString()}
                    </p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">
                      Maximum Withdrawal
                    </label>
                    <p className="text-2xl font-bold text-green-600">
                      ৳{method.max_withdrawal.toLocaleString()}
                    </p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">
                      Withdrawal Fee
                    </label>
                    <p className="text-lg font-semibold text-orange-600">
                      {method.withdrawal_fee}
                      {method.fee_type === "percentage" ? "%" : " ৳"}
                    </p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">
                      Fee Type
                    </label>
                    <Badge variant="outline" className="capitalize">
                      {method.fee_type}
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Processing Time */}
            <Card className="glass-effect">
              <CardHeader className="flex flex-row items-center gap-2">
                <Clock className="h-5 w-5 text-primary" />
                <CardTitle>Processing Information</CardTitle>
              </CardHeader>
              <CardContent>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">
                    Processing Time
                  </label>
                  <p className="text-lg font-semibold">
                    {method.processing_time}
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Instructions */}
            {(method.instruction_en || method.instruction_bd) && (
              <Card className="glass-effect">
                <CardHeader className="flex flex-row items-center gap-2">
                  <FileText className="h-5 w-5 text-primary" />
                  <CardTitle>Instructions</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {method.instruction_en && (
                    <div>
                      <label className="text-sm font-medium text-muted-foreground">
                        English Instruction
                      </label>
                      <p className="text-base whitespace-pre-wrap">
                        {method.instruction_en}
                      </p>
                    </div>
                  )}
                  {method.instruction_bd && (
                    <div>
                      <label className="text-sm font-medium text-muted-foreground">
                        Bangla Instruction
                      </label>
                      <p className="text-base whitespace-pre-wrap">
                        {method.instruction_bd}
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>
            )}

            {/* User Input Fields */}
            <Card className="glass-effect">
              <CardHeader className="flex flex-row items-center gap-2">
                <Users className="h-5 w-5 text-primary" />
                <CardTitle>
                  User Input Fields ({method.user_inputs.length})
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {method.user_inputs && method.user_inputs.length > 0 ? (
                    method.user_inputs.map((input, index) => (
                      <div key={index} className="p-4 bg-muted/50 rounded-lg">
                        <div className="flex items-start justify-between mb-2">
                          <div>
                            <p className="font-medium text-lg">
                              {input.label_en}
                            </p>
                            {input.label_bd && (
                              <p className="text-sm text-muted-foreground">
                                {input.label_bd}
                              </p>
                            )}
                          </div>
                          <div className="flex gap-2">
                            <Badge variant="outline" className="capitalize">
                              {input.type}
                            </Badge>
                            {input.isRequired && (
                              <Badge variant="destructive">Required</Badge>
                            )}
                          </div>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
                          <div>
                            <span className="text-muted-foreground">
                              Field Name:
                            </span>{" "}
                            <span className="font-mono">{input.name}</span>
                          </div>
                          {input.instruction_en && (
                            <div>
                              <span className="text-muted-foreground">
                                Instruction (EN):
                              </span>{" "}
                              {input.instruction_en}
                            </div>
                          )}
                          {input.instruction_bd && (
                            <div>
                              <span className="text-muted-foreground">
                                Instruction (BD):
                              </span>{" "}
                              {input.instruction_bd}
                            </div>
                          )}
                        </div>
                      </div>
                    ))
                  ) : (
                    <p className="text-muted-foreground">
                      No user input fields configured
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Color Settings */}
            <Card className="glass-effect">
              <CardHeader className="flex flex-row items-center gap-2">
                <Palette className="h-5 w-5 text-primary" />
                <CardTitle>Color Settings</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">
                      Text Color
                    </label>
                    <div className="flex items-center gap-2 mt-1">
                      <div
                        className="w-10 h-10 rounded border"
                        style={{ backgroundColor: method.text_color }}
                      />
                      <span className="font-mono text-sm">
                        {method.text_color}
                      </span>
                    </div>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">
                      Background Color
                    </label>
                    <div className="flex items-center gap-2 mt-1">
                      <div
                        className="w-10 h-10 rounded border"
                        style={{ backgroundColor: method.background_color }}
                      />
                      <span className="font-mono text-sm">
                        {method.background_color}
                      </span>
                    </div>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">
                      Button Color
                    </label>
                    <div className="flex items-center gap-2 mt-1">
                      <div
                        className="w-10 h-10 rounded border"
                        style={{ backgroundColor: method.button_color }}
                      />
                      <span className="font-mono text-sm">
                        {method.button_color}
                      </span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Method Image */}
            <Card className="glass-effect">
              <CardHeader>
                <CardTitle>Method Image</CardTitle>
              </CardHeader>
              <CardContent>
                {method.method_image ? (
                  <img
                    src={`${API_URL}/${method.method_image}`}
                    alt={method.method_name_en}
                    className="w-full h-48 object-cover rounded-lg border"
                  />
                ) : (
                  <div className="w-full h-48 bg-muted rounded-lg border flex items-center justify-center">
                    <div className="text-center">
                      <TrendingUp className="h-12 w-12 text-muted-foreground mx-auto mb-2" />
                      <p className="text-muted-foreground text-sm">
                        No image uploaded
                      </p>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Withdrawal Page Image */}
            <Card className="glass-effect">
              <CardHeader>
                <CardTitle>Withdrawal Page Image</CardTitle>
              </CardHeader>
              <CardContent>
                {method.withdrawal_page_image ? (
                  <img
                    src={`${API_URL}/${method.withdrawal_page_image}`}
                    alt="Withdrawal Page"
                    className="w-full h-48 object-cover rounded-lg border"
                  />
                ) : (
                  <div className="w-full h-48 bg-muted rounded-lg border flex items-center justify-center">
                    <div className="text-center">
                      <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-2" />
                      <p className="text-muted-foreground text-sm">
                        No image uploaded
                      </p>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Metadata */}
            <Card className="glass-effect">
              <CardHeader>
                <CardTitle>Metadata</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <div>
                  <label className="text-sm font-medium text-muted-foreground">
                    Created
                  </label>
                  <p className="text-sm">
                    {new Date(method.createdAt).toLocaleString()}
                  </p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">
                    Updated
                  </label>
                  <p className="text-sm">
                    {new Date(method.updatedAt).toLocaleString()}
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
