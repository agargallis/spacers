import Hero from '../components/features/Hero';
import OverviewSection from '../components/sections/OverviewSection';
import StandingsSection from '../components/sections/StandingsSection';
import RosterSection from '../components/sections/RosterSection';
import ScheduleSection from '../components/sections/ScheduleSection';
import ResultsSection from '../components/sections/ResultsSection';
import VideoSection from '../components/sections/VideoSection';
import SponsorsSection from '../components/sections/SponsorsSection';
import ContactSection from '../components/sections/ContactSection';
import { sectionOrder } from '../data/sectionConfig';
import { useTeamStore } from '../store/useTeamStore';

/** Section id → component. Order is decided per team in sectionConfig. */
const SECTION_COMPONENTS = {
  standings: StandingsSection,
  roster: RosterSection,
  schedule: ScheduleSection,
  results: ResultsSection,
  video: VideoSection,
  sponsors: SponsorsSection,
  contact: ContactSection,
};

export default function HomePage() {
  const activeTeam = useTeamStore((s) => s.activeTeam);
  const order = sectionOrder[activeTeam] ?? sectionOrder.main;

  return (
    <>
      <Hero />
      <OverviewSection />
      {order.map((id) => {
        const Cmp = SECTION_COMPONENTS[id];
        return Cmp ? <Cmp key={id} /> : null;
      })}
    </>
  );
}
