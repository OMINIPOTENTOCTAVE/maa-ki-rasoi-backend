import { useState } from "react";

const SAFFRON = "#C8550A";
const CREAM = "#F8F7F5";
const BROWN = "#2D2418";
const SAND = "#E8A87C";
const ACCENT = "#F4E4BC";
const BORDER = "#E5E0D8";

const phases = [
    {
        id: "tokens", number: "01", label: "Design Tokens", icon: "◈", color: SAFFRON,
        description: "Foundation layer — every pixel traces back here",
        steps: [
            { title: "Color Palette", detail: "Brand Saffron #C8550A · Antique Cream #F8F7F5 · Kitchen Brown #2D2418 · Warm Sand #E8A87C" },
            { title: "Typography Scale", detail: "Fraunces (headings) + DM Sans (body) · h1→6xl · h2→4xl · p→lg/relaxed" },
            { title: "Spacing System", detail: "4px base grid · Section padding py-16/24 · Card padding p-6/8 · Always 2–3× more than feels right" },
            { title: "Shadow & Radius", detail: "rounded-2xl cards · rounded-full buttons · Warm brown shadows at 5–8% opacity" },
            { title: "Motion Curves", detail: "Page: opacity 0→1, y 20→0, 400ms easeOut · Hover lift: –4px, 300ms · Stagger: 100ms children" },
        ],
    },
    {
        id: "components", number: "02", label: "Component Library", icon: "⬡", color: "#A04408",
        description: "46 shadcn/ui components + MKR-branded overrides",
        steps: [
            { title: "Atoms", detail: "Button · Badge · Input · Label · Avatar · Skeleton · Separator" },
            { title: "Molecules", detail: "Card · Toast (sonner) · Dialog · Sheet · Dropdown · Select · Tabs" },
            { title: "Organisms", detail: "NavSidebar · PlanCard · MenuBentoCard · SubscriptionStatusCard · SupportTicketForm" },
            { title: "Feedback States", detail: "Loading skeletons for every data-fetching component · Error states with retry CTA · Empty states with illustration" },
            { title: "Rules", detail: "Named exports only · data-testid on every interactive element · lucide-react icons (no emoji)" },
        ],
    },
    {
        id: "screens", number: "03", label: "Screen Inventory", icon: "▣", color: "#6B3A07",
        description: "Every route mapped, every state designed",
        steps: [
            { title: "Public Screens", detail: "/ Home · /menu Today's Menu (Bento Grid) · /plans Subscription Plans · /login Auth Gate" },
            { title: "Auth Screens", detail: "Login — Google OAuth · Phone OTP entry · OTP verification · Error states" },
            { title: "Dashboard Screens", detail: "/dashboard Overview · /subscription Active plan + pause toggle · /orders History · /profile Settings" },
            { title: "Admin Screens", detail: "Dispatch manifest · Subscription engine · Menu management · User management" },
            { title: "Delivery Screens", detail: "Rider route view · Mark delivered · Daily manifest · Pickup confirmation" },
        ],
    },
    {
        id: "userflows", number: "04", label: "User Flows", icon: "⟶", color: "#8B4513",
        description: "Critical journeys that must feel effortless",
        steps: [
            { title: "Onboarding Flow", detail: "Land on Home → View Plans → Click Book Trial → Login prompt → Google sign-in → Dashboard" },
            { title: "Subscription Flow", detail: "Plans page → Select meal type → Choose plan → Razorpay checkout → Confirmation → Dashboard" },
            { title: "Daily Interaction", detail: "App open → Today's menu shown → Delivery status visible → No friction required" },
            { title: "Pause Flow", detail: "Dashboard → Pause toggle → Confirm modal → Success toast → Status updates (cutoff: 10 PM IST)" },
            { title: "Support Flow", detail: "Dashboard → Raise ticket → Fill form → Submit → WhatsApp escalation CTA → Ticket ID shown" },
        ],
    },
    {
        id: "implementation", number: "05", label: "Implementation Order", icon: "▶", color: SAFFRON,
        description: "Build sequence that avoids wasted effort",
        steps: [
            { title: "P0 — Auth (Blocking)", detail: "Fix Firebase Google provider → useAuth hook → AuthContext → Login page wiring → POST /api/auth/firebase" },
            { title: "P1 — Shell + Routing", detail: "App.jsx layout · React Router routes · ProtectedRoute wrapper · NavSidebar · Page transitions" },
            { title: "P2 — Core Pages", detail: "Home hero section · Plans page (Best Value highlighted) · Menu Bento Grid · Dashboard with live data" },
            { title: "P3 — Subscription Engine", detail: "Create subscription flow · Pause/resume with 10 PM IST guard · Order history · Delivery status" },
            { title: "P4 — Polish + Deploy", detail: "Skeleton loaders · Error boundaries · PWA manifest · Cloud Run deploy · Firebase Hosting redeploy" },
        ],
    },
    {
        id: "qa", number: "06", label: "QA & Handoff", icon: "✓", color: "#4F772D",
        description: "Ship only what passes this gate",
        steps: [
            { title: "Visual QA", detail: "Fraunces renders on all pages · Saffron #C8550A exact match · No placeholder images · Grain texture visible" },
            { title: "Interaction QA", detail: "Every button has hover + active state · Page transitions smooth · Toasts use sonner · No layout shift on load" },
            { title: "Auth QA", detail: "Google OAuth completes without error · JWT stored correctly · Logout clears all tokens · Protected routes redirect" },
            { title: "Build QA", detail: "npm run build → exit code 0 · No console errors in production · Lighthouse score > 85 · PWA installable" },
            { title: "Mobile QA", detail: "Tested on 375px (iPhone SE) · Sticky Book Trial CTA visible · Touch targets ≥ 44px · Scroll performance smooth" },
        ],
    },
];

const userJourney = [
    { label: "Discovery", screen: "Home", state: "Guest", color: "#F4E4BC", textColor: BROWN },
    { label: "Explore", screen: "Menu / Plans", state: "Guest", color: "#E8A87C", textColor: BROWN },
    { label: "Intent", screen: "Book Trial", state: "Guest → Auth", color: SAFFRON, textColor: "#FFF" },
    { label: "Auth", screen: "Login", state: "Signing in", color: "#A04408", textColor: "#FFF" },
    { label: "Subscribe", screen: "Checkout", state: "Authenticated", color: "#6B3A07", textColor: "#FFF" },
    { label: "Receive", screen: "Dashboard", state: "Subscriber", color: BROWN, textColor: "#FFF" },
];

export default function MKRDesignWorkflow() {
    const [activePhase, setActivePhase] = useState("tokens");
    const [expandedStep, setExpandedStep] = useState(null);
    const [activeTab, setActiveTab] = useState("workflow");

    const current = phases.find((p) => p.id === activePhase);

    return (
        <div style={{ fontFamily: "'DM Sans', system-ui, sans-serif", background: CREAM, minHeight: "100vh", color: BROWN }}>
            <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:opsz,wght@9..40,300;400;500;600;700&family=Fraunces:opsz,wght@9..144,400;600;700&display=swap');
        * { box-sizing: border-box; }
        .phase-btn { transition: all 0.22s ease; cursor: pointer; }
        .phase-btn:hover { transform: translateY(-2px); box-shadow: 0 6px 16px rgba(45,36,24,0.12); }
        .step-row { transition: background 0.18s ease; cursor: pointer; }
        .step-row:hover { background: #FFF5EB !important; }
        .tab-btn { transition: all 0.18s ease; cursor: pointer; border: none; font-family: 'DM Sans', sans-serif; }
        .journey-node { transition: transform 0.18s ease; cursor: default; }
        .journey-node:hover { transform: scale(1.06); }
        .flow-card { transition: transform 0.18s ease, box-shadow 0.18s ease; }
        .flow-card:hover { transform: translateY(-2px); box-shadow: 0 8px 24px rgba(45,36,24,0.09); }
        .phase-nav-item { transition: all 0.15s ease; cursor: pointer; }
        .phase-nav-item:hover { background: rgba(200,85,10,0.06) !important; }
        .swatch { transition: transform 0.15s ease; cursor: default; }
        .swatch:hover { transform: scale(1.03); }
      `}</style>

            {/* ── HEADER ── */}
            <div style={{ background: BROWN, padding: "24px 28px", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 12 }}>
                <div>
                    <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 5 }}>
                        <span style={{ background: SAFFRON, color: "#FFF", fontFamily: "Fraunces, serif", fontWeight: 700, fontSize: 13, padding: "3px 14px", borderRadius: 999, letterSpacing: 0.3 }}>
                            Maa Ki Rasoi
                        </span>
                        <span style={{ color: SAND, fontSize: 12, opacity: 0.8 }}>Design System v3.0</span>
                    </div>
                    <h1 style={{ fontFamily: "Fraunces, serif", color: "#FFF", fontSize: 22, fontWeight: 700, margin: 0, lineHeight: 1.2 }}>
                        Designer Systematic Workflow
                    </h1>
                </div>
                <div style={{ display: "flex", gap: 8 }}>
                    {[["workflow", "⬡ Workflow"], ["journey", "⟶ Journey"], ["tokens", "◈ Tokens"]].map(([tab, label]) => (
                        <button key={tab} className="tab-btn" onClick={() => setActiveTab(tab)} style={{
                            background: activeTab === tab ? SAFFRON : "rgba(255,255,255,0.1)",
                            color: "#FFF", borderRadius: 999, padding: "8px 16px",
                            fontSize: 13, fontWeight: 600, letterSpacing: 0.2,
                        }}>
                            {label}
                        </button>
                    ))}
                </div>
            </div>

            {/* ══════════════════════════════ WORKFLOW TAB ══════════════════════════════ */}
            {activeTab === "workflow" && (
                <div style={{ padding: "24px 20px", maxWidth: 1080, margin: "0 auto" }}>

                    {/* Phase pills */}
                    <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 20 }}>
                        {phases.map((phase) => (
                            <button key={phase.id} className="phase-btn" onClick={() => { setActivePhase(phase.id); setExpandedStep(null); }} style={{
                                background: activePhase === phase.id ? phase.color : "#FFF",
                                color: activePhase === phase.id ? "#FFF" : BROWN,
                                border: `2px solid ${activePhase === phase.id ? phase.color : BORDER}`,
                                borderRadius: 12, padding: "9px 16px",
                                fontFamily: "'DM Sans', sans-serif", fontWeight: 600, fontSize: 13,
                                display: "flex", alignItems: "center", gap: 8,
                            }}>
                                <span style={{ fontFamily: "Fraunces, serif", fontSize: 15 }}>{phase.number}</span>
                                {phase.label}
                            </button>
                        ))}
                    </div>

                    {/* Progress bar */}
                    <div style={{ display: "flex", height: 3, borderRadius: 999, overflow: "hidden", marginBottom: 24, background: BORDER }}>
                        {phases.map((phase, i) => (
                            <div key={phase.id} style={{
                                flex: 1,
                                background: i <= phases.findIndex(p => p.id === activePhase) ? phase.color : "transparent",
                                transition: "background 0.3s",
                            }} />
                        ))}
                    </div>

                    {/* Main grid */}
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 320px", gap: 18, alignItems: "start" }}>

                        {/* Steps panel */}
                        <div style={{ background: "#FFF", borderRadius: 20, border: `1px solid ${BORDER}`, overflow: "hidden", boxShadow: "0 2px 12px rgba(45,36,24,0.05)" }}>
                            <div style={{ background: current.color, padding: "20px 24px", display: "flex", alignItems: "center", gap: 14 }}>
                                <span style={{ fontSize: 26, color: "rgba(255,255,255,0.5)", lineHeight: 1 }}>{current.icon}</span>
                                <div>
                                    <div style={{ fontFamily: "Fraunces, serif", color: "#FFF", fontSize: 20, fontWeight: 700 }}>
                                        {current.number} — {current.label}
                                    </div>
                                    <div style={{ color: "rgba(255,255,255,0.72)", fontSize: 13, marginTop: 2 }}>{current.description}</div>
                                </div>
                            </div>
                            {current.steps.map((step, idx) => (
                                <div key={idx} className="step-row"
                                    onClick={() => setExpandedStep(expandedStep === idx ? null : idx)}
                                    style={{ padding: "16px 24px", borderBottom: `1px solid ${BORDER}`, background: expandedStep === idx ? "#FFF5EB" : "#FFF" }}>
                                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                                        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                                            <div style={{
                                                width: 26, height: 26, borderRadius: 999, flexShrink: 0,
                                                background: expandedStep === idx ? current.color : ACCENT,
                                                color: expandedStep === idx ? "#FFF" : BROWN,
                                                display: "flex", alignItems: "center", justifyContent: "center",
                                                fontSize: 11, fontWeight: 700,
                                            }}>{idx + 1}</div>
                                            <span style={{ fontWeight: 600, fontSize: 14 }}>{step.title}</span>
                                        </div>
                                        <span style={{ color: current.color, fontSize: 20, display: "inline-block", transition: "transform 0.2s", transform: expandedStep === idx ? "rotate(90deg)" : "none" }}>›</span>
                                    </div>
                                    {expandedStep === idx && (
                                        <div style={{
                                            marginTop: 12, marginLeft: 38,
                                            padding: "12px 14px",
                                            background: "rgba(200,85,10,0.05)",
                                            borderRadius: 10,
                                            borderLeft: `3px solid ${current.color}`,
                                            fontSize: 13, lineHeight: 1.7, color: "#5C4033",
                                        }}>{step.detail}</div>
                                    )}
                                </div>
                            ))}
                        </div>

                        {/* Sidebar */}
                        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>

                            {/* Phase navigator */}
                            <div style={{ background: "#FFF", borderRadius: 18, border: `1px solid ${BORDER}`, padding: "18px", boxShadow: "0 2px 8px rgba(45,36,24,0.04)" }}>
                                <div style={{ fontFamily: "Fraunces, serif", fontWeight: 700, fontSize: 14, marginBottom: 12, color: BROWN }}>All Phases</div>
                                {phases.map((phase, idx) => {
                                    const isActive = phase.id === activePhase;
                                    const isDone = phases.findIndex(p => p.id === activePhase) > idx;
                                    return (
                                        <div key={phase.id} className="phase-nav-item"
                                            onClick={() => { setActivePhase(phase.id); setExpandedStep(null); }}
                                            style={{
                                                display: "flex", alignItems: "center", gap: 10,
                                                padding: "9px 10px", borderRadius: 10, marginBottom: 3,
                                                background: isActive ? `${phase.color}16` : "transparent",
                                                border: `1px solid ${isActive ? phase.color + "50" : "transparent"}`,
                                            }}>
                                            <div style={{
                                                width: 22, height: 22, borderRadius: 999, flexShrink: 0,
                                                background: isDone ? "#4F772D" : isActive ? phase.color : BORDER,
                                                color: isDone || isActive ? "#FFF" : "#999",
                                                display: "flex", alignItems: "center", justifyContent: "center",
                                                fontSize: 9, fontWeight: 700,
                                            }}>{isDone ? "✓" : phase.number}</div>
                                            <span style={{ fontSize: 13, fontWeight: isActive ? 600 : 400, color: isActive ? phase.color : BROWN }}>{phase.label}</span>
                                        </div>
                                    );
                                })}
                            </div>

                            {/* Critical rules */}
                            <div style={{ background: BROWN, borderRadius: 18, padding: "18px" }}>
                                <div style={{ fontFamily: "Fraunces, serif", fontWeight: 700, fontSize: 14, marginBottom: 12, color: SAND }}>Critical Rules</div>
                                {["Named exports only", "sonner for toasts", "lucide-react icons only", "data-testid everywhere", "framer-motion transitions", "Fraunces + DM Sans fonts", "No localStorage for JWT", "2–3× spacing always"].map((rule, i) => (
                                    <div key={i} style={{ display: "flex", gap: 8, alignItems: "center", marginBottom: 7 }}>
                                        <span style={{ color: SAFFRON, fontSize: 8 }}>◆</span>
                                        <span style={{ color: "rgba(255,255,255,0.78)", fontSize: 12 }}>{rule}</span>
                                    </div>
                                ))}
                            </div>

                            {/* P0 alert */}
                            <div style={{ background: `${SAFFRON}12`, border: `1px solid ${SAFFRON}45`, borderRadius: 18, padding: "18px" }}>
                                <div style={{ fontFamily: "Fraunces, serif", fontWeight: 700, fontSize: 14, marginBottom: 10, color: SAFFRON }}>🔥 P0 — Fix Now</div>
                                {["Fix Firebase support email", "Enable Google sign-in provider", "POST /api/auth/firebase endpoint", "useAuth hook + AuthContext"].map((item, i) => (
                                    <div key={i} style={{ display: "flex", gap: 8, alignItems: "flex-start", marginBottom: 8 }}>
                                        <span style={{ color: SAFFRON, fontWeight: 700, fontSize: 11, marginTop: 1 }}>{i + 1}.</span>
                                        <span style={{ fontSize: 12, color: "#5C3010", lineHeight: 1.5 }}>{item}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* ══════════════════════════════ JOURNEY TAB ══════════════════════════════ */}
            {activeTab === "journey" && (
                <div style={{ padding: "24px 20px", maxWidth: 1080, margin: "0 auto" }}>
                    <div style={{ fontFamily: "Fraunces, serif", fontSize: 20, fontWeight: 700, marginBottom: 4 }}>Customer Journey Map</div>
                    <div style={{ color: "#999", fontSize: 13, marginBottom: 24 }}>From first visit to active subscriber — every touchpoint intentionally designed</div>

                    {/* Journey arc */}
                    <div style={{ background: "#FFF", borderRadius: 22, border: `1px solid ${BORDER}`, padding: "28px 20px", marginBottom: 18, boxShadow: "0 2px 12px rgba(45,36,24,0.05)" }}>
                        <div style={{ display: "flex", alignItems: "flex-start", overflowX: "auto", paddingBottom: 8 }}>
                            {userJourney.map((step, idx) => (
                                <div key={idx} className="journey-node" style={{ flex: 1, minWidth: 100, display: "flex", flexDirection: "column", alignItems: "center", position: "relative" }}>
                                    {idx < userJourney.length - 1 && (
                                        <div style={{
                                            position: "absolute", top: 22, left: "55%", width: "90%", height: 2,
                                            background: `linear-gradient(to right, ${step.color}, ${userJourney[idx + 1].color})`,
                                            zIndex: 0,
                                        }} />
                                    )}
                                    <div style={{
                                        width: 44, height: 44, borderRadius: 999,
                                        background: step.color, zIndex: 1, position: "relative",
                                        display: "flex", alignItems: "center", justifyContent: "center",
                                        fontFamily: "Fraunces, serif", fontWeight: 700, fontSize: 15,
                                        color: step.textColor,
                                        boxShadow: `0 4px 14px ${step.color}45`,
                                    }}>{idx + 1}</div>
                                    <div style={{ marginTop: 10, textAlign: "center", padding: "0 6px" }}>
                                        <div style={{ fontWeight: 700, fontSize: 12, color: BROWN, marginBottom: 3 }}>{step.label}</div>
                                        <div style={{ fontSize: 11, color: "#999", marginBottom: 5 }}>{step.screen}</div>
                                        <div style={{
                                            background: `${step.color}18`, border: `1px solid ${step.color}40`,
                                            borderRadius: 999, padding: "2px 8px",
                                            fontSize: 10, color: step.color, fontWeight: 600, display: "inline-block",
                                        }}>{step.state}</div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Flow cards 2×2 */}
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
                        {[
                            { title: "Public Flow (No Login)", bg: ACCENT, border: BORDER, steps: ["/ Home → Hero + Trust badges", "/menu → Bento Grid today's menu", "/plans → 3 plan cards (Best Value highlighted)", "Book Trial → Login gate triggered"] },
                            { title: "Auth Flow", bg: `${SAFFRON}12`, border: `${SAFFRON}40`, steps: ["Firebase Google OAuth popup", "Phone OTP as fallback method", "ID token → POST /api/auth/firebase", "JWT returned, stored in AuthContext"] },
                            { title: "Subscriber Flow", bg: `${BROWN}0B`, border: BORDER, steps: ["Dashboard → Active subscription status", "Today's delivery status visible", "Pause toggle (10 PM IST cutoff enforced)", "Order history + upcoming menu view"] },
                            { title: "Support Flow", bg: "#4F772D12", border: "#4F772D40", steps: ["Raise ticket from dashboard", "Form: issue type + description", "Submit → unique ticket ID generated", "WhatsApp escalation CTA shown"] },
                        ].map((flow, i) => (
                            <div key={i} className="flow-card" style={{ background: flow.bg, border: `1px solid ${flow.border}`, borderRadius: 18, padding: "20px" }}>
                                <div style={{ fontFamily: "Fraunces, serif", fontWeight: 700, fontSize: 15, marginBottom: 14, color: BROWN }}>{flow.title}</div>
                                {flow.steps.map((s, j) => (
                                    <div key={j} style={{ display: "flex", gap: 10, alignItems: "flex-start", marginBottom: 9 }}>
                                        <div style={{
                                            width: 18, height: 18, borderRadius: 999, flexShrink: 0,
                                            background: SAFFRON, color: "#FFF",
                                            display: "flex", alignItems: "center", justifyContent: "center",
                                            fontSize: 9, fontWeight: 700, marginTop: 2,
                                        }}>{j + 1}</div>
                                        <span style={{ fontSize: 13, color: "#5C4033", lineHeight: 1.55 }}>{s}</span>
                                    </div>
                                ))}
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* ══════════════════════════════ TOKENS TAB ══════════════════════════════ */}
            {activeTab === "tokens" && (
                <div style={{ padding: "24px 20px", maxWidth: 1080, margin: "0 auto" }}>
                    <div style={{ fontFamily: "Fraunces, serif", fontSize: 20, fontWeight: 700, marginBottom: 4 }}>Design Token Reference</div>
                    <div style={{ color: "#999", fontSize: 13, marginBottom: 24 }}>Copy these exactly — every component traces back to these values.</div>

                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 14 }}>

                        {/* Color swatches — span 2 cols */}
                        <div style={{ gridColumn: "span 2", background: "#FFF", borderRadius: 20, border: `1px solid ${BORDER}`, padding: "22px", boxShadow: "0 2px 8px rgba(45,36,24,0.04)" }}>
                            <div style={{ fontFamily: "Fraunces, serif", fontWeight: 700, fontSize: 15, marginBottom: 16 }}>Color Palette</div>
                            <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 10 }}>
                                {[
                                    { name: "Brand Saffron", hex: "#C8550A", var: "--primary" },
                                    { name: "Antique Cream", hex: "#F8F7F5", var: "--background" },
                                    { name: "Kitchen Brown", hex: "#2D2418", var: "--foreground" },
                                    { name: "Warm Sand", hex: "#E8A87C", var: "--secondary" },
                                    { name: "Accent Cream", hex: "#F4E4BC", var: "--accent" },
                                    { name: "Card White", hex: "#FFFFFF", var: "--card" },
                                    { name: "Border", hex: "#E5E0D8", var: "--border" },
                                    { name: "Success Green", hex: "#4F772D", var: "--success" },
                                    { name: "Destructive", hex: "#EF4444", var: "--destructive" },
                                ].map((c) => (
                                    <div key={c.hex} className="swatch" style={{ borderRadius: 12, overflow: "hidden", border: `1px solid ${BORDER}` }}>
                                        <div style={{ height: 40, background: c.hex }} />
                                        <div style={{ padding: "8px 10px" }}>
                                            <div style={{ fontWeight: 700, fontSize: 11, color: BROWN }}>{c.name}</div>
                                            <div style={{ fontFamily: "monospace", fontSize: 10, color: "#888", marginTop: 1 }}>{c.hex}</div>
                                            <div style={{ fontFamily: "monospace", fontSize: 9, color: SAFFRON, marginTop: 1 }}>{c.var}</div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Typography */}
                        <div style={{ background: BROWN, borderRadius: 20, padding: "22px" }}>
                            <div style={{ fontFamily: "Fraunces, serif", fontWeight: 700, fontSize: 15, marginBottom: 16, color: SAND }}>Typography</div>
                            <div style={{ marginBottom: 16, paddingBottom: 16, borderBottom: "1px solid rgba(255,255,255,0.1)" }}>
                                <div style={{ fontFamily: "Fraunces, serif", color: "#FFF", fontSize: 26, fontWeight: 700, lineHeight: 1.2 }}>Fraunces</div>
                                <div style={{ color: SAND, fontSize: 11, marginTop: 4 }}>Headings · Serif display · h1–h4</div>
                            </div>
                            <div style={{ marginBottom: 16, paddingBottom: 16, borderBottom: "1px solid rgba(255,255,255,0.1)" }}>
                                <div style={{ fontFamily: "'DM Sans', sans-serif", color: "#FFF", fontSize: 18 }}>DM Sans</div>
                                <div style={{ color: SAND, fontSize: 11, marginTop: 4 }}>Body · UI labels · Captions</div>
                            </div>
                            {[
                                ["h1", "text-6xl font-bold"], ["h2", "text-4xl font-semibold"],
                                ["h3", "text-3xl font-medium"], ["body", "text-lg leading-relaxed"], ["caption", "text-sm muted"],
                            ].map(([l, c]) => (
                                <div key={l} style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
                                    <span style={{ color: SAND, fontSize: 11, fontWeight: 600 }}>{l}</span>
                                    <span style={{ color: "rgba(255,255,255,0.45)", fontSize: 9, fontFamily: "monospace" }}>{c}</span>
                                </div>
                            ))}
                        </div>

                        {/* Spacing */}
                        <div style={{ background: "#FFF", borderRadius: 20, border: `1px solid ${BORDER}`, padding: "22px" }}>
                            <div style={{ fontFamily: "Fraunces, serif", fontWeight: 700, fontSize: 15, marginBottom: 16 }}>Spacing System</div>
                            {[
                                ["4px", "p-1", "Icon padding"],
                                ["8px", "p-2", "Tight elements"],
                                ["16px", "p-4", "Component internal"],
                                ["24px", "p-6", "Card padding"],
                                ["32px", "p-8", "Card padding lg"],
                                ["64px", "py-16", "Section vertical"],
                                ["96px", "py-24", "Section lg"],
                            ].map(([size, tw, use]) => (
                                <div key={size} style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 9 }}>
                                    <div style={{ width: Math.max(parseInt(size) * 0.55, 4), height: 7, background: SAFFRON, borderRadius: 999, flexShrink: 0 }} />
                                    <span style={{ fontWeight: 700, fontSize: 11, color: BROWN, minWidth: 28 }}>{size}</span>
                                    <span style={{ fontFamily: "monospace", fontSize: 10, color: SAFFRON }}>{tw}</span>
                                    <span style={{ fontSize: 10, color: "#AAA" }}>{use}</span>
                                </div>
                            ))}
                        </div>

                        {/* Motion */}
                        <div style={{ background: `${SAFFRON}0E`, border: `1px solid ${SAFFRON}30`, borderRadius: 20, padding: "22px" }}>
                            <div style={{ fontFamily: "Fraunces, serif", fontWeight: 700, fontSize: 15, marginBottom: 16, color: SAFFRON }}>Motion Tokens</div>
                            {[
                                ["Page Enter", "opacity 0→1, y 20→0, 400ms easeOut"],
                                ["Page Exit", "opacity 1→0, y 0→–20, 400ms easeIn"],
                                ["Hover Lift", "translateY –4px, 300ms ease"],
                                ["Active Scale", "scale 0.95, 150ms ease"],
                                ["Stagger", "100ms delay per child"],
                                ["Skeleton", "shimmer pulse, 1.5s infinite"],
                            ].map(([name, val]) => (
                                <div key={name} style={{ marginBottom: 11 }}>
                                    <div style={{ fontWeight: 600, fontSize: 12, color: BROWN }}>{name}</div>
                                    <div style={{ fontFamily: "monospace", fontSize: 10, color: "#5C3010", background: "rgba(200,85,10,0.07)", borderRadius: 6, padding: "3px 8px", marginTop: 3 }}>{val}</div>
                                </div>
                            ))}
                        </div>

                        {/* Component rules */}
                        <div style={{ background: BROWN, borderRadius: 20, padding: "22px" }}>
                            <div style={{ fontFamily: "Fraunces, serif", fontWeight: 700, fontSize: 15, marginBottom: 16, color: SAND }}>Component Rules</div>
                            {[
                                ["Buttons", "rounded-full · active:scale-95 · 300ms"],
                                ["Cards", "rounded-2xl · warm shadow · hover lift"],
                                ["Inputs", "rounded-xl · focus ring saffron/20"],
                                ["Shadows", "#2D2418 at 5–8% opacity"],
                                ["Radius", "rounded-2xl cards · rounded-3xl hero"],
                                ["Exports", "Named exports always"],
                                ["Icons", "lucide-react only · no emoji"],
                                ["Toasts", "sonner only · no browser alert"],
                            ].map(([label, rule]) => (
                                <div key={label} style={{ display: "flex", gap: 10, marginBottom: 9, alignItems: "flex-start" }}>
                                    <span style={{ color: SAFFRON, fontSize: 11, fontWeight: 700, flexShrink: 0, marginTop: 1, minWidth: 52 }}>{label}</span>
                                    <span style={{ color: "rgba(255,255,255,0.6)", fontSize: 10, fontFamily: "monospace", lineHeight: 1.5 }}>{rule}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            )}

            {/* Footer */}
            <div style={{ padding: "16px 28px", borderTop: `1px solid ${BORDER}`, display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 8, flexWrap: "wrap", gap: 8 }}>
                <span style={{ fontSize: 11, color: "#BBB" }}>Maa Ki Rasoi Design System v3.0 · maa-ki-rasoi-app-2026 · asia-south1</span>
                <div style={{ display: "flex", gap: 6 }}>
                    {["100% Pure Veg", "Daily Delivery", "Home Style", "Zero Preservatives"].map((b) => (
                        <span key={b} style={{ background: ACCENT, color: BROWN, borderRadius: 999, fontSize: 10, fontWeight: 600, padding: "3px 10px" }}>{b}</span>
                    ))}
                </div>
            </div>
        </div>
    );
}
