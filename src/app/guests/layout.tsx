import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Mollie & Jason - Guest Details",
  description: "Find your dietary choice, camping and bottle details, plus the running order for the day.",
  openGraph: {
    title: "Mollie & Jason - Guest Details",
    description: "Find your dietary choice, camping and bottle details, plus the running order for the day.",
  },
};

export default function GuestsLayout({ children }: { children: React.ReactNode }) {
  return children;
}
