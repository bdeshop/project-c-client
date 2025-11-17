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
          <TableRow className="bg-gradient-to-r from-purple-600 via-blue-600 to-indigo-600 dark:from-purple-700 dark:via-blue-700 dark:to-indigo-700 hover:from-purple-700 hover:via-blue-700 hover:to-indigo-700 dark:hover:from-purple-600 dark:hover:via-blue-600 dark:hover:to-indigo-600 border-b-2 border-purple-400 dark:border-purple-500 transition-all duration-300">
            <TableHead className="font-bold text-white">Match</TableHead>
            <TableHead className="font-bold text-white">Category</TableHead>
            <TableHead className="font-bold text-white">Date & Time</TableHead>
            <TableHead className="font-bold text-white">Team A</TableHead>
            <TableHead className="font-bold text-white">Odds A</TableHead>
            <TableHead className="font-bold text-white">Team B</TableHead>
            <TableHead className="font-bold text-white">Odds B</TableHead>
            <TableHead className="font-bold text-white">Status</TableHead>
            {isAdmin && (
              <TableHead className="text-right font-bold text-white">
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
                <div className="font-semibold text-slate-900 dark:text-slate-100">
                  {upcomingMatch.matchType}
                </div>
              </TableCell>
              <TableCell>
                <Badge variant="secondary" className="font-medium shadow-sm">
                  {upcomingMatch.category}
                </Badge>
              </TableCell>
              <TableCell>
                <div className="font-semibold text-slate-900 dark:text-slate-100">
                  {formatDate(upcomingMatch.matchDate)}
                </div>
                <div className="text-sm text-slate-600 dark:text-slate-400">
                  {getDaysUntilMatch(upcomingMatch.matchDate) > 0
                    ? `${getDaysUntilMatch(upcomingMatch.matchDate)} days`
                    : "Today"}
                </div>
              </TableCell>
              <TableCell>
                <div className="font-semibold text-slate-900 dark:text-slate-100">
                  {upcomingMatch.teamA.name}
                </div>
              </TableCell>
              <TableCell>
                <Badge variant="outline" className="font-medium shadow-sm">
                  {upcomingMatch.teamA.odds.toFixed(2)}
                </Badge>
              </TableCell>
              <TableCell>
                <div className="font-semibold text-slate-900 dark:text-slate-100">
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
                      className="hover:bg-blue-50 dark:hover:bg-blue-950 transition-colors"
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onDeleteUpcomingMatch?.(upcomingMatch._id)}
                      className="hover:bg-red-50 dark:hover:bg-red-950 transition-colors"
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
