import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Suspense } from "react";
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

async function ClientStory({ params }: { params: PageProps<"/[slug]">["params"] }) {
  const { slug } = await params;
  const story = getClientStory(slug);
  if (!story) notFound();
  return <KarwaChauthExperience story={story} />;
}

// reading params inside Suspense keeps the page shell instant (the night-dark fallback matches the preloader)
export default function ClientPage({ params }: PageProps<"/[slug]">) {
  return (
    <Suspense fallback={<div className="fixed inset-0 bg-[#02040a]" />}>
      <ClientStory params={params} />
    </Suspense>
  );
}
