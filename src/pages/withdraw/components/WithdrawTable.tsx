import { Link } from "react-router-dom";
import { Button } from "../../../components/ui/button";
import { Badge } from "../../../components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../../../components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../../../components/ui/dropdown-menu";
import {
  Edit,
  Trash2,
  Eye,
  ToggleLeft,
  ToggleRight,
  MoreHorizontal,
} from "lucide-react";
import { API_URL } from "../../../lib/api";

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
  user_inputs: unknown[];
  status: string;
}

interface WithdrawTableProps {
  methods: WithdrawMethod[];
  onToggleStatus: (id: string) => void;
  onDelete: (id: string, name: string) => void;
}

export function WithdrawTable({
  methods,
  onToggleStatus,
  onDelete,
}: WithdrawTableProps) {
  return (
    <div className="rounded-lg border border-border/50 overflow-hidden shadow-sm">
      <Table>
        <TableHeader>
          <TableRow className="bg-gradient-to-r from-purple-600 via-blue-600 to-indigo-600 dark:from-purple-700 dark:via-blue-700 dark:to-indigo-700 hover:from-purple-700 hover:via-blue-700 hover:to-indigo-700 dark:hover:from-purple-600 dark:hover:via-blue-600 dark:hover:to-indigo-600 border-b-2 border-purple-400 dark:border-purple-500 transition-all duration-300">
            <TableHead className="font-bold text-white dark:text-white">
              Method
            </TableHead>
            <TableHead className="font-bold text-white dark:text-white">
              Min/Max
            </TableHead>
            <TableHead className="font-bold text-white dark:text-white">
              Fee
            </TableHead>
            <TableHead className="font-bold text-white dark:text-white">
              Processing Time
            </TableHead>
            <TableHead className="font-bold text-white dark:text-white">
              User Fields
            </TableHead>
            <TableHead className="font-bold text-white dark:text-white">
              Status
            </TableHead>
            <TableHead className="font-bold text-white dark:text-white">
              Actions
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {methods.map((method, index) => (
            <TableRow
              key={method._id}
              className={`
                transition-all duration-300 ease-in-out
                hover:bg-gradient-to-r hover:from-purple-50 hover:via-blue-50 hover:to-indigo-50 
                dark:hover:from-purple-950/40 dark:hover:via-blue-950/40 dark:hover:to-indigo-950/40
                hover:shadow-md hover:scale-[1.01] hover:border-l-4 hover:border-l-purple-500
                ${
                  index % 2 === 0
                    ? "bg-white dark:bg-slate-950"
                    : "bg-slate-50/50 dark:bg-slate-900/50"
                }
                border-b border-slate-100 dark:border-slate-800
              `}
            >
              <TableCell className="py-4">
                <div className="flex items-center gap-3">
                  {method.method_image && (
                    <img
                      src={`${API_URL}/${method.method_image}`}
                      alt={method.method_name_en}
                      className="w-10 h-10 object-cover rounded shadow-md ring-2 ring-slate-100 dark:ring-slate-800"
                    />
                  )}
                  <div>
                    <p className="font-semibold text-slate-900 dark:text-slate-100">
                      {method.method_name_en}
                    </p>
                    <p className="text-sm text-slate-600 dark:text-slate-400">
                      {method.method_name_bd}
                    </p>
                  </div>
                </div>
              </TableCell>
              <TableCell>
                <div className="text-sm">
                  <p className="font-semibold text-slate-900 dark:text-slate-100">
                    ৳{method.min_withdrawal.toLocaleString()}
                  </p>
                  <p className="text-slate-600 dark:text-slate-400">
                    to ৳{method.max_withdrawal.toLocaleString()}
                  </p>
                </div>
              </TableCell>
              <TableCell>
                <Badge variant="outline" className="font-medium shadow-sm">
                  {method.withdrawal_fee}
                  {method.fee_type === "percentage" ? "%" : " ৳"}
                </Badge>
              </TableCell>
              <TableCell>
                <span className="text-sm text-slate-600 dark:text-slate-400 font-medium">
                  {method.processing_time}
                </span>
              </TableCell>
              <TableCell>
                <Badge variant="secondary" className="font-medium shadow-sm">
                  {method.user_inputs.length} fields
                </Badge>
              </TableCell>
              <TableCell>
                <Badge
                  variant={method.status === "Active" ? "default" : "secondary"}
                  className={
                    method.status === "Active"
                      ? "bg-green-500 hover:bg-green-600 font-medium shadow-sm"
                      : "font-medium shadow-sm"
                  }
                >
                  {method.status}
                </Badge>
              </TableCell>
              <TableCell className="text-right">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
                    >
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="shadow-lg">
                    <DropdownMenuItem asChild>
                      <Link
                        to={`/dashboard/withdraw/view/${method._id}`}
                        className="cursor-pointer hover:bg-blue-50 dark:hover:bg-blue-950"
                      >
                        <Eye className="h-4 w-4 mr-2" />
                        View Details
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link
                        to={`/dashboard/withdraw/edit/${method._id}`}
                        className="cursor-pointer hover:bg-blue-50 dark:hover:bg-blue-950"
                      >
                        <Edit className="h-4 w-4 mr-2" />
                        Edit
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => onToggleStatus(method._id)}
                      className="cursor-pointer hover:bg-blue-50 dark:hover:bg-blue-950"
                    >
                      {method.status === "Active" ? (
                        <ToggleLeft className="h-4 w-4 mr-2" />
                      ) : (
                        <ToggleRight className="h-4 w-4 mr-2" />
                      )}
                      {method.status === "Active" ? "Deactivate" : "Activate"}
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() =>
                        onDelete(method._id, method.method_name_en)
                      }
                      className="text-destructive cursor-pointer hover:bg-red-50 dark:hover:bg-red-950"
                    >
                      <Trash2 className="h-4 w-4 mr-2" />
                      Delete
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
