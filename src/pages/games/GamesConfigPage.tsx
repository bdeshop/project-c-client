import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Gamepad2, Layers, Building2, Plus } from "lucide-react";
import { GameCategoriesTab } from "./tabs/GameCategoriesTab";
import { CreateGameTab } from "./tabs/CreateGameTab";
import { BulkCreateTab } from "./tabs/BulkCreateTab";
import { ManageGamesTab } from "./tabs/ManageGamesTab";

export function GamesConfigPage() {
  const [activeTab, setActiveTab] = useState("categories");

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 dark:from-slate-950 dark:via-purple-950 dark:to-slate-950 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8 animate-fade-in">
          <div className="flex items-center space-x-3 mb-2">
            <div className="w-12 h-12 bg-gradient-to-br from-purple-500 via-blue-500 to-indigo-500 rounded-xl flex items-center justify-center ring-2 ring-purple-400/50 shadow-lg shadow-purple-500/50">
              <Gamepad2 className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-200 to-blue-200 bg-clip-text text-transparent">
                Khela88 Games Management Console
              </h1>
              <p className="text-purple-300 text-sm mt-1">
                Complete game library management with categories and bulk
                operations
              </p>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-gradient-to-br from-slate-800/50 to-purple-800/50 backdrop-blur-xl border border-purple-500/20 rounded-2xl shadow-2xl overflow-hidden">
          <Tabs
            value={activeTab}
            onValueChange={setActiveTab}
            className="w-full"
          >
            <TabsList className="w-full bg-gradient-to-r from-purple-600/20 to-blue-600/20 border-b border-purple-500/20 rounded-none p-0 h-auto overflow-x-auto">
              <TabsTrigger
                value="categories"
                className="flex-1 rounded-none border-b-2 border-transparent data-[state=active]:border-purple-500 data-[state=active]:bg-purple-500/10 transition-all duration-300 py-4 px-6 font-semibold text-purple-200 data-[state=active]:text-white hover:text-white whitespace-nowrap"
              >
                <Layers className="w-4 h-4 mr-2" />
                Categories
              </TabsTrigger>
              <TabsTrigger
                value="create"
                className="flex-1 rounded-none border-b-2 border-transparent data-[state=active]:border-purple-500 data-[state=active]:bg-purple-500/10 transition-all duration-300 py-4 px-6 font-semibold text-purple-200 data-[state=active]:text-white hover:text-white whitespace-nowrap"
              >
                <Plus className="w-4 h-4 mr-2" />
                Create Game
              </TabsTrigger>
              <TabsTrigger
                value="bulk"
                className="flex-1 rounded-none border-b-2 border-transparent data-[state=active]:border-purple-500 data-[state=active]:bg-purple-500/10 transition-all duration-300 py-4 px-6 font-semibold text-purple-200 data-[state=active]:text-white hover:text-white whitespace-nowrap"
              >
                <Building2 className="w-4 h-4 mr-2" />
                Bulk Create
              </TabsTrigger>
              <TabsTrigger
                value="manage"
                className="flex-1 rounded-none border-b-2 border-transparent data-[state=active]:border-purple-500 data-[state=active]:bg-purple-500/10 transition-all duration-300 py-4 px-6 font-semibold text-purple-200 data-[state=active]:text-white hover:text-white whitespace-nowrap"
              >
                <Gamepad2 className="w-4 h-4 mr-2" />
                Manage Games
              </TabsTrigger>
            </TabsList>

            <div className="p-6">
              <TabsContent value="categories" className="animate-fade-in">
                <GameCategoriesTab />
              </TabsContent>
              <TabsContent value="create" className="animate-fade-in">
                <CreateGameTab />
              </TabsContent>
              <TabsContent value="bulk" className="animate-fade-in">
                <BulkCreateTab />
              </TabsContent>
              <TabsContent value="manage" className="animate-fade-in">
                <ManageGamesTab />
              </TabsContent>
            </div>
          </Tabs>
        </div>
      </div>
    </div>
  );
}
