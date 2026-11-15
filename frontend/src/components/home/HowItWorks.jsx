import { Coffee, QrCode, ShoppingBag } from 'lucide-react';
import SectionHeading from './SectionHeading';

const STEPS = [
  {
    icon: QrCode,
    title: 'Scan your table',
    text: 'Point your phone camera at the QR code on your table. The menu opens instantly, no app or account needed.',
  },
  {
    icon: ShoppingBag,
    title: 'Pick your favourites',
    text: 'Browse, search and add items to your cart. Leave a note if you like it extra hot or less sweet.',
  },
  {
    icon: Coffee,
    title: 'Sit back & enjoy',
    text: 'Place your order and follow its progress live. We bring it right to your table.',
  },
];

const HowItWorks = () => (
  <section className="bg-espresso py-16 sm:py-20" aria-labelledby="how-heading">
    <div className="container-page">
      <SectionHeading
        light
        align="center"
        eyebrow="Table ordering"
        title={<span id="how-heading">Order in three easy steps</span>}
      />
      <ol className="mt-12 grid gap-6 md:grid-cols-3">
        {STEPS.map(({ icon: Icon, title, text }, index) => (
          <li key={title} className="relative rounded-3xl border border-cream/10 bg-cream/[0.04] p-7">
            <span className="absolute top-6 right-7 font-display text-5xl font-semibold text-cream/10">
              0{index + 1}
            </span>
            <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-caramel text-white">
              <Icon className="h-5 w-5" aria-hidden="true" />
            </span>
            <h3 className="mt-5 text-xl font-semibold text-cream">{title}</h3>
            <p className="mt-2 text-sm leading-relaxed text-cream/65">{text}</p>
          </li>
        ))}
      </ol>
    </div>
  </section>
);

export default HowItWorks;
