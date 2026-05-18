import { NextResponse } from "next/server";

const GOOGLE_SCRIPT_URL = "https://script.google.com/macros/s/AKfycbx0iQK9wubcrA7LOOvHP13T9-BMvmB6UAvW-FMs1PWJyHacyHVPYXOZ68052imdGQ7b/exec";

interface Guest {
  firstName: string;
  lastName: string;
  dietary: string;
}

interface Rsvp {
  firstName: string;
  lastName: string;
  dietary: string;
  guests: Guest[];
  bottle: string;
  timestamp: string;
}

interface Data {
  rsvps: Rsvp[];
  bottles: Record<string, number>;
}

async function loadData(): Promise<Data> {
  const res = await fetch(GOOGLE_SCRIPT_URL, {
    cache: "no-store",
    redirect: "follow",
  });
  if (res.ok) {
    const text = await res.text();
    return JSON.parse(text);
  }
  return { rsvps: [], bottles: {} };
}

async function saveData(rsvp: Rsvp): Promise<Data> {
  const res = await fetch(GOOGLE_SCRIPT_URL, {
    method: "POST",
    redirect: "follow",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(rsvp),
  });
  const text = await res.text();
  return JSON.parse(text);
}

export async function GET() {
  const data = await loadData();
  return NextResponse.json(data);
}

export async function POST(request: Request) {
  const body = await request.json();
  if (body.declined) {
    const decline = {
      firstName: body.firstName,
      lastName: body.lastName,
      declined: true,
      timestamp: new Date().toISOString(),
    };
    await fetch(GOOGLE_SCRIPT_URL, {
      method: "POST",
      redirect: "follow",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(decline),
    });
    return NextResponse.json({ ok: true });
  }
  const data = await saveData({ ...body, timestamp: new Date().toISOString() });
  return NextResponse.json(data);
}
