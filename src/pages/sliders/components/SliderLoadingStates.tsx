import { Loader2, AlertCircle } from "lucide-react";

interface SliderLoadingStatesProps {
  isLoading: boolean;
  error: Error | null;
  hasSliders: boolean;
}

export function SliderLoadingStates({
  isLoading,
  error,
  hasSliders,
}: SliderLoadingStatesProps) {
  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-8">
        <Loader2 className="w-6 h-6 animate-spin mr-2" />
        <span>Loading sliders...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center py-8 text-destructive">
        <AlertCircle className="w-5 h-5 mr-2" />
        <span>Error loading sliders: {error.message}</span>
      </div>
    );
  }

  if (!hasSliders) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        No sliders found.
      </div>
    );
  }

  return null;
}
