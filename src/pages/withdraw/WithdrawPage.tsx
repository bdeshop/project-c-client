"use client";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../../components/ui/card";
import { Breadcrumb } from "../../components/ui/breadcrumb";
import { useWithdrawMethods } from "../../lib/queries";
import {
  WithdrawHeader,
  WithdrawFilters,
  WithdrawTable,
  WithdrawLoadingStates,
} from "./components";
import { useWithdrawFilters, useWithdrawActions } from "./hooks";
import { TrendingUp } from "lucide-react";

export default function WithdrawPage() {
  // Custom hooks for managing state and actions
  const { searchTerm, setSearchTerm, filterMethods } = useWithdrawFilters();
  const { handleDelete, handleToggleStatus } = useWithdrawActions();

  // Fetch withdraw methods using TanStack Query
  const { data: withdrawMethodsData, isLoading } = useWithdrawMethods();

  const withdrawMethods = withdrawMethodsData?.data?.data || [];

  // Filter methods based on search
  const filteredMethods = filterMethods(withdrawMethods);

  return (
    <div className="p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Breadcrumb */}
        <Breadcrumb items={[{ label: "Withdraw Methods" }]} />

        {/* Header */}
        <WithdrawHeader onAddMethod={() => {}} />

        {/* Search Filters */}
        <WithdrawFilters
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
        />

        {/* Withdraw Methods Table */}
        <Card className="glass-effect">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              Withdraw Methods ({filteredMethods.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            {/* Loading and Empty States */}
            <WithdrawLoadingStates
              isLoading={isLoading}
              hasData={filteredMethods.length > 0}
              searchTerm={searchTerm}
            />

            {/* Table */}
            {!isLoading && filteredMethods.length > 0 && (
              <WithdrawTable
                methods={filteredMethods}
                onToggleStatus={handleToggleStatus}
                onDelete={handleDelete}
              />
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
