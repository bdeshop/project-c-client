import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../../../components/ui/table";
import { Badge } from "../../../components/ui/badge";
import { Button } from "../../../components/ui/button";
import { Edit, Trash2, Eye, Crown, Medal } from "lucide-react";
import { TopWinner } from "../../../lib/queries";

interface TopWinnerTableProps {
  topWinners: TopWinner[];
  onEditTopWinner: (topWinner: TopWinner) => void;
  onDeleteTopWinner: (id: string) => void;
}

export function TopWinnerTable({
  topWinners,
  onEditTopWinner,
  onDeleteTopWinner,
}: TopWinnerTableProps) {
  const formatCurrency = (amount: number, currency: string) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: currency,
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString();
  };

  return (
    <div className="rounded-lg border border-border/50 overflow-hidden shadow-sm">
      <Table>
        <TableHeader>
          <TableRow className="bg-gradient-to-r from-purple-600 via-blue-600 to-indigo-600 dark:from-purple-700 dark:via-blue-700 dark:to-indigo-700 hover:from-purple-700 hover:via-blue-700 hover:to-indigo-700 dark:hover:from-purple-600 dark:hover:via-blue-600 dark:hover:to-indigo-600 border-b-2 border-purple-400 dark:border-purple-500 transition-all duration-300">
            <TableHead className="font-bold text-white">Rank</TableHead>
            <TableHead className="font-bold text-white">Game</TableHead>
            <TableHead className="font-bold text-white">Category</TableHead>
            <TableHead className="font-bold text-white">Username</TableHead>
            <TableHead className="font-bold text-white">Win Amount</TableHead>
            <TableHead className="font-bold text-white">Multiplier</TableHead>
            <TableHead className="font-bold text-white">Win Time</TableHead>
            <TableHead className="font-bold text-white">Status</TableHead>
            <TableHead className="text-right font-bold text-white">
              Actions
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {topWinners.map((topWinner, index) => (
            <TableRow
              key={topWinner._id}
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
                <div className="flex items-center">
                  {index === 0 && (
                    <Crown className="h-5 w-5 text-yellow-500 mr-2" />
                  )}
                  {index === 1 && (
                    <Medal className="h-5 w-5 text-gray-400 mr-2" />
                  )}
                  {index === 2 && (
                    <Medal className="h-5 w-5 text-amber-700 mr-2" />
                  )}
                  <span className="font-bold text-slate-900 dark:text-slate-100">
                    #{index + 1}
                  </span>
                </div>
              </TableCell>
              <TableCell>
                <div className="font-semibold text-slate-900 dark:text-slate-100">
                  {topWinner.gameName}
                </div>
              </TableCell>
              <TableCell>
                <Badge variant="secondary" className="font-medium shadow-sm">
                  {topWinner.gameCategory}
                </Badge>
              </TableCell>
              <TableCell>
                <div className="font-semibold text-slate-900 dark:text-slate-100">
                  @{topWinner.username}
                </div>
              </TableCell>
              <TableCell>
                <div className="font-bold text-green-600 dark:text-green-400">
                  {formatCurrency(topWinner.winAmount, topWinner.currency)}
                </div>
              </TableCell>
              <TableCell>
                {topWinner.multiplier ? (
                  <Badge variant="outline" className="font-medium shadow-sm">
                    {topWinner.multiplier}x
                  </Badge>
                ) : (
                  <span className="text-slate-500">-</span>
                )}
              </TableCell>
              <TableCell>
                <div className="text-sm text-slate-600 dark:text-slate-400 font-medium">
                  {formatDate(topWinner.winTime)}
                </div>
              </TableCell>
              <TableCell>
                {topWinner.isLive ? (
                  <Badge variant="default" className="font-medium shadow-sm">
                    LIVE
                  </Badge>
                ) : (
                  <Badge variant="secondary" className="font-medium shadow-sm">
                    Hidden
                  </Badge>
                )}
              </TableCell>
              <TableCell className="text-right">
                <div className="flex justify-end space-x-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onEditTopWinner(topWinner)}
                    className="hover:bg-blue-50 dark:hover:bg-blue-950 transition-colors"
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onDeleteTopWinner(topWinner._id)}
                    className="hover:bg-red-50 dark:hover:bg-red-950 transition-colors"
                  >
                    <Trash2 className="h-4 w-4 text-destructive" />
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
