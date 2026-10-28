import KarwaChauthExperience from "@/components/KarwaChauthExperience";
import { storyData } from "@/config/story";

// the home page plays the demo story; each client has their own link (see config/clients.ts)
export default function Home() {
  return <KarwaChauthExperience story={storyData} />;
}
