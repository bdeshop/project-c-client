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
import { Slider } from "../../../lib/queries";
import { Pencil, Trash2 } from "lucide-react";
import { API_URL } from "../../../lib/api";

interface SliderTableProps {
  sliders: Slider[];
  onEditSlider: (slider: Slider) => void;
  onDeleteSlider: (id: string) => void;
}

export function SliderTable({
  sliders,
  onEditSlider,
  onDeleteSlider,
}: SliderTableProps) {
  // Function to get the full image URL with base URL
  const getFullImageUrl = (imageUrl: string) => {
    if (imageUrl.startsWith("http")) {
      return imageUrl;
    }
    return `${API_URL}/${imageUrl}`;
  };
  console.log("sliders", sliders);

  return (
    <div className="rounded-lg border border-border/50 overflow-hidden shadow-sm">
      <Table>
        <TableHeader>
          <TableRow className="bg-gradient-to-r from-purple-600 via-blue-600 to-indigo-600 dark:from-purple-700 dark:via-blue-700 dark:to-indigo-700 hover:from-purple-700 hover:via-blue-700 hover:to-indigo-700 dark:hover:from-purple-600 dark:hover:via-blue-600 dark:hover:to-indigo-600 border-b-2 border-purple-400 dark:border-purple-500 transition-all duration-300">
            <TableHead className="font-bold text-white">Title</TableHead>
            <TableHead className="font-bold text-white">Status</TableHead>
            <TableHead className="font-bold text-white">Image</TableHead>
            <TableHead className="font-bold text-white">Created At</TableHead>
            <TableHead className="font-bold text-white">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {sliders.map((slider, index) => (
            <TableRow
              key={slider._id}
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
              <TableCell className="font-semibold text-slate-900 dark:text-slate-100 py-4">
                {slider.title}
              </TableCell>
              <TableCell>
                <Badge
                  variant={slider.status === "active" ? "default" : "secondary"}
                  className="font-medium shadow-sm"
                >
                  {slider.status}
                </Badge>
              </TableCell>
              <TableCell>
                {slider.imageUrl && (
                  <img
                    src={`${API_URL}/${slider.imageUrl}`}
                    alt={slider.title}
                    className="w-16 h-16 object-cover rounded-lg shadow-md ring-2 ring-slate-200 dark:ring-slate-700"
                  />
                )}
              </TableCell>
              <TableCell className="text-slate-600 dark:text-slate-400 font-medium">
                {new Date(slider.createdAt).toLocaleDateString()}
              </TableCell>
              <TableCell>
                <div className="flex space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onEditSlider(slider)}
                    className="hover:bg-blue-50 dark:hover:bg-blue-950 transition-colors"
                  >
                    <Pencil className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onDeleteSlider(slider._id)}
                    className="hover:bg-red-50 dark:hover:bg-red-950 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
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
