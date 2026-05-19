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
  onEditTopWinner?: (topWinner: TopWinner) => void;
  onDeleteTopWinner?: (id: string) => void;
  isAdmin?: boolean;
}

export function TopWinnerTable({
  topWinners,
  onEditTopWinner,
  onDeleteTopWinner,
  isAdmin = false,
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
          <TableRow className="bg-yellow-400 hover:bg-yellow-500 border-b-2 border-yellow-500 transition-all duration-300">
            <TableHead className="font-bold text-gray-900">Rank</TableHead>
            <TableHead className="font-bold text-gray-900">Game</TableHead>
            <TableHead className="font-bold text-gray-900">Category</TableHead>
            <TableHead className="font-bold text-gray-900">Username</TableHead>
            <TableHead className="font-bold text-gray-900">Win Amount</TableHead>
            <TableHead className="font-bold text-gray-900">Multiplier</TableHead>
            <TableHead className="font-bold text-gray-900">Win Time</TableHead>
            <TableHead className="font-bold text-gray-900">Status</TableHead>
            {isAdmin && (
              <TableHead className="text-right font-bold text-gray-900">
                Actions
              </TableHead>
            )}
          </TableRow>
        </TableHeader>
        <TableBody>
          {topWinners.map((topWinner, index) => (
            <TableRow
              key={topWinner._id}
              className={`
              transition-all duration-300 ease-in-out
              hover:bg-gray-700/40
              hover:shadow-md hover:scale-[1.01] hover:border-l-4 hover:border-l-yellow-400
              ${
                index % 2 === 0
                  ? "bg-gray-800/30"
                  : "bg-gray-800/10"
              }
              border-b border-gray-700/50
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
                  <span className="font-bold text-white">
                    #{index + 1}
                  </span>
                </div>
              </TableCell>
              <TableCell>
                <div className="font-semibold text-white">
                  {topWinner.gameName}
                </div>
              </TableCell>
              <TableCell>
                <Badge variant="secondary" className="font-medium shadow-sm">
                  {topWinner.gameCategory}
                </Badge>
              </TableCell>
              <TableCell>
                <div className="font-semibold text-white">
                  @{topWinner.username}
                </div>
              </TableCell>
              <TableCell>
                <div className="font-bold text-yellow-400">
                  {formatCurrency(topWinner.winAmount, topWinner.currency)}
                </div>
              </TableCell>
              <TableCell>
                {topWinner.multiplier ? (
                  <Badge variant="outline" className="font-medium shadow-sm">
                    {topWinner.multiplier}x
                  </Badge>
                ) : (
                  <span className="text-gray-500">-</span>
                )}
              </TableCell>
              <TableCell>
                <div className="text-sm text-gray-400 font-medium">
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
              {isAdmin && (
                <TableCell className="text-right">
                  <div className="flex justify-end space-x-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onEditTopWinner?.(topWinner)}
                      className="hover:bg-gray-700/50 transition-colors"
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onDeleteTopWinner?.(topWinner._id)}
                      className="hover:bg-red-500/10 transition-colors text-red-400"
                    >
                      <Trash2 className="h-4 w-4 text-destructive" />
                    </Button>
                  </div>
                </TableCell>
              )}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
