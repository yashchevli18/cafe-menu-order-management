import { Bean, ChefHat, Heart } from 'lucide-react';
import SectionHeading from './SectionHeading';
import SmartImage from '../common/SmartImage';

const INTERIOR_IMAGE =
  'https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?auto=format&fit=crop&w=900&q=75';
const BEANS_IMAGE = 'https://images.unsplash.com/photo-1447933601403-0c6688de566e?auto=format&fit=crop&w=500&q=70';

const VALUES = [
  {
    icon: Bean,
    title: 'Thoughtfully sourced',
    text: 'Beans from small Indian estates in Chikmagalur and Coorg, roasted in small batches.',
  },
  {
    icon: ChefHat,
    title: 'Made to order',
    text: 'Every pizza, burger and sandwich is prepared fresh when you order, never pre-made.',
  },
  {
    icon: Heart,
    title: 'Warm hospitality',
    text: 'A cosy corner to work, catch up with friends or simply slow down for a while.',
  },
];

const AboutSection = () => (
  <section className="container-page py-16 sm:py-24" aria-labelledby="about-heading">
    <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-20">
      <div className="relative">
        <SmartImage
          src={INTERIOR_IMAGE}
          alt="Warm, light-filled interior of the Brew & Bean cafe"
          className="aspect-[4/3] w-full rounded-[2rem] shadow-lift"
        />
        <SmartImage
          src={BEANS_IMAGE}
          alt="Freshly roasted coffee beans"
          className="absolute -right-3 -bottom-8 hidden aspect-square w-40 rounded-3xl border-4 border-cream shadow-lift sm:block lg:-right-8"
        />
      </div>

      <div>
        <SectionHeading
          eyebrow="About our cafe"
          title={<span id="about-heading">Brewed with patience, served with heart</span>}
          description="Brew & Bean started with a simple idea: great coffee and honest food shouldn't feel complicated. Our baristas dial in every shot, our kitchen cooks from scratch, and our tables are always open for one more conversation."
        />
        <ul className="mt-8 space-y-5">
          {VALUES.map(({ icon: Icon, title, text }) => (
            <li key={title} className="flex gap-4">
              <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-white text-caramel shadow-soft">
                <Icon className="h-5 w-5" aria-hidden="true" />
              </span>
              <div>
                <h3 className="font-sans text-base font-semibold text-espresso">{title}</h3>
                <p className="mt-1 text-sm leading-relaxed text-espresso/65">{text}</p>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  </section>
);

export default AboutSection;
