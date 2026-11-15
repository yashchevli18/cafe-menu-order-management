import { Link } from 'react-router-dom';
import { ArrowRight, Leaf, MapPin, QrCode, Sparkles, UserX } from 'lucide-react';
import Button from '../common/Button';
import SmartImage from '../common/SmartImage';

const HERO_IMAGE =
  'https://images.unsplash.com/photo-1442512595331-e89e73853f31?auto=format&fit=crop&w=1200&q=80';
const SECONDARY_IMAGE =
  'https://images.unsplash.com/photo-1509042239860-f550ce710b93?auto=format&fit=crop&w=500&q=75';

const HIGHLIGHTS = [
  { icon: QrCode, label: 'Order from your table' },
  { icon: UserX, label: 'No sign-up needed' },
  { icon: Leaf, label: 'Fresh, every day' },
];

const HeroSection = () => (
  <section className="relative overflow-hidden">
    <div
      className="pointer-events-none absolute -top-40 -right-32 h-[28rem] w-[28rem] rounded-full bg-caramel/20 blur-3xl"
      aria-hidden="true"
    />
    <div
      className="pointer-events-none absolute -bottom-40 -left-40 h-96 w-96 rounded-full bg-beige blur-3xl"
      aria-hidden="true"
    />

    <div className="container-page relative grid items-center gap-12 pt-8 pb-16 sm:pt-12 lg:grid-cols-[1.05fr_1fr] lg:gap-16 lg:pt-16 lg:pb-24">
      <div className="animate-fade-up">
        <span className="inline-flex items-center gap-2 rounded-full border border-caramel/30 bg-white/70 px-3.5 py-1.5 text-xs font-semibold text-brown">
          <Sparkles className="h-3.5 w-3.5 text-caramel" aria-hidden="true" />
          Specialty coffee &amp; kitchen
        </span>
        <h1 className="mt-6 text-[2.6rem] leading-[1.08] font-semibold tracking-tight text-espresso sm:text-6xl lg:text-[4.2rem]">
          Slow-brewed coffee, <span className="text-caramel italic">made</span> for lingering.
        </h1>
        <p className="mt-6 max-w-xl text-base leading-relaxed text-espresso/70 sm:text-lg">
          Welcome to Brew &amp; Bean, your neighbourhood cafe for hand-crafted espresso, fragrant chai, wood-fired
          pizzas and desserts worth saving room for. Pull up a chair, scan the code on your table and we&apos;ll take
          it from there.
        </p>
        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
          <Button as={Link} to="/menu" size="lg" rightIcon={ArrowRight}>
            Explore Menu
          </Button>
          <Button as={Link} to="/track-order" size="lg" variant="outline" leftIcon={MapPin}>
            Track an Order
          </Button>
        </div>
        <ul className="mt-10 flex flex-wrap gap-x-6 gap-y-3">
          {HIGHLIGHTS.map(({ icon: Icon, label }) => (
            <li key={label} className="flex items-center gap-2 text-sm font-medium text-espresso/70">
              <span className="flex h-8 w-8 items-center justify-center rounded-full bg-white text-caramel shadow-sm">
                <Icon className="h-4 w-4" aria-hidden="true" />
              </span>
              {label}
            </li>
          ))}
        </ul>
      </div>

      <div className="relative mx-auto w-full max-w-lg animate-fade-up [animation-delay:120ms] lg:max-w-none">
        <div className="relative aspect-[4/5] overflow-hidden rounded-[2.5rem] shadow-lift sm:aspect-[5/5] lg:aspect-[4/5]">
          <SmartImage
            src={HERO_IMAGE}
            alt="Barista preparing pour-over coffee at the Brew & Bean bar"
            loading="eager"
            fetchPriority="high"
            className="h-full w-full"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-espresso/50 via-transparent to-transparent" />
        </div>

        <div className="absolute -bottom-6 -left-3 hidden w-44 overflow-hidden rounded-3xl border-4 border-cream shadow-lift sm:block lg:-left-10">
          <SmartImage src={SECONDARY_IMAGE} alt="Latte art in ceramic cups" className="aspect-square w-full" />
        </div>

        <div className="absolute top-6 -right-2 rounded-2xl bg-white/95 p-4 whitespace-nowrap shadow-lift backdrop-blur sm:-right-6">
          <div className="flex items-center gap-3">
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-espresso text-cream">
              <QrCode className="h-5 w-5" aria-hidden="true" />
            </span>
            <div>
              <p className="text-sm font-semibold text-espresso">Scan. Order. Relax.</p>
              <p className="text-xs text-espresso/55">Straight from your table</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
);

export default HeroSection;
