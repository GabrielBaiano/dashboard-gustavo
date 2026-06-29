import { useState, useEffect } from "react";
import {
  Instagram,
  Users,
  Heart,
  MessageCircle,
  TrendingUp,
  Clock,
  Grid,
  Calculator,
  GitCompare,
  Plus,
  Trash2,
  Award,
  ChevronRight,
  Filter,
  ArrowUpDown,
  X,
  PlusCircle,
  Sparkles,
  Info,
} from "lucide-react";
import DefaultLayout from "@/layouts/default";
import { AreaChart, CompareBarChart, HeatmapChart } from "@/components/InstagramCharts";
import { mockProfiles, InstagramProfile, generateMockProfile, Post } from "@/config/mockData";

export default function IndexPage() {
  const [profiles, setProfiles] = useState<InstagramProfile[]>(() => {
    try {
      const saved = localStorage.getItem("yellowhood_profiles");
      return saved ? JSON.parse(saved) : mockProfiles;
    } catch (e) {
      console.error("Failed to load profiles from local storage", e);
      return mockProfiles;
    }
  });
  const [activeUsername, setActiveUsername] = useState<string>(() => {
    try {
      const saved = localStorage.getItem("yellowhood_active_username");
      return saved || "tech_gustavo";
    } catch (e) {
      return "tech_gustavo";
    }
  });
  const [activeTab, setActiveTab] = useState<"overview" | "posts" | "simulator" | "compare">("overview");
  const [showDisclaimer, setShowDisclaimer] = useState(() => {
    try {
      const saved = localStorage.getItem("yellowhood_show_disclaimer");
      return saved !== null ? JSON.parse(saved) : true;
    } catch (e) {
      return true;
    }
  });

  // Form state for adding profile
  const [isAddingProfile, setIsAddingProfile] = useState(false);
  const [newUsername, setNewUsername] = useState("");
  const [newFullName, setNewFullName] = useState("");
  const [newCategory, setNewCategory] = useState("Tecnologia");

  // Filter & Sort state for Posts
  const [postTypeFilter, setPostTypeFilter] = useState<"all" | "photo" | "video" | "carousel" | "reel">("all");
  const [postSortKey, setPostSortKey] = useState<"date" | "likes" | "comments" | "er">("date");

  // Simulator state
  const [simFollowers, setSimFollowers] = useState<number>(45200);
  const [simLikes, setSimLikes] = useState<number>(() => {
    try {
      const saved = localStorage.getItem("yellowhood_sim_likes");
      return saved ? Number(saved) : 2000;
    } catch (e) {
      return 2000;
    }
  });
  const [simComments, setSimComments] = useState<number>(() => {
    try {
      const saved = localStorage.getItem("yellowhood_sim_comments");
      return saved ? Number(saved) : 150;
    } catch (e) {
      return 150;
    }
  });

  // Compare state
  const [compareUser1, setCompareUser1] = useState<string>(() => {
    try {
      const saved = localStorage.getItem("yellowhood_compare_user_1");
      return saved || "tech_gustavo";
    } catch (e) {
      return "tech_gustavo";
    }
  });
  const [compareUser2, setCompareUser2] = useState<string>(() => {
    try {
      const saved = localStorage.getItem("yellowhood_compare_user_2");
      return saved || "gourmet_bites";
    } catch (e) {
      return "gourmet_bites";
    }
  });

  // Selected post for modal inspector
  const [selectedPost, setSelectedPost] = useState<Post | null>(null);

  // Load active profile
  const activeProfile = profiles.find((p) => p.username === activeUsername) || profiles[0];

  // Sync simulator followers with active profile followers when profile changes
  useEffect(() => {
    if (activeProfile) {
      setSimFollowers(activeProfile.followers);
    }
  }, [activeUsername, activeProfile]);

  // Persist states to local storage
  useEffect(() => {
    try {
      localStorage.setItem("yellowhood_profiles", JSON.stringify(profiles));
    } catch (e) {
      console.error("Failed to save profiles to local storage", e);
    }
  }, [profiles]);

  useEffect(() => {
    try {
      localStorage.setItem("yellowhood_active_username", activeUsername);
    } catch (e) {
      console.error("Failed to save active username to local storage", e);
    }
  }, [activeUsername]);

  useEffect(() => {
    try {
      localStorage.setItem("yellowhood_show_disclaimer", JSON.stringify(showDisclaimer));
    } catch (e) {
      console.error("Failed to save disclaimer state to local storage", e);
    }
  }, [showDisclaimer]);

  useEffect(() => {
    try {
      localStorage.setItem("yellowhood_sim_likes", String(simLikes));
    } catch (e) {
      console.error("Failed to save sim likes to local storage", e);
    }
  }, [simLikes]);

  useEffect(() => {
    try {
      localStorage.setItem("yellowhood_sim_comments", String(simComments));
    } catch (e) {
      console.error("Failed to save sim comments to local storage", e);
    }
  }, [simComments]);

  useEffect(() => {
    try {
      localStorage.setItem("yellowhood_compare_user_1", compareUser1);
    } catch (e) {
      console.error("Failed to save compare user 1 to local storage", e);
    }
  }, [compareUser1]);

  useEffect(() => {
    try {
      localStorage.setItem("yellowhood_compare_user_2", compareUser2);
    } catch (e) {
      console.error("Failed to save compare user 2 to local storage", e);
    }
  }, [compareUser2]);

  const handleAddProfile = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newUsername) return;

    const formattedUsername = newUsername.replace("@", "").trim().toLowerCase();
    
    // Check if profile already exists
    if (profiles.some((p) => p.username === formattedUsername)) {
      alert("Este perfil já está cadastrado!");
      return;
    }

    const newProfile = generateMockProfile(
      formattedUsername,
      newFullName || `@${formattedUsername}`,
      newCategory
    );

    const updated = [...profiles, newProfile];
    setProfiles(updated);
    setActiveUsername(formattedUsername);
    setIsAddingProfile(false);
    
    // Reset fields
    setNewUsername("");
    setNewFullName("");
  };

  const handleDeleteProfile = (usernameToDelete: string) => {
    if (profiles.length <= 1) {
      alert("Você deve ter pelo menos um perfil cadastrado.");
      return;
    }
    
    if (confirm(`Tem certeza que deseja excluir o perfil @${usernameToDelete}?`)) {
      const updated = profiles.filter((p) => p.username !== usernameToDelete);
      setProfiles(updated);
      
      // If we deleted the active profile, switch to the first remaining one
      if (activeUsername === usernameToDelete) {
        setActiveUsername(updated[0].username);
      }
    }
  };

  // Process posts filter & sort
  const filteredPosts = activeProfile.posts
    .filter((post) => postTypeFilter === "all" || post.type === postTypeFilter)
    .sort((a, b) => {
      if (postSortKey === "likes") return b.likes - a.likes;
      if (postSortKey === "comments") return b.comments - a.comments;
      if (postSortKey === "er") return b.engagementRate - a.engagementRate;
      return 0; // Keep default mock data chronological order
    });

  // Calculate simulated engagement rate
  const simulatedER = simFollowers > 0 
    ? parseFloat((((simLikes + simComments) / simFollowers) * 100).toFixed(2))
    : 0;

  const getSimulatorRating = (er: number) => {
    if (er >= 6) return { label: "Excelente! 🚀", color: "text-green-400 bg-green-500/10 border-green-500/20" };
    if (er >= 4) return { label: "Muito Bom! 🔥", color: "text-emerald-400 bg-emerald-500/10 border-emerald-500/20" };
    if (er >= 2) return { label: "Médio 👍", color: "text-blue-400 bg-blue-500/10 border-blue-500/20" };
    return { label: "Baixo 📉", color: "text-zinc-400 bg-zinc-500/10 border-zinc-500/20" };
  };

  const compProfile1 = profiles.find((p) => p.username === compareUser1) || profiles[0];
  const compProfile2 = profiles.find((p) => p.username === compareUser2) || profiles[1] || profiles[0];

  const formatNumber = (num: number) => {
    if (num >= 1000000) return (num / 1000000).toFixed(1) + "M";
    if (num >= 1000) return (num / 1000).toFixed(1) + "K";
    return num.toLocaleString();
  };

  return (
    <DefaultLayout>
      <div className="flex flex-col gap-6 pb-16 text-foreground max-w-6xl mx-auto">
        
        {/* YELLOWHOOD DISCLAIMER BANNER */}
        {showDisclaimer && (
          <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-amber-500/10 to-yellow-600/5 border border-yellow-500/20 p-4 shadow-lg backdrop-blur-md flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-xl bg-yellow-500/20 border border-yellow-500/30 text-yellow-500 flex-shrink-0 animate-pulse">
                <Sparkles className="w-5 h-5" />
              </div>
              <div className="pr-4">
                <h3 className="font-bold text-sm text-yellow-500 tracking-wide uppercase">Demonstração Yellowhood</h3>
                <p className="text-xs text-zinc-300 mt-0.5 font-normal">
                  Este painel de engajamento do Instagram é uma demonstração interativa de alta fidelidade desenvolvida pela <strong>Yellowhood</strong>. Todos os dados exibidos são simulados para fins de apresentação e validação de interface.
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <div className="hidden md:block px-3 py-1 rounded-full bg-yellow-500/10 border border-yellow-500/20 text-[10px] font-bold text-yellow-500 uppercase tracking-widest whitespace-nowrap">
                Demo Mode
              </div>
              <button
                onClick={() => setShowDisclaimer(false)}
                className="p-1.5 rounded-lg hover:bg-white/5 text-zinc-400 hover:text-white transition-colors cursor-pointer"
                aria-label="Fechar aviso"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* STORIES STYLE PROFILE BAR */}
        <div className="relative w-full rounded-2xl bg-zinc-950/40 border border-zinc-900 p-4 shadow-xl backdrop-blur-xl">
          <div className="flex items-center justify-between mb-3 px-1">
            <h2 className="text-xs font-bold text-zinc-400 uppercase tracking-widest flex items-center gap-1.5">
              <Instagram className="w-3.5 h-3.5 text-pink-500" />
              Perfis Conectados
            </h2>
            <button
              onClick={() => setIsAddingProfile(!isAddingProfile)}
              className="text-xs font-bold text-pink-500 hover:text-pink-400 transition-colors flex items-center gap-1 px-2.5 py-1 rounded-full bg-pink-500/10 border border-pink-500/20 hover:border-pink-500/40"
            >
              <Plus className="w-3 h-3" /> Adicionar Perfil
            </button>
          </div>

          <div className="flex items-center gap-5 overflow-x-auto py-2 scrollbar-none">
            {profiles.map((profile) => {
              const isActive = profile.username === activeUsername;
              return (
                <div
                  key={profile.username}
                  className="flex flex-col items-center gap-1.5 flex-shrink-0 group"
                >
                  <div
                    onClick={() => setActiveUsername(profile.username)}
                    className={`p-[2.5px] rounded-full transition-all duration-300 cursor-pointer ${
                      isActive
                        ? "bg-gradient-to-tr from-yellow-400 via-pink-500 to-purple-600 scale-105 shadow-[0_0_12px_rgba(236,72,153,0.3)]"
                        : "bg-zinc-800 hover:bg-zinc-600 hover:scale-105"
                    }`}
                  >
                    <div className="bg-black p-[2px] rounded-full">
                      <img
                        className="w-14 h-14 rounded-full object-cover"
                        src={profile.avatar}
                        alt={profile.fullName}
                      />
                    </div>
                  </div>
                  <span className={`text-xs font-bold transition-colors ${
                    isActive ? "text-white" : "text-zinc-400 group-hover:text-zinc-200"
                  }`}>
                    @{profile.username}
                  </span>
                </div>
              );
            })}

            {/* QUICK DUMMY STORIES BUTTON FOR ADDING */}
            <div
              onClick={() => setIsAddingProfile(true)}
              className="flex flex-col items-center gap-1.5 cursor-pointer flex-shrink-0 group"
            >
              <div className="w-16 h-16 rounded-full border border-dashed border-zinc-700 hover:border-zinc-500 flex items-center justify-center transition-all duration-300 group-hover:scale-105 bg-zinc-900/40">
                <PlusCircle className="w-6 h-6 text-zinc-500 group-hover:text-zinc-300 transition-colors" />
              </div>
              <span className="text-xs font-bold text-zinc-500 group-hover:text-zinc-400 transition-colors">
                Novo Perfil
              </span>
            </div>
          </div>
        </div>

        {/* ADD PROFILE EXPANSION PANEL */}
        {isAddingProfile && (
          <div className="w-full rounded-2xl bg-zinc-900/70 border border-zinc-800 p-5 shadow-2xl animate-in fade-in slide-in-from-top-4 duration-300">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-pink-500" />
                Cadastrar Novo Perfil no Dashboard
              </h3>
              <button
                onClick={() => setIsAddingProfile(false)}
                className="p-1.5 rounded-full hover:bg-zinc-800 text-zinc-400 hover:text-white transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleAddProfile} className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-zinc-400">Usuário do Instagram</label>
                <input
                  type="text"
                  required
                  placeholder="@seu_perfil"
                  value={newUsername}
                  onChange={(e) => setNewUsername(e.target.value)}
                  className="bg-black border border-zinc-800 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-pink-500 focus:ring-1 focus:ring-pink-500 transition-all placeholder-zinc-600"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-zinc-400">Nome Completo / Canal</label>
                <input
                  type="text"
                  placeholder="Ex: Gustavo | Tech & Dev"
                  value={newFullName}
                  onChange={(e) => setNewFullName(e.target.value)}
                  className="bg-black border border-zinc-800 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-pink-500 focus:ring-1 focus:ring-pink-500 transition-all placeholder-zinc-600"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-zinc-400">Categoria do Perfil</label>
                <select
                  value={newCategory}
                  onChange={(e) => setNewCategory(e.target.value)}
                  className="bg-black border border-zinc-800 rounded-xl px-3 py-2.5 text-sm text-white focus:outline-none focus:border-pink-500 transition-all"
                >
                  <option value="Tecnologia">Tecnologia & Dev</option>
                  <option value="Gastronomia">Gastronomia & Food</option>
                  <option value="Moda & Beleza">Moda & Beleza</option>
                  <option value="Finanças & Negócios">Finanças & Negócios</option>
                  <option value="Viagem">Viagem & Lazer</option>
                  <option value="Saúde & Fitness">Saúde & Fitness</option>
                </select>
              </div>

              <button
                type="submit"
                className="w-full bg-gradient-to-r from-pink-500 to-purple-600 text-white font-bold text-sm rounded-xl py-2.5 px-4 shadow-[0_0_15px_rgba(236,72,153,0.3)] hover:opacity-90 active:scale-[0.98] transition-all"
              >
                Gerar Demonstração
              </button>
            </form>
          </div>
        )}

        {/* ACTIVE PROFILE OVERVIEW CARD */}
        <div className="w-full rounded-2xl bg-zinc-950/40 border border-zinc-900 p-6 shadow-xl backdrop-blur-xl flex flex-col md:flex-row md:items-center justify-between gap-6 relative overflow-hidden">
          {/* Back gradient glow */}
          <div className="absolute right-0 top-0 w-80 h-80 bg-pink-500/5 rounded-full filter blur-3xl pointer-events-none" />
          
          <div className="flex items-center gap-4">
            <img
              className="w-20 h-20 rounded-full object-cover ring-2 ring-zinc-800 p-1"
              src={activeProfile.avatar}
              alt={activeProfile.fullName}
            />
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <h1 className="text-2xl font-black text-white tracking-tight">{activeProfile.fullName}</h1>
                <span className="px-2.5 py-0.5 rounded-full bg-pink-500/10 border border-pink-500/20 text-pink-500 text-[10px] font-extrabold tracking-wider uppercase">
                  {activeProfile.category}
                </span>
              </div>
              <p className="text-zinc-400 text-sm font-semibold flex items-center gap-1">
                <Instagram className="w-3.5 h-3.5 text-zinc-500" />
                @{activeProfile.username}
              </p>
              <p className="text-xs text-zinc-500 max-w-lg mt-1 italic font-medium">"{activeProfile.bio}"</p>
            </div>
          </div>

          <div className="flex items-center gap-2 self-end md:self-center">
            {/* Display Delete Button if wanted */}
            <button
              onClick={() => handleDeleteProfile(activeProfile.username)}
              className="p-2.5 rounded-xl bg-zinc-900 border border-zinc-800 hover:border-red-500/30 hover:bg-red-500/10 text-zinc-400 hover:text-red-500 transition-all"
              title="Excluir perfil do painel"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* METRICS KPI GRID */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Followers KPI */}
          <div className="p-5 rounded-2xl bg-zinc-950/40 border border-zinc-900 hover:border-zinc-800/80 shadow-lg backdrop-blur-xl transition-all group">
            <div className="flex justify-between items-start">
              <div className="space-y-1">
                <span className="text-xs font-bold text-zinc-500 uppercase tracking-wider">Seguidores</span>
                <p className="text-2xl font-black text-white font-mono tracking-tight">
                  {activeProfile.followers.toLocaleString()}
                </p>
              </div>
              <div className="p-2 bg-pink-500/10 border border-pink-500/20 text-pink-500 rounded-xl group-hover:scale-110 transition-transform">
                <Users className="w-4 h-4" />
              </div>
            </div>
            <div className="mt-4 flex items-center gap-1.5 text-xs text-green-400 font-bold">
              <TrendingUp className="w-3.5 h-3.5" />
              <span>+18.9%</span>
              <span className="text-zinc-600 font-semibold font-sans">este ano</span>
            </div>
          </div>

          {/* Engagement Rate KPI */}
          <div className="p-5 rounded-2xl bg-zinc-950/40 border border-zinc-900 hover:border-zinc-800/80 shadow-lg backdrop-blur-xl transition-all group">
            <div className="flex justify-between items-start">
              <div className="space-y-1">
                <span className="text-xs font-bold text-zinc-500 uppercase tracking-wider">Engajamento</span>
                <p className="text-2xl font-black text-fuchsia-400 font-mono tracking-tight">
                  {activeProfile.engagementRate}%
                </p>
              </div>
              <div className="p-2 bg-fuchsia-500/10 border border-fuchsia-500/20 text-fuchsia-400 rounded-xl group-hover:scale-110 transition-transform">
                <Award className="w-4 h-4" />
              </div>
            </div>
            <div className="mt-4 flex items-center gap-1 text-xs">
              <span className="px-1.5 py-0.5 rounded bg-fuchsia-500/10 text-fuchsia-400 font-extrabold border border-fuchsia-500/20">
                {activeProfile.engagementRate >= 4 ? "Altíssimo" : "Saudável"}
              </span>
              <span className="text-zinc-500 font-semibold">vs média da categoria</span>
            </div>
          </div>

          {/* Average Likes KPI */}
          <div className="p-5 rounded-2xl bg-zinc-950/40 border border-zinc-900 hover:border-zinc-800/80 shadow-lg backdrop-blur-xl transition-all group">
            <div className="flex justify-between items-start">
              <div className="space-y-1">
                <span className="text-xs font-bold text-zinc-500 uppercase tracking-wider">Média de Likes</span>
                <p className="text-2xl font-black text-white font-mono tracking-tight">
                  {formatNumber(Math.round(activeProfile.posts.reduce((acc, p) => acc + p.likes, 0) / activeProfile.posts.length))}
                </p>
              </div>
              <div className="p-2 bg-orange-500/10 border border-orange-500/20 text-orange-400 rounded-xl group-hover:scale-110 transition-transform">
                <Heart className="w-4 h-4" />
              </div>
            </div>
            <div className="mt-4 flex items-center gap-1.5 text-xs text-green-400 font-bold">
              <TrendingUp className="w-3.5 h-3.5" />
              <span>+6.4%</span>
              <span className="text-zinc-600 font-semibold font-sans">últimos posts</span>
            </div>
          </div>

          {/* Average Comments KPI */}
          <div className="p-5 rounded-2xl bg-zinc-950/40 border border-zinc-900 hover:border-zinc-800/80 shadow-lg backdrop-blur-xl transition-all group">
            <div className="flex justify-between items-start">
              <div className="space-y-1">
                <span className="text-xs font-bold text-zinc-500 uppercase tracking-wider">Média Comentários</span>
                <p className="text-2xl font-black text-white font-mono tracking-tight">
                  {formatNumber(Math.round(activeProfile.posts.reduce((acc, p) => acc + p.comments, 0) / activeProfile.posts.length))}
                </p>
              </div>
              <div className="p-2 bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 rounded-xl group-hover:scale-110 transition-transform">
                <MessageCircle className="w-4 h-4" />
              </div>
            </div>
            <div className="mt-4 flex items-center gap-1.5 text-xs text-green-400 font-bold">
              <TrendingUp className="w-3.5 h-3.5" />
              <span>+12.1%</span>
              <span className="text-zinc-600 font-semibold font-sans">este mês</span>
            </div>
          </div>
        </div>

        {/* TABS CONTROL */}
        <div className="w-full flex border-b border-zinc-950 bg-zinc-900/30 p-1 rounded-xl gap-1">
          <button
            onClick={() => setActiveTab("overview")}
            className={`flex-1 flex items-center justify-center gap-2 py-2.5 text-xs font-bold rounded-lg transition-all ${
              activeTab === "overview"
                ? "bg-zinc-950 text-white shadow-md border border-zinc-800"
                : "text-zinc-400 hover:text-zinc-200"
            }`}
          >
            <TrendingUp className="w-4 h-4 text-pink-500" />
            Visão Geral
          </button>
          <button
            onClick={() => setActiveTab("posts")}
            className={`flex-1 flex items-center justify-center gap-2 py-2.5 text-xs font-bold rounded-lg transition-all ${
              activeTab === "posts"
                ? "bg-zinc-950 text-white shadow-md border border-zinc-800"
                : "text-zinc-400 hover:text-zinc-200"
            }`}
          >
            <Grid className="w-4 h-4 text-fuchsia-500" />
            Análise de Posts
          </button>
          <button
            onClick={() => setActiveTab("simulator")}
            className={`flex-1 flex items-center justify-center gap-2 py-2.5 text-xs font-bold rounded-lg transition-all ${
              activeTab === "simulator"
                ? "bg-zinc-950 text-white shadow-md border border-zinc-800"
                : "text-zinc-400 hover:text-zinc-200"
            }`}
          >
            <Calculator className="w-4 h-4 text-orange-500" />
            Simulador de ER
          </button>
          <button
            onClick={() => setActiveTab("compare")}
            className={`flex-1 flex items-center justify-center gap-2 py-2.5 text-xs font-bold rounded-lg transition-all ${
              activeTab === "compare"
                ? "bg-zinc-950 text-white shadow-md border border-zinc-800"
                : "text-zinc-400 hover:text-zinc-200"
            }`}
          >
            <GitCompare className="w-4 h-4 text-cyan-500" />
            Comparativo
          </button>
        </div>

        {/* TAB 1: VISÃO GERAL */}
        {activeTab === "overview" && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 animate-in fade-in duration-300">
            {/* Followers Area Chart */}
            <div className="p-6 rounded-2xl bg-zinc-950/40 border border-zinc-900 shadow-xl backdrop-blur-xl flex flex-col gap-4">
              <div className="flex justify-between items-center">
                <div className="space-y-0.5">
                  <h3 className="text-sm font-bold text-white">Crescimento de Seguidores</h3>
                  <span className="text-[10px] text-zinc-500 uppercase tracking-widest">Histórico Mensal</span>
                </div>
                <div className="text-right">
                  <span className="text-xs font-bold text-green-400">+7,200</span>
                  <p className="text-[10px] text-zinc-500">Últimos 6 meses</p>
                </div>
              </div>
              <div className="py-4">
                <AreaChart
                  data={activeProfile.monthlyHistory.map((h) => ({ label: h.date, value: h.followers }))}
                  color="pink"
                  height={180}
                />
              </div>
            </div>

            {/* Weekly Engagement Rate Area Chart */}
            <div className="p-6 rounded-2xl bg-zinc-950/40 border border-zinc-900 shadow-xl backdrop-blur-xl flex flex-col gap-4">
              <div className="flex justify-between items-center">
                <div className="space-y-0.5">
                  <h3 className="text-sm font-bold text-white">Flutuação de Engajamento</h3>
                  <span className="text-[10px] text-zinc-500 uppercase tracking-widest">Histórico Semanal</span>
                </div>
                <div className="text-right">
                  <span className="text-xs font-bold text-fuchsia-400">ER Médio: {activeProfile.engagementRate}%</span>
                  <p className="text-[10px] text-zinc-500">Último Mês</p>
                </div>
              </div>
              <div className="py-4">
                <AreaChart
                  data={activeProfile.weeklyERHistory.map((w) => ({ label: w.date, value: w.er }))}
                  color="purple"
                  height={180}
                  suffix="%"
                />
              </div>
            </div>

            {/* Posting Times Heatmap */}
            <div className="lg:col-span-2 p-6 rounded-2xl bg-zinc-950/40 border border-zinc-900 shadow-xl backdrop-blur-xl flex flex-col gap-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <h3 className="text-sm font-bold text-white flex items-center gap-1.5">
                    <Clock className="w-4 h-4 text-pink-500" />
                    Melhores Horários para Postar
                  </h3>
                  <p className="text-[10px] text-zinc-500">
                    Nível de engajamento baseado em interações por hora nos últimos 30 dias
                  </p>
                </div>
                <div className="flex gap-2 text-xs bg-zinc-900 border border-zinc-800 rounded-lg p-1">
                  <span className="px-2 py-0.5 rounded text-white font-bold bg-zinc-950 shadow-sm">
                    20:00h
                  </span>
                  <span className="text-zinc-500 font-semibold self-center pr-1.5">Pico de Engajamento</span>
                </div>
              </div>

              <div className="mt-2 py-2 overflow-x-auto">
                <HeatmapChart data={activeProfile.hourlyEngagement} />
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: ANÁLISE DE POSTS */}
        {activeTab === "posts" && (
          <div className="space-y-6 animate-in fade-in duration-300">
            {/* Filter controls */}
            <div className="w-full flex flex-col md:flex-row justify-between gap-4 p-4 rounded-xl bg-zinc-950/40 border border-zinc-900 shadow-lg backdrop-blur-md">
              <div className="flex items-center gap-2 overflow-x-auto scrollbar-none">
                <span className="text-xs font-bold text-zinc-500 flex items-center gap-1 pr-1 flex-shrink-0">
                  <Filter className="w-3.5 h-3.5" /> Filtrar:
                </span>
                {(["all", "photo", "carousel", "reel"] as const).map((type) => (
                  <button
                    key={type}
                    onClick={() => setPostTypeFilter(type)}
                    className={`text-xs font-bold px-3 py-1.5 rounded-lg border transition-all uppercase tracking-wider ${
                      postTypeFilter === type
                        ? "bg-pink-500 border-pink-500 text-white shadow-[0_0_10px_rgba(236,72,153,0.2)]"
                        : "bg-zinc-900/60 border-zinc-800 text-zinc-400 hover:text-zinc-200"
                    }`}
                  >
                    {type === "all" ? "Todos" : type === "carousel" ? "Carrossel" : type === "reel" ? "Reels" : "Foto"}
                  </button>
                ))}
              </div>

              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-zinc-500 flex items-center gap-1 pr-1 flex-shrink-0">
                  <ArrowUpDown className="w-3.5 h-3.5" /> Ordenar:
                </span>
                <select
                  value={postSortKey}
                  onChange={(e) => setPostSortKey(e.target.value as any)}
                  className="bg-zinc-900 border border-zinc-800 rounded-lg text-xs font-bold text-zinc-300 py-1.5 px-3 focus:outline-none focus:border-pink-500 transition-colors"
                >
                  <option value="date">Cronológico</option>
                  <option value="likes">Mais Curtidas</option>
                  <option value="comments">Mais Comentados</option>
                  <option value="er">Maior Engajamento</option>
                </select>
              </div>
            </div>

            {/* Grid display */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {filteredPosts.map((post) => (
                <div
                  key={post.id}
                  onClick={() => setSelectedPost(post)}
                  className="group rounded-2xl bg-zinc-950/40 border border-zinc-900 hover:border-zinc-800/80 shadow-xl overflow-hidden cursor-pointer transition-all duration-300 hover:scale-[1.02] flex flex-col"
                >
                  {/* Image container */}
                  <div className="relative aspect-square overflow-hidden bg-zinc-900">
                    <img
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                      src={post.image}
                      alt="Post content"
                    />
                    
                    {/* Hover overlay overlaying icons */}
                    <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 flex items-center justify-center gap-4 transition-all duration-300 backdrop-blur-xs">
                      <div className="flex items-center gap-1 text-white font-black text-sm">
                        <Heart className="w-5 h-5 fill-white text-white" />
                        {post.likes.toLocaleString()}
                      </div>
                      <div className="flex items-center gap-1 text-white font-black text-sm">
                        <MessageCircle className="w-5 h-5 fill-white text-white" />
                        {post.comments.toLocaleString()}
                      </div>
                    </div>

                    {/* Post Type Badge */}
                    <span className="absolute top-3 left-3 px-2 py-0.5 text-[9px] font-extrabold tracking-wider bg-black/75 text-zinc-300 rounded border border-zinc-800/60 uppercase">
                      {post.type}
                    </span>

                    {/* ER badge in image */}
                    <span className="absolute bottom-3 right-3 px-2 py-0.5 text-[10px] font-bold bg-fuchsia-500 text-white rounded shadow-md border border-fuchsia-400/30">
                      {post.engagementRate}% ER
                    </span>
                  </div>

                  {/* Post details */}
                  <div className="p-4 space-y-2 flex-grow flex flex-col justify-between">
                    <p className="text-xs text-zinc-400 font-medium line-clamp-2 leading-relaxed">
                      {post.caption}
                    </p>
                    <div className="flex justify-between items-center pt-2 border-t border-zinc-900">
                      <span className="text-[10px] font-semibold text-zinc-500">{post.date}</span>
                      <span className="text-[10px] font-bold text-pink-500 flex items-center gap-0.5 hover:underline">
                        Ver detalhes <ChevronRight className="w-3 h-3" />
                      </span>
                    </div>
                  </div>
                </div>
              ))}

              {filteredPosts.length === 0 && (
                <div className="col-span-full py-16 text-center text-zinc-500 font-bold border border-dashed border-zinc-900 rounded-2xl bg-zinc-950/10">
                  Nenhum post corresponde aos filtros.
                </div>
              )}
            </div>
          </div>
        )}

        {/* TAB 3: SIMULADOR DE ENGAJAMENTO */}
        {activeTab === "simulator" && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 animate-in fade-in duration-300">
            {/* Controls */}
            <div className="lg:col-span-2 p-6 rounded-2xl bg-zinc-950/40 border border-zinc-900 shadow-xl backdrop-blur-xl space-y-6">
              <div>
                <h3 className="text-sm font-bold text-white flex items-center gap-1.5">
                  <Calculator className="w-4.5 h-4.5 text-orange-500" />
                  Simulador de Engajamento de Postagem
                </h3>
                <p className="text-xs text-zinc-500 mt-1">
                  Estime a taxa de engajamento do seu próximo post de acordo com as curtidas e comentários esperados.
                </p>
              </div>

              <div className="space-y-6 pt-2">
                {/* Followers slider/input */}
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <label className="text-xs font-bold text-zinc-400 uppercase tracking-wider">Custo de Seguidores Base</label>
                    <input
                      type="number"
                      value={simFollowers}
                      onChange={(e) => setSimFollowers(Number(e.target.value))}
                      className="w-24 bg-zinc-900 border border-zinc-800 rounded-lg text-xs font-bold text-right text-white py-1 px-2 focus:outline-none focus:border-orange-500"
                    />
                  </div>
                  <input
                    type="range"
                    min="1000"
                    max="500000"
                    step="1000"
                    value={simFollowers}
                    onChange={(e) => setSimFollowers(Number(e.target.value))}
                    className="w-full accent-orange-500 bg-zinc-900 rounded-lg h-2"
                  />
                  <div className="flex justify-between text-[10px] text-zinc-600 font-semibold">
                    <span>1K</span>
                    <span>250K</span>
                    <span>500K</span>
                  </div>
                </div>

                {/* Likes slider/input */}
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <label className="text-xs font-bold text-zinc-400 uppercase tracking-wider flex items-center gap-1">
                      <Heart className="w-3.5 h-3.5 text-pink-500 fill-pink-500" /> Curtidas Esperadas
                    </label>
                    <input
                      type="number"
                      value={simLikes}
                      onChange={(e) => setSimLikes(Number(e.target.value))}
                      className="w-24 bg-zinc-900 border border-zinc-800 rounded-lg text-xs font-bold text-right text-white py-1 px-2 focus:outline-none focus:border-orange-500"
                    />
                  </div>
                  <input
                    type="range"
                    min="50"
                    max="20000"
                    step="50"
                    value={simLikes}
                    onChange={(e) => setSimLikes(Number(e.target.value))}
                    className="w-full accent-pink-500 bg-zinc-900 rounded-lg h-2"
                  />
                  <div className="flex justify-between text-[10px] text-zinc-600 font-semibold">
                    <span>50</span>
                    <span>10K</span>
                    <span>20K</span>
                  </div>
                </div>

                {/* Comments slider/input */}
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <label className="text-xs font-bold text-zinc-400 uppercase tracking-wider flex items-center gap-1">
                      <MessageCircle className="w-3.5 h-3.5 text-cyan-400 fill-cyan-400" /> Comentários Esperados
                    </label>
                    <input
                      type="number"
                      value={simComments}
                      onChange={(e) => setSimComments(Number(e.target.value))}
                      className="w-24 bg-zinc-900 border border-zinc-800 rounded-lg text-xs font-bold text-right text-white py-1 px-2 focus:outline-none focus:border-orange-500"
                    />
                  </div>
                  <input
                    type="range"
                    min="5"
                    max="2000"
                    step="5"
                    value={simComments}
                    onChange={(e) => setSimComments(Number(e.target.value))}
                    className="w-full accent-cyan-500 bg-zinc-900 rounded-lg h-2"
                  />
                  <div className="flex justify-between text-[10px] text-zinc-600 font-semibold">
                    <span>5</span>
                    <span>1K</span>
                    <span>2K</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Results display */}
            <div className="p-6 rounded-2xl bg-zinc-950/40 border border-zinc-900 shadow-xl backdrop-blur-xl flex flex-col justify-between gap-6 relative overflow-hidden">
              <div className="absolute right-0 bottom-0 w-60 h-60 bg-orange-500/5 rounded-full filter blur-2xl pointer-events-none" />
              
              <div className="space-y-4">
                <span className="text-xs font-bold text-zinc-500 uppercase tracking-widest">Resultado da Simulação</span>

                <div className="flex flex-col items-center justify-center py-6 gap-2">
                  <div className="relative flex items-center justify-center w-36 h-36 rounded-full border-4 border-dashed border-orange-500/20 shadow-[0_0_20px_rgba(249,115,22,0.1)]">
                    <div className="flex flex-col items-center">
                      <span className="text-3xl font-black text-white font-mono">{simulatedER}%</span>
                      <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Taxa de Eng.</span>
                    </div>
                  </div>

                  <span className={`mt-2 text-xs font-bold px-3 py-1 rounded-full border ${getSimulatorRating(simulatedER).color}`}>
                    {getSimulatorRating(simulatedER).label}
                  </span>
                </div>
              </div>

              <div className="p-4 rounded-xl bg-zinc-900/60 border border-zinc-800 space-y-2">
                <h4 className="text-xs font-bold text-white flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-orange-400" />
                  Métricas de Análise
                </h4>
                <ul className="text-xs space-y-1.5 text-zinc-400 font-medium">
                  <li className="flex justify-between">
                    <span>Total Interações:</span>
                    <span className="text-white font-bold">{(simLikes + simComments).toLocaleString()}</span>
                  </li>
                  <li className="flex justify-between">
                    <span>Média de Curtidas do Perfil:</span>
                    <span className="text-white font-bold font-mono">
                      {Math.round(activeProfile.posts.reduce((acc, p) => acc + p.likes, 0) / activeProfile.posts.length).toLocaleString()}
                    </span>
                  </li>
                  <li className="flex justify-between">
                    <span>Média Engajamento do Perfil:</span>
                    <span className="text-pink-500 font-bold font-mono">{activeProfile.engagementRate}%</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        )}

        {/* TAB 4: COMPARATIVO */}
        {activeTab === "compare" && (
          <div className="space-y-6 animate-in fade-in duration-300">
            {/* Selectors Bar */}
            <div className="flex flex-col md:flex-row justify-center items-center gap-4 p-5 rounded-2xl bg-zinc-950/40 border border-zinc-900 shadow-xl backdrop-blur-xl">
              <div className="flex-1 w-full flex flex-col gap-1.5">
                <label className="text-xs font-bold text-zinc-500 uppercase tracking-wider">Perfil A (Rosa)</label>
                <select
                  value={compareUser1}
                  onChange={(e) => setCompareUser1(e.target.value)}
                  className="w-full bg-zinc-900 border border-zinc-800 rounded-xl py-2 px-3 text-sm text-white focus:outline-none focus:border-pink-500"
                >
                  {profiles.map((p) => (
                    <option key={p.username} value={p.username}>
                      @{p.username} ({p.fullName})
                    </option>
                  ))}
                </select>
              </div>

              <div className="p-2 rounded-full bg-zinc-900 border border-zinc-800 font-black text-xs text-zinc-500">
                VS
              </div>

              <div className="flex-1 w-full flex flex-col gap-1.5">
                <label className="text-xs font-bold text-zinc-500 uppercase tracking-wider">Perfil B (Laranja)</label>
                <select
                  value={compareUser2}
                  onChange={(e) => setCompareUser2(e.target.value)}
                  className="w-full bg-zinc-900 border border-zinc-800 rounded-xl py-2 px-3 text-sm text-white focus:outline-none focus:border-orange-500"
                >
                  {profiles.map((p) => (
                    <option key={p.username} value={p.username}>
                      @{p.username} ({p.fullName})
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Quick side-by-side header */}
            <div className="grid grid-cols-2 gap-6 p-4 rounded-xl bg-zinc-950/10 border border-zinc-900/50">
              <div className="flex items-center gap-3">
                <img className="w-12 h-12 rounded-full object-cover ring-2 ring-pink-500" src={compProfile1.avatar} alt="" />
                <div>
                  <h4 className="font-extrabold text-white">@{compProfile1.username}</h4>
                  <span className="text-[10px] text-pink-500 font-bold uppercase tracking-wider">{compProfile1.category}</span>
                </div>
              </div>
              <div className="flex items-center gap-3 justify-end text-right">
                <div>
                  <h4 className="font-extrabold text-white">@{compProfile2.username}</h4>
                  <span className="text-[10px] text-orange-400 font-bold uppercase tracking-wider">{compProfile2.category}</span>
                </div>
                <img className="w-12 h-12 rounded-full object-cover ring-2 ring-orange-500" src={compProfile2.avatar} alt="" />
              </div>
            </div>

            {/* Detailed comparison charts */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <CompareBarChart
                title="Seguidores Totais"
                label1={`@${compProfile1.username}`}
                value1={compProfile1.followers}
                label2={`@${compProfile2.username}`}
                value2={compProfile2.followers}
              />
              <CompareBarChart
                title="Taxa de Engajamento (%)"
                label1={`@${compProfile1.username}`}
                value1={compProfile1.engagementRate}
                label2={`@${compProfile2.username}`}
                value2={compProfile2.engagementRate}
                suffix="%"
              />
              <CompareBarChart
                title="Média de Curtidas por Post"
                label1={`@${compProfile1.username}`}
                value1={Math.round(compProfile1.posts.reduce((acc, p) => acc + p.likes, 0) / compProfile1.posts.length)}
                label2={`@${compProfile2.username}`}
                value2={Math.round(compProfile2.posts.reduce((acc, p) => acc + p.likes, 0) / compProfile2.posts.length)}
              />
              <CompareBarChart
                title="Média de Comentários por Post"
                label1={`@${compProfile1.username}`}
                value1={Math.round(compProfile1.posts.reduce((acc, p) => acc + p.comments, 0) / compProfile1.posts.length)}
                label2={`@${compProfile2.username}`}
                value2={Math.round(compProfile2.posts.reduce((acc, p) => acc + p.comments, 0) / compProfile2.posts.length)}
              />
            </div>
          </div>
        )}

      </div>

      {/* POST DETAILS MODAL INSPECTOR */}
      {selectedPost && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
          <div className="relative w-full max-w-3xl rounded-2xl bg-zinc-950 border border-zinc-800 shadow-2xl overflow-hidden flex flex-col md:flex-row max-h-[85vh]">
            
            {/* Close button */}
            <button
              onClick={() => setSelectedPost(null)}
              className="absolute top-4 right-4 z-10 p-1.5 rounded-full bg-black/60 hover:bg-zinc-800 text-zinc-400 hover:text-white transition-all border border-zinc-800/20"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Post image/media side */}
            <div className="flex-1 bg-black flex items-center justify-center aspect-square md:aspect-auto md:h-auto overflow-hidden">
              <img
                className="w-full h-full object-cover max-h-[45vh] md:max-h-[85vh]"
                src={selectedPost.image}
                alt="Post high-res preview"
              />
            </div>

            {/* Analysis details side */}
            <div className="flex-1 p-6 flex flex-col justify-between overflow-y-auto max-h-[40vh] md:max-h-none">
              <div className="space-y-5">
                {/* Profile header in modal */}
                <div className="flex items-center gap-2.5 pb-4 border-b border-zinc-900">
                  <img className="w-9 h-9 rounded-full object-cover" src={activeProfile.avatar} alt="" />
                  <div>
                    <h4 className="text-sm font-extrabold text-white">@{activeProfile.username}</h4>
                    <span className="text-[9px] text-zinc-500 font-bold">{selectedPost.date}</span>
                  </div>
                </div>

                {/* Caption */}
                <div className="space-y-1.5">
                  <h5 className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Legenda do Post</h5>
                  <p className="text-xs text-zinc-300 font-medium leading-relaxed max-h-24 overflow-y-auto scrollbar-thin">
                    {selectedPost.caption}
                  </p>
                </div>

                {/* Engagement Breakdown */}
                <div className="space-y-2">
                  <h5 className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Métricas de Engajamento</h5>
                  <div className="grid grid-cols-3 gap-2">
                    <div className="p-3 bg-zinc-900/60 border border-zinc-800/80 rounded-xl text-center">
                      <Heart className="w-4 h-4 text-pink-500 mx-auto mb-1 fill-pink-500/20" />
                      <span className="text-xs font-black text-white">{selectedPost.likes.toLocaleString()}</span>
                      <p className="text-[8px] font-bold text-zinc-500 uppercase mt-0.5">Likes</p>
                    </div>
                    <div className="p-3 bg-zinc-900/60 border border-zinc-800/80 rounded-xl text-center">
                      <MessageCircle className="w-4 h-4 text-cyan-400 mx-auto mb-1 fill-cyan-400/20" />
                      <span className="text-xs font-black text-white">{selectedPost.comments.toLocaleString()}</span>
                      <p className="text-[8px] font-bold text-zinc-500 uppercase mt-0.5">Comments</p>
                    </div>
                    <div className="p-3 bg-fuchsia-500/10 border border-fuchsia-500/20 rounded-xl text-center">
                      <Award className="w-4 h-4 text-fuchsia-400 mx-auto mb-1" />
                      <span className="text-xs font-black text-fuchsia-400">{selectedPost.engagementRate}%</span>
                      <p className="text-[8px] font-extrabold text-fuchsia-500 uppercase mt-0.5">ER Taxa</p>
                    </div>
                  </div>
                </div>

                {/* Insight Box */}
                <div className="p-3.5 rounded-xl bg-zinc-900 border border-zinc-800 text-xs font-medium text-zinc-400 leading-relaxed flex gap-2">
                  <Info className="w-4 h-4 text-pink-500 flex-shrink-0 mt-0.5" />
                  <div>
                    Este post atingiu uma taxa de engajamento de{" "}
                    <span className="text-white font-bold">{selectedPost.engagementRate}%</span>, que está{" "}
                    <span className={selectedPost.engagementRate >= activeProfile.engagementRate ? "text-green-400 font-bold" : "text-yellow-400 font-bold"}>
                      {selectedPost.engagementRate >= activeProfile.engagementRate
                        ? `${((selectedPost.engagementRate - activeProfile.engagementRate) / activeProfile.engagementRate * 100).toFixed(0)}% ACIMA`
                        : `${((activeProfile.engagementRate - selectedPost.engagementRate) / activeProfile.engagementRate * 100).toFixed(0)}% ABAIXO`}
                    </span>{" "}
                    da média atual de engajamento do perfil (@{activeProfile.username}: {activeProfile.engagementRate}%).
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t border-zinc-900 flex justify-between items-center text-[10px] text-zinc-500 font-bold">
                <span>FORMATO: {selectedPost.type.toUpperCase()}</span>
                <button
                  onClick={() => setSelectedPost(null)}
                  className="px-3 py-1 rounded bg-zinc-900 hover:bg-zinc-800 text-zinc-300 transition-colors"
                >
                  Fechar
                </button>
              </div>
            </div>

          </div>
        </div>
      )}
    </DefaultLayout>
  );
}
