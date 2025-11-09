import { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import { Switch } from "../../components/ui/switch";
import { Label } from "../../components/ui/label";
import { Input } from "../../components/ui/input";
import { useTogglePromoSection, useUpdatePromoSection } from "../../lib/mutations";
import { usePromoSection } from "../../lib/queries";
import { useQueryClient } from "@tanstack/react-query";
import { queryKeys } from "../../lib/queries";
import { PromoSection } from "../../lib/queries";

export function PromotionPage() {
  const queryClient = useQueryClient();
  const { data: promoSection, isLoading, error } = usePromoSection();
  const togglePromoSection = useTogglePromoSection();
  const updatePromoSection = useUpdatePromoSection();

  // State for error messages
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const [bannerTitle, setBannerTitle] = useState(promoSection?.banner.title || "");
  const [bannerSubtitle, setBannerSubtitle] = useState(promoSection?.banner.subtitle || "");
  const [bannerCtaText, setBannerCtaText] = useState(promoSection?.banner.ctaText || "");
  const [bannerCtaLink, setBannerCtaLink] = useState(promoSection?.banner.ctaLink || "");
  const [bannerImage, setBannerImage] = useState(promoSection?.banner.image || "");
  
  const [videoTitle, setVideoTitle] = useState(promoSection?.video.title || "");
  const [videoUrl, setVideoUrl] = useState(promoSection?.video.youtubeUrl || "");
  const [videoThumbnail, setVideoThumbnail] = useState(promoSection?.video.thumbnail || "");
  
  const [extraBannerImage, setExtraBannerImage] = useState(promoSection?.extraBanner.image || "");
  const [extraBannerLink, setExtraBannerLink] = useState(promoSection?.extraBanner.link || "");

  // Update form fields when promoSection data changes
  useEffect(() => {
    if (promoSection) {
      setBannerTitle(promoSection.banner.title);
      setBannerSubtitle(promoSection.banner.subtitle || "");
      setBannerCtaText(promoSection.banner.ctaText);
      setBannerCtaLink(promoSection.banner.ctaLink);
      setBannerImage(promoSection.banner.image);
      
      setVideoTitle(promoSection.video.title);
      setVideoUrl(promoSection.video.youtubeUrl);
      setVideoThumbnail(promoSection.video.thumbnail || "");
      
      setExtraBannerImage(promoSection.extraBanner.image || "");
      setExtraBannerLink(promoSection.extraBanner.link || "");
    }
  }, [promoSection]);

  const handleSave = () => {
    updatePromoSection.mutate({
      banner: {
        title: bannerTitle,
        subtitle: bannerSubtitle,
        ctaText: bannerCtaText,
        ctaLink: bannerCtaLink,
        image: bannerImage,
      },
      video: {
        title: videoTitle,
        youtubeUrl: videoUrl,
        thumbnail: videoThumbnail,
      },
      extraBanner: {
        image: extraBannerImage,
        link: extraBannerLink,
      },
      isActive: promoSection?.isActive ?? true,
    }, {
      onSuccess: () => {
        // Invalidate the query to refetch the updated data
        queryClient.invalidateQueries({ queryKey: queryKeys.promoSection });
      }
    });
  };

  const handleToggleActive = () => {
    // Clear any previous error messages
    setErrorMessage(null);
    
    // Optimistically update the UI
    const newIsActive = !promoSection?.isActive;
    
    // Update the query data immediately for instant feedback
    queryClient.setQueryData(
      queryKeys.promoSection, 
      (oldData: PromoSection | undefined) => {
        if (!oldData) return oldData;
        return {
          ...oldData,
          isActive: newIsActive
        };
      }
    );

    togglePromoSection.mutate(undefined, {
      onSuccess: (response) => {
        // Log the response to understand its structure
        console.log("Toggle success response:", response);
        
        // Extract the promoSection object from the response
        // The query uses a select function that extracts promoSection from response.data.data.promoSection
        // So we need to provide the same extracted object to the cache
        try {
          if (response && response.data && response.data.data && response.data.data.promoSection) {
            queryClient.setQueryData(queryKeys.promoSection, response.data.data.promoSection);
          } else {
            // If structure is different, invalidate the query to refetch the data
            queryClient.invalidateQueries({ queryKey: queryKeys.promoSection });
          }
        } catch (error) {
          console.error("Error updating promo section cache:", error);
          // Fallback to invalidating the query
          queryClient.invalidateQueries({ queryKey: queryKeys.promoSection });
        }
      },
      onError: (error: unknown) => {
        // Revert the optimistic update if there's an error
        queryClient.setQueryData(
          queryKeys.promoSection, 
          (oldData: PromoSection | undefined) => {
            if (!oldData) return oldData;
            return {
              ...oldData,
              isActive: !newIsActive // Revert to previous state
            };
          }
        );
        // Set error message for display
        let errorMessage = "Failed to update promo section status. Please try again.";
        if (error instanceof Error) {
          errorMessage = error.message;
        } else if (typeof error === 'string') {
          errorMessage = error;
        }
        setErrorMessage(errorMessage);
        console.error("Failed to toggle promo section:", error);
      }
    });
  };

  if (isLoading) {
    return <div className="p-6">Loading...</div>;
  }

  if (error) {
    return (
      <div className="p-6">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
          <strong className="font-bold">Error: </strong>
          <span className="block sm:inline">
            Error loading promo section: {error instanceof Error ? error.message : "Unknown error"}
          </span>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Show error message if there's an error with toggle operation */}
        {errorMessage && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
            <div className="flex items-center">
              <strong className="font-bold">Error: </strong>
              <span className="block sm:inline ml-2">{errorMessage}</span>
              <button 
                onClick={() => setErrorMessage(null)} 
                className="absolute top-0 bottom-0 right-0 px-4 py-3"
              >
                <span className="text-red-500 text-2xl leading-none">&times;</span>
              </button>
            </div>
          </div>
        )}
        
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Promotion Management</h1>
            <p className="text-muted-foreground">
              Manage your website promotion section
            </p>
          </div>
          {/* <div className="flex items-center space-x-2">
            <Label htmlFor="active-toggle">Active</Label>
            <Switch
              id="active-toggle"
              checked={promoSection?.isActive}
              onCheckedChange={handleToggleActive}
              disabled={togglePromoSection.isPending}
            />
            {togglePromoSection.isPending && (
              <span className="text-sm text-muted-foreground">Updating...</span>
            )}
          </div> */}
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Banner Settings</CardTitle>
            <CardDescription>
              Configure the main promotional banner
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="banner-title">Title</Label>
                <Input
                  id="banner-title"
                  value={bannerTitle}
                  onChange={(e) => setBannerTitle(e.target.value)}
                  placeholder="Enter banner title"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="banner-subtitle">Subtitle</Label>
                <Input
                  id="banner-subtitle"
                  value={bannerSubtitle}
                  onChange={(e) => setBannerSubtitle(e.target.value)}
                  placeholder="Enter banner subtitle"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="banner-cta-text">CTA Text</Label>
                <Input
                  id="banner-cta-text"
                  value={bannerCtaText}
                  onChange={(e) => setBannerCtaText(e.target.value)}
                  placeholder="Enter CTA text"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="banner-cta-link">CTA Link</Label>
                <Input
                  id="banner-cta-link"
                  value={bannerCtaLink}
                  onChange={(e) => setBannerCtaLink(e.target.value)}
                  placeholder="Enter CTA link"
                />
              </div>
              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="banner-image">Image URL</Label>
                <Input
                  id="banner-image"
                  value={bannerImage}
                  onChange={(e) => setBannerImage(e.target.value)}
                  placeholder="Enter banner image URL"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Video Settings</CardTitle>
            <CardDescription>
              Configure the promotional video
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="video-title">Title</Label>
                <Input
                  id="video-title"
                  value={videoTitle}
                  onChange={(e) => setVideoTitle(e.target.value)}
                  placeholder="Enter video title"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="video-url">YouTube URL</Label>
                <Input
                  id="video-url"
                  value={videoUrl}
                  onChange={(e) => setVideoUrl(e.target.value)}
                  placeholder="Enter YouTube video URL"
                />
              </div>
              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="video-thumbnail">Thumbnail URL</Label>
                <Input
                  id="video-thumbnail"
                  value={videoThumbnail}
                  onChange={(e) => setVideoThumbnail(e.target.value)}
                  placeholder="Enter video thumbnail URL"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Extra Banner Settings</CardTitle>
            <CardDescription>
              Configure the additional promotional banner
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="extra-banner-image">Image URL</Label>
                <Input
                  id="extra-banner-image"
                  value={extraBannerImage}
                  onChange={(e) => setExtraBannerImage(e.target.value)}
                  placeholder="Enter extra banner image URL"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="extra-banner-link">Link URL</Label>
                <Input
                  id="extra-banner-link"
                  value={extraBannerLink}
                  onChange={(e) => setExtraBannerLink(e.target.value)}
                  placeholder="Enter extra banner link URL"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="flex justify-end">
          <Button onClick={handleSave} disabled={updatePromoSection.isPending}>
            {updatePromoSection.isPending ? "Saving..." : "Save Changes"}
          </Button>
        </div>
      </div>
    </div>
  );
}