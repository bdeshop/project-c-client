import { useSearchParams } from "react-router-dom";
import {
  Gamepad2,
  Plus,
  Settings,
  Package,
  FolderTree,
} from "lucide-react";
import GameCategoryTab from "./tabs/GameCategoryTab";
import GameListTab from "./tabs/GameListTab";
import ManageGamesTab from "./tabs/ManageGamesTab";
import { CreateGameTab } from "./tabs/CreateGameTab";
import ManageProvidersTab from "./tabs/ManageProvidersTab";

interface MenuItem {
  id: string;
  label: string;
  icon: React.ReactNode;
  component: React.ReactNode;
}

export function GamesConfigPage() {
  const [searchParams] = useSearchParams();
  const activeMenu = searchParams.get("tab") || "categories";

  const menuItems: MenuItem[] = [
    {
      id: "categories",
      label: "Game Categories",
      icon: <FolderTree className="w-5 h-5" />,
      component: <GameCategoryTab />,
    },
    {
      id: "create",
      label: "Create Game",
      icon: <Plus className="w-5 h-5" />,
      component: <CreateGameTab />,
    },
    {
      id: "bulk",
      label: "Bulk Deploy",
      icon: <Gamepad2 className="w-5 h-5" />,
      component: <GameListTab />,
    },
    {
      id: "manage",
      label: "Manage All Games",
      icon: <Settings className="w-5 h-5" />,
      component: <ManageGamesTab />,
    },
    {
      id: "providers",
      label: "Game Providers",
      icon: <Package className="w-5 h-5" />,
      component: <ManageProvidersTab />,
    },
  ];

  const activeItem = menuItems.find((item) => item.id === activeMenu) || menuItems[0];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 dark:from-slate-950 dark:via-purple-950 dark:to-slate-950 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
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

        {/* Content Area */}
        <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-[2rem] shadow-2xl overflow-hidden">
          <div className="border-b border-white/10 px-8 py-6">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-purple-500 to-indigo-500 text-white">
                {activeItem.icon}
              </div>
              <h2 className="text-2xl font-black uppercase tracking-tight text-white">
                {activeItem.label}
              </h2>
            </div>
          </div>
          <div className="p-8 min-h-[600px] animate-fade-in">
            {activeItem.component}
          </div>
        </div>
      </div>
    </div>
  );
}

