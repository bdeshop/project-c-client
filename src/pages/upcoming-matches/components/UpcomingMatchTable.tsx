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
  onEditUpcomingMatch: (upcomingMatch: UpcomingMatch) => void;
  onDeleteUpcomingMatch: (id: string) => void;
}

export function UpcomingMatchTable({
  upcomingMatches,
  onEditUpcomingMatch,
  onDeleteUpcomingMatch,
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
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Match</TableHead>
          <TableHead>Category</TableHead>
          <TableHead>Date & Time</TableHead>
          <TableHead>Team A</TableHead>
          <TableHead>Odds A</TableHead>
          <TableHead>Team B</TableHead>
          <TableHead>Odds B</TableHead>
          <TableHead>Status</TableHead>
          <TableHead className="text-right">Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {upcomingMatches.map((upcomingMatch) => (
          <TableRow key={upcomingMatch._id}>
            <TableCell>
              <div className="font-medium">{upcomingMatch.matchType}</div>
            </TableCell>
            <TableCell>
              <Badge variant="secondary">{upcomingMatch.category}</Badge>
            </TableCell>
            <TableCell>
              <div className="font-medium">
                {formatDate(upcomingMatch.matchDate)}
              </div>
              <div className="text-sm text-muted-foreground">
                {getDaysUntilMatch(upcomingMatch.matchDate) > 0 
                  ? `${getDaysUntilMatch(upcomingMatch.matchDate)} days` 
                  : "Today"}
              </div>
            </TableCell>
            <TableCell>
              <div className="font-medium">{upcomingMatch.teamA.name}</div>
            </TableCell>
            <TableCell>
              <Badge variant="outline">{upcomingMatch.teamA.odds.toFixed(2)}</Badge>
            </TableCell>
            <TableCell>
              <div className="font-medium">{upcomingMatch.teamB.name}</div>
            </TableCell>
            <TableCell>
              <Badge variant="outline">{upcomingMatch.teamB.odds.toFixed(2)}</Badge>
            </TableCell>
            <TableCell>
              {upcomingMatch.isLive ? (
                <Badge variant="default">
                  <Play className="h-3 w-3 mr-1" />
                  LIVE
                </Badge>
              ) : (
                <Badge variant="secondary">
                  <Clock className="h-3 w-3 mr-1" />
                  Upcoming
                </Badge>
              )}
            </TableCell>
            <TableCell className="text-right">
              <div className="flex justify-end space-x-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onEditUpcomingMatch(upcomingMatch)}
                >
                  <Edit className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onDeleteUpcomingMatch(upcomingMatch._id)}
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