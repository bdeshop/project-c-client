import { useState, useMemo } from "react";

interface WithdrawMethod {
  _id: string;
  method_name_en: string;
  method_name_bd: string;
  method_image?: string;
  min_withdrawal: number;
  max_withdrawal: number;
  withdrawal_fee: number;
  fee_type: string;
  processing_time: string;
  user_inputs: any[];
  status: string;
}

export function useWithdrawFilters() {
  const [searchTerm, setSearchTerm] = useState("");

  const filterMethods = useMemo(
    () => (methods: WithdrawMethod[]) => {
      return methods.filter(
        (method) =>
          method.method_name_en
            .toLowerCase()
            .includes(searchTerm.toLowerCase()) ||
          method.method_name_bd.toLowerCase().includes(searchTerm.toLowerCase())
      );
    },
    [searchTerm]
  );

  return {
    searchTerm,
    setSearchTerm,
    filterMethods,
  };
}
