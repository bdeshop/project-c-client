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
import { useUserProfile } from "../../lib/queries";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "../../components/ui/tabs";
import { ProfileHeader } from "./components/ProfileHeader";
import { ProfileInfo } from "./components/ProfileInfo";
import { ProfileEdit } from "./components/ProfileEdit";
import { ProfileStats } from "./components/ProfileStats";
import { User, Settings, BarChart3 } from "lucide-react";

export function ProfilePage() {
  const { data: userProfile, isLoading } = useUserProfile();
  const [activeTab, setActiveTab] = useState("overview");

  if (isLoading) {
    return (
      <div className="p-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Breadcrumb */}
        <Breadcrumb items={[{ label: "Profile" }]} />

        {/* Profile Header */}
        <ProfileHeader user={userProfile?.user} />

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-3 max-w-md">
            <TabsTrigger value="overview" className="flex items-center gap-2">
              <User className="h-4 w-4" />
              Overview
            </TabsTrigger>
            <TabsTrigger value="edit" className="flex items-center gap-2">
              <Settings className="h-4 w-4" />
              Edit Profile
            </TabsTrigger>
            <TabsTrigger value="stats" className="flex items-center gap-2">
              <BarChart3 className="h-4 w-4" />
              Statistics
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6 mt-6">
            <ProfileInfo user={userProfile?.user} />
          </TabsContent>

          <TabsContent value="edit" className="space-y-6 mt-6">
            <ProfileEdit user={userProfile?.user} />
          </TabsContent>

          <TabsContent value="stats" className="space-y-6 mt-6">
            <ProfileStats user={userProfile?.user} />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
