import { BookOpen } from "lucide-react";

export const Header = () => {
  return (
    <header className="bg-[#0f766e] border-b border-[#115e59] sticky top-0 z-50 shadow-md">
      <div className="container mx-auto px-4 h-20 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-white/10 backdrop-blur-sm flex items-center justify-center shadow-inner">
            <BookOpen className="w-6 h-6 text-white" />
          </div>
          <div className="flex flex-col">
            <span className="font-bold text-xl tracking-tight text-white leading-tight">
              PedagogIA
            </span>
            <span className="text-xs font-medium text-emerald-50 opacity-90">
              Plataforma de Ensino Inteligente
            </span>
          </div>
        </div>
      </div>
    </header>
  );
};
