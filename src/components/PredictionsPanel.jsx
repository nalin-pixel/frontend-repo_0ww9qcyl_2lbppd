import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Trophy, Save, Trash2, Sparkles, Brain } from "lucide-react";

export default function PredictionsPanel({ api, lastResult, lastSeed }) {
  const [items, setItems] = useState([]);
  const [saving, setSaving] = useState(false);
  const [insights, setInsights] = useState(null);

  const load = async () => {
    const res = await fetch(`${api}/predictions`);
    const data = await res.json();
    setItems(data);
    const ires = await fetch(`${api}/insights/latest`);
    setInsights(await ires.json());
  };

  useEffect(() => { load(); }, []);

  const save = async () => {
    if (!lastResult) return;
    setSaving(true);
    try {
      const body = { main: lastResult.main, euro: lastResult.euro, seed: lastSeed, method: "consensus" };
      const res = await fetch(`${api}/predictions`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) });
      if (!res.ok) throw new Error(await res.text());
      await load();
    } catch (e) {
      alert(`Errore: ${e}`);
    } finally {
      setSaving(false);
    }
  };

  const clearAll = async () => {
    if (!confirm("Cancellare tutte le predizioni salvate?")) return;
    await fetch(`${api}/predictions`, { method: "DELETE" });
    await load();
  };

  return (
    <section className="mt-10">
      <div className="flex items-center gap-2">
        <Brain className="h-5 w-5 text-fuchsia-300" />
        <h3 className="text-lg font-semibold">Predizioni e apprendimento</h3>
      </div>

      <div className="mt-3 flex items-center gap-3">
        <button onClick={save} disabled={!lastResult || saving} className="inline-flex items-center gap-2 rounded-lg bg-white/10 px-3 py-1.5 text-sm hover:bg-white/15 disabled:opacity-50">
          <Save className="h-4 w-4" /> Salva ultima predizione
        </button>
        <button onClick={clearAll} className="inline-flex items-center gap-2 rounded-lg bg-white/10 px-3 py-1.5 text-sm text-red-300 hover:text-red-200">
          <Trash2 className="h-4 w-4" /> Pulisci archivio
        </button>
      </div>

      <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="mt-4 rounded-xl border border-white/10 bg-white/[0.03] p-4">
        <div className="text-sm text-white/70 mb-2">Storico predizioni</div>
        <div className="max-h-56 overflow-auto divide-y divide-white/5">
          {items.length === 0 ? (
            <div className="py-6 text-white/60">Nessuna predizione salvata.</div>
          ) : (
            items.map((p) => (
              <div key={p._id || p.id} className="flex items-center justify-between py-2 text-sm">
                <div className="flex-1">
                  <span className="text-white/70">[{p.main?.join(" ")}]</span>
                  <span className="text-amber-200 ml-2">[{p.euro?.join(" ")}]</span>
                  {p.matched?.latest_match ? (
                    <span className="ml-3 text-emerald-300">hit: {p.matched.latest_match.total} (M{p.matched.latest_match.main}/E{p.matched.latest_match.euro})</span>
                  ) : null}
                </div>
                <span className="text-xs text-white/50">{new Date(p.created_at).toLocaleString()}</span>
              </div>
            ))
          )}
        </div>
      </motion.div>

      <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="mt-4 rounded-xl border border-white/10 bg-white/[0.03] p-4">
        <div className="flex items-center gap-2 text-sm text-white/70 mb-2"><Sparkles className="h-4 w-4 text-amber-300"/> Evidenze ultimo concorso</div>
        {!insights || !insights.has_latest ? (
          <div className="text-white/60">Aggiungi almeno un'estrazione per vedere gli hit.</div>
        ) : (
          <div className="text-sm text-white/80">
            Ultima data: <span className="text-white font-medium">{insights.latest_date}</span>
            <div className="mt-2 max-h-40 overflow-auto divide-y divide-white/5">
              {insights.matched_predictions?.length ? insights.matched_predictions.map(m => (
                <div key={m._id} className="py-1 flex items-center justify-between">
                  <span className="text-emerald-300">Pred {m._id.slice(-6)} ha indovinato {m.matches.total} numeri</span>
                  <span className="text-xs text-white/50">M{m.matches.main} / E{m.matches.euro}</span>
                </div>
              )) : <div className="text-white/60 py-2">Nessuna predizione con hit sull'ultima estrazione.</div>}
            </div>
          </div>
        )}
      </motion.div>
    </section>
  );
}
