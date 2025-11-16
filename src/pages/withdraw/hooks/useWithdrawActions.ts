import {
  useDeleteWithdrawMethod,
  useToggleWithdrawMethodStatus,
} from "../../../lib/queries";
import { toast } from "sonner";

export function useWithdrawActions() {
  const deleteWithdrawMethod = useDeleteWithdrawMethod();
  const toggleStatus = useToggleWithdrawMethodStatus();

  const handleDelete = async (id: string, name: string) => {
    if (window.confirm(`Are you sure you want to delete "${name}"?`)) {
      try {
        await deleteWithdrawMethod.mutateAsync(id);
        toast.success("Withdraw method deleted successfully!");
      } catch (error) {
        const errorMessage =
          (error as { response?: { data?: { message?: string } } })?.response
            ?.data?.message || "Failed to delete withdraw method";
        toast.error(errorMessage);
      }
    }
  };

  const handleToggleStatus = async (id: string) => {
    try {
      await toggleStatus.mutateAsync(id);
      toast.success("Status updated successfully!");
    } catch (error) {
      const errorMessage =
        (error as { response?: { data?: { message?: string } } })?.response
          ?.data?.message || "Failed to update status";
      toast.error(errorMessage);
    }
  };

  return {
    handleDelete,
    handleToggleStatus,
  };
}
