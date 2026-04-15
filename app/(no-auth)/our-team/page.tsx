import OurTeamComponents from "@/components/OurTeamComponents";
import { getOurTeamData } from "@/lib/our-team";

export default async function page() {
  const teams = await getOurTeamData();
  return <OurTeamComponents teams={teams} />;
}
