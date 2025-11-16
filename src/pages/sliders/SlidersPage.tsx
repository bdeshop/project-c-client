"use client";
import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../../components/ui/card";
import { Breadcrumb } from "../../components/ui/breadcrumb";
import { useSliders } from "../../lib/queries";
import {
  SliderTable,
  AddSliderDialog,
  BannerTextDisplay,
  EditBannerTextDialog,
  EditSliderDialog,
  SliderHeader,
  SliderLoadingStates,
} from "./components";
import { useSliderActions } from "./hooks";

export function SlidersPage() {
  const {
    isAddSliderOpen,
    isEditSliderOpen,
    newSlider,
    editSlider,
    createSliderMutation,
    updateSliderMutation,
    deleteSliderMutation,
    setNewSlider,
    setEditSlider,
    handleOpenAddSlider,
    handleCloseAddDialog,
    handleCloseEditDialog,
    handleEditSlider,
    handleAddSlider,
    handleUpdateSlider,
    handleDeleteSlider,
  } = useSliderActions();

  const [isEditBannerTextOpen, setIsEditBannerTextOpen] = useState(false);

  // Fetch sliders using TanStack Query
  const { data: slidersData, isLoading, error, refetch } = useSliders();

  return (
    <div className="p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Breadcrumb */}
        <Breadcrumb items={[{ label: "Sliders" }]} />

        {/* Header */}
        <SliderHeader
          onAddSlider={handleOpenAddSlider}
          onEditBannerText={() => setIsEditBannerTextOpen(true)}
        />

        {/* Banner Text Display */}
        <BannerTextDisplay onEditClick={() => setIsEditBannerTextOpen(true)} />

        {/* Edit Banner Text Dialog */}
        <EditBannerTextDialog
          isOpen={isEditBannerTextOpen}
          onClose={() => setIsEditBannerTextOpen(false)}
        />

        {/* Add Slider Dialog */}
        <AddSliderDialog
          isOpen={isAddSliderOpen}
          onClose={handleCloseAddDialog}
          newSlider={newSlider}
          onSliderChange={setNewSlider}
          onSubmit={() => handleAddSlider(refetch)}
          isLoading={createSliderMutation.isPending}
        />

        {/* Edit Slider Dialog */}
        <EditSliderDialog
          isOpen={isEditSliderOpen}
          onClose={handleCloseEditDialog}
          editSlider={editSlider}
          onSliderChange={setEditSlider}
          onSubmit={() => handleUpdateSlider(refetch)}
          isLoading={updateSliderMutation.isPending}
        />

        {/* Sliders Table */}
        <Card>
          <CardHeader>
            <CardTitle>Slider Management</CardTitle>
            <CardDescription>
              Manage your website sliders and banners
            </CardDescription>
          </CardHeader>
          <CardContent>
            {/* Loading, Error, and Empty States */}
            <SliderLoadingStates
              isLoading={isLoading}
              error={error}
              hasSliders={slidersData?.length > 0}
            />

            {/* Sliders Table */}
            {!isLoading && !error && slidersData && slidersData.length > 0 && (
              <SliderTable
                sliders={slidersData}
                onEditSlider={handleEditSlider}
                onDeleteSlider={(id) => handleDeleteSlider(id, refetch)}
              />
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
