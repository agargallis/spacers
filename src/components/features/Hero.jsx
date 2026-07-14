import { motion } from 'framer-motion';
import TeamCrest from '../ui/TeamCrest';
import LogoMarquee from './LogoMarquee';
import { useActiveTeamMeta } from '../../store/useTeamStore';
import { useTeamResource } from '../../hooks/useTeamResource';
import { getSponsors } from '../../services/sponsorsService';
import { teams } from '../../data/teams';

// Both team crests always ride the carousel, followed by every sponsor.
const crests = [
  { id: 'crest-main', name: teams.main.name, logo: teams.main.logo, url: teams.main.profileUrl },
  { id: 'crest-beta', name: teams.beta.name, logo: teams.beta.logo, url: teams.beta.profileUrl },
];

export default function Hero() {
  const meta = useActiveTeamMeta();
  const { data: sponsors } = useTeamResource(getSponsors, { initialData: [] });

  // Live sponsors (respecting admin hide/custom/add) + the two crests.
  const marqueeItems = [...crests, ...(sponsors ?? []).filter((s) => s.logo && !s._hidden)];

  return (
    <section className="relative overflow-hidden">
      <div className="mx-auto flex max-w-3xl flex-col items-center px-4 sm:px-6 pt-12 pb-14 sm:pt-16">
        {/* Centered crest */}
        <motion.div
          initial={{ opacity: 0, scale: 0.82 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          className="flex justify-center"
        >
          <div className="animate-float scale-[0.72] sm:scale-90 lg:scale-100">
            <TeamCrest team={meta.key} size={320} spin />
          </div>
        </motion.div>

        {/* Carousel directly below */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.25 }}
          className="mt-8 flex w-full max-w-xl justify-center"
        >
          <LogoMarquee items={marqueeItems} />
        </motion.div>
      </div>
    </section>
  );
}
