import { Card, CardContent, CardHeader, CardTitle } from "../../../components/ui/card";
import { useBannerText } from "../../../lib/queries";
import { Badge } from "../../../components/ui/badge";
import { Button } from "../../../components/ui/button";

interface BannerTextDisplayProps {
  onEditClick: () => void;
}

export function BannerTextDisplay({ onEditClick }: BannerTextDisplayProps) {
  const { data: bannerText, isLoading, error } = useBannerText();

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Banner Text</CardTitle>
        </CardHeader>
        <CardContent>
          <p>Loading banner text...</p>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Banner Text</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-red-500">Error loading banner text</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Banner Text</CardTitle>
        <Button onClick={onEditClick} variant="outline" size="sm">
          Edit
        </Button>
      </CardHeader>
      <CardContent className="space-y-4">
        {bannerText ? (
          <div className="space-y-3">
            <div>
              <Badge variant="secondary" className="mb-1">English</Badge>
              <p className="text-lg">{bannerText.englishText}</p>
            </div>
            <div>
              <Badge variant="secondary" className="mb-1">Bangla</Badge>
              <p className="text-lg">{bannerText.banglaText}</p>
            </div>
          </div>
        ) : (
          <p>No banner text available</p>
        )}
      </CardContent>
    </Card>
  );
}