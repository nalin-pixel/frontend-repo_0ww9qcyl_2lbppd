import { useEffect, useState } from "react";
import { Shuffle } from "lucide-react";
import { motion } from "framer-motion";

export default function GeneratorForm({ onGenerate }) {
  const [sets, setSets] = useState(1); // fixed: una sola predizione
  const [seed, setSeed] = useState("");

  useEffect(() => {
    if (sets !== 1) setSets(1);
  }, [sets]);

  const handleSubmit = (e) => {
    e.preventDefault();
    onGenerate({ sets: 1, seed: seed || undefined });
  };

  return (
    <motion.form
      onSubmit={handleSubmit}
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ type: "spring", stiffness: 120, damping: 18 }}
      className="rounded-2xl border border-white/10 bg-white/[0.03] p-6"
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="text-sm text-white/70">Seed (opzionale)</label>
          <input
            type="text"
            placeholder="Riproducibilità"
            value={seed}
            onChange={(e) => setSeed(e.target.value)}
            className="mt-1 w-full rounded-lg bg-white/5 text-white border border-white/10 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-fuchsia-500"
          />
        </div>
        <div className="self-end">
          <button
            type="submit"
            className="inline-flex items-center gap-2 rounded-lg bg-gradient-to-r from-indigo-500 via-fuchsia-500 to-amber-400 px-4 py-2 font-medium text-white shadow-lg ring-1 ring-white/20 hover:brightness-110"
          >
            <Shuffle className="h-4 w-4" /> Genera Predizione
          </button>
        </div>
      </div>
    </motion.form>
  );
}
