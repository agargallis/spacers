import { AnimatePresence, motion } from 'framer-motion';
import Section from './Section';
import SectionHeading from '../ui/SectionHeading';
import SponsorCard from '../features/SponsorCard';
import { useTeamResource } from '../../hooks/useTeamResource';
import { getSponsors } from '../../services/sponsorsService';
import { stagger } from '../../utils/motion';

export default function SponsorsSection() {
  const { data: sponsors, activeTeam } = useTeamResource(getSponsors, { initialData: [] });

  return (
    <Section id="sponsors">
      <SectionHeading eyebrow="Partners" title="Οι χορηγοί μας." />

      <AnimatePresence mode="wait">
        <motion.div
          key={activeTeam}
          variants={stagger(0.06)}
          initial="hidden"
          animate="show"
          className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4"
        >
          {(sponsors ?? []).slice(0, 2).map((s) => (
            <SponsorCard key={s.id} sponsor={s} />
          ))}
        </motion.div>
      </AnimatePresence>
    </Section>
  );
}
