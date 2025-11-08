import { useEffect, useState } from "react";
import { Shuffle, Download } from "lucide-react";

export default function GeneratorForm({ onGenerate }) {
  const [algorithm, setAlgorithm] = useState("statistical");
  const [sets, setSets] = useState(5);
  const [seed, setSeed] = useState("");

  useEffect(() => {
    // Ensure bounds
    if (sets < 1) setSets(1);
    if (sets > 20) setSets(20);
  }, [sets]);

  const handleSubmit = (e) => {
    e.preventDefault();
    onGenerate({ algorithm, sets: Number(sets), seed: seed || undefined });
  };

  const handleDownload = () => {
    onGenerate({ algorithm, sets: Number(sets), seed: seed || undefined, download: true });
  };

  return (
    <form onSubmit={handleSubmit} className="rounded-2xl border border-white/10 bg-white/[0.03] p-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label className="text-sm text-white/70">Algoritmo</label>
          <select
            value={algorithm}
            onChange={(e) => setAlgorithm(e.target.value)}
            className="mt-1 w-full rounded-lg bg-white/5 text-white border border-white/10 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-fuchsia-500"
          >
            <option value="statistical">Statistico Avanzato</option>
            <option value="ml_ensemble">ML Ensemble</option>
            <option value="quantum">Quantum Inspired</option>
            <option value="neural">Reti Neurali</option>
          </select>
        </div>

        <div>
          <label className="text-sm text-white/70">Numero set</label>
          <input
            type="number"
            min={1}
            max={20}
            value={sets}
            onChange={(e) => setSets(parseInt(e.target.value || "1", 10))}
            className="mt-1 w-full rounded-lg bg-white/5 text-white border border-white/10 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-fuchsia-500"
          />
        </div>

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
      </div>

      <div className="mt-5 flex items-center gap-3">
        <button
          type="submit"
          className="inline-flex items-center gap-2 rounded-lg bg-gradient-to-r from-indigo-500 via-fuchsia-500 to-amber-400 px-4 py-2 font-medium text-white shadow-lg ring-1 ring-white/20 hover:brightness-110"
        >
          <Shuffle className="h-4 w-4" /> Genera
        </button>
        <button
          type="button"
          onClick={handleDownload}
          className="inline-flex items-center gap-2 rounded-lg border border-white/15 bg-white/[0.06] px-4 py-2 font-medium text-white hover:bg-white/[0.12]"
        >
          <Download className="h-4 w-4" /> Esporta CSV
        </button>
      </div>
    </form>
  );
}
