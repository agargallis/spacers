import { motion } from 'framer-motion';
import Section from './Section';
import SectionHeading from '../ui/SectionHeading';
import SponsorCard from '../features/SponsorCard';
import Editable from '../admin/Editable';
import AddButton from '../admin/AddButton';
import { useTeamResource } from '../../hooks/useTeamResource';
import { getSponsors } from '../../services/sponsorsService';
import { stagger } from '../../utils/motion';

export default function SponsorsSection() {
  const { data: sponsors } = useTeamResource(getSponsors, { initialData: [] });

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
        {(sponsors ?? []).map((s) => (
          <Editable key={s.id} collection="sponsors" schema="sponsors" item={s}>
            <SponsorCard sponsor={s} />
          </Editable>
        ))}
      </motion.div>

      <AddButton collection="sponsors" schema="sponsors" label="χορηγό" className="mt-6" />
    </Section>
  );
}
