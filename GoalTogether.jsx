import { useState, useEffect } from "react";
import { usePaystackPayment } from "react-paystack";

const STORAGE_KEY = "goaltogether_v2";

const G = {
  bg: "#000000", bg2: "#111111", card: "#18181A", border: "#2A2A2A",
  purple: "#8B5CF6", purpleLight: "#A78BFA", pink: "#D946EF", pinkLight: "#F472B6",
  gold: "#F59E0B", goldLight: "#FDE68A", green: "#10B981", blue: "#3B82F6",
  red: "#EF4444", orange: "#F97316", text: "#FAFAFA", textMuted: "#A1A1AA", textDim: "#52525B",
};
const font = `'DM Serif Display', Georgia, serif`;
const fontBody = `'Plus Jakarta Sans', sans-serif`;

const css = `
  @import url('https://fonts.googleapis.com/css2?family=DM+Serif+Display:ital@0;1&family=Plus+Jakarta+Sans:wght@300;400;500;600;700&display=swap');
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
  html { -webkit-text-size-adjust: 100%; }
  body { background: ${G.bg}; color: ${G.text}; font-family: ${fontBody}; overflow-x: hidden; }
  ::-webkit-scrollbar { width: 3px; }
  ::-webkit-scrollbar-track { background: ${G.bg2}; }
  ::-webkit-scrollbar-thumb { background: ${G.purple}; border-radius: 2px; }
  select option { background: #1A1535; color: ${G.text}; }
  @keyframes fadeUp { from { opacity:0; transform:translateY(16px); } to { opacity:1; transform:translateY(0); } }
  @keyframes float { 0%,100% { transform:translateY(0); } 50% { transform:translateY(-8px); } }
  @keyframes slideUp { from { transform:translateY(100%); opacity:0; } to { transform:translateY(0); opacity:1; } }
  .fadeUp { animation: fadeUp .45s ease forwards; }
  input, textarea, select {
    background: ${G.bg2}; border: 1px solid ${G.border}; color: ${G.text};
    border-radius: 10px; padding: 12px 14px; font-family: ${fontBody};
    font-size: 14px; outline: none; transition: border .2s; width: 100%;
    -webkit-appearance: none;
  }
  input:focus, textarea:focus, select:focus { border-color: ${G.purple}; }
  input::placeholder, textarea::placeholder { color: ${G.textDim}; }
  input[type=range] { padding: 0; height: 4px; cursor: pointer; accent-color: ${G.purple}; }
  button { -webkit-tap-highlight-color: transparent; touch-action: manipulation; }
`;

const uid = () => Math.random().toString(36).slice(2, 9);
const today = () => new Date().toISOString().split("T")[0];
const formatDate = (d) => d ? new Date(d).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }) : "—";

const CATEGORIES = ["Finance", "Health", "Career", "Travel", "Personal Growth", "Relationship", "Hobbies", "Spiritual", "Education", "Home"];
const PRIORITIES = ["High", "Medium", "Low"];
const STATUSES = ["Not Started", "In Progress", "Completed", "Paused"];
const MONTHS = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
const priorityColor = (p) => p === "High" ? G.red : p === "Medium" ? G.gold : G.green;
const statusColor = (s) => s === "Completed" ? G.green : s === "In Progress" ? G.blue : s === "Paused" ? G.orange : G.textDim;

const useBreakpoint = () => {
  const [w, setW] = useState(typeof window !== "undefined" ? window.innerWidth : 1024);
  useEffect(() => {
    const fn = () => setW(window.innerWidth);
    window.addEventListener("resize", fn);
    return () => window.removeEventListener("resize", fn);
  }, []);
  return { isMobile: w < 768, w };
};

const defaultGoals = (owner) => {
  const couples = [
    { id: uid(), title: "Buy our first home together", category: "Finance", targetDate: "2025-12-31", progress: 35, kpi: "House purchased & keys", priority: "High", status: "In Progress", notes: "Saving for deposit" },
    { id: uid(), title: "Travel to 3 new countries", category: "Travel", targetDate: "2026-12-31", progress: 33, kpi: "Countries visited", priority: "High", status: "In Progress", notes: "Portugal done!" },
    { id: uid(), title: "12 monthly date nights", category: "Relationship", targetDate: "2025-12-31", progress: 75, kpi: "Date nights done", priority: "Medium", status: "In Progress", notes: "" },
    { id: uid(), title: "Run a 5K together", category: "Health", targetDate: "2025-06-30", progress: 60, kpi: "Race completed", priority: "Medium", status: "In Progress", notes: "Training 3x/week" },
    { id: uid(), title: "Build joint investment portfolio", category: "Finance", targetDate: "2026-12-31", progress: 30, kpi: "Portfolio milestone", priority: "High", status: "In Progress", notes: "" },
    { id: uid(), title: "Attend couples retreat", category: "Relationship", targetDate: "2025-12-31", progress: 0, kpi: "Retreat attended", priority: "Medium", status: "Not Started", notes: "" },
  ];
  const his = [
    { id: uid(), title: "Save 6-month emergency fund", category: "Finance", targetDate: "2025-09-30", progress: 50, kpi: "Savings target hit", priority: "High", status: "In Progress", notes: "" },
    { id: uid(), title: "Get promoted / grow income 20%", category: "Career", targetDate: "2025-12-31", progress: 40, kpi: "Income increase", priority: "High", status: "In Progress", notes: "" },
    { id: uid(), title: "Work out 4x per week", category: "Health", targetDate: "2025-12-31", progress: 60, kpi: "Weekly logs", priority: "High", status: "In Progress", notes: "" },
    { id: uid(), title: "Learn a new language (A2)", category: "Personal Growth", targetDate: "2026-06-30", progress: 30, kpi: "A2 test passed", priority: "Low", status: "In Progress", notes: "" },
    { id: uid(), title: "Invest 20% of income monthly", category: "Finance", targetDate: "2025-12-31", progress: 55, kpi: "% invested", priority: "High", status: "In Progress", notes: "" },
  ];
  const her = [
    { id: uid(), title: "Launch side business", category: "Finance", targetDate: "2026-03-31", progress: 20, kpi: "Business + 1st sale", priority: "High", status: "In Progress", notes: "" },
    { id: uid(), title: "Read 24 books this year", category: "Personal Growth", targetDate: "2025-12-31", progress: 58, kpi: "Books read", priority: "Medium", status: "In Progress", notes: "" },
    { id: uid(), title: "Daily wellness routine", category: "Health", targetDate: "2025-12-31", progress: 65, kpi: "Habit streak", priority: "Medium", status: "In Progress", notes: "Journal + meditate" },
    { id: uid(), title: "Grow professional network +50", category: "Career", targetDate: "2025-12-31", progress: 40, kpi: "New connections", priority: "High", status: "In Progress", notes: "" },
    { id: uid(), title: "Take a solo trip", category: "Travel", targetDate: "2026-12-31", progress: 10, kpi: "Trip completed", priority: "Medium", status: "Not Started", notes: "" },
  ];
  return owner === "couple" ? couples : owner === "his" ? his : her;
};

const defaultAchieved = () => [
  { id: uid(), title: "Paid off credit card debt", owner: "Him", category: "Finance", dateAchieved: "2025-03-15", celebration: "🎉 Dinner date to celebrate!" },
  { id: uid(), title: "Completed 30-day fitness challenge", owner: "Her", category: "Health", dateAchieved: "2025-02-28", celebration: "🥂 Spa day treat!" },
  { id: uid(), title: "First holiday abroad together", owner: "Couple", category: "Travel", dateAchieved: "2025-01-20", celebration: "❤️ Portugal was magical!" },
];
const defaultCheckins = () => MONTHS.map(m => ({ month: m, his: "", her: "", couple: "", win: "", challenge: "", action: "" }));
const newUser = (name, partner, plan, email) => ({
  id: uid(), name, partnerName: partner, plan, email, joinedAt: today(),
  hisGoals: defaultGoals("his"), herGoals: defaultGoals("her"),
  coupleGoals: defaultGoals("couple"), achieved: defaultAchieved(), checkins: defaultCheckins(),
});

// ── UI Primitives ─────────────────────────────────────────────────────────────
const Btn = ({ children, onClick, variant = "primary", size = "md", style: s = {}, disabled, full }) => {
  const vs = {
    primary: { background: `linear-gradient(135deg, ${G.purple}, ${G.pink})`, color: "#fff", boxShadow: `0 4px 16px ${G.purple}40` },
    gold: { background: `linear-gradient(135deg, ${G.gold}, ${G.orange})`, color: "#000" },
    ghost: { background: "transparent", color: G.text, border: `1px solid ${G.border}` },
    danger: { background: `${G.red}15`, color: G.red, border: `1px solid ${G.red}40` },
    success: { background: `${G.green}15`, color: G.green, border: `1px solid ${G.green}40` },
    muted: { background: G.card, color: G.textMuted, border: `1px solid ${G.border}` },
  };
  return (
    <button onClick={!disabled ? onClick : undefined} style={{
      border: "none", cursor: disabled ? "not-allowed" : "pointer", fontFamily: fontBody, fontWeight: 600,
      borderRadius: 12, transition: "opacity .15s", display: "inline-flex", alignItems: "center", gap: 6,
      opacity: disabled ? .5 : 1, fontSize: size === "sm" ? 12 : size === "lg" ? 15 : 13,
      padding: size === "sm" ? "7px 13px" : size === "lg" ? "14px 26px" : "10px 18px",
      width: full ? "100%" : undefined, justifyContent: full ? "center" : undefined,
      ...vs[variant], ...s,
    }}>{children}</button>
  );
};

const Card = ({ children, style: s = {}, glow }) => (
  <div style={{ background: G.card, border: `1px solid ${G.border}`, borderRadius: 16, padding: 18, boxShadow: glow ? `0 0 24px ${G.purple}18` : "none", ...s }}>
    {children}
  </div>
);

const Badge = ({ label, color }) => (
  <span style={{ background: `${color}20`, color, border: `1px solid ${color}40`, borderRadius: 6, padding: "2px 7px", fontSize: 10, fontWeight: 700, whiteSpace: "nowrap" }}>
    {label}
  </span>
);

const ProgressBar = ({ value, color = G.purple, height = 6 }) => (
  <div style={{ background: G.border, borderRadius: 99, height, overflow: "hidden" }}>
    <div style={{ width: `${Math.min(value, 100)}%`, height: "100%", borderRadius: 99, background: `linear-gradient(90deg, ${color}, ${color}bb)`, transition: "width .5s ease" }} />
  </div>
);

const Modal = ({ title, onClose, children }) => (
  <div style={{ position: "fixed", inset: 0, background: "#00000092", zIndex: 1000, display: "flex", alignItems: "flex-end", justifyContent: "center" }}
    onClick={e => e.target === e.currentTarget && onClose()}>
    <div style={{ background: G.card, border: `1px solid ${G.border}`, borderRadius: "20px 20px 0 0", padding: "20px 20px 32px", width: "100%", maxWidth: 540, maxHeight: "92vh", overflowY: "auto", animation: "slideUp .28s ease" }}>
      <div style={{ width: 36, height: 3, background: G.border, borderRadius: 2, margin: "0 auto 18px" }} />
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 18 }}>
        <h3 style={{ fontFamily: font, fontSize: 19 }}>{title}</h3>
        <button onClick={onClose} style={{ background: "none", border: "none", color: G.textMuted, fontSize: 22, cursor: "pointer", padding: "4px 8px" }}>×</button>
      </div>
      {children}
    </div>
  </div>
);

// ── Goal Form ─────────────────────────────────────────────────────────────────
const GoalForm = ({ initial, onSave, onClose }) => {
  const [f, setF] = useState(initial || { title: "", category: "Finance", targetDate: "", progress: 0, kpi: "", priority: "Medium", status: "Not Started", notes: "" });
  const set = (k, v) => setF(p => ({ ...p, [k]: v }));
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 13 }}>
      <div>
        <label style={{ fontSize: 10, color: G.textMuted, display: "block", marginBottom: 5, fontWeight: 700, letterSpacing: .5 }}>GOAL TITLE *</label>
        <input value={f.title} onChange={e => set("title", e.target.value)} placeholder="What do you want to achieve?" />
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
        <div>
          <label style={{ fontSize: 10, color: G.textMuted, display: "block", marginBottom: 5, fontWeight: 700, letterSpacing: .5 }}>CATEGORY</label>
          <select value={f.category} onChange={e => set("category", e.target.value)}>{CATEGORIES.map(c => <option key={c}>{c}</option>)}</select>
        </div>
        <div>
          <label style={{ fontSize: 10, color: G.textMuted, display: "block", marginBottom: 5, fontWeight: 700, letterSpacing: .5 }}>PRIORITY</label>
          <select value={f.priority} onChange={e => set("priority", e.target.value)}>{PRIORITIES.map(p => <option key={p}>{p}</option>)}</select>
        </div>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
        <div>
          <label style={{ fontSize: 10, color: G.textMuted, display: "block", marginBottom: 5, fontWeight: 700, letterSpacing: .5 }}>TARGET DATE</label>
          <input type="date" value={f.targetDate} onChange={e => set("targetDate", e.target.value)} />
        </div>
        <div>
          <label style={{ fontSize: 10, color: G.textMuted, display: "block", marginBottom: 5, fontWeight: 700, letterSpacing: .5 }}>STATUS</label>
          <select value={f.status} onChange={e => set("status", e.target.value)}>{STATUSES.map(s => <option key={s}>{s}</option>)}</select>
        </div>
      </div>
      <div>
        <label style={{ fontSize: 10, color: G.textMuted, display: "block", marginBottom: 5, fontWeight: 700, letterSpacing: .5 }}>PROGRESS: {f.progress}%</label>
        <input type="range" min={0} max={100} value={f.progress} onChange={e => set("progress", +e.target.value)} style={{ width: "100%" }} />
      </div>
      <div>
        <label style={{ fontSize: 10, color: G.textMuted, display: "block", marginBottom: 5, fontWeight: 700, letterSpacing: .5 }}>MEASURE / KPI</label>
        <input value={f.kpi} onChange={e => set("kpi", e.target.value)} placeholder="How will you know you succeeded?" />
      </div>
      <div>
        <label style={{ fontSize: 10, color: G.textMuted, display: "block", marginBottom: 5, fontWeight: 700, letterSpacing: .5 }}>NOTES</label>
        <textarea rows={2} value={f.notes} onChange={e => set("notes", e.target.value)} style={{ resize: "none" }} placeholder="Any extra context..." />
      </div>
      <div style={{ display: "flex", gap: 10, paddingTop: 4 }}>
        <Btn variant="ghost" onClick={onClose} full>Cancel</Btn>
        <Btn onClick={() => f.title && onSave({ ...f, id: f.id || uid() })} full disabled={!f.title}>💾 Save Goal</Btn>
      </div>
    </div>
  );
};

// ── Goals Tab ─────────────────────────────────────────────────────────────────
const GoalsTab = ({ goals, onUpdate, onDelete, onAdd, title, color, onMarkAchieved }) => {
  const [editing, setEditing] = useState(null);
  const [adding, setAdding] = useState(false);
  const [filter, setFilter] = useState("All");
  const filtered = filter === "All" ? goals : goals.filter(g => g.status === filter);
  const completed = goals.filter(g => g.status === "Completed").length;
  const avgProg = goals.length ? Math.round(goals.reduce((a, g) => a + g.progress, 0) / goals.length) : 0;

  return (
    <div className="fadeUp">
      <div style={{ display: "grid", gridTemplateColumns: "repeat(2,1fr)", gap: 10, marginBottom: 18 }}>
        {[
          { l: "Total", v: goals.length, i: "🎯", c: color },
          { l: "Done", v: completed, i: "✅", c: G.green },
          { l: "Active", v: goals.filter(g => g.status === "In Progress").length, i: "🔥", c: G.blue },
          { l: "Avg", v: `${avgProg}%`, i: "📈", c: G.gold },
        ].map(({ l, v, i, c }) => (
          <div key={l} style={{ background: G.bg2, border: `1px solid ${G.border}`, borderRadius: 12, padding: "12px 10px", textAlign: "center" }}>
            <div style={{ fontSize: 18 }}>{i}</div>
            <div style={{ fontFamily: font, fontSize: 24, color: c, lineHeight: 1.2 }}>{v}</div>
            <div style={{ fontSize: 10, color: G.textMuted, fontWeight: 700 }}>{l}</div>
          </div>
        ))}
      </div>

      <div style={{ display: "flex", gap: 5, marginBottom: 14, flexWrap: "wrap", alignItems: "center" }}>
        {["All", ...STATUSES].map(s => (
          <button key={s} onClick={() => setFilter(s)} style={{
            background: filter === s ? `${color}25` : "transparent",
            border: `1px solid ${filter === s ? color : G.border}`,
            color: filter === s ? color : G.textMuted,
            borderRadius: 8, padding: "5px 10px", fontSize: 10, fontWeight: 700, cursor: "pointer",
          }}>{s}</button>
        ))}
        <div style={{ marginLeft: "auto" }}>
          <Btn size="sm" onClick={() => setAdding(true)}>+ Add</Btn>
        </div>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        {filtered.length === 0 && (
          <div style={{ textAlign: "center", padding: 50, color: G.textDim }}>
            <div style={{ fontSize: 36, marginBottom: 8 }}>🎯</div>
            No goals here yet!
          </div>
        )}
        {filtered.map(goal => (
          <div key={goal.id} style={{ background: G.bg2, border: `1px solid ${G.border}`, borderRadius: 14, padding: "14px 14px", transition: "border .2s" }}
            onMouseEnter={e => e.currentTarget.style.borderColor = color}
            onMouseLeave={e => e.currentTarget.style.borderColor = G.border}>
            <div style={{ display: "flex", justifyContent: "space-between", gap: 10 }}>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontWeight: 700, fontSize: 13, marginBottom: 6, lineHeight: 1.4 }}>{goal.title}</div>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 4, marginBottom: 7 }}>
                  <Badge label={goal.category} color={G.purpleLight} />
                  <Badge label={goal.priority} color={priorityColor(goal.priority)} />
                  <Badge label={goal.status} color={statusColor(goal.status)} />
                </div>
                {goal.kpi && <div style={{ fontSize: 11, color: G.textMuted, marginBottom: 6 }}>📏 {goal.kpi}</div>}
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <div style={{ flex: 1 }}><ProgressBar value={goal.progress} color={color} /></div>
                  <span style={{ fontSize: 12, fontWeight: 700, color, minWidth: 32 }}>{goal.progress}%</span>
                </div>
                {goal.targetDate && <div style={{ fontSize: 10, color: G.textDim, marginTop: 4 }}>🗓 {formatDate(goal.targetDate)}</div>}
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 5, flexShrink: 0 }}>
                {goal.status !== "Completed" && <Btn variant="success" size="sm" onClick={() => onMarkAchieved(goal)}>🏆</Btn>}
                <Btn variant="muted" size="sm" onClick={() => setEditing(goal)}>✏️</Btn>
                <Btn variant="danger" size="sm" onClick={() => onDelete(goal.id)}>🗑</Btn>
              </div>
            </div>
          </div>
        ))}
      </div>

      {adding && <Modal title="Add Goal" onClose={() => setAdding(false)}><GoalForm onSave={g => { onAdd(g); setAdding(false); }} onClose={() => setAdding(false)} /></Modal>}
      {editing && <Modal title="Edit Goal" onClose={() => setEditing(null)}><GoalForm initial={editing} onSave={g => { onUpdate(g); setEditing(null); }} onClose={() => setEditing(null)} /></Modal>}
    </div>
  );
};

// ── Hall of Fame ──────────────────────────────────────────────────────────────
const HallOfFame = ({ achieved, onAdd, onDelete, userName, partnerName }) => {
  const [adding, setAdding] = useState(false);
  const [form, setForm] = useState({ title: "", owner: "Him", category: "Finance", dateAchieved: today(), celebration: "" });
  const ownerColors = { Him: G.blue, Her: G.pink, Couple: G.purple };

  return (
    <div className="fadeUp">
      <div style={{ textAlign: "center", marginBottom: 22 }}>
        <div style={{ fontSize: 48 }}>🏆</div>
        <h2 style={{ fontFamily: font, fontSize: 26, marginTop: 6 }}>Hall of Fame</h2>
        <p style={{ color: G.textMuted, fontSize: 12, marginTop: 3 }}>Every win logged. Every victory celebrated.</p>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 10, marginBottom: 18 }}>
        {[
          { l: `${userName || "His"} Wins`, n: achieved.filter(a => a.owner === "Him").length, c: G.blue },
          { l: `${partnerName || "Her"} Wins`, n: achieved.filter(a => a.owner === "Her").length, c: G.pink },
          { l: "Joint Wins", n: achieved.filter(a => a.owner === "Couple").length, c: G.purple },
        ].map(({ l, n, c }) => (
          <div key={l} style={{ background: `${c}12`, border: `1px solid ${c}35`, borderRadius: 12, padding: 14, textAlign: "center" }}>
            <div style={{ fontFamily: font, fontSize: 26, color: c }}>{n}</div>
            <div style={{ fontSize: 10, fontWeight: 700, color: G.textMuted, marginTop: 2 }}>{l}</div>
          </div>
        ))}
      </div>
      <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: 12 }}>
        <Btn variant="gold" onClick={() => setAdding(true)}>🏆 Log Win</Btn>
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        {achieved.length === 0 && <div style={{ textAlign: "center", padding: 50, color: G.textDim }}><div style={{ fontSize: 40 }}>✨</div><div style={{ marginTop: 8 }}>Your first win is coming!</div></div>}
        {achieved.map(a => (
          <div key={a.id} style={{ background: `${ownerColors[a.owner] || G.purple}10`, border: `1px solid ${ownerColors[a.owner] || G.purple}35`, borderRadius: 14, padding: "14px 14px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", gap: 10 }}>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontWeight: 700, fontSize: 13, marginBottom: 5 }}>🏆 {a.title}</div>
                <div style={{ display: "flex", gap: 5, flexWrap: "wrap", marginBottom: 4 }}>
                  <Badge label={a.owner} color={ownerColors[a.owner] || G.purple} />
                  <Badge label={a.category} color={G.purpleLight} />
                </div>
                {a.celebration && <div style={{ color: G.goldLight, fontSize: 12, fontStyle: "italic" }}>{a.celebration}</div>}
                <div style={{ fontSize: 10, color: G.textDim, marginTop: 3 }}>🗓 {formatDate(a.dateAchieved)}</div>
              </div>
              <Btn variant="danger" size="sm" onClick={() => onDelete(a.id)}>🗑</Btn>
            </div>
          </div>
        ))}
      </div>
      {adding && (
        <Modal title="🏆 Log Achievement" onClose={() => setAdding(false)}>
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            <input value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))} placeholder="What did you achieve?" />
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
              <select value={form.owner} onChange={e => setForm(f => ({ ...f, owner: e.target.value }))}><option>Him</option><option>Her</option><option>Couple</option></select>
              <select value={form.category} onChange={e => setForm(f => ({ ...f, category: e.target.value }))}>{CATEGORIES.map(c => <option key={c}>{c}</option>)}</select>
            </div>
            <input type="date" value={form.dateAchieved} onChange={e => setForm(f => ({ ...f, dateAchieved: e.target.value }))} />
            <input value={form.celebration} onChange={e => setForm(f => ({ ...f, celebration: e.target.value }))} placeholder="How are you celebrating? 🎉" />
            <div style={{ display: "flex", gap: 10, paddingTop: 4 }}>
              <Btn variant="ghost" onClick={() => setAdding(false)} full>Cancel</Btn>
              <Btn variant="gold" onClick={() => { if (form.title) { onAdd({ ...form, id: uid() }); setAdding(false); } }} full>🏆 Log It!</Btn>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};

// ── Check-In ──────────────────────────────────────────────────────────────────
const CheckIn = ({ checkins, onUpdate }) => {
  const [active, setActive] = useState(new Date().getMonth());
  const ci = checkins[active];
  const set = (k, v) => onUpdate(active, { ...ci, [k]: v });

  return (
    <div className="fadeUp">
      <div style={{ textAlign: "center", marginBottom: 18 }}>
        <h2 style={{ fontFamily: font, fontSize: 24 }}>📅 Monthly Check-In</h2>
        <p style={{ color: G.textMuted, fontSize: 12, marginTop: 3 }}>30 minutes together. Every month.</p>
      </div>
      <div style={{ display: "flex", gap: 5, flexWrap: "wrap", marginBottom: 20, justifyContent: "center" }}>
        {MONTHS.map((m, i) => (
          <button key={m} onClick={() => setActive(i)} style={{
            background: active === i ? `linear-gradient(135deg, ${G.purple}, ${G.pink})` : G.bg2,
            border: `1px solid ${active === i ? "transparent" : G.border}`,
            color: active === i ? "#fff" : G.textMuted,
            borderRadius: 8, padding: "5px 9px", fontSize: 10, fontWeight: 700, cursor: "pointer",
          }}>{m.slice(0, 3)}</button>
        ))}
      </div>
      <Card glow>
        <h3 style={{ fontFamily: font, fontSize: 18, marginBottom: 16, color: G.purpleLight }}>{MONTHS[active]}</h3>
        <div style={{ display: "flex", flexDirection: "column", gap: 13 }}>
          {[
            { key: "his", label: "His Progress", color: G.blue },
            { key: "her", label: "Her Progress", color: G.pink },
            { key: "couple", label: "Couple Progress", color: G.purple },
            { key: "win", label: "🏆 Win of the Month", color: G.gold },
            { key: "challenge", label: "⚡ Challenge", color: G.orange },
            { key: "action", label: "🚀 Next Month Focus", color: G.green },
          ].map(({ key, label, color }) => (
            <div key={key}>
              <label style={{ fontSize: 10, fontWeight: 700, color, display: "block", marginBottom: 5, letterSpacing: .4 }}>{label.toUpperCase()}</label>
              <textarea rows={2} value={ci[key]} onChange={e => set(key, e.target.value)} style={{ resize: "none" }} />
            </div>
          ))}
        </div>
        <div style={{ marginTop: 14 }}><Btn full>💾 Save Check-In</Btn></div>
      </Card>
    </div>
  );
};

// ── Dashboard ─────────────────────────────────────────────────────────────────
const Dashboard = ({ user }) => {
  const { isMobile } = useBreakpoint();
  const all = [...user.hisGoals, ...user.herGoals, ...user.coupleGoals];
  const completed = all.filter(g => g.status === "Completed").length;
  const inProgress = all.filter(g => g.status === "In Progress").length;
  const avgProg = all.length ? Math.round(all.reduce((a, g) => a + g.progress, 0) / all.length) : 0;
  const top5 = [...all].sort((a, b) => b.progress - a.progress).slice(0, 5);
  const catData = CATEGORIES.map(c => ({ c, n: all.filter(g => g.category === c).length })).filter(d => d.n > 0).sort((a, b) => b.n - a.n).slice(0, 6);
  const maxCat = Math.max(...catData.map(d => d.n), 1);

  return (
    <div className="fadeUp">
      <div style={{ marginBottom: 18 }}>
        <h2 style={{ fontFamily: font, fontSize: isMobile ? 20 : 24, lineHeight: 1.2 }}>
          Hey, {user.name}{user.plan === "couple" && user.partnerName ? ` & ${user.partnerName}` : ""} 💑
        </h2>
        <p style={{ color: G.textMuted, fontSize: 12, marginTop: 3 }}>Here's how your journey is going.</p>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(2,1fr)", gap: 10, marginBottom: 16 }}>
        {[
          { l: "Total Goals", v: all.length, i: "🎯", c: G.purpleLight },
          { l: "Completed", v: completed, i: "✅", c: G.green },
          { l: "In Progress", v: inProgress, i: "🔥", c: G.blue },
          { l: "Avg Progress", v: `${avgProg}%`, i: "📈", c: G.gold },
        ].map(({ l, v, i, c }) => (
          <div key={l} style={{ background: G.bg2, border: `1px solid ${G.border}`, borderRadius: 12, padding: "13px 12px", textAlign: "center" }}>
            <div style={{ fontSize: 20 }}>{i}</div>
            <div style={{ fontFamily: font, fontSize: 26, color: c, lineHeight: 1.1 }}>{v}</div>
            <div style={{ fontSize: 10, color: G.textMuted, fontWeight: 700, marginTop: 2 }}>{l}</div>
          </div>
        ))}
      </div>

      <Card style={{ marginBottom: 12 }}>
        <h3 style={{ fontFamily: font, fontSize: 15, marginBottom: 13, color: G.purpleLight }}>🔥 Top Progress Goals</h3>
        <div style={{ display: "flex", flexDirection: "column", gap: 11 }}>
          {top5.map(g => (
            <div key={g.id}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
                <span style={{ fontSize: 12, fontWeight: 600, flex: 1, marginRight: 8, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{g.title}</span>
                <span style={{ fontSize: 12, fontWeight: 700, color: G.purpleLight, flexShrink: 0 }}>{g.progress}%</span>
              </div>
              <ProgressBar value={g.progress} color={statusColor(g.status)} height={5} />
            </div>
          ))}
        </div>
      </Card>

      <Card style={{ marginBottom: 12 }}>
        <h3 style={{ fontFamily: font, fontSize: 15, marginBottom: 13, color: G.purpleLight }}>📊 By Category</h3>
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          {catData.map(({ c, n }) => (
            <div key={c} style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <span style={{ fontSize: 11, color: G.textMuted, width: 86, flexShrink: 0 }}>{c}</span>
              <div style={{ flex: 1 }}><ProgressBar value={(n / maxCat) * 100} color={G.purple} height={5} /></div>
              <span style={{ fontSize: 11, color: G.textMuted, width: 14, textAlign: "right" }}>{n}</span>
            </div>
          ))}
        </div>
      </Card>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 10, marginBottom: 12 }}>
        {[
          { l: "His", goals: user.hisGoals, color: G.blue },
          { l: "Her", goals: user.herGoals, color: G.pink },
          { l: "Ours", goals: user.coupleGoals, color: G.purple },
        ].map(({ l, goals, color }) => {
          const avg = goals.length ? Math.round(goals.reduce((a, g) => a + g.progress, 0) / goals.length) : 0;
          return (
            <div key={l} style={{ background: G.bg2, border: `1px solid ${color}40`, borderRadius: 12, padding: 12, textAlign: "center" }}>
              <div style={{ fontSize: 10, fontWeight: 700, color, marginBottom: 5 }}>{l}</div>
              <div style={{ fontFamily: font, fontSize: 24, color }}>{goals.length}</div>
              <div style={{ marginTop: 6 }}><ProgressBar value={avg} color={color} height={4} /></div>
              <div style={{ fontSize: 9, color: G.textMuted, marginTop: 3 }}>{avg}%</div>
            </div>
          );
        })}
      </div>

      {user.achieved.length > 0 && (
        <Card>
          <h3 style={{ fontFamily: font, fontSize: 15, marginBottom: 11, color: G.goldLight }}>🏆 Recent Wins</h3>
          <div style={{ display: "flex", flexDirection: "column", gap: 7 }}>
            {user.achieved.slice(0, 3).map(a => (
              <div key={a.id} style={{ background: `${G.gold}10`, border: `1px solid ${G.gold}25`, borderRadius: 10, padding: "9px 12px" }}>
                <div style={{ fontSize: 12, fontWeight: 700 }}>{a.title}</div>
                <div style={{ fontSize: 10, color: G.textMuted, marginTop: 1 }}>{a.owner} · {formatDate(a.dateAchieved)}</div>
              </div>
            ))}
          </div>
        </Card>
      )}
    </div>
  );
};

// ── Landing Page ──────────────────────────────────────────────────────────────
const Landing = ({ onGetStarted, onLogin }) => {
  const { isMobile, w } = useBreakpoint();
  const px = isMobile ? 18 : 48;

  return (
    <div style={{ minHeight: "100vh", background: G.bg, overflowX: "hidden" }}>
      <div style={{ position: "fixed", inset: 0, pointerEvents: "none", zIndex: 0 }}>
        <div style={{ position: "absolute", top: "5%", left: "5%", width: isMobile ? 180 : 380, height: isMobile ? 180 : 380, background: `${G.purple}12`, borderRadius: "50%", filter: "blur(80px)" }} />
        <div style={{ position: "absolute", top: "55%", right: "5%", width: isMobile ? 160 : 350, height: 250, background: `${G.pink}10`, borderRadius: "50%", filter: "blur(80px)" }} />
      </div>

      {/* Nav */}
      <nav style={{ position: "sticky", top: 0, zIndex: 100, backdropFilter: "blur(20px)", background: `${G.bg}cc`, borderBottom: `1px solid ${G.border}`, padding: `13px ${px}px`, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div style={{ fontFamily: font, fontSize: isMobile ? 19 : 22 }}>
          <span style={{ background: `linear-gradient(135deg, ${G.purple}, ${G.pink})`, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>Goal</span>Together
        </div>
        <div style={{ display: "flex", gap: 8 }}>
          <Btn variant="ghost" size="sm" onClick={onLogin}>Log In</Btn>
          <Btn size="sm" onClick={() => onGetStarted("couple")}>Start Free</Btn>
        </div>
      </nav>

      {/* Hero */}
      <section style={{ position: "relative", zIndex: 1, textAlign: "center", padding: isMobile ? "52px 18px 36px" : "90px 24px 52px" }}>
        <div className="fadeUp" style={{ display: "inline-block", background: `${G.purple}20`, border: `1px solid ${G.purple}40`, borderRadius: 99, padding: "5px 14px", fontSize: 11, color: G.purpleLight, marginBottom: 18 }}>
          ✨ The #1 goal-setting platform for couples
        </div>
        <h1 className="fadeUp" style={{ fontFamily: font, fontSize: `clamp(30px, 8vw, 72px)`, lineHeight: 1.1, maxWidth: 720, margin: "0 auto 18px", animationDelay: ".1s" }}>
          Achieve More,{" "}
          <span style={{ background: `linear-gradient(135deg, ${G.purple}, ${G.pink}, ${G.gold})`, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>Together.</span>
        </h1>
        <p className="fadeUp" style={{ fontSize: isMobile ? 14 : 17, color: G.textMuted, maxWidth: 500, margin: "0 auto 28px", lineHeight: 1.7, animationDelay: ".2s" }}>
          Set goals. Track progress. Celebrate wins. The analytics-driven platform for ambitious couples and individuals.
        </p>
        <div className="fadeUp" style={{ display: "flex", gap: 10, justifyContent: "center", flexWrap: "wrap", animationDelay: ".3s" }}>
          <Btn size="lg" onClick={() => onGetStarted("couple")}>💑 Start Together</Btn>
          <Btn size={isMobile ? "md" : "lg"} variant="ghost" onClick={() => onGetStarted("individual")}>🧑 Go Solo</Btn>
        </div>
      </section>

      {/* Features */}
      <section style={{ position: "relative", zIndex: 1, padding: `44px ${px}px` }}>
        <h2 style={{ fontFamily: font, fontSize: isMobile ? 24 : 32, textAlign: "center", marginBottom: 8 }}>Everything you need</h2>
        <p style={{ textAlign: "center", color: G.textMuted, marginBottom: 30, fontSize: 13 }}>World-class frameworks. Beautiful design.</p>
        <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr 1fr" : w < 900 ? "1fr 1fr" : "repeat(3,1fr)", gap: 12, maxWidth: 960, margin: "0 auto" }}>
          {[
            { icon: "📊", title: "Live Dashboard", desc: "Real-time analytics across all your goals." },
            { icon: "🎯", title: "3-Track System", desc: "His, Her, and Couple goal spaces." },
            { icon: "🏆", title: "Hall of Fame", desc: "Log and celebrate every achievement." },
            { icon: "📅", title: "Monthly Check-Ins", desc: "Guided 30-min monthly review ritual." },
            { icon: "📏", title: "Measurable KPIs", desc: "Every goal has a clear success metric." },
            { icon: "💑", title: "Built for Couples", desc: "Individual ambition + shared vision." },
          ].map(({ icon, title, desc }) => (
            <div key={title} style={{ background: G.card, border: `1px solid ${G.border}`, borderRadius: 14, padding: isMobile ? "16px 14px" : 22 }}>
              <div style={{ fontSize: isMobile ? 26 : 30, marginBottom: 8 }}>{icon}</div>
              <div style={{ fontFamily: font, fontSize: isMobile ? 14 : 16, marginBottom: 5 }}>{title}</div>
              <div style={{ color: G.textMuted, fontSize: isMobile ? 11 : 13, lineHeight: 1.6 }}>{desc}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Pricing */}
      <section style={{ position: "relative", zIndex: 1, padding: `44px ${px}px`, background: G.bg2 }}>
        <h2 style={{ fontFamily: font, fontSize: isMobile ? 26 : 34, textAlign: "center", marginBottom: 8 }}>Simple pricing</h2>
        <p style={{ textAlign: "center", color: G.textMuted, marginBottom: 36, fontSize: 13 }}>Invest in your goals. Worth every cent.</p>
        <div style={{ display: "flex", gap: 18, justifyContent: "center", flexDirection: isMobile ? "column" : "row", alignItems: isMobile ? "stretch" : "flex-start", maxWidth: 680, margin: "0 auto" }}>
          {/* Individual */}
          <div style={{ background: G.card, border: `1px solid ${G.border}`, borderRadius: 20, padding: isMobile ? 24 : 30, flex: 1, textAlign: "center" }}>
            <div style={{ fontSize: 34, marginBottom: 8 }}>🧑</div>
            <div style={{ fontFamily: font, fontSize: 18, marginBottom: 5 }}>Individual</div>
            <div style={{ fontFamily: font, fontSize: 44, color: G.purpleLight, lineHeight: 1 }}>KES 149</div>
            <div style={{ color: G.textMuted, fontSize: 11, marginBottom: 20 }}>per year</div>
            {["Personal goal dashboard", "Unlimited goals", "KPI & progress tracking", "Monthly check-ins", "Hall of Fame", "Analytics"].map(f => (
              <div key={f} style={{ display: "flex", gap: 8, alignItems: "center", marginBottom: 7, textAlign: "left" }}>
                <span style={{ color: G.green, fontWeight: 700 }}>✓</span>
                <span style={{ fontSize: 12, color: G.textMuted }}>{f}</span>
              </div>
            ))}
            <Btn variant="ghost" full style={{ marginTop: 18 }} onClick={() => onGetStarted("individual")}>Get Started</Btn>
          </div>
          {/* Couple */}
          <div style={{ background: `linear-gradient(135deg, ${G.purple}18, ${G.pink}12)`, border: `2px solid ${G.purple}`, borderRadius: 20, padding: isMobile ? 24 : 30, flex: 1, textAlign: "center", position: "relative", boxShadow: `0 0 36px ${G.purple}25` }}>
            <div style={{ position: "absolute", top: -13, left: "50%", transform: "translateX(-50%)", background: `linear-gradient(135deg, ${G.purple}, ${G.pink})`, borderRadius: 99, padding: "4px 14px", fontSize: 10, fontWeight: 700, whiteSpace: "nowrap" }}>⭐ MOST POPULAR</div>
            <div style={{ fontSize: 34, marginBottom: 8 }}>💑</div>
            <div style={{ fontFamily: font, fontSize: 18, marginBottom: 5 }}>Couple</div>
            <div style={{ fontFamily: font, fontSize: 44, color: G.purpleLight, lineHeight: 1 }}>KES 199</div>
            <div style={{ color: G.textMuted, fontSize: 11, marginBottom: 20 }}>per year · 2 people</div>
            {["Everything in Individual", "His + Her + Couple tracks", "Joint analytics", "Partner personalisation", "Shared Hall of Fame", "Couples check-in ritual"].map(f => (
              <div key={f} style={{ display: "flex", gap: 8, alignItems: "center", marginBottom: 7, textAlign: "left" }}>
                <span style={{ color: G.purple, fontWeight: 700 }}>✓</span>
                <span style={{ fontSize: 12, color: G.text }}>{f}</span>
              </div>
            ))}
            <Btn full style={{ marginTop: 18 }} onClick={() => onGetStarted("couple")}>Start Together →</Btn>
          </div>
        </div>
      </section>

      <footer style={{ position: "relative", zIndex: 1, textAlign: "center", padding: "22px", color: G.textDim, fontSize: 11, borderTop: `1px solid ${G.border}` }}>
        <span style={{ fontFamily: font, color: G.textMuted }}>GoalTogether</span> · Built for dreamers who execute · © 2025
      </footer>
    </div>
  );
};

// ── Auth Screen ───────────────────────────────────────────────────────────────
const Auth = ({ mode: initMode, defaultPlan, onSuccess, onBack }) => {
  const [mode, setMode] = useState(initMode);
  const [sf, setSF] = useState({ name: "", partner: "", email: "", password: "", plan: defaultPlan || "couple" });
  const [lf, setLF] = useState({ email: "", password: "" });

  // Paystack config
  const amountToCharge = sf.plan === "couple" ? 199 : 149;
  const config = {
    reference: (new Date()).getTime().toString(),
    email: sf.email || "guest@goaltogether.com",
    amount: amountToCharge * 100, // Paystack amount is in kobo/cents
    publicKey: "pk_live_786a2015613ac0cadb80564c2950cbb82532db3a",
    currency: "KES",
  };

  const initializePayment = usePaystackPayment(config);

  const handleCreateAccount = () => {
    // If public key is obviously a placeholder, just succeed for local dev.
    if (config.publicKey.includes("xxxx")) {
      alert("Paystack Key missing: Bypassing checkout for local development.");
      onSuccess("signup", sf);
      return;
    }

    initializePayment(
      (ref) => {
        // Payment complete!
        onSuccess("signup", sf);
      },
      () => {
        // Payment closed/cancelled
        alert("Payment was not completed.");
      }
    );
  };

  return (
    <div style={{ minHeight: "100vh", background: G.bg, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: 20 }}>
      <div style={{ position: "fixed", inset: 0, pointerEvents: "none" }}>
        <div style={{ position: "absolute", top: "20%", left: "10%", width: 280, height: 280, background: `${G.purple}12`, borderRadius: "50%", filter: "blur(80px)" }} />
        <div style={{ position: "absolute", bottom: "15%", right: "10%", width: 240, height: 240, background: `${G.pink}10`, borderRadius: "50%", filter: "blur(80px)" }} />
      </div>
      <div style={{ position: "relative", zIndex: 1, width: "100%", maxWidth: 420 }}>
        <button onClick={onBack} style={{ background: "none", border: "none", color: G.textMuted, cursor: "pointer", marginBottom: 18, fontSize: 13, display: "flex", alignItems: "center", gap: 6 }}>← Back</button>
        <div style={{ textAlign: "center", marginBottom: 24 }}>
          <div style={{ fontFamily: font, fontSize: 26 }}>
            <span style={{ background: `linear-gradient(135deg, ${G.purple}, ${G.pink})`, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>Goal</span>Together
          </div>
          <p style={{ color: G.textMuted, marginTop: 4, fontSize: 12 }}>{mode === "signup" ? "Create your account" : "Welcome back"}</p>
        </div>
        <div style={{ display: "flex", background: G.bg2, borderRadius: 12, padding: 4, marginBottom: 22, border: `1px solid ${G.border}` }}>
          {["signup", "login"].map(m => (
            <button key={m} onClick={() => setMode(m)} style={{
              flex: 1, padding: "9px", borderRadius: 9, fontWeight: 700, fontSize: 13,
              background: mode === m ? `linear-gradient(135deg, ${G.purple}, ${G.pink})` : "transparent",
              color: mode === m ? "#fff" : G.textMuted, border: "none", cursor: "pointer",
            }}>{m === "signup" ? "Sign Up" : "Log In"}</button>
          ))}
        </div>
        <Card glow>
          {mode === "signup" ? (
            <div style={{ display: "flex", flexDirection: "column", gap: 13 }}>
              <div>
                <label style={{ fontSize: 10, color: G.textMuted, display: "block", marginBottom: 7, fontWeight: 700, letterSpacing: .5 }}>CHOOSE YOUR PLAN</label>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
                  {[{ val: "individual", icon: "🧑", label: "Individual", price: "$149/yr" }, { val: "couple", icon: "💑", label: "Couple", price: "$199/yr" }].map(({ val, icon, label, price }) => (
                    <button key={val} onClick={() => setSF(f => ({ ...f, plan: val }))} style={{
                      background: sf.plan === val ? `${G.purple}25` : G.bg2,
                      border: `2px solid ${sf.plan === val ? G.purple : G.border}`,
                      borderRadius: 12, padding: "12px 8px", cursor: "pointer", textAlign: "center",
                    }}>
                      <div style={{ fontSize: 22 }}>{icon}</div>
                      <div style={{ fontWeight: 700, fontSize: 12, color: G.text, marginTop: 3 }}>{label}</div>
                      <div style={{ fontSize: 11, color: G.purpleLight, fontWeight: 700 }}>{price}</div>
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <label style={{ fontSize: 10, color: G.textMuted, display: "block", marginBottom: 5, fontWeight: 700, letterSpacing: .5 }}>YOUR NAME *</label>
                <input value={sf.name} onChange={e => setSF(f => ({ ...f, name: e.target.value }))} placeholder="First name" />
              </div>
              {sf.plan === "couple" && (
                <div>
                  <label style={{ fontSize: 10, color: G.textMuted, display: "block", marginBottom: 5, fontWeight: 700, letterSpacing: .5 }}>PARTNER'S NAME</label>
                  <input value={sf.partner} onChange={e => setSF(f => ({ ...f, partner: e.target.value }))} placeholder="Your partner's first name" />
                </div>
              )}
              <div>
                <label style={{ fontSize: 10, color: G.textMuted, display: "block", marginBottom: 5, fontWeight: 700, letterSpacing: .5 }}>EMAIL *</label>
                <input type="email" value={sf.email} onChange={e => setSF(f => ({ ...f, email: e.target.value }))} placeholder="you@example.com" />
              </div>
              <div>
                <label style={{ fontSize: 10, color: G.textMuted, display: "block", marginBottom: 5, fontWeight: 700, letterSpacing: .5 }}>PASSWORD</label>
                <input type="password" value={sf.password} onChange={e => setSF(f => ({ ...f, password: e.target.value }))} placeholder="Create a password" />
              </div>
              <Btn full size="lg" style={{ marginTop: 4 }} onClick={handleCreateAccount} disabled={!sf.name || !sf.email}>
                🚀 Create Account — {sf.plan === "couple" ? "KES 199" : "KES 149"}/yr
              </Btn>
              <p style={{ fontSize: 10, color: G.textDim, textAlign: "center" }}>Secured via Paystack (Card & M-PESA)</p>
            </div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: 13 }}>
              <div>
                <label style={{ fontSize: 10, color: G.textMuted, display: "block", marginBottom: 5, fontWeight: 700, letterSpacing: .5 }}>EMAIL</label>
                <input type="email" value={lf.email} onChange={e => setLF(f => ({ ...f, email: e.target.value }))} placeholder="you@example.com" />
              </div>
              <div>
                <label style={{ fontSize: 10, color: G.textMuted, display: "block", marginBottom: 5, fontWeight: 700, letterSpacing: .5 }}>PASSWORD</label>
                <input type="password" value={lf.password} onChange={e => setLF(f => ({ ...f, password: e.target.value }))} placeholder="Your password" />
              </div>
              <Btn full size="lg" style={{ marginTop: 4 }} onClick={() => onSuccess("login", lf)}>Log In →</Btn>
            </div>
          )}
        </Card>
      </div>
    </div>
  );
};

// ── App Shell ─────────────────────────────────────────────────────────────────
const AppShell = ({ user, onLogout, onUpdateUser }) => {
  const { isMobile } = useBreakpoint();
  const [activeTab, setActiveTab] = useState("dashboard");

  const tabs = [
    { id: "dashboard", label: "Home", icon: "📊" },
    { id: "his", label: isMobile ? "His" : `${user.name}'s Goals`, icon: "🧑" },
    ...(user.plan === "couple" ? [{ id: "her", label: isMobile ? "Her" : `${user.partnerName || "Her"}'s Goals`, icon: "👩" }] : []),
    ...(user.plan === "couple" ? [{ id: "couple", label: isMobile ? "Ours" : "Our Goals", icon: "💑" }] : []),
    { id: "achieved", label: isMobile ? "Wins" : "Hall of Fame", icon: "🏆" },
    { id: "checkin", label: isMobile ? "Check" : "Check-In", icon: "📅" },
  ];

  const updateGoals = (field, goals) => onUpdateUser({ ...user, [field]: goals });
  const markAchieved = (goal, owner) => {
    const fm = { Him: "hisGoals", Her: "herGoals", Couple: "coupleGoals" };
    onUpdateUser({
      ...user,
      [fm[owner]]: user[fm[owner]].map(x => x.id === goal.id ? { ...x, status: "Completed", progress: 100 } : x),
      achieved: [{ id: uid(), title: goal.title, owner, category: goal.category, dateAchieved: today(), celebration: "🎉 Crushed it!" }, ...user.achieved],
    });
  };

  const content = () => {
    if (activeTab === "dashboard") return <Dashboard user={user} />;
    if (activeTab === "his") return <GoalsTab title="His" goals={user.hisGoals} color={G.blue} onAdd={g => updateGoals("hisGoals", [...user.hisGoals, g])} onUpdate={g => updateGoals("hisGoals", user.hisGoals.map(x => x.id === g.id ? g : x))} onDelete={id => updateGoals("hisGoals", user.hisGoals.filter(x => x.id !== id))} onMarkAchieved={g => markAchieved(g, "Him")} />;
    if (activeTab === "her") return <GoalsTab title="Her" goals={user.herGoals} color={G.pink} onAdd={g => updateGoals("herGoals", [...user.herGoals, g])} onUpdate={g => updateGoals("herGoals", user.herGoals.map(x => x.id === g.id ? g : x))} onDelete={id => updateGoals("herGoals", user.herGoals.filter(x => x.id !== id))} onMarkAchieved={g => markAchieved(g, "Her")} />;
    if (activeTab === "couple") return <GoalsTab title="Couple" goals={user.coupleGoals} color={G.purple} onAdd={g => updateGoals("coupleGoals", [...user.coupleGoals, g])} onUpdate={g => updateGoals("coupleGoals", user.coupleGoals.map(x => x.id === g.id ? g : x))} onDelete={id => updateGoals("coupleGoals", user.coupleGoals.filter(x => x.id !== id))} onMarkAchieved={g => markAchieved(g, "Couple")} />;
    if (activeTab === "achieved") return <HallOfFame achieved={user.achieved} userName={user.name} partnerName={user.partnerName} onAdd={a => onUpdateUser({ ...user, achieved: [a, ...user.achieved] })} onDelete={id => onUpdateUser({ ...user, achieved: user.achieved.filter(a => a.id !== id) })} />;
    if (activeTab === "checkin") return <CheckIn checkins={user.checkins} onUpdate={(idx, upd) => onUpdateUser({ ...user, checkins: user.checkins.map((c, i) => i === idx ? upd : c) })} />;
  };

  return (
    <>
      <style>{css}</style>
      <div style={{ minHeight: "100vh", background: G.bg, display: "flex" }}>

        {/* Desktop sidebar */}
        {!isMobile && (
          <aside style={{ width: 232, background: G.bg2, borderRight: `1px solid ${G.border}`, display: "flex", flexDirection: "column", padding: "22px 0", position: "fixed", height: "100vh", overflowY: "auto", zIndex: 50 }}>
            <div style={{ padding: "0 18px 18px", borderBottom: `1px solid ${G.border}` }}>
              <div style={{ fontFamily: font, fontSize: 19 }}>
                <span style={{ background: `linear-gradient(135deg, ${G.purple}, ${G.pink})`, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>Goal</span>Together
              </div>
              <div style={{ marginTop: 12, display: "flex", alignItems: "center", gap: 9 }}>
                <div style={{ width: 32, height: 32, borderRadius: "50%", background: `linear-gradient(135deg, ${G.purple}, ${G.pink})`, display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 700, fontSize: 13, flexShrink: 0 }}>{user.name[0]}</div>
                <div style={{ minWidth: 0 }}>
                  <div style={{ fontSize: 12, fontWeight: 700, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{user.name}{user.plan === "couple" && user.partnerName ? ` & ${user.partnerName}` : ""}</div>
                  <div style={{ fontSize: 10, color: G.textMuted }}>{user.plan === "couple" ? "💑 Couple" : "🧑 Individual"}</div>
                </div>
              </div>
            </div>
            <nav style={{ padding: "12px 8px", flex: 1 }}>
              {tabs.map(tab => (
                <button key={tab.id} onClick={() => setActiveTab(tab.id)} style={{
                  width: "100%", display: "flex", alignItems: "center", gap: 9, padding: "9px 12px", borderRadius: 10, marginBottom: 3,
                  background: activeTab === tab.id ? `${G.purple}25` : "transparent",
                  border: `1px solid ${activeTab === tab.id ? G.purple + "55" : "transparent"}`,
                  color: activeTab === tab.id ? G.purpleLight : G.textMuted,
                  fontFamily: fontBody, fontSize: 13, fontWeight: 600, cursor: "pointer", textAlign: "left", transition: "all .12s",
                }}>
                  <span>{tab.icon}</span><span>{tab.label}</span>
                </button>
              ))}
            </nav>
            <div style={{ padding: "0 8px" }}>
              <Btn variant="ghost" size="sm" onClick={onLogout} full>Log Out</Btn>
            </div>
          </aside>
        )}

        {/* Main content */}
        <main style={{
          marginLeft: isMobile ? 0 : 232, flex: 1,
          padding: isMobile ? "16px 14px 88px" : "26px 26px",
          maxWidth: isMobile ? "100%" : "calc(100vw - 232px)",
        }}>
          {isMobile && (
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 18, paddingBottom: 14, borderBottom: `1px solid ${G.border}` }}>
              <div style={{ fontFamily: font, fontSize: 17 }}>
                <span style={{ background: `linear-gradient(135deg, ${G.purple}, ${G.pink})`, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>Goal</span>Together
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <span style={{ fontSize: 10, color: G.textMuted, fontWeight: 700 }}>{user.plan === "couple" ? "💑" : "🧑"} {user.name}</span>
                <Btn variant="ghost" size="sm" onClick={onLogout}>Out</Btn>
              </div>
            </div>
          )}
          {content()}
        </main>

        {/* Mobile bottom nav */}
        {isMobile && (
          <nav style={{
            position: "fixed", bottom: 0, left: 0, right: 0, zIndex: 50,
            background: `${G.bg2}f8`, backdropFilter: "blur(20px)",
            borderTop: `1px solid ${G.border}`, padding: "7px 0 14px",
            display: "flex", justifyContent: "space-around",
          }}>
            {tabs.map(tab => (
              <button key={tab.id} onClick={() => setActiveTab(tab.id)} style={{
                display: "flex", flexDirection: "column", alignItems: "center", gap: 2,
                background: "none", border: "none", cursor: "pointer",
                color: activeTab === tab.id ? G.purpleLight : G.textDim,
                padding: "4px 6px", flex: 1, transition: "color .12s",
              }}>
                <span style={{ fontSize: 20, lineHeight: 1 }}>{tab.icon}</span>
                <span style={{ fontSize: 9, fontWeight: 700, letterSpacing: .3 }}>{tab.label}</span>
                {activeTab === tab.id && <div style={{ width: 18, height: 2, borderRadius: 99, background: `linear-gradient(90deg, ${G.purple}, ${G.pink})`, marginTop: 1 }} />}
              </button>
            ))}
          </nav>
        )}
      </div>
    </>
  );
};

// ── Root ──────────────────────────────────────────────────────────────────────
export default function App() {
  const [screen, setScreen] = useState("landing");
  const [authCfg, setAuthCfg] = useState({ mode: "signup", plan: "couple" });
  const [user, setUser] = useState(null);
  const [users, setUsers] = useState([]);

  useEffect(() => {
    (async () => {
      try {
        const res = await window.storage.get(STORAGE_KEY);
        if (res) {
          const d = JSON.parse(res.value);
          const us = d.users || [];
          setUsers(us);
          if (d.currentUserId) {
            const u = us.find(u => u.id === d.currentUserId);
            if (u) { setUser(u); setScreen("app"); }
          }
        }
      } catch { }
    })();
  }, []);

  const persist = async (all, cid) => {
    try { await window.storage.set(STORAGE_KEY, JSON.stringify({ users: all, currentUserId: cid })); } catch { }
  };

  const handleUpdateUser = (updated) => {
    const nu = users.map(u => u.id === updated.id ? updated : u);
    setUsers(nu); setUser(updated); persist(nu, updated.id);
  };

  const handleAuth = (mode, fd) => {
    if (mode === "signup") {
      const nu = newUser(fd.name, fd.partner, fd.plan, fd.email);
      const updated = [...users, nu];
      setUsers(updated); setUser(nu); persist(updated, nu.id); setScreen("app");
    } else {
      const found = users.find(u => u.email === fd.email);
      if (found) { setUser(found); persist(users, found.id); setScreen("app"); }
      else alert("No account found. Please sign up first.");
    }
  };

  const handleLogout = () => { setUser(null); persist(users, null); setScreen("landing"); };

  if (screen === "landing") return (
    <><style>{css}</style><Landing onGetStarted={plan => { setAuthCfg({ mode: "signup", plan }); setScreen("auth"); }} onLogin={() => { setAuthCfg({ mode: "login", plan: "couple" }); setScreen("auth"); }} /></>
  );

  if (screen === "auth") return (
    <><style>{css}</style><Auth mode={authCfg.mode} defaultPlan={authCfg.plan} onSuccess={handleAuth} onBack={() => setScreen("landing")} /></>
  );

  if (screen === "app" && user) return <AppShell user={user} onLogout={handleLogout} onUpdateUser={handleUpdateUser} />;

  return null;
}
