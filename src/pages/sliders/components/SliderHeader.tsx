import { Button } from "../../../components/ui/button";

interface SliderHeaderProps {
  onAddSlider: () => void;
  onEditBannerText?: () => void;
}

export function SliderHeader({ onAddSlider, onEditBannerText }: SliderHeaderProps) {
  return (
    <div className="flex items-center justify-between">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Sliders</h1>
        <p className="text-muted-foreground">
          Manage your website sliders and banners
        </p>
      </div>
      <div className="flex space-x-2">
        {onEditBannerText && (
          <Button variant="outline" onClick={onEditBannerText}>
            Edit Banner Text
          </Button>
        )}
        <Button onClick={onAddSlider}>Add Slider</Button>
      </div>
    </div>
  );
}
