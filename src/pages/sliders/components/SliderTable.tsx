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
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Title</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Image</TableHead>
            <TableHead>Created At</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {sliders.map((slider) => (
            <TableRow key={slider._id}>
              <TableCell className="font-medium">{slider.title}</TableCell>
              <TableCell>
                <Badge
                  variant={slider.status === "active" ? "default" : "secondary"}
                >
                  {slider.status}
                </Badge>
              </TableCell>
              <TableCell>
                {slider.imageUrl && (
                  <img
                    src={`${API_URL}/${slider.imageUrl}`}
                    alt={slider.title}
                    className="w-16 h-16 object-cover rounded-md"
                  />
                )}
              </TableCell>
              <TableCell>
                {new Date(slider.createdAt).toLocaleDateString()}
              </TableCell>
              <TableCell>
                <div className="flex space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onEditSlider(slider)}
                  >
                    <Pencil className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onDeleteSlider(slider._id)}
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
