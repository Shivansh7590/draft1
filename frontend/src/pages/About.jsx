import { motion } from 'framer-motion';
import SEO from '../components/SEO';
import Waveform from '../components/Waveform';

const timeline = [
  { year: '2020', title: 'Founded', desc: 'Nimbus Audio launched in San Francisco with a mission to redefine premium sound.' },
  { year: '2021', title: 'Air Pro Launch', desc: 'Our flagship earbuds debuted to critical acclaim, winning Best Audio Product of the Year.' },
  { year: '2023', title: 'Global Expansion', desc: 'Opened studios in Tokyo and Berlin, expanding our design and engineering teams.' },
  { year: '2025', title: 'Watch Ultra', desc: 'Entered the wearables market with our titanium smartwatch featuring seamless audio integration.' },
  { year: '2026', title: 'Today', desc: 'Serving over 500,000 customers worldwide with award-winning audio and wearables.' },
];

const team = [
  { name: 'Elena Vasquez', role: 'CEO & Co-founder', img: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&q=80' },
  { name: 'James Okonkwo', role: 'Head of Engineering', img: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&q=80' },
  { name: 'Mia Tanaka', role: 'Lead Designer', img: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=200&q=80' },
  { name: 'David Chen', role: 'Audio Director', img: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200&q=80' },
];

export default function About() {
  return (
    <>
      <SEO title="About" description="Learn about Nimbus — our mission, story, and team." />

      <section className="relative overflow-hidden bg-ink py-20 text-cloud">
        <div className="pointer-events-none absolute inset-x-0 bottom-6 flex justify-center opacity-40">
          <Waveform size="md" variant="default" className="max-w-md" label="" />
        </div>
        <div className="relative mx-auto max-w-7xl px-4 text-center sm:px-6 lg:px-8">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="font-display mb-4 text-4xl font-semibold sm:text-5xl"
          >
            Our Mission
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="mx-auto max-w-2xl text-lg text-cloud/70"
          >
            To craft audio experiences so immersive, they dissolve the boundary between listener and sound.
            Every Nimbus product is a testament to our obsession with quality.
          </motion.p>
        </div>
      </section>

      <section className="py-16 sm:py-24">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
          <h2 className="font-display mb-12 text-center text-3xl font-semibold text-ink">Our Journey</h2>
          <div className="relative space-y-8 border-l-2 border-mist pl-8">
            {timeline.map((item, i) => (
              <motion.div
                key={item.year}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="relative"
              >
                <div className="absolute -left-[41px] flex h-5 w-5 items-center justify-center rounded-full bg-signal ring-4 ring-cloud" />
                <p className="font-mono-price text-sm font-semibold text-signal">{item.year}</p>
                <h3 className="text-lg font-semibold text-ink">{item.title}</h3>
                <p className="text-slate">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-mist/25 py-16 sm:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <h2 className="font-display mb-12 text-center text-3xl font-semibold text-ink">Meet the Team</h2>
          <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
            {team.map((member, i) => (
              <motion.div
                key={member.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="text-center"
              >
                <img
                  src={member.img}
                  alt={member.name}
                  className="mx-auto mb-4 h-32 w-32 rounded-full object-cover shadow-lg ring-2 ring-mist"
                  loading="lazy"
                />
                <h3 className="font-semibold text-ink">{member.name}</h3>
                <p className="text-sm text-slate">{member.role}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
