import { useMemo, useState } from "react";
import Header from "./components/Header";
import AlgorithmSelector from "./components/AlgorithmSelector";
import GeneratorForm from "./components/GeneratorForm";
import Results from "./components/Results";

// Local pseudo-"advanced" generator for demo purposes.
// It uses weighted randomness, low-discrepancy shuffling and simple ensemble voting to emulate
// sophisticated generation while running fully client-side. No guarantees, entertainment only.

function mulberry32(a) {
  return function () {
    var t = (a += 0x6d2b79f5);
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function lcg(seed) {
  let s = seed >>> 0;
  return () => (s = (1664525 * s + 1013904223) >>> 0);
}

function makePRNG(seedStr) {
  if (!seedStr) return Math.random;
  let h = 2166136261;
  for (let i = 0; i < seedStr.length; i++) h ^= seedStr.charCodeAt(i), (h = Math.imul(h, 16777619));
  return mulberry32(h >>> 0);
}

function weightedSample(range, k, weights, rand) {
  const picks = [];
  const pool = Array.from({ length: range }, (_, i) => i + 1);
  const w = weights.slice();
  for (let p = 0; p < k; p++) {
    const total = w.reduce((a, b) => a + b, 0);
    let r = rand() * total;
    let idx = 0;
    for (; idx < pool.length; idx++) {
      r -= w[idx];
      if (r <= 0) break;
    }
    picks.push(pool[idx]);
    pool.splice(idx, 1);
    w.splice(idx, 1);
  }
  return picks;
}

function sobolShuffle(arr, rand) {
  const a = arr.slice();
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(rand() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function generateSet(algorithm, rand) {
  // Create dynamic weights to emulate hot/cold numbers and correlations
  const baseMain = Array.from({ length: 50 }, (_, i) => 1 + i);
  const baseEuro = Array.from({ length: 12 }, (_, i) => 1 + i);

  const weightsMain = baseMain.map((n) => 1 + 0.6 * Math.sin((n * 2.11) % Math.PI) + 0.4 * rand());
  const weightsEuro = baseEuro.map((n) => 1 + 0.7 * Math.cos((n * 1.73) % Math.PI) + 0.5 * rand());

  let main, euro;

  if (algorithm === "statistical") {
    main = weightedSample(50, 5, weightsMain, rand);
    euro = weightedSample(12, 2, weightsEuro, rand);
  } else if (algorithm === "ml_ensemble") {
    // Ensemble: average of multiple samplers with slight perturbations
    const voters = 5;
    const countsMain = new Map();
    const countsEuro = new Map();
    for (let v = 0; v < voters; v++) {
      const r = mulberry32((rand() * 1e9) >>> 0);
      const m = weightedSample(50, 5, weightsMain.map((x) => x * (0.9 + 0.2 * r())), r);
      const e = weightedSample(12, 2, weightsEuro.map((x) => x * (0.9 + 0.2 * r())), r);
      m.forEach((n) => countsMain.set(n, (countsMain.get(n) || 0) + 1));
      e.forEach((n) => countsEuro.set(n, (countsEuro.get(n) || 0) + 1));
    }
    const sortedMain = Array.from(countsMain.entries()).sort((a, b) => b[1] - a[1]).slice(0, 5).map((x) => x[0]);
    const sortedEuro = Array.from(countsEuro.entries()).sort((a, b) => b[1] - a[1]).slice(0, 2).map((x) => x[0]);
    main = sobolShuffle(sortedMain, rand);
    euro = sobolShuffle(sortedEuro, rand);
  } else if (algorithm === "quantum") {
    // Simulate quantum-inspired sampling by adding interference-like oscillations
    const qrand = () => (rand() + Math.sin(rand() * 6.283) * 0.25 + 1) % 1;
    main = weightedSample(50, 5, weightsMain.map((w, i) => w * (1 + Math.sin((i + 1) * 0.27))), qrand);
    euro = weightedSample(12, 2, weightsEuro.map((w, i) => w * (1 + Math.cos((i + 1) * 0.41))), qrand);
  } else {
    // neural
    const state = lcg((rand() * 1e9) >>> 0);
    const nrand = () => ((state() >>> 0) % 1000) / 1000;
    main = weightedSample(50, 5, weightsMain.map((w, i) => w * (1 + (i % 5) * 0.03 + 0.15 * nrand())), nrand);
    euro = weightedSample(12, 2, weightsEuro.map((w, i) => w * (1 + (i % 3) * 0.05 + 0.2 * nrand())), nrand);
  }

  return { main, euro };
}

export default function App() {
  const [algorithm, setAlgorithm] = useState("statistical");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [lastSeed, setLastSeed] = useState("");

  const handleGenerate = async ({ algorithm: alg, sets, seed, download }) => {
    setLoading(true);
    setAlgorithm(alg);
    const prng = makePRNG(seed || "");
    const out = [];
    for (let i = 0; i < sets; i++) out.push(generateSet(alg, prng));
    setResults(out);
    setLastSeed(seed || "");
    setLoading(false);

    if (download) {
      const lines = ["main1-main2-main3-main4-main5;euro1-euro2"]; // header
      for (const s of out) {
        lines.push(`${s.main.sort((a,b)=>a-b).join("-")};${s.euro.sort((a,b)=>a-b).join("-")}`);
      }
      const blob = new Blob([lines.join("\n")], { type: "text/csv;charset=utf-8" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `eurojackpot_${alg}${seed ? `_seed-${seed}` : ""}.csv`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(url);
    }
  };

  const heroBg = useMemo(() => ({
    backgroundImage:
      "radial-gradient(1200px 600px at 20% -10%, rgba(99,102,241,0.25), transparent)," +
      "radial-gradient(900px 500px at 80% 0%, rgba(236,72,153,0.20), transparent)," +
      "radial-gradient(800px 400px at 50% 100%, rgba(251,191,36,0.15), transparent)",
  }), []);

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <div style={heroBg} className="fixed inset-0 -z-0" />
      <div className="relative">
        <Header />

        <main className="mx-auto max-w-6xl px-6 pb-16">
          <section className="mt-4">
            <div className="mb-5">
              <AlgorithmSelector value={algorithm} onChange={setAlgorithm} />
            </div>

            <GeneratorForm onGenerate={handleGenerate} />

            <Results results={results} loading={loading} />

            {lastSeed && (
              <p className="mt-6 text-xs text-white/50">Seed usato: {lastSeed}</p>
            )}
          </section>
        </main>
      </div>
    </div>
  );
}
