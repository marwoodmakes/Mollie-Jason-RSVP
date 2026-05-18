"use client";

import { useState, useEffect, useCallback } from "react";

const colors = {
  bg: "#F7F3EE",
  card: "#FFFFFF",
  sage: "#B8A8C8",
  sageLight: "#D4CCE0",
  sageDark: "#8E7BA8",
  blush: "#E8D5CD",
  blushLight: "#F2E8E3",
  dustyRose: "#C9A9A6",
  warmGrey: "#9B9590",
  text: "#3D3833",
  textLight: "#7A756F",
  linen: "#EDE7DF",
  cream: "#FAF8F5",
  gold: "#D4A574",
  goldLight: "#E8CDB0",
};

const COCKTAILS = [
  { id: "cosmo", name: "Cosmopolitan", bottle: "Vodka", emoji: "\u{1F378}", desc: "Vodka, cranberry, triple sec & lime", total: 10 },
  { id: "mojito", name: "Mojito", bottle: "White Rum", emoji: "\u{1F33F}", desc: "White rum, mint, lime & soda", total: 12 },
  { id: "maitai", name: "Mai Tai", bottle: "Dark Rum", emoji: "\u{1F379}", desc: "Dark rum, pineapple & lime", total: 10 },
  { id: "oldfashioned", name: "Old Fashioned", bottle: "Bourbon", emoji: "\u{1F943}", desc: "Bourbon, sugar & bitters", total: 8 },
];

interface Guest {
  firstName: string;
  lastName: string;
  dietary: string;
}

interface RsvpData {
  firstName: string;
  lastName: string;
  dietary: string;
  guests: Guest[];
  bottle: string;
  camping: boolean;
  timestamp?: string;
}

function Divider() {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 12, margin: "8px 0" }}>
      <div style={{ flex: 1, height: 1, background: `linear-gradient(to right, transparent, ${colors.sageLight})` }} />
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={colors.sage} strokeWidth="1.2">
        <path d="M12 2C6.5 2 2 6.5 2 12c4-1 7-3 10-6 0 4-2 8-5 11 3-1 6-3 8-6 1 3 1 6 0 9 3-4 5-9 5-14 0-2-1-4-3-4h-5z" />
      </svg>
      <div style={{ flex: 1, height: 1, background: `linear-gradient(to left, transparent, ${colors.sageLight})` }} />
    </div>
  );
}

const inputStyle: React.CSSProperties = {
  fontFamily: "var(--font-outfit), sans-serif",
  fontSize: 16,
  fontWeight: 300,
  padding: "14px 0",
  border: "none",
  borderBottom: `1.5px solid ${colors.sageLight}`,
  background: "transparent",
  color: colors.text,
  width: "100%",
  transition: "border-color 0.3s ease",
  letterSpacing: "0.5px",
};

const labelStyle: React.CSSProperties = {
  fontFamily: "var(--font-outfit), sans-serif",
  fontSize: 11,
  fontWeight: 400,
  textTransform: "uppercase",
  letterSpacing: "2px",
  color: colors.warmGrey,
};

function DietaryToggle({ value, onChange, size = "normal" }: { value: string; onChange: (v: string) => void; size?: "normal" | "small" }) {
  const pad = size === "small" ? "6px 14px" : "12px";
  const fs = size === "small" ? 12 : 14;
  return (
    <div style={{ display: "flex", gap: size === "small" ? 8 : 10 }}>
      {["Meat", "Veg", "Vegan"].map((d) => {
        const isActive = value === d.toLowerCase();
        const bg = isActive ? (d === "Meat" ? colors.blush : colors.sageLight) : "transparent";
        const borderColor = isActive ? (d === "Meat" ? colors.dustyRose : colors.sage) : colors.linen;
        const emoji = d === "Meat" ? "\u{1F969}" : d === "Veg" ? "\u{1F966}" : "\u{1F331}";
        return (
          <button
            key={d}
            onClick={() => onChange(d.toLowerCase())}
            style={{
              flex: size === "normal" ? 1 : undefined,
              fontFamily: "var(--font-outfit), sans-serif",
              fontSize: fs,
              fontWeight: isActive ? 500 : 300,
              padding: pad,
              background: bg,
              color: isActive ? colors.text : colors.warmGrey,
              border: `1.5px solid ${borderColor}`,
              borderRadius: size === "small" ? 20 : 8,
              cursor: "pointer",
              transition: "all 0.2s ease",
            }}
          >
            <span style={{ marginRight: 4 }}>{emoji}</span> {d}
          </button>
        );
      })}
    </div>
  );
}

function BottleSelector({ bottles, onSelect, selected }: { bottles: Record<string, number>; onSelect: (id: string) => void; selected: string }) {
  return (
    <div style={{ marginTop: 8, textAlign: "center" }}>
      <p style={{ fontFamily: "var(--font-outfit), sans-serif", fontSize: 14, fontWeight: 300, textTransform: "uppercase", letterSpacing: "3px", color: colors.text, margin: "0 0 8px" }}>
        Your presence is your present
      </p>
      <p style={{ fontFamily: "var(--font-outfit), sans-serif", fontSize: 13, fontWeight: 300, color: colors.textLight, margin: "0 0 20px", lineHeight: 1.6 }}>
        All we ask is you help us stock the bar — each household brings a bottle, just the spirit, we&apos;ll sort the rest!
      </p>
      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        {COCKTAILS.map((c) => {
          const claimed = bottles[c.id] || 0;
          const remaining = c.total - claimed;
          const soldOut = remaining <= 0;
          const isSelected = selected === c.id;
          return (
            <button
              key={c.id}
              onClick={() => !soldOut && onSelect(isSelected ? "" : c.id)}
              disabled={soldOut}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 12,
                padding: "14px 16px",
                background: isSelected ? colors.sageLight : soldOut ? colors.linen : colors.cream,
                border: isSelected ? `2px solid ${colors.sage}` : `1.5px solid ${soldOut ? colors.linen : colors.sageLight}`,
                borderRadius: 8,
                cursor: soldOut ? "not-allowed" : "pointer",
                opacity: soldOut ? 0.5 : 1,
                transition: "all 0.3s ease",
                textAlign: "left" as const,
                width: "100%",
              }}
            >
              <span style={{ fontSize: 24 }}>{c.emoji}</span>
              <div style={{ flex: 1 }}>
                <div style={{ fontFamily: "var(--font-outfit), sans-serif", fontSize: 14, fontWeight: 400, color: colors.text }}>{c.name}</div>
                <div style={{ fontFamily: "var(--font-outfit), sans-serif", fontSize: 12, fontWeight: 300, color: soldOut ? colors.dustyRose : colors.sageDark, marginTop: 4 }}>
                  {soldOut ? "All claimed!" : `Please bring: ${c.bottle} \u00B7 ${remaining} still needed`}
                </div>
              </div>
              {isSelected && (
                <div style={{ width: 24, height: 24, borderRadius: "50%", background: colors.sage, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                  <svg width="12" height="12" viewBox="0 0 12 12" fill="none" stroke="#fff" strokeWidth="2"><path d="M2 6l3 3 5-5" /></svg>
                </div>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}

function GuestEntry({ guest, index, onUpdate, onRemove }: { guest: Guest; index: number; onUpdate: (i: number, field: string, val: string) => void; onRemove: (i: number) => void }) {
  return (
    <div style={{ animation: "slideIn 0.3s ease both", padding: "12px 0", borderBottom: `1px solid ${colors.linen}` }}>
      <div style={{ display: "flex", gap: 10, marginBottom: 10 }}>
        <input type="text" value={guest.firstName} onChange={(e) => onUpdate(index, "firstName", e.target.value)} placeholder="First name" style={{ ...inputStyle, fontSize: 14, padding: "10px 0" }} />
        <input type="text" value={guest.lastName} onChange={(e) => onUpdate(index, "lastName", e.target.value)} placeholder="Last name" style={{ ...inputStyle, fontSize: 14, padding: "10px 0" }} />
      </div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <DietaryToggle value={guest.dietary} onChange={(v) => onUpdate(index, "dietary", v)} size="small" />
        <button onClick={() => onRemove(index)} style={{ background: "none", border: "none", color: colors.warmGrey, cursor: "pointer", fontFamily: "var(--font-outfit), sans-serif", fontSize: 12, padding: "4px 8px" }}>remove</button>
      </div>
    </div>
  );
}

function RSVPForm({ onSubmit, loading, bottles }: { onSubmit: (data: RsvpData) => void; loading: boolean; bottles: Record<string, number> }) {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [dietary, setDietary] = useState("");
  const [guests, setGuests] = useState<Guest[]>([]);
  const [selectedBottle, setSelectedBottle] = useState("");
  const [camping, setCamping] = useState<boolean | null>(null);

  const addGuest = () => setGuests(prev => [...prev, { firstName: "", lastName: "", dietary: "" }]);
  const updateGuest = (i: number, field: string, val: string) => {
    setGuests(prev => prev.map((g, idx) => idx === i ? { ...g, [field]: val } : g));
  };
  const removeGuest = (i: number) => setGuests(prev => prev.filter((_, idx) => idx !== i));

  const canSubmit = !!(firstName.trim() && lastName.trim() && dietary && selectedBottle && camping !== null && guests.every((g) => g.firstName.trim() && g.lastName.trim() && g.dietary));

  return (
    <div style={{ animation: "fadeUp 0.8s ease both", animationDelay: "0.6s" }}>
      <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
        <div>
          <label style={labelStyle}>First Name</label>
          <input type="text" value={firstName} onChange={(e) => setFirstName(e.target.value)} placeholder="Your first name" style={inputStyle} />
        </div>
        <div>
          <label style={labelStyle}>Last Name</label>
          <input type="text" value={lastName} onChange={(e) => setLastName(e.target.value)} placeholder="Your last name" style={inputStyle} />
        </div>
      </div>

      <div style={{ marginTop: 24 }}>
        <label style={labelStyle}>What are you eating?</label>
        <div style={{ marginTop: 10 }}>
          <DietaryToggle value={dietary} onChange={setDietary} />
        </div>
      </div>

      <div style={{ marginTop: 28 }}>
        <label style={labelStyle}>Your party</label>
        {guests.length > 0 && (
          <div style={{ marginTop: 8 }}>{guests.map((g, i) => <GuestEntry key={i} guest={g} index={i} onUpdate={updateGuest} onRemove={removeGuest} />)}</div>
        )}
        <button
          onClick={addGuest}
          style={{ marginTop: 12, fontFamily: "var(--font-outfit), sans-serif", fontSize: 13, fontWeight: 300, color: colors.sageDark, background: "none", border: `1px dashed ${colors.sageLight}`, borderRadius: 4, padding: "10px 16px", cursor: "pointer", width: "100%", letterSpacing: "0.5px", transition: "all 0.3s ease" }}
        >
          + Add partner, children, or guests
        </button>
      </div>

      <div style={{ marginTop: 28 }}>
        <BottleSelector bottles={bottles} onSelect={setSelectedBottle} selected={selectedBottle} />
      </div>

      <p style={{ marginTop: 28, fontFamily: "var(--font-outfit), sans-serif", fontSize: 14, fontWeight: 300, textTransform: "uppercase", letterSpacing: "3px", color: colors.text, textAlign: "center" }}>
        Would you like to camp at the farm?
      </p>
      <div style={{ display: "flex", gap: 10, marginTop: 12, justifyContent: "center" }}>
        {["Yes", "No"].map((opt) => {
          const isActive = camping === (opt === "Yes");
          return (
            <button
              key={opt}
              onClick={() => setCamping(opt === "Yes")}
              style={{
                fontFamily: "var(--font-outfit), sans-serif",
                fontSize: 14,
                fontWeight: isActive ? 500 : 300,
                padding: "12px 28px",
                background: isActive ? colors.sageLight : "transparent",
                color: isActive ? colors.text : colors.warmGrey,
                border: `1.5px solid ${isActive ? colors.sage : colors.linen}`,
                borderRadius: 8,
                cursor: "pointer",
                transition: "all 0.2s ease",
              }}
            >
              {opt}
            </button>
          );
        })}
      </div>

      <button
        onClick={() => { if (canSubmit && !loading) onSubmit({ firstName: firstName.trim(), lastName: lastName.trim(), dietary, guests, bottle: selectedBottle, camping: !!camping }); }}
        disabled={!canSubmit || loading}
        style={{
          marginTop: 32, width: "100%", padding: "16px",
          fontFamily: "var(--font-cormorant), serif", fontSize: 18, fontWeight: 500, letterSpacing: "3px", textTransform: "uppercase",
          background: canSubmit ? colors.sage : colors.sageLight, color: "#fff", border: "none", borderRadius: 4,
          cursor: canSubmit ? "pointer" : "not-allowed", transition: "all 0.4s ease", opacity: loading ? 0.6 : 1,
        }}
      >
        {loading ? "Sending..." : "Let\u2019s party"}
      </button>
    </div>
  );
}

function Confirmed({ name, partySize, cocktail }: { name: string; partySize: number; cocktail: string }) {
  const c = COCKTAILS.find((x) => x.id === cocktail);
  return (
    <div style={{ textAlign: "center", animation: "fadeUp 0.6s ease both", padding: "20px 0" }}>
      <div style={{ width: 64, height: 64, borderRadius: "50%", background: colors.sageLight, margin: "0 auto 24px", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <div style={{ width: 20, height: 10, borderLeft: `2.5px solid ${colors.sageDark}`, borderBottom: `2.5px solid ${colors.sageDark}`, animation: "checkmark 0.5s ease both 0.3s", opacity: 0 }} />
      </div>
      <h3 style={{ fontFamily: "var(--font-cormorant), serif", fontSize: 26, fontWeight: 400, color: colors.text, marginBottom: 12, fontStyle: "italic" }}>Thank you, {name}</h3>
      <p style={{ fontFamily: "var(--font-outfit), sans-serif", fontSize: 14, fontWeight: 300, color: colors.textLight, lineHeight: 1.7 }}>
        {partySize > 1 ? `We've got you and your ${partySize - 1 === 1 ? "guest" : `${partySize - 1} guests`} on the list.` : "We've got you on the list."}
      </p>
      {c && (
        <div style={{ marginTop: 16, padding: "14px 20px", background: colors.cream, borderRadius: 8, display: "inline-block" }}>
          <p style={{ fontFamily: "var(--font-outfit), sans-serif", fontSize: 13, fontWeight: 400, color: colors.text }}>
            {c.emoji} Don&apos;t forget your bottle of <strong>{c.bottle}</strong>
          </p>
        </div>
      )}
      <Divider />
      <p style={{ fontFamily: "var(--font-outfit), sans-serif", fontSize: 13, fontWeight: 300, color: colors.warmGrey, marginTop: 12, lineHeight: 1.7 }}>
        More details to follow — we can&apos;t wait to see you there.
      </p>
    </div>
  );
}

function DeclineForm({ onDecline, onBack, loading }: { onDecline: (firstName: string, lastName: string) => void; onBack: () => void; loading: boolean }) {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const canSubmit = !!(firstName.trim() && lastName.trim());

  return (
    <div style={{ animation: "fadeUp 0.6s ease both", padding: "20px 0" }}>
      <h3 style={{ fontFamily: "var(--font-cormorant), serif", fontSize: 26, fontWeight: 400, color: colors.text, marginBottom: 8, fontStyle: "italic", textAlign: "center" }}>Sorry to hear that</h3>
      <p style={{ fontFamily: "var(--font-outfit), sans-serif", fontSize: 13, fontWeight: 300, color: colors.textLight, lineHeight: 1.7, textAlign: "center", marginBottom: 20 }}>
        Let us know who you are so we can update our list.
      </p>
      <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
        <div>
          <label style={labelStyle}>First Name</label>
          <input type="text" value={firstName} onChange={(e) => setFirstName(e.target.value)} placeholder="Your first name" style={inputStyle} />
        </div>
        <div>
          <label style={labelStyle}>Last Name</label>
          <input type="text" value={lastName} onChange={(e) => setLastName(e.target.value)} placeholder="Your last name" style={inputStyle} />
        </div>
      </div>
      <button
        onClick={() => { if (canSubmit && !loading) onDecline(firstName.trim(), lastName.trim()); }}
        disabled={!canSubmit || loading}
        style={{
          marginTop: 24, width: "100%", padding: "14px",
          fontFamily: "var(--font-cormorant), serif", fontSize: 16, fontWeight: 500, letterSpacing: "2px", textTransform: "uppercase",
          background: canSubmit ? colors.dustyRose : colors.blushLight, color: "#fff", border: "none", borderRadius: 4,
          cursor: canSubmit ? "pointer" : "not-allowed", transition: "all 0.4s ease", opacity: loading ? 0.6 : 1,
        }}
      >
        {loading ? "Sending..." : "Send regrets"}
      </button>
      <p style={{ textAlign: "center", marginTop: 12 }}>
        <button
          onClick={onBack}
          style={{ fontFamily: "var(--font-outfit), sans-serif", fontSize: 12, fontWeight: 300, color: colors.warmGrey, background: "none", border: "none", cursor: "pointer", textDecoration: "underline", textUnderlineOffset: 4 }}
        >
          Actually, I can make it!
        </button>
      </p>
    </div>
  );
}

function Declined({ name }: { name: string }) {
  return (
    <div style={{ textAlign: "center", animation: "fadeUp 0.6s ease both", padding: "20px 0" }}>
      <h3 style={{ fontFamily: "var(--font-cormorant), serif", fontSize: 26, fontWeight: 400, color: colors.text, marginBottom: 12, fontStyle: "italic" }}>We&apos;ll miss you, {name}</h3>
      <p style={{ fontFamily: "var(--font-outfit), sans-serif", fontSize: 14, fontWeight: 300, color: colors.textLight, lineHeight: 1.7 }}>
        Sorry you can&apos;t make it — we&apos;ll raise a glass for you.
      </p>
    </div>
  );
}

function AdminView({ rsvps, bottles, onClose }: { rsvps: RsvpData[]; bottles: Record<string, number>; onClose: () => void }) {
  const totalHeads = rsvps.reduce((s, r) => s + 1 + r.guests.length, 0);
  const meatCount = rsvps.reduce((s, r) => {
    let c = r.dietary === "meat" ? 1 : 0;
    r.guests.forEach((g) => { if (g.dietary === "meat") c++; });
    return s + c;
  }, 0);
  const veganCount = rsvps.reduce((s, r) => {
    let c = r.dietary === "vegan" ? 1 : 0;
    r.guests.forEach((g) => { if (g.dietary === "vegan") c++; });
    return s + c;
  }, 0);
  const vegCount = totalHeads - meatCount - veganCount;

  return (
    <div onClick={onClose} style={{ position: "fixed", inset: 0, background: "rgba(61,56,51,0.4)", backdropFilter: "blur(8px)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 999, animation: "fadeIn 0.3s ease", padding: 16 }}>
      <div onClick={(e) => e.stopPropagation()} style={{ background: colors.cream, borderRadius: 8, padding: "28px 22px", maxWidth: 500, width: "100%", maxHeight: "85vh", overflowY: "auto", animation: "slideIn 0.4s ease both" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
          <h3 style={{ fontFamily: "var(--font-cormorant), serif", fontSize: 24, fontWeight: 400, color: colors.text }}>Guest List</h3>
          <button onClick={onClose} style={{ background: "none", border: "none", fontFamily: "var(--font-outfit), sans-serif", fontSize: 13, color: colors.warmGrey, cursor: "pointer" }}>close</button>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(5, 1fr)", gap: 8, marginBottom: 16 }}>
          {[{ l: "RSVPs", v: rsvps.length }, { l: "Heads", v: totalHeads }, { l: "Meat", v: meatCount }, { l: "Veg", v: vegCount }, { l: "Vegan", v: veganCount }].map((s) => (
            <div key={s.l} style={{ textAlign: "center", padding: "10px 6px", background: colors.linen, borderRadius: 6 }}>
              <div style={{ fontFamily: "var(--font-cormorant), serif", fontSize: 24, fontWeight: 500, color: colors.sage }}>{s.v}</div>
              <div style={{ fontFamily: "var(--font-outfit), sans-serif", fontSize: 9, textTransform: "uppercase", letterSpacing: "1px", color: colors.warmGrey }}>{s.l}</div>
            </div>
          ))}
        </div>

        <div style={{ marginBottom: 16, padding: "12px 14px", background: colors.blushLight, borderRadius: 6 }}>
          <div style={{ fontFamily: "var(--font-outfit), sans-serif", fontSize: 10, textTransform: "uppercase", letterSpacing: "1.5px", color: colors.warmGrey, marginBottom: 6 }}>Bottles Pledged</div>
          {COCKTAILS.map((c) => (
            <div key={c.id} style={{ display: "flex", justifyContent: "space-between", fontFamily: "var(--font-outfit), sans-serif", fontSize: 13, color: colors.text, padding: "3px 0" }}>
              <span>{c.emoji} {c.bottle}</span>
              <span style={{ fontWeight: 400 }}>{bottles[c.id] || 0} / {c.total}</span>
            </div>
          ))}
        </div>

        {rsvps.length === 0 ? (
          <p style={{ fontFamily: "var(--font-outfit), sans-serif", fontSize: 14, color: colors.warmGrey, textAlign: "center", padding: 20 }}>No RSVPs yet</p>
        ) : (
          rsvps.map((r, i) => (
            <div key={i} style={{ padding: "10px 0", borderBottom: i < rsvps.length - 1 ? `1px solid ${colors.linen}` : "none" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <span style={{ fontFamily: "var(--font-outfit), sans-serif", fontSize: 14, fontWeight: 400, color: colors.text }}>
                  {r.firstName} {r.lastName} <span style={{ fontSize: 12 }}>{r.dietary === "meat" ? "\u{1F969}" : r.dietary === "vegan" ? "\u{1F331}" : "\u{1F966}"}</span>
                </span>
                <span style={{ fontFamily: "var(--font-outfit), sans-serif", fontSize: 11, color: colors.warmGrey }}>{COCKTAILS.find((c) => c.id === r.bottle)?.bottle || "\u2014"}</span>
              </div>
              {r.guests.length > 0 && (
                <div style={{ marginTop: 4, paddingLeft: 14 }}>
                  {r.guests.map((g, j) => (
                    <div key={j} style={{ fontFamily: "var(--font-outfit), sans-serif", fontSize: 12, fontWeight: 300, color: colors.textLight, padding: "2px 0" }}>
                      + {g.firstName} {g.lastName} {g.dietary === "meat" ? "\u{1F969}" : g.dietary === "vegan" ? "\u{1F331}" : "\u{1F966}"}
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))
        )}

        <button
          onClick={() => {
            const rows = ["First Name,Last Name,Dietary,Bottle,Guest Of"];
            rsvps.forEach((r) => {
              rows.push(`${r.firstName},${r.lastName},${r.dietary},${COCKTAILS.find((c) => c.id === r.bottle)?.bottle || ""},\u2014`);
              r.guests.forEach((g) => rows.push(`${g.firstName},${g.lastName},${g.dietary},,${r.firstName} ${r.lastName}`));
            });
            const a = document.createElement("a");
            a.href = URL.createObjectURL(new Blob([rows.join("\n")], { type: "text/csv" }));
            a.download = "wedding-rsvps.csv";
            a.click();
          }}
          style={{ marginTop: 20, width: "100%", padding: "12px", fontFamily: "var(--font-outfit), sans-serif", fontSize: 13, fontWeight: 400, letterSpacing: "1px", textTransform: "uppercase", background: "transparent", color: colors.sageDark, border: `1.5px solid ${colors.sage}`, borderRadius: 4, cursor: "pointer" }}
        >
          Export CSV
        </button>
      </div>
    </div>
  );
}

export default function WeddingRSVP() {
  const [view, setView] = useState("invite");
  const [loading, setLoading] = useState(false);
  const [confirmedName, setConfirmedName] = useState("");
  const [confirmedBottle, setConfirmedBottle] = useState("");
  const [partySize, setPartySize] = useState(1);
  const [showAdmin, setShowAdmin] = useState(false);
  const [rsvps, setRsvps] = useState<RsvpData[]>([]);
  const [bottles, setBottles] = useState<Record<string, number>>({});
  const [adminTaps, setAdminTaps] = useState(0);

  const loadData = useCallback(async () => {
    try {
      const res = await fetch("/api/rsvps");
      if (res.ok) {
        const data = await res.json();
        setRsvps(data.rsvps || []);
        setBottles(data.bottles || {});
      }
    } catch {
      // silent fail on load
    }
  }, []);

  useEffect(() => { loadData(); }, [loadData]);

  const handleSubmit = async (data: RsvpData) => {
    setLoading(true);
    try {
      const res = await fetch("/api/rsvps", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (res.ok) {
        const result = await res.json();
        setRsvps(result.rsvps);
        setBottles(result.bottles);
        setConfirmedName(data.firstName);
        setConfirmedBottle(data.bottle);
        setPartySize(1 + data.guests.length);
        setView("confirmed");
      }
    } catch (err) {
      console.error(err);
    }
    setLoading(false);
  };

  const handleDecline = async (firstName: string, lastName: string) => {
    setLoading(true);
    try {
      await fetch("/api/rsvps", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ firstName, lastName, declined: true }),
      });
      setConfirmedName(firstName);
      setView("declined");
    } catch (err) {
      console.error(err);
    }
    setLoading(false);
  };

  const handleDateTap = () => {
    const n = adminTaps + 1;
    setAdminTaps(n);
    if (n >= 5) { loadData(); setShowAdmin(true); setAdminTaps(0); }
    setTimeout(() => setAdminTaps(0), 3000);
  };

  return (
    <div style={{ minHeight: "100vh", background: `linear-gradient(180deg, ${colors.cream} 0%, ${colors.bg} 40%, ${colors.blushLight} 100%)`, display: "flex", alignItems: "center", justifyContent: "center", padding: "40px 20px" }}>
      <div style={{ maxWidth: 440, width: "100%", textAlign: "center" }}>
        <div style={{ animation: "fadeUp 0.8s ease both" }}>
          <p style={{ fontFamily: "var(--font-outfit), sans-serif", fontSize: 11, fontWeight: 300, textTransform: "uppercase", letterSpacing: "4px", color: colors.warmGrey, marginBottom: 20 }}>You&apos;re invited to celebrate</p>
          <h1 style={{ fontFamily: "var(--font-cormorant), serif", fontSize: 52, fontWeight: 300, color: colors.text, lineHeight: 1.1, marginBottom: 4 }}>Mollie</h1>
          <p style={{ fontFamily: "var(--font-cormorant), serif", fontSize: 20, fontWeight: 300, fontStyle: "italic", color: colors.dustyRose, margin: "4px 0" }}>&amp;</p>
          <h1 style={{ fontFamily: "var(--font-cormorant), serif", fontSize: 52, fontWeight: 300, color: colors.text, lineHeight: 1.1, marginBottom: 8 }}>Jason</h1>
          <p style={{ fontFamily: "var(--font-cormorant), serif", fontSize: 18, fontWeight: 300, fontStyle: "italic", color: colors.textLight, marginBottom: 20 }}>tying the knot</p>
        </div>

        <div style={{ animation: "fadeUp 0.8s ease both", animationDelay: "0.2s" }}><Divider /></div>

        <div style={{ animation: "fadeUp 0.8s ease both", animationDelay: "0.3s", margin: "16px 0" }}>
          <p onClick={handleDateTap} style={{ fontFamily: "var(--font-outfit), sans-serif", fontSize: 14, fontWeight: 300, textTransform: "uppercase", letterSpacing: "3px", color: colors.text, cursor: "default", userSelect: "none" }}>
            Saturday, 22nd August 2026
          </p>
          <p style={{ fontFamily: "var(--font-cormorant), serif", fontSize: 16, fontWeight: 300, fontStyle: "italic", color: colors.textLight, marginTop: 8 }}>Bathampton Home Farm, BA2 6TL</p>
          <div style={{ marginTop: 14, display: "flex", justifyContent: "center", gap: 24 }}>
            <div>
              <p style={{ fontFamily: "var(--font-outfit), sans-serif", fontSize: 11, fontWeight: 400, textTransform: "uppercase", letterSpacing: "2px", color: colors.warmGrey }}>Arrival</p>
              <p style={{ fontFamily: "var(--font-cormorant), serif", fontSize: 18, fontWeight: 400, color: colors.text, marginTop: 2 }}>12:00 pm</p>
            </div>
            <div style={{ width: 1, background: colors.sageLight }} />
            <div>
              <p style={{ fontFamily: "var(--font-outfit), sans-serif", fontSize: 11, fontWeight: 400, textTransform: "uppercase", letterSpacing: "2px", color: colors.warmGrey }}>Ceremony</p>
              <p style={{ fontFamily: "var(--font-cormorant), serif", fontSize: 18, fontWeight: 400, color: colors.text, marginTop: 2 }}>12:45 pm</p>
            </div>
          </div>
        </div>

        <div style={{ animation: "fadeUp 0.8s ease both", animationDelay: "0.4s" }}><Divider /></div>

        {/* Form card */}
        <div style={{
          background: `${colors.card}CC`, backdropFilter: "blur(12px)", borderRadius: 8, padding: "36px 24px", marginTop: 20,
          boxShadow: "0 2px 40px rgba(0,0,0,0.04)", border: `1px solid ${colors.linen}`,
          animation: "fadeUp 0.8s ease both", animationDelay: "0.5s", textAlign: "left",
        }}>
          {view === "invite" && (
            <>
              <RSVPForm onSubmit={handleSubmit} loading={loading} bottles={bottles} />
              <p style={{ textAlign: "center", marginTop: 16 }}>
                <button
                  onClick={() => setView("decline")}
                  style={{ fontFamily: "var(--font-outfit), sans-serif", fontSize: 12, fontWeight: 300, color: colors.warmGrey, background: "none", border: "none", cursor: "pointer", textDecoration: "underline", textUnderlineOffset: 4 }}
                >
                  Can&apos;t make it?
                </button>
              </p>
            </>
          )}
          {view === "confirmed" && <Confirmed name={confirmedName} partySize={partySize} cocktail={confirmedBottle} />}
          {view === "decline" && <DeclineForm onDecline={handleDecline} onBack={() => setView("invite")} loading={loading} />}
          {view === "declined" && <Declined name={confirmedName} />}
        </div>

        <p style={{ fontFamily: "var(--font-outfit), sans-serif", fontSize: 11, fontWeight: 200, color: colors.warmGrey, marginTop: 32, letterSpacing: "1px", animation: "fadeUp 0.8s ease both", animationDelay: "0.8s", opacity: 0.6 }}>M & J &middot; MMXXVI</p>
      </div>

      {showAdmin && <AdminView rsvps={rsvps} bottles={bottles} onClose={() => setShowAdmin(false)} />}
    </div>
  );
}
