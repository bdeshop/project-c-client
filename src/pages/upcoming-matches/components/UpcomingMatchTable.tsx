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
import { Edit, Trash2, Eye, Play, Clock } from "lucide-react";
import { UpcomingMatch } from "../../../lib/queries";

interface UpcomingMatchTableProps {
  upcomingMatches: UpcomingMatch[];
  onEditUpcomingMatch?: (upcomingMatch: UpcomingMatch) => void;
  onDeleteUpcomingMatch?: (id: string) => void;
  isAdmin?: boolean;
}

export function UpcomingMatchTable({
  upcomingMatches,
  onEditUpcomingMatch,
  onDeleteUpcomingMatch,
  isAdmin = false,
}: UpcomingMatchTableProps) {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString();
  };

  const getDaysUntilMatch = (dateString: string) => {
    const matchDate = new Date(dateString);
    const today = new Date();
    const diffTime = matchDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  return (
    <div className="rounded-lg border border-border/50 overflow-hidden shadow-sm">
      <Table>
        <TableHeader>
          <TableRow className="bg-yellow-400 hover:bg-yellow-500 border-b-2 border-yellow-500 transition-all duration-300">
            <TableHead className="font-bold text-gray-900">Match</TableHead>
            <TableHead className="font-bold text-gray-900">Category</TableHead>
            <TableHead className="font-bold text-gray-900">Date & Time</TableHead>
            <TableHead className="font-bold text-gray-900">Team A</TableHead>
            <TableHead className="font-bold text-gray-900">Odds A</TableHead>
            <TableHead className="font-bold text-gray-900">Team B</TableHead>
            <TableHead className="font-bold text-gray-900">Odds B</TableHead>
            <TableHead className="font-bold text-gray-900">Status</TableHead>
            {isAdmin && (
              <TableHead className="text-right font-bold text-gray-900">
                Actions
              </TableHead>
            )}
          </TableRow>
        </TableHeader>
        <TableBody>
          {upcomingMatches.map((upcomingMatch, index) => (
            <TableRow
              key={upcomingMatch._id}
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
                <div className="font-semibold text-white">
                  {upcomingMatch.matchType}
                </div>
              </TableCell>
              <TableCell>
                <Badge variant="secondary" className="font-medium shadow-sm">
                  {upcomingMatch.category}
                </Badge>
              </TableCell>
              <TableCell>
                <div className="font-semibold text-white">
                  {formatDate(upcomingMatch.matchDate)}
                </div>
                <div className="text-sm text-gray-400">
                  {getDaysUntilMatch(upcomingMatch.matchDate) > 0
                    ? `${getDaysUntilMatch(upcomingMatch.matchDate)} days`
                    : "Today"}
                </div>
              </TableCell>
              <TableCell>
                <div className="font-semibold text-white">
                  {upcomingMatch.teamA.name}
                </div>
              </TableCell>
              <TableCell>
                <Badge variant="outline" className="font-medium shadow-sm">
                  {upcomingMatch.teamA.odds.toFixed(2)}
                </Badge>
              </TableCell>
              <TableCell>
                <div className="font-semibold text-white">
                  {upcomingMatch.teamB.name}
                </div>
              </TableCell>
              <TableCell>
                <Badge variant="outline" className="font-medium shadow-sm">
                  {upcomingMatch.teamB.odds.toFixed(2)}
                </Badge>
              </TableCell>
              <TableCell>
                {upcomingMatch.isLive ? (
                  <Badge variant="default" className="font-medium shadow-sm">
                    <Play className="h-3 w-3 mr-1" />
                    LIVE
                  </Badge>
                ) : (
                  <Badge variant="secondary" className="font-medium shadow-sm">
                    <Clock className="h-3 w-3 mr-1" />
                    Upcoming
                  </Badge>
                )}
              </TableCell>
              {isAdmin && (
                <TableCell className="text-right">
                  <div className="flex justify-end space-x-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onEditUpcomingMatch?.(upcomingMatch)}
                      className="hover:bg-gray-700/50 transition-colors"
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onDeleteUpcomingMatch?.(upcomingMatch._id)}
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
