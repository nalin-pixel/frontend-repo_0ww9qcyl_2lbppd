import { Cpu, Sigma, Brain, Layers, Check } from "lucide-react";
import { motion } from "framer-motion";

const algorithms = [
  {
    key: "statistical",
    name: "Statistico Avanzato",
    icon: Sigma,
    desc: "Distribuzioni, correlazioni e smoothing bayesiano",
  },
  {
    key: "ml_ensemble",
    name: "ML Ensemble",
    icon: Layers,
    desc: "Gradient boosting + random forest + stacking",
  },
  {
    key: "quantum",
    name: "Quantum Inspired",
    icon: Cpu,
    desc: "Campionamento ispirato al quantum annealing",
  },
  {
    key: "neural",
    name: "Reti Neurali",
    icon: Brain,
    desc: "Sequence modeling e dropout stocastico",
  },
];

export default function AlgorithmSelector() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
      {algorithms.map((alg, idx) => {
        const ActiveIcon = alg.icon;
        return (
          <motion.div
            key={alg.key}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.05 * idx, type: "spring", stiffness: 120, damping: 18 }}
            className="relative overflow-hidden rounded-xl border border-white/10 bg-white/[0.03] p-4"
          >
            <div className="absolute inset-0 pointer-events-none bg-gradient-to-br from-fuchsia-500/0 via-fuchsia-500/0 to-amber-400/0 group-hover:from-fuchsia-500/10 group-hover:to-amber-400/10 transition-colors" />
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3 text-white">
                <ActiveIcon className="h-5 w-5 text-fuchsia-300" />
                <span className="font-medium tracking-tight">{alg.name}</span>
              </div>
              <span className="inline-flex items-center gap-1 rounded-md border border-emerald-400/30 bg-emerald-400/10 px-2 py-0.5 text-xs text-emerald-200">
                <Check className="h-3.5 w-3.5" /> Attivo
              </span>
            </div>
            <p className="mt-2 text-sm text-white/70 leading-snug">{alg.desc}</p>
          </motion.div>
        );
      })}
    </div>
  );
}
