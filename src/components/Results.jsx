import { useMemo } from "react";
import { Trophy, Sparkles } from "lucide-react";
import { motion } from "framer-motion";

function formatSet(set) {
  const main = set.main.slice().sort((a, b) => a - b).join(" · ");
  const euro = set.euro.slice().sort((a, b) => a - b).join(" · ");
  return { main, euro };
}

export default function Results({ results, loading }) {
  const formatted = useMemo(() => results.map(formatSet), [results]);

  if (!loading && (!results || results.length === 0)) return null;

  return (
    <section className="mt-8">
      <div className="flex items-center gap-2">
        <Trophy className="h-5 w-5 text-amber-300" />
        <h3 className="text-lg font-semibold text-white">Predizione migliore</h3>
      </div>

      <div className="mt-4">
        {loading ? (
          <motion.div
            initial={{ opacity: 0.6 }}
            animate={{ opacity: [0.6, 1, 0.6] }}
            transition={{ duration: 1.2, repeat: Infinity }}
            className="rounded-2xl border border-white/10 bg-white/[0.03] p-6 text-white/70"
          >
            Calcolo in corso con modelli ibridi e campionamento stocastico...
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 16, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ type: "spring", stiffness: 120, damping: 16 }}
            className="relative overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-br from-white/[0.04] to-white/[0.02] p-6"
          >
            <div className="pointer-events-none absolute -inset-1 opacity-30 [mask-image:radial-gradient(60%_60%_at_50%_50%,black,transparent)]">
              <div className="absolute inset-0 bg-[conic-gradient(from_0deg,theme(colors.indigo.400/_30%),theme(colors.fuchsia.400/_30%),theme(colors.amber.400/_30%),theme(colors.indigo.400/_30%))] animate-[spin_8s_linear_infinite]" />
            </div>
            <div className="relative">
              <div className="text-sm text-white/60">Set 1 (consenso ensemble)</div>
              <div className="mt-2 text-2xl font-semibold text-white tracking-wide flex flex-wrap gap-2">
                {formatted[0].main.split(" · ").map((n) => (
                  <motion.span key={n} initial={{ y: 8, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ type: "spring", stiffness: 130, damping: 14 }} className="inline-flex h-9 min-w-9 items-center justify-center rounded-lg bg-white/10 px-3">
                    {n}
                  </motion.span>
                ))}
              </div>
              <div className="mt-3 flex items-center gap-2 text-sm">
                <Sparkles className="h-4 w-4 text-amber-300" />
                <span className="text-amber-200/90">Euro: {formatted[0].euro}</span>
              </div>
            </div>
          </motion.div>
        )}
      </div>

      <p className="mt-4 text-xs text-white/50">
        Nota: questo strumento è a scopo di intrattenimento. Il gioco comporta rischio e non garantisce vincite.
      </p>
    </section>
  );
}
