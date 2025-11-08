import { useMemo } from "react";
import { Sparkles } from "lucide-react";

function formatSet(set) {
  const main = set.main.slice().sort((a, b) => a - b).join(" · ");
  const euro = set.euro.slice().sort((a, b) => a - b).join(" · ");
  return { main, euro };
}

export default function Results({ results, loading }) {
  const formatted = useMemo(() => results.map(formatSet), [results]);

  return (
    <section className="mt-8">
      <div className="flex items-center gap-2">
        <Sparkles className="h-5 w-5 text-amber-300" />
        <h3 className="text-lg font-semibold text-white">Combinazioni suggerite</h3>
      </div>

      <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
        {loading ? (
          <div className="col-span-full animate-pulse rounded-xl border border-white/10 bg-white/[0.03] p-6 text-white/60">
            Calcolo in corso con modelli ensemble e campionamento stocastico...
          </div>
        ) : (
          formatted.map((s, idx) => (
            <div key={idx} className="rounded-xl border border-white/10 bg-white/[0.03] p-6">
              <div className="text-sm text-white/60">Set {idx + 1}</div>
              <div className="mt-2 text-xl font-semibold text-white tracking-wide">
                {s.main}
              </div>
              <div className="mt-1 text-sm text-amber-200/90">
                Euro: {s.euro}
              </div>
            </div>
          ))
        )}
      </div>

      <p className="mt-4 text-xs text-white/50">
        Nota: questo strumento è a scopo di intrattenimento. Il gioco comporta rischio e non garantisce vincite.
      </p>
    </section>
  );
}
