import { Link } from 'react-router-dom';
import { Clock, Mail, MapPin, Phone } from 'lucide-react';
import Logo from './Logo';
import SocialIcons from './SocialIcons';
import { CAFE_INFO } from '../../utils/constants';

const QUICK_LINKS = [
  { to: '/', label: 'Home' },
  { to: '/menu', label: 'Our Menu' },
  { to: '/track-order', label: 'Track Your Order' },
  { to: '/table-qr', label: 'Table QR Codes' },
];

const Footer = () => (
  <footer className="mt-auto bg-espresso text-cream/75 print:hidden">
    <div className="container-page grid gap-10 py-14 sm:grid-cols-2 lg:grid-cols-[1.4fr_1fr_1.2fr_1fr]">
      <div>
        <Logo light />
        <p className="mt-4 max-w-xs text-sm leading-relaxed">
          Small-batch roasts, slow-brewed teas and honest comfort food, served with warmth since day one.
        </p>
        <SocialIcons links={CAFE_INFO.socials} className="mt-6" />
      </div>

      <div>
        <h3 className="font-sans text-sm font-semibold tracking-wider text-cream uppercase">Explore</h3>
        <ul className="mt-4 space-y-2.5 text-sm">
          {QUICK_LINKS.map((link) => (
            <li key={link.to}>
              <Link to={link.to} className="transition hover:text-caramel">
                {link.label}
              </Link>
            </li>
          ))}
        </ul>
      </div>

      <div>
        <h3 className="font-sans text-sm font-semibold tracking-wider text-cream uppercase">Visit us</h3>
        <ul className="mt-4 space-y-3 text-sm">
          <li className="flex gap-3">
            <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-caramel" aria-hidden="true" />
            <span>{CAFE_INFO.address}</span>
          </li>
          <li>
            <a href={`tel:${CAFE_INFO.phone.replace(/\s/g, '')}`} className="flex gap-3 transition hover:text-caramel">
              <Phone className="mt-0.5 h-4 w-4 shrink-0 text-caramel" aria-hidden="true" />
              {CAFE_INFO.phone}
            </a>
          </li>
          <li>
            <a href={`mailto:${CAFE_INFO.email}`} className="flex gap-3 transition hover:text-caramel">
              <Mail className="mt-0.5 h-4 w-4 shrink-0 text-caramel" aria-hidden="true" />
              {CAFE_INFO.email}
            </a>
          </li>
        </ul>
      </div>

      <div>
        <h3 className="font-sans text-sm font-semibold tracking-wider text-cream uppercase">Opening hours</h3>
        <ul className="mt-4 space-y-3 text-sm">
          {CAFE_INFO.hours.map((slot) => (
            <li key={slot.days} className="flex gap-3">
              <Clock className="mt-0.5 h-4 w-4 shrink-0 text-caramel" aria-hidden="true" />
              <span>
                <span className="block text-cream">{slot.days}</span>
                {slot.time}
              </span>
            </li>
          ))}
        </ul>
      </div>
    </div>

    <div className="border-t border-cream/10">
      <div className="container-page flex flex-col items-center justify-between gap-2 py-5 text-xs text-cream/50 sm:flex-row">
        <p>&copy; {new Date().getFullYear()} Brew &amp; Bean. All rights reserved.</p>
        <p>Order from your table &middot; No sign-up needed</p>
      </div>
    </div>
  </footer>
);

export default Footer;
