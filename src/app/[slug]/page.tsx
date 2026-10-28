import type { Metadata } from "next";
import { notFound } from "next/navigation";
import KarwaChauthExperience from "@/components/KarwaChauthExperience";
import { clients, getClientStory } from "@/config/clients";

// every client link is pre-rendered at build time; unknown links fall through to a 404
export function generateStaticParams() {
  return Object.keys(clients).map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: PageProps<"/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const story = getClientStory(slug);
  if (!story) return {};
  return {
    title: `For ${story.wifeName} — a Karwa Chauth story`,
    description: `A little film, made with love by ${story.husbandName}.`,
    openGraph: { title: `For ${story.wifeName} 🌙`, description: "Tonight isn't just about the moon…" },
  };
}

export default async function ClientPage({ params }: PageProps<"/[slug]">) {
  const { slug } = await params;
  const story = getClientStory(slug);
  if (!story) notFound();
  return <KarwaChauthExperience story={story} />;
}
