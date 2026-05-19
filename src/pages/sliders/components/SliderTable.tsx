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
          <TableRow className="bg-yellow-400 hover:bg-yellow-500 border-b-2 border-yellow-500 transition-all duration-300">
            <TableHead className="font-bold text-gray-900">Title</TableHead>
            <TableHead className="font-bold text-gray-900">Status</TableHead>
            <TableHead className="font-bold text-gray-900">Image</TableHead>
            <TableHead className="font-bold text-gray-900">Created At</TableHead>
            <TableHead className="font-bold text-gray-900">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {sliders.map((slider, index) => (
            <TableRow
              key={slider._id}
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
              <TableCell className="font-semibold text-white py-4">
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
                    className="w-16 h-16 object-cover rounded-lg shadow-md ring-2 ring-gray-700/50"
                  />
                )}
              </TableCell>
              <TableCell className="text-gray-400 font-medium">
                {new Date(slider.createdAt).toLocaleDateString()}
              </TableCell>
              <TableCell>
                <div className="flex space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onEditSlider(slider)}
                    className="hover:bg-gray-700/50 transition-colors"
                  >
                    <Pencil className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onDeleteSlider(slider._id)}
                    className="hover:bg-red-500/10 transition-colors text-red-400"
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
