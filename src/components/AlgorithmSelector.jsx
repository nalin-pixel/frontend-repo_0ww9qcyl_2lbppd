import { useState } from "react";
import { Cpu, Sigma, Brain, Layers } from "lucide-react";

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

export default function AlgorithmSelector({ value, onChange }) {
  const [selected, setSelected] = useState(value || algorithms[0].key);

  const handleSelect = (key) => {
    setSelected(key);
    onChange?.(key);
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
      {algorithms.map((alg) => {
        const ActiveIcon = alg.icon;
        const active = selected === alg.key;
        return (
          <button
            key={alg.key}
            onClick={() => handleSelect(alg.key)}
            className={`group flex flex-col items-start rounded-xl border p-4 text-left transition-all ${
              active
                ? "border-fuchsia-400/60 bg-fuchsia-500/10 shadow-lg"
                : "border-white/10 hover:border-white/20 bg-white/[0.02]"
            }`}
          >
            <div className={`flex items-center gap-3 ${active ? "text-fuchsia-300" : "text-white"}`}>
              <ActiveIcon className="h-5 w-5" />
              <span className="font-medium tracking-tight">{alg.name}</span>
            </div>
            <p className="mt-2 text-sm text-white/70 leading-snug">{alg.desc}</p>
          </button>
        );
      })}
    </div>
  );
}
