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
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency,
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString();
  };

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Rank</TableHead>
          <TableHead>Game</TableHead>
          <TableHead>Category</TableHead>
          <TableHead>Username</TableHead>
          <TableHead>Win Amount</TableHead>
          <TableHead>Multiplier</TableHead>
          <TableHead>Win Time</TableHead>
          <TableHead>Status</TableHead>
          <TableHead className="text-right">Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {topWinners.map((topWinner, index) => (
          <TableRow key={topWinner._id}>
            <TableCell>
              <div className="flex items-center">
                {index === 0 && <Crown className="h-4 w-4 text-yellow-500 mr-1" />}
                {index === 1 && <Medal className="h-4 w-4 text-gray-400 mr-1" />}
                {index === 2 && <Medal className="h-4 w-4 text-amber-700 mr-1" />}
                <span className="font-medium">#{index + 1}</span>
              </div>
            </TableCell>
            <TableCell>
              <div className="font-medium">{topWinner.gameName}</div>
            </TableCell>
            <TableCell>
              <Badge variant="secondary">{topWinner.gameCategory}</Badge>
            </TableCell>
            <TableCell>
              <div className="font-medium">@{topWinner.username}</div>
            </TableCell>
            <TableCell>
              <div className="font-medium">
                {formatCurrency(topWinner.winAmount, topWinner.currency)}
              </div>
            </TableCell>
            <TableCell>
              {topWinner.multiplier ? (
                <Badge variant="outline">{topWinner.multiplier}x</Badge>
              ) : (
                "-"
              )}
            </TableCell>
            <TableCell>
              <div className="text-sm text-muted-foreground">
                {formatDate(topWinner.winTime)}
              </div>
            </TableCell>
            <TableCell>
              {topWinner.isLive ? (
                <Badge variant="default">LIVE</Badge>
              ) : (
                <Badge variant="secondary">Hidden</Badge>
              )}
            </TableCell>
            <TableCell className="text-right">
              <div className="flex justify-end space-x-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onEditTopWinner(topWinner)}
                >
                  <Edit className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onDeleteTopWinner(topWinner._id)}
                >
                  <Trash2 className="h-4 w-4 text-destructive" />
                </Button>
              </div>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}