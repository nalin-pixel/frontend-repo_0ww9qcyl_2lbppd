import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { Database, Upload, Trash2, FileText, Calendar, Pencil } from "lucide-react";

export default function DataManager({ api, onRefreshAll }) {
  const [draws, setDraws] = useState([]);
  const [loading, setLoading] = useState(false);
  const [single, setSingle] = useState({ date: "", main: "", euro: "" });
  const [bulkTab, setBulkTab] = useState("csv");
  const [bulk, setBulk] = useState({ csv: "", json: "", text: "" });
  const [editingId, setEditingId] = useState(null);

  const load = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${api}/draws?limit=300`);
      const data = await res.json();
      setDraws(data);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const handleAddSingle = async (e) => {
    e.preventDefault();
    try {
      const main = single.main.split(/[,\s]+/).filter(Boolean).map(Number);
      const euro = single.euro.split(/[,\s]+/).filter(Boolean).map(Number);
      const body = { date: single.date, main, euro };
      const res = await fetch(`${api}/draws`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) });
      if (!res.ok) throw new Error(await res.text());
      setSingle({ date: "", main: "", euro: "" });
      await load();
      onRefreshAll();
    } catch (err) {
      alert(`Errore: ${err}`);
    }
  };

  const handleBulk = async () => {
    try {
      const payload = { csv: bulk.csv || undefined, json: undefined, text: bulk.text || undefined };
      if (bulk.json) {
        try { payload.json = JSON.parse(bulk.json); } catch (e) { alert("JSON non valido"); return; }
      }
      const res = await fetch(`${api}/draws/bulk`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) });
      const data = await res.json();
      if (!res.ok) throw new Error(JSON.stringify(data));
      await load();
      onRefreshAll();
    } catch (err) {
      alert(`Errore: ${err}`);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm("Eliminare questa estrazione?")) return;
    const res = await fetch(`${api}/draws/${id}`, { method: "DELETE" });
    if (res.ok) { await load(); onRefreshAll(); }
  };

  const handleClearAll = async () => {
    if (!confirm("Cancellare tutte le estrazioni?")) return;
    const res = await fetch(`${api}/draws`, { method: "DELETE" });
    if (res.ok) { await load(); onRefreshAll(); }
  };

  const startEdit = (draw) => {
    setEditingId(draw.id || draw._id);
    setSingle({ date: draw.date, main: draw.main.join(" "), euro: draw.euro.join(" ") });
  };

  const saveEdit = async (e) => {
    e.preventDefault();
    try {
      const main = single.main.split(/[,\s]+/).filter(Boolean).map(Number);
      const euro = single.euro.split(/[,\s]+/).filter(Boolean).map(Number);
      const body = { date: single.date, main, euro };
      const res = await fetch(`${api}/draws/${editingId}`, { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) });
      if (!res.ok) throw new Error(await res.text());
      setEditingId(null);
      setSingle({ date: "", main: "", euro: "" });
      await load();
      onRefreshAll();
    } catch (err) {
      alert(`Errore: ${err}`);
    }
  };

  return (
    <section className="mt-10">
      <div className="flex items-center gap-2">
        <Database className="h-5 w-5 text-indigo-300" />
        <h3 className="text-lg font-semibold">Storico estrazioni</h3>
      </div>

      <div className="mt-4 grid grid-cols-1 lg:grid-cols-2 gap-4">
        <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="rounded-xl border border-white/10 bg-white/[0.03] p-4">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2 text-sm text-white/70"><Calendar className="h-4 w-4"/> Inserisci estrazione singola</div>
            {editingId ? (
              <span className="text-xs text-amber-300">Modifica attiva</span>
            ) : null}
          </div>
          <form onSubmit={editingId ? saveEdit : handleAddSingle} className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <input type="date" required value={single.date} onChange={(e)=>setSingle(s=>({ ...s, date: e.target.value }))} className="rounded-lg bg-white/5 text-white border border-white/10 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"/>
            <input type="text" required placeholder="Main: 5 numeri" value={single.main} onChange={(e)=>setSingle(s=>({ ...s, main: e.target.value }))} className="rounded-lg bg-white/5 text-white border border-white/10 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-fuchsia-500"/>
            <div className="flex gap-2">
              <input type="text" required placeholder="Euro: 2 numeri" value={single.euro} onChange={(e)=>setSingle(s=>({ ...s, euro: e.target.value }))} className="flex-1 rounded-lg bg-white/5 text-white border border-white/10 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-amber-500"/>
              <button type="submit" className="rounded-lg bg-gradient-to-r from-indigo-500 via-fuchsia-500 to-amber-400 px-3 py-2 text-sm">{editingId ? "Salva" : "Aggiungi"}</button>
            </div>
          </form>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="rounded-xl border border-white/10 bg-white/[0.03] p-4">
          <div className="flex items-center gap-2 text-sm text-white/70 mb-3"><Upload className="h-4 w-4"/> Import massivo</div>
          <div className="flex gap-2 mb-2">
            {(["csv","json","text"]).map(tab => (
              <button key={tab} onClick={()=>setBulkTab(tab)} className={`px-3 py-1.5 rounded-md text-xs border ${bulkTab===tab?"border-white/30 bg-white/10":"border-white/10 bg-white/5"}`}>{tab.toUpperCase()}</button>
            ))}
            <button onClick={handleBulk} className="ml-auto px-3 py-1.5 rounded-md text-xs bg-emerald-600/80 hover:bg-emerald-600">Carica</button>
          </div>
          {bulkTab === "csv" && (
            <textarea value={bulk.csv} onChange={(e)=>setBulk(b=>({ ...b, csv: e.target.value }))} placeholder="date, m1, m2, m3, m4, m5, e1, e2" className="h-28 w-full rounded-lg bg-white/5 text-white border border-white/10 p-2"/>
          )}
          {bulkTab === "json" && (
            <textarea value={bulk.json} onChange={(e)=>setBulk(b=>({ ...b, json: e.target.value }))} placeholder='[{"date":"2024-01-01","main":[1,2,3,4,5],"euro":[1,2]}]' className="h-28 w-full rounded-lg bg-white/5 text-white border border-white/10 p-2"/>
          )}
          {bulkTab === "text" && (
            <textarea value={bulk.text} onChange={(e)=>setBulk(b=>({ ...b, text: e.target.value }))} placeholder="YYYY-MM-DD; 1 2 3 4 5; 1 2" className="h-28 w-full rounded-lg bg-white/5 text-white border border-white/10 p-2"/>
          )}
        </motion.div>
      </div>

      <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="mt-4 rounded-xl border border-white/10 bg-white/[0.03] p-4">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2 text-sm text-white/70"><FileText className="h-4 w-4"/> Elenco estrazioni ({draws.length})</div>
          <button onClick={handleClearAll} className="flex items-center gap-1 text-xs text-red-300 hover:text-red-200"><Trash2 className="h-4 w-4"/> Svuota tutto</button>
        </div>
        <div className="max-h-64 overflow-auto divide-y divide-white/5">
          {loading ? (
            <div className="py-6 text-white/60">Caricamento...</div>
          ) : draws.length === 0 ? (
            <div className="py-6 text-white/60">Nessuna estrazione ancora.</div>
          ) : (
            draws.map((d) => (
              <div key={d._id || d.id} className="flex items-center justify-between py-2 text-sm">
                <div className="flex-1">
                  <span className="text-white/80 font-medium mr-2">{d.date}</span>
                  <span className="text-white/70">[{d.main?.join(" ")}]</span>
                  <span className="text-amber-200 ml-2">[{d.euro?.join(" ")}]</span>
                </div>
                <div className="flex items-center gap-2">
                  <button onClick={()=>startEdit(d)} className="text-xs px-2 py-1 rounded-md bg-white/10"><Pencil className="h-3.5 w-3.5"/></button>
                  <button onClick={()=>handleDelete(d._id || d.id)} className="text-xs px-2 py-1 rounded-md bg-white/10 text-red-300"><Trash2 className="h-3.5 w-3.5"/></button>
                </div>
              </div>
            ))
          )}
        </div>
      </motion.div>
    </section>
  );
}
