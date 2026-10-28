import type { Metadata } from "next";
import LinkCreator from "@/components/LinkCreator";

export const metadata: Metadata = {
  title: "Naya link banayein — Karwa Chauth story",
  robots: { index: false, follow: false },
};

export default function CreatePage() {
  return <LinkCreator />;
}
