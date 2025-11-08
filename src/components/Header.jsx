import { Rocket } from "lucide-react";

export default function Header() {
  return (
    <header className="w-full">
      <div className="mx-auto max-w-6xl px-6 pt-10 pb-6">
        <div className="flex items-center gap-3">
          <div className="relative h-11 w-11 rounded-xl bg-gradient-to-br from-indigo-500 via-fuchsia-500 to-amber-400 shadow-lg ring-1 ring-white/20 flex items-center justify-center">
            <Rocket className="h-6 w-6 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-semibold tracking-tight text-white">
              EuroJackpot AI Generator
            </h1>
            <p className="text-sm text-white/70 -mt-0.5">
              Statistica, ensemble ML e un pizzico di magia quantistica
            </p>
          </div>
        </div>
      </div>
      <div className="pointer-events-none h-24 w-full bg-gradient-to-r from-indigo-500/20 via-fuchsia-500/20 to-amber-400/20" />
    </header>
  );
}
