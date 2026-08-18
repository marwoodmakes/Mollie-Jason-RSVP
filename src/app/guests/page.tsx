"use client";

import { useState, useMemo } from "react";

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

const serif = "var(--font-cormorant), serif";
const sans = "var(--font-outfit), sans-serif";

// ===== GUEST DATA (embedded, static) =====
const BOTTLE_MAP: Record<string, string> = {
  mojito: "Mojito \u{1F379}",
  maitai: "Mai Tai \u{26A1}",
  cosmo: "Cosmo \u{1F378}",
  oldfashioned: "Old Fashioned \u{1F943}",
};

type RawGuest = [string, string, string];
type RawEntry = [string, string, string, string, RawGuest[], string];

const RAW: RawEntry[] = [
  ["Barbara", "Morris", "veg", "mojito", [], "No"],
  ["Vicki", "Wallis", "meat", "cosmo", [["Dan", "Longley", "meat"], ["Maddie", "Longley", "veg"], ["Max", "Longley", "meat"], ["Joe", "Longley", "meat"], ["Leah", "Warboys", "meat"]], "Yes"],
  ["Lucy", "Wood", "meat", "maitai", [["Oliver", "Wood", "meat"], ["Sophia", "Wood", "meat"], ["Georgia", "Wood", "meat"]], "No"],
  ["Svenja", "Gerrard", "veg", "oldfashioned", [["Josh", "Gerrard", "vegan"], ["Juniper", "Gerrard", "veg"]], "Yes"],
  ["Paul", "Bell", "meat", "oldfashioned", [["Sonja", "Bell", "meat"], ["Thomas", "Bell", "meat"]], "No"],
  ["Greg", "Wilkinson", "meat", "cosmo", [["Vicky", "Wilkinson", "meat"], ["Theodore", "Wilkinson", "meat"]], "No"],
  ["Sam", "Wallis", "meat", "maitai", [["Evie", "Wallis", "meat"]], "No"],
  ["Catherine", "Meyer", "meat", "mojito", [["Vaughn", "Meyer", "meat"], ["Woody", "Meyer", "meat"], ["Cedar", "Meyer", "meat"], ["Dash", "Meyer", "meat"]], "Yes"],
  ["Amy", "Wetton", "veg", "mojito", [["Jack", "Norman", "meat"], ["Phylis", "Norman", "veg"], ["Baby", "Norman", "veg"]], "No"],
  ["Jane", "Pottas", "veg", "cosmo", [["Richard", "Pottas", "meat"]], "No"],
  ["Anna", "Matthews", "meat", "mojito", [["Jim", "Matthews", "meat"], ["Maia", "Matthews", "meat"], ["Savannah", "Matthews", "meat"]], "No"],
  ["Liam", "Dowling", "meat", "maitai", [["Robyn", "Pitts", "meat"]], "Yes"],
  ["Chiara", "Poulton", "meat", "oldfashioned", [["Luke", "Poulton", "meat"], ["Noah", "Poulton", "meat"], ["Eli", "Poulton", "meat"]], "Yes"],
  ["Ben", "Winsor", "meat", "cosmo", [["Lynn", "Winsor", "meat"]], "No"],
  ["Carli", "Zabilowicz", "meat", "mojito", [["Nicholas", "Zabilowicz", "meat"]], "No"],
  ["Saz", "Manuel", "meat", "cosmo", [["James", "Townsend", "meat"], ["Jacob", "Forster", "meat"]], "Yes"],
  ["Emily", "Hieatt", "veg", "mojito", [["Adrian", "Hieatt", "meat"], ["Molly", "Hieatt", "veg"], ["Theo", "Hieatt", "meat"]], "No"],
  ["Amy", "Hogarth", "meat", "mojito", [], "Yes"],
  ["Joey", "Gomez-Mannion", "meat", "mojito", [], "Yes"],
  ["Mike", "Atkinson", "meat", "maitai", [], "No"],
  ["Dot", "Lock", "meat", "maitai", [["Jean", "Lister", "veg"]], "No"],
  ["Ben", "Pottas", "meat", "maitai", [], "Yes"],
  ["Jess", "Cheetham", "meat", "oldfashioned", [["George", "Cheetham", "meat"], ["Ed", "Cheetham", "meat"], ["Rex", "Cheetham", "meat"]], "No"],
  ["Rebecca", "Fisher", "meat", "cosmo", [["William", "Owen", "meat"]], "No"],
  ["Nick", "Watson", "meat", "maitai", [["Annie", "Emery", "meat"], ["Amber", "Emery-Watson", "meat"]], "Yes"],
  ["Sarah", "Holliday", "meat", "cosmo", [["Tim", "O'Sullivan", "meat"]], "No"],
  ["Maria", "Pannell", "meat", "oldfashioned", [["Stuart", "Pannell", "meat"], ["Mary", "Pannell", "meat"]], "No"],
  ["Heather", "Edey", "veg", "mojito", [], "No"],
  ["Sarah", "Pottas", "meat", "mojito", [["Tristan", "Pottas", "meat"], ["Martha", "Pottas", "meat"], ["Archie", "Pottas", "meat"]], "No"],
  ["Amy", "Goodberry", "meat", "cosmo", [["Mitchell", "Tuby", "meat"], ["George", "Stuart", "meat"]], "No"],
  ["Jade", "Barnes", "meat", "mojito", [["Hayden", "Barnes", "meat"], ["Evoleht", "Barnes", "meat"], ["Chester", "Barnes", "meat"]], "Yes"],
  ["Matthew", "Edwards", "meat", "maitai", [], "Yes"],
  ["Greg", "Pfauntsch", "meat", "oldfashioned", [["Emilia", "Pfauntsch", "meat"]], "Yes"],
  ["Stacey", "Fussell", "meat", "cosmo", [["Nellie", "van der Meer", "meat"], ["Amelie", "Capo", "meat"]], "No"],
];

interface PartyMember {
  first: string;
  last: string;
  dietary: string;
  role: "Primary" | "Partner" | "Child";
}

interface Person extends PartyMember {
  camping: boolean;
  bottle: string;
  party: PartyMember[];
  partyHost: string;
}

function buildDirectory(): Person[] {
  const entries: Person[] = [];
  RAW.forEach(([fn, ln, diet, bottle, guests, camp]) => {
    const party: PartyMember[] = [{ first: fn, last: ln, dietary: diet, role: "Primary" }];
    guests.forEach(([gfn, gln, gdiet], i) => {
      const role = guests.length >= 2 && i >= 1 ? "Child" : "Partner";
      party.push({ first: gfn, last: gln, dietary: gdiet, role });
    });
    party.forEach((p) => {
      entries.push({
        ...p,
        camping: camp === "Yes",
        bottle: BOTTLE_MAP[bottle] || bottle,
        party: party.filter((x) => x !== p),
        partyHost: fn + " " + ln,
      });
    });
  });
  return entries;
}

const DIRECTORY = buildDirectory();

function DietBadge({ diet }: { diet: string }) {
  const d = (diet || "").toLowerCase();
  const map: Record<string, { label: string; bg: string; fg: string }> = {
    meat: { label: "Meat \u{1F969}", bg: colors.blushLight, fg: colors.dustyRose },
    veg: { label: "Veg \u{1F331}", bg: colors.sageLight, fg: colors.sageDark },
    vegan: { label: "Vegan \u{1F33F}", bg: colors.sageLight, fg: colors.sageDark },
  };
  const s = map[d] || { label: diet, bg: colors.linen, fg: colors.warmGrey };
  return (
    <span style={{
      display: "inline-block", fontFamily: sans, fontSize: 12, fontWeight: 500,
      padding: "4px 12px", borderRadius: 20, background: s.bg, color: s.fg, whiteSpace: "nowrap",
    }}>{s.label}</span>
  );
}

function ResultCard({ person }: { person: Person }) {
  return (
    <div style={{
      background: colors.card, borderRadius: 12, padding: "24px 22px", marginTop: 16,
      border: `1px solid ${colors.linen}`, boxShadow: "0 2px 24px rgba(0,0,0,0.04)",
      animation: "slideIn 0.4s ease both",
    }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 12, marginBottom: 16 }}>
        <div>
          <h3 style={{ fontFamily: serif, fontSize: 26, fontWeight: 500, color: colors.text }}>
            {person.first} {person.last}
          </h3>
          {person.role !== "Primary" && (
            <p style={{ fontFamily: sans, fontSize: 12, color: colors.warmGrey, marginTop: 2 }}>
              {person.role === "Child" ? "Guest of" : "Partner of"} {person.partyHost}
            </p>
          )}
        </div>
        <DietBadge diet={person.dietary} />
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 12, padding: "10px 14px", background: colors.cream, borderRadius: 8 }}>
          <span style={{ fontFamily: sans, fontSize: 13, color: colors.textLight }}>Camping</span>
          <span style={{ fontFamily: sans, fontSize: 13, fontWeight: 500, color: person.camping ? colors.sageDark : colors.warmGrey }}>
            {person.camping ? "\u{26FA} Yes — bring bedding" : "No"}
          </span>
        </div>

        {person.role === "Primary" && person.bottle && (
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 12, padding: "10px 14px", background: colors.blushLight, borderRadius: 8 }}>
            <span style={{ fontFamily: sans, fontSize: 13, color: colors.textLight }}>Bottle pledged</span>
            <span style={{ fontFamily: sans, fontSize: 13, fontWeight: 500, color: colors.text }}>{person.bottle}</span>
          </div>
        )}

        {person.party.length > 0 && (
          <div style={{ padding: "10px 14px", background: colors.cream, borderRadius: 8 }}>
            <span style={{ fontFamily: sans, fontSize: 11, textTransform: "uppercase", letterSpacing: "1px", color: colors.warmGrey }}>
              Rest of your party
            </span>
            <div style={{ marginTop: 6, display: "flex", flexWrap: "wrap", gap: 6 }}>
              {person.party.map((p, i) => (
                <span key={i} style={{ fontFamily: sans, fontSize: 12, color: colors.text, background: colors.card, padding: "4px 10px", borderRadius: 14, border: `1px solid ${colors.linen}` }}>
                  {p.first} {p.last}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function Search() {
  const [query, setQuery] = useState("");

  const results = useMemo(() => {
    if (query.trim().length < 2) return [];
    const q = query.trim().toLowerCase();
    return DIRECTORY.filter((p) => `${p.first} ${p.last}`.toLowerCase().includes(q)).slice(0, 6);
  }, [query]);

  return (
    <div style={{ animation: "fadeUp 0.6s ease both" }}>
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Type your name..."
        aria-label="Search for your name"
        style={{
          width: "100%", fontFamily: serif, fontSize: 22, fontWeight: 400, fontStyle: "italic",
          padding: "16px 18px", border: `2px solid ${colors.sageLight}`, borderRadius: 12, background: colors.card,
          color: colors.text, transition: "border-color 0.3s ease",
        }}
        onFocus={(e) => (e.currentTarget.style.borderColor = colors.sage)}
        onBlur={(e) => (e.currentTarget.style.borderColor = colors.sageLight)}
      />

      {query.trim().length >= 2 && results.length === 0 && (
        <p style={{ fontFamily: sans, fontSize: 14, color: colors.warmGrey, textAlign: "center", marginTop: 24 }}>
          Can&apos;t find that name &mdash; try just your first name, or check with Mollie &amp; Jason.
        </p>
      )}

      {results.map((p, i) => (
        <ResultCard key={`${p.first}-${p.last}-${i}`} person={p} />
      ))}
    </div>
  );
}

function ScheduleItem({ time, title, desc, active }: { time: string; title: string; desc?: string; active?: boolean }) {
  return (
    <div style={{ display: "flex", gap: 16, animation: "slideIn 0.4s ease both" }}>
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", width: 56, flexShrink: 0 }}>
        <div style={{
          width: 12, height: 12, borderRadius: "50%",
          background: active ? colors.gold : colors.sageLight, marginTop: 6, flexShrink: 0,
        }} />
        <div style={{ flex: 1, width: 2, background: colors.linen, marginTop: 4 }} />
      </div>
      <div style={{ paddingBottom: 28 }}>
        <p style={{ fontFamily: sans, fontSize: 11, fontWeight: 500, letterSpacing: "1.5px", textTransform: "uppercase", color: colors.gold }}>{time}</p>
        <h4 style={{ fontFamily: serif, fontSize: 20, fontWeight: 500, color: colors.text, marginTop: 4 }}>{title}</h4>
        {desc && <p style={{ fontFamily: sans, fontSize: 13, fontWeight: 300, color: colors.textLight, marginTop: 4, lineHeight: 1.5 }}>{desc}</p>}
      </div>
    </div>
  );
}

function Parking() {
  return (
    <a
      href="https://what3words.com/sung.drape.chips"
      target="_blank"
      rel="noopener noreferrer"
      style={{
        display: "block", textDecoration: "none", background: colors.card, borderRadius: 12,
        padding: "18px 20px", marginBottom: 8, border: `1px solid ${colors.linen}`,
        boxShadow: "0 2px 24px rgba(0,0,0,0.04)", animation: "fadeUp 0.6s ease both",
      }}
    >
      <span style={{ fontFamily: sans, fontSize: 11, textTransform: "uppercase", letterSpacing: "1.5px", color: colors.warmGrey }}>
        Parking
      </span>
      <p style={{ fontFamily: serif, fontSize: 24, fontWeight: 500, color: colors.text, marginTop: 4 }}>
        {"///sung.drape.chips"}
      </p>
      <p style={{ fontFamily: sans, fontSize: 12, fontWeight: 300, color: colors.textLight, marginTop: 4 }}>
        Tap to open in what3words
      </p>
    </a>
  );
}

function Schedule() {
  const items = [
    { time: "12:00 \u2013 12:45", title: "Arrival", desc: "Park up and make your way in." },
    { time: "12:45 \u2013 1:00", title: "Ceremony", desc: "On the grass!" },
    { time: "1:30 \u2013 2:30", title: "Lunch" },
    { time: "2:30 \u2013 3:00", title: "Speeches" },
    { time: "3:00 \u2013 5:00", title: "Relaxed vibe" },
    { time: "5:00 \u2013 7:00", title: "Pizza Time!" },
    { time: "7:00 \u2013 late!", title: "Dancing!" },
    { time: "All day", title: "Cocktail bar", desc: "Self-serve \u2014 bring your bottle, mix your own." },
    { time: "All night", title: "Kids den", desc: "Blankets, cushions & a quiet corner in the pavilion." },
  ];
  return (
    <div style={{ animation: "fadeUp 0.6s ease both", marginTop: 8 }}>
      <Parking />
      {items.map((it, i) => (
        <ScheduleItem key={i} {...it} active={i === 1} />
      ))}
    </div>
  );
}

export default function GuestLookupPage() {
  const [tab, setTab] = useState<"search" | "schedule">("search");

  return (
    <div style={{ minHeight: "100vh", background: `linear-gradient(180deg, ${colors.cream} 0%, ${colors.bg} 40%, ${colors.blushLight} 100%)`, padding: "40px 20px" }}>
      <div style={{ maxWidth: 460, margin: "0 auto" }}>
        {/* Header */}
        <div style={{ textAlign: "center", animation: "fadeUp 0.8s ease both" }}>
          <p style={{ fontFamily: sans, fontSize: 11, fontWeight: 300, textTransform: "uppercase", letterSpacing: "4px", color: colors.warmGrey, marginBottom: 12 }}>
            22nd August 2026
          </p>
          <h1 style={{ fontFamily: serif, fontSize: 40, fontWeight: 300, color: colors.text, fontStyle: "italic" }}>
            Mollie &amp; Jason
          </h1>
        </div>

        {/* Tabs */}
        <div style={{ display: "flex", gap: 8, marginTop: 32, marginBottom: 24, background: colors.linen, padding: 4, borderRadius: 12 }}>
          {([
            { id: "search", label: "Find My Details" },
            { id: "schedule", label: "The Day" },
          ] as const).map((t) => (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              style={{
                flex: 1, padding: "12px", fontFamily: sans, fontSize: 13, fontWeight: 500,
                background: tab === t.id ? colors.card : "transparent", color: tab === t.id ? colors.text : colors.warmGrey,
                border: "none", borderRadius: 9, cursor: "pointer", transition: "all 0.3s ease",
                boxShadow: tab === t.id ? "0 2px 8px rgba(0,0,0,0.06)" : "none",
              }}
            >
              {t.label}
            </button>
          ))}
        </div>

        {tab === "search" ? <Search /> : <Schedule />}

        <p style={{ fontFamily: sans, fontSize: 11, fontWeight: 200, color: colors.warmGrey, marginTop: 40, textAlign: "center", letterSpacing: "1px", opacity: 0.6 }}>
          M &amp; J &middot; MMXXVI
        </p>
      </div>
    </div>
  );
}
