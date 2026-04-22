import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Gamepad2, Layers, Building2, Plus, Settings, Package, FolderTree } from "lucide-react";
import GameCategoryTab from "./tabs/GameCategoryTab";
import GameListTab from "./tabs/GameListTab";
import ManageGamesTab from "./tabs/ManageGamesTab";
import { CreateGameTab } from "./tabs/CreateGameTab";
import ManageProvidersTab from "./tabs/ManageProvidersTab";

export function GamesConfigPage() {
  const [activeTab, setActiveTab] = useState("categories");

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 dark:from-slate-950 dark:via-purple-950 dark:to-slate-950 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header Section from Jaya Style */}
        <div className="relative overflow-hidden rounded-[2.5rem] bg-white/5 backdrop-blur-xl p-10 shadow-2xl border border-white/10 mb-10 animate-fade-in">
          <div className="absolute top-0 right-0 -mr-20 -mt-20 h-80 w-80 rounded-full bg-purple-500/10 blur-[100px]"></div>
          <div className="relative flex flex-col md:flex-row items-center gap-8">
            <div className="flex h-24 w-24 items-center justify-center rounded-3xl bg-gradient-to-br from-purple-500 via-indigo-500 to-blue-500 text-white shadow-2xl shadow-purple-500/20 ring-4 ring-white/10">
              <Gamepad2 size={48} />
            </div>
            <div className="text-center md:text-left">
              <h1 className="text-4xl font-black tracking-tight text-white md:text-5xl uppercase">
                Games Management
              </h1>
              <p className="mt-3 text-lg font-bold text-purple-200/70 tracking-wide uppercase">
                Synchronize, Categorize & Manage Global Game Assets
              </p>
            </div>
          </div>
        </div>

        {/* Tabs Control Area */}
        <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-[2rem] shadow-2xl overflow-hidden">
          <Tabs
            value={activeTab}
            onValueChange={setActiveTab}
            className="w-full"
          >
            <TabsList className="w-full bg-white/5 border-b border-white/10 rounded-none p-2 h-auto flex flex-wrap gap-2">
              <TabsTrigger
                value="categories"
                className="flex-1 min-w-[150px] rounded-xl transition-all duration-300 py-4 px-6 font-black uppercase text-[11px] tracking-widest text-purple-200/50 data-[state=active]:bg-purple-500 data-[state=active]:text-white hover:bg-white/5 hover:text-white"
              >
                <FolderTree className="w-4 h-4 mr-2" />
                Categories
              </TabsTrigger>
              <TabsTrigger
                value="create"
                className="flex-1 min-w-[150px] rounded-xl transition-all duration-300 py-4 px-6 font-black uppercase text-[11px] tracking-widest text-purple-200/50 data-[state=active]:bg-purple-500 data-[state=active]:text-white hover:bg-white/5 hover:text-white"
              >
                <Plus className="w-4 h-4 mr-2" />
                Create Game
              </TabsTrigger>
              <TabsTrigger
                value="bulk"
                className="flex-1 min-w-[150px] rounded-xl transition-all duration-300 py-4 px-6 font-black uppercase text-[11px] tracking-widest text-purple-200/50 data-[state=active]:bg-purple-500 data-[state=active]:text-white hover:bg-white/5 hover:text-white"
              >
                <Gamepad2 className="w-4 h-4 mr-2" />
                Bulk Deploy
              </TabsTrigger>
              <TabsTrigger
                value="manage"
                className="flex-1 min-w-[150px] rounded-xl transition-all duration-300 py-4 px-6 font-black uppercase text-[11px] tracking-widest text-purple-200/50 data-[state=active]:bg-purple-500 data-[state=active]:text-white hover:bg-white/5 hover:text-white"
              >
                <Settings className="w-4 h-4 mr-2" />
                Manage All
              </TabsTrigger>
              <TabsTrigger
                value="providers"
                className="flex-1 min-w-[150px] rounded-xl transition-all duration-300 py-4 px-6 font-black uppercase text-[11px] tracking-widest text-purple-200/50 data-[state=active]:bg-purple-500 data-[state=active]:text-white hover:bg-white/5 hover:text-white"
              >
                <Package className="w-4 h-4 mr-2" />
                Providers
              </TabsTrigger>
            </TabsList>

            <div className="p-8 min-h-[600px]">
              <TabsContent value="categories" className="animate-fade-in outline-none">
                <GameCategoryTab />
              </TabsContent>
              <TabsContent value="create" className="animate-fade-in outline-none">
                <CreateGameTab />
              </TabsContent>
              <TabsContent value="bulk" className="animate-fade-in outline-none">
                <GameListTab />
              </TabsContent>
              <TabsContent value="manage" className="animate-fade-in outline-none">
                <ManageGamesTab />
              </TabsContent>
              <TabsContent value="providers" className="animate-fade-in outline-none">
                <ManageProvidersTab />
              </TabsContent>
            </div>
          </Tabs>
        </div>
      </div>
    </div>
  );
}

