import { Instagram } from "lucide-react";

export const Navbar = () => {
  return (
    <nav className="sticky top-0 z-40 w-full border-b border-zinc-800 bg-black/60 backdrop-blur-xl">
      <header className="mx-auto flex h-16 max-w-[1280px] items-center justify-between gap-4 px-6">
        <div className="flex items-center gap-6">
          <a className="flex items-center gap-2 group" href="/">
            <div className="relative flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-tr from-yellow-500 via-pink-500 to-purple-600 shadow-[0_0_15px_rgba(236,72,153,0.3)] group-hover:scale-105 transition-all duration-300">
              <Instagram className="text-white w-5 h-5" />
            </div>
            <div className="flex flex-col">
              <span className="font-extrabold text-lg bg-gradient-to-r from-white via-zinc-200 to-zinc-400 bg-clip-text text-transparent tracking-tight">
                InstaTrack
              </span>
              <span className="text-[10px] text-pink-500 font-bold tracking-widest uppercase -mt-1">
                Analytics
              </span>
            </div>
          </a>
        </div>

        <div className="flex items-center gap-4">
          <div className="hidden md:flex items-center gap-1.5 px-3 py-1 rounded-full bg-zinc-900 border border-zinc-800 text-xs font-semibold text-zinc-400">
            <span className="w-2 h-2 rounded-full bg-pink-500 animate-pulse" />
            Nativo Desktop
          </div>
        </div>
      </header>
    </nav>
  );
};
