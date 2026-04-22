import { useState, useEffect } from "react";
import {
  getOracleProviders,
  getOracleProviderGames,
  getOracleGameDetails,
} from "../../lib/api";
import { Gamepad2, ChevronRight, Search, Zap, Loader2 } from "lucide-react";
import { Input } from "../../components/ui/input";
import { Button } from "../../components/ui/button";

interface Provider {
  _id: string;
  providerCode: string;
  providerName: string;
  gameType: string;
}

interface Game {
  _id: string;
  game_code: string;
  gameName: string;
  game_type: string;
  image: string;
  rtp: number;
  jackpot: string;
  freeTry: string;
  provider_code: string;
}

interface GameDetails extends Game {
  provider?: {
    provider_code: string;
    providerName: string;
    gameType: string;
  };
}

export function OracleGamesPage() {
  const [providers, setProviders] = useState<Provider[]>([]);
  const [selectedProvider, setSelectedProvider] = useState<Provider | null>(
    null,
  );
  const [games, setGames] = useState<Game[]>([]);
  const [selectedGame, setSelectedGame] = useState<GameDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    fetchProviders();
  }, []);

  const fetchProviders = async () => {
    try {
      setLoading(true);
      setError("");
      const response = await getOracleProviders();
      setProviders(response.providers || []);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to fetch providers",
      );
      console.error("Error fetching providers:", err);
    } finally {
      setLoading(false);
    }
  };

  const fetchProviderGames = async (provider: Provider) => {
    try {
      setLoading(true);
      setError("");
      setSelectedProvider(provider);
      setSelectedGame(null);
      const response = await getOracleProviderGames(provider.providerCode);
      setGames(response.games || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch games");
      console.error("Error fetching games:", err);
    } finally {
      setLoading(false);
    }
  };

  const fetchGameDetails = async (game: Game) => {
    try {
      setLoading(true);
      setError("");
      const response = await getOracleGameDetails(game._id);
      setSelectedGame(response.game);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to fetch game details",
      );
      console.error("Error fetching game details:", err);
    } finally {
      setLoading(false);
    }
  };

  const filteredGames = games.filter((game) =>
    game.gameName.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="rounded-3xl border bg-slate-900/50 p-8 text-white backdrop-blur-xl border-purple-500/20 shadow-2xl relative overflow-hidden group">
        <div className="absolute inset-0 bg-gradient-to-r from-purple-600/10 via-blue-600/10 to-indigo-600/10 group-hover:scale-110 transition-transform duration-700" />
        <div className="relative z-10 flex items-center gap-6">
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-purple-500 via-blue-500 to-indigo-500 text-white shadow-lg shadow-purple-500/50 animate-pulse">
            <Gamepad2 size={32} />
          </div>
          <div>
            <h1 className="text-3xl font-black uppercase tracking-tight bg-gradient-to-r from-purple-200 to-blue-200 bg-clip-text text-transparent">
              Oracle Games Integration
            </h1>
            <p className="text-purple-300 font-medium">
              Browse and inspect providers and games directly from Oracle Games API
            </p>
          </div>
          <Button 
            variant="outline" 
            className="ml-auto border-purple-500/30 bg-purple-500/10 text-purple-200 hover:bg-purple-500/20"
            onClick={fetchProviders}
          >
            Refresh Providers
          </Button>
        </div>
      </div>

      {error && (
        <div className="rounded-2xl border border-red-500/30 bg-red-500/10 p-4 text-red-400 backdrop-blur-md">
          <p className="flex items-center gap-2 font-bold text-sm uppercase tracking-widest">
            <span>⚠️ Error:</span>
            {error}
          </p>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Providers List */}
        <div className="rounded-3xl border border-purple-500/20 bg-slate-900/40 shadow-xl backdrop-blur-md overflow-hidden flex flex-col h-[700px]">
          <div className="border-b border-purple-500/20 p-6 bg-purple-500/5">
            <h2 className="font-black text-xs uppercase tracking-[0.2em] text-purple-300">
              Available Providers ({providers.length})
            </h2>
          </div>
          <div className="flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-purple-500/50 scrollbar-track-transparent">
            {loading && providers.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full gap-4">
                    <Loader2 className="w-8 h-8 text-purple-400 animate-spin" />
                    <p className="text-purple-300 font-bold text-xs uppercase tracking-widest animate-pulse">Fetching Providers...</p>
                </div>
            ) : providers.map((provider) => (
              <button
                key={provider._id}
                onClick={() => fetchProviderGames(provider)}
                className={`w-full text-left px-6 py-4 border-b border-purple-500/10 transition-all group relative overflow-hidden ${
                  selectedProvider?._id === provider._id
                    ? "bg-purple-500/20 text-white shadow-inner"
                    : "text-purple-100 hover:bg-purple-500/10"
                }`}
              >
                <div className="relative z-10 flex items-center justify-between">
                  <div>
                    <p className="font-bold text-sm tracking-wide group-hover:translate-x-1 transition-transform">
                      {provider.providerName}
                    </p>
                    <p className="text-[10px] font-black uppercase tracking-widest text-purple-400/80">
                      {provider.gameType} | {provider.providerCode}
                    </p>
                  </div>
                  <ChevronRight size={16} className={`transition-transform duration-300 ${selectedProvider?._id === provider._id ? "translate-x-2" : "group-hover:translate-x-1 opacity-50"}`} />
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Games List */}
        <div className="rounded-3xl border border-purple-500/20 bg-slate-900/40 shadow-xl backdrop-blur-md overflow-hidden flex flex-col h-[700px]">
          <div className="border-b border-purple-500/20 p-6 bg-purple-500/5 space-y-4">
            <h2 className="font-black text-xs uppercase tracking-[0.2em] text-purple-300">
              Games ({filteredGames.length})
            </h2>
            <div className="relative">
              <Search
                size={16}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-purple-400/60"
              />
              <Input
                placeholder="Search games..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 h-10 bg-slate-950/50 border-purple-500/30 text-white placeholder:text-purple-500/30 text-sm rounded-xl focus:ring-purple-500/20"
              />
            </div>
          </div>
          <div className="flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-purple-500/50 scrollbar-track-transparent">
            {loading && games.length === 0 && selectedProvider ? (
                <div className="flex flex-col items-center justify-center h-full gap-4">
                    <Loader2 className="w-8 h-8 text-purple-400 animate-spin" />
                    <p className="text-purple-300 font-bold text-xs uppercase tracking-widest animate-pulse">Loading Games...</p>
                </div>
            ) : filteredGames.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full p-8 text-center text-purple-300/50">
                <Zap size={40} className="mb-4 opacity-10" />
                <p className="font-bold text-sm tracking-widest uppercase">
                  {selectedProvider ? "No matches found" : "Select a provider"}
                </p>
              </div>
            ) : (
              filteredGames.map((game) => (
                <button
                  key={game._id}
                  onClick={() => fetchGameDetails(game)}
                  className={`w-full text-left px-6 py-4 border-b border-purple-500/10 transition-all group relative overflow-hidden ${
                    selectedGame?._id === game._id
                      ? "bg-purple-500/20 text-white shadow-inner"
                      : "text-purple-100 hover:bg-purple-500/10"
                  }`}
                >
                  <div className="relative z-10 flex items-center gap-4">
                    <div className="relative h-12 w-12 flex-shrink-0 overflow-hidden rounded-xl border border-purple-500/30">
                        <img
                        src={game.image}
                        alt={game.gameName}
                        className="h-full w-full object-cover group-hover:scale-110 transition-transform duration-500"
                        />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-bold text-sm truncate tracking-wide">
                        {game.gameName}
                      </p>
                      <p className="text-[10px] font-black uppercase tracking-[0.2em] text-purple-400/80">
                        RTP: {game.rtp}% | {game.game_type}
                      </p>
                    </div>
                  </div>
                </button>
              ))
            )}
          </div>
        </div>

        {/* Game Details */}
        <div className="rounded-3xl border border-purple-500/20 bg-slate-900/40 shadow-xl backdrop-blur-md overflow-hidden flex flex-col h-[700px]">
          <div className="border-b border-purple-500/20 p-6 bg-purple-500/5">
            <h2 className="font-black text-xs uppercase tracking-[0.2em] text-purple-300">
              Game Details
            </h2>
          </div>
          <div className="flex-1 overflow-y-auto p-6 scrollbar-thin scrollbar-thumb-purple-500/50 scrollbar-track-transparent">
            {loading && selectedGame === null && selectedProvider && games.length > 0 ? (
                <div className="flex flex-col items-center justify-center h-full gap-4">
                    <Loader2 className="w-8 h-8 text-purple-400 animate-spin" />
                </div>
            ) : selectedGame ? (
              <div className="space-y-8 animate-fade-in">
                <div className="relative group/img rounded-2xl overflow-hidden border-2 border-purple-500/30 shadow-2xl">
                  <img
                    src={selectedGame.image}
                    alt={selectedGame.gameName}
                    className="w-full h-56 object-cover group-hover/img:scale-105 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent" />
                </div>

                <div className="space-y-6">
                  <div className="p-4 rounded-2xl bg-white/5 border border-white/10">
                    <p className="text-[10px] font-black uppercase text-purple-400 tracking-[0.3em] mb-1">
                      Full Game Name
                    </p>
                    <p className="font-black text-xl text-white tracking-tight leading-none bg-gradient-to-r from-white to-purple-200 bg-clip-text text-transparent">
                        {selectedGame.gameName}
                    </p>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-4 rounded-2xl bg-white/5 border border-white/10">
                        <p className="text-[10px] font-black uppercase text-purple-500/60 tracking-widest mb-1">
                        Game Code
                        </p>
                        <p className="font-mono text-sm text-purple-100">{selectedGame.game_code}</p>
                    </div>
                    <div className="p-4 rounded-2xl bg-white/5 border border-white/10">
                        <p className="text-[10px] font-black uppercase text-purple-500/60 tracking-widest mb-1">
                        Type
                        </p>
                        <p className="font-bold text-sm text-purple-100">{selectedGame.game_type}</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-4">
                    <div className="p-4 rounded-2xl bg-white/5 border border-white/10 text-center">
                        <p className="text-[10px] font-black uppercase text-purple-500/60 tracking-widest mb-1">RTP</p>
                        <p className="font-black text-lg text-emerald-400">{selectedGame.rtp}%</p>
                    </div>
                    <div className="p-4 rounded-2xl bg-white/5 border border-white/10 text-center">
                        <p className="text-[10px] font-black uppercase text-purple-500/60 tracking-widest mb-1">Jackpot</p>
                        <p className={`font-black text-lg ${selectedGame.jackpot === "TRUE" ? "text-amber-400" : "text-slate-600"}`}>
                            {selectedGame.jackpot === "TRUE" ? "YES" : "NO"}
                        </p>
                    </div>
                    <div className="p-4 rounded-2xl bg-white/5 border border-white/10 text-center">
                        <p className="text-[10px] font-black uppercase text-purple-500/60 tracking-widest mb-1">Free</p>
                        <p className={`font-black text-lg ${selectedGame.freeTry === "TRUE" ? "text-blue-400" : "text-slate-600"}`}>
                            {selectedGame.freeTry === "TRUE" ? "YES" : "NO"}
                        </p>
                    </div>
                  </div>

                  {selectedGame.provider && (
                    <div className="p-6 rounded-2xl bg-gradient-to-br from-purple-500/10 to-blue-500/10 border border-purple-500/20">
                      <p className="text-[10px] font-black uppercase text-purple-400 tracking-[0.3em] mb-4">
                        Provider Information
                      </p>
                      <div className="space-y-3">
                        <div className="flex justify-between items-center">
                            <span className="text-sm font-medium text-purple-300">Name</span>
                            <span className="text-sm font-black text-white">{selectedGame.provider.providerName}</span>
                        </div>
                        <div className="flex justify-between items-center">
                            <span className="text-sm font-medium text-purple-300">Code</span>
                            <span className="text-sm font-mono text-purple-100">{selectedGame.provider.provider_code}</span>
                        </div>
                        <div className="flex justify-between items-center">
                            <span className="text-sm font-medium text-purple-300">Base Type</span>
                            <span className="text-sm font-bold text-purple-100 uppercase">{selectedGame.provider.gameType}</span>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center h-full p-8 text-center text-purple-300/30">
                <Gamepad2 size={48} className="mb-4 opacity-5" />
                <p className="font-bold text-sm tracking-widest uppercase">
                  Select a game to view details
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
