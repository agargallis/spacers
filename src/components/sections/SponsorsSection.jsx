import { motion } from 'framer-motion';
import Section from './Section';
import SectionHeading from '../ui/SectionHeading';
import SponsorCard from '../features/SponsorCard';
import { heroPartners } from '../../data/partners';
import { stagger } from '../../utils/motion';

export default function SponsorsSection() {
  return (
    <Section id="sponsors">
      <SectionHeading eyebrow="Partners" title="Οι χορηγοί μας." />

      <motion.div
        variants={stagger(0.1)}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true }}
        className="flex flex-wrap justify-center gap-6"
      >
        {heroPartners.map((s) => (
          <SponsorCard key={s.id} sponsor={s} />
        ))}
      </motion.div>
    </Section>
  );
}
