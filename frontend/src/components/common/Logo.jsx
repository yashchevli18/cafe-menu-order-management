import { Link } from 'react-router-dom';
import logoMark from '../../assets/icons/logo-mark.svg';

const Logo = ({ light = false, onClick }) => (
  <Link to="/" onClick={onClick} className="group inline-flex items-center gap-2.5" aria-label="Brew & Bean home">
    <img src={logoMark} alt="" className="h-9 w-9 transition-transform duration-300 group-hover:-rotate-6" />
    <span className="leading-none whitespace-nowrap">
      <span className={`block font-display text-xl font-semibold ${light ? 'text-cream' : 'text-espresso'}`}>
        Brew <span className="text-caramel">&amp;</span> Bean
      </span>
      <span
        className={`mt-0.5 block text-[10px] font-medium tracking-[0.25em] uppercase ${light ? 'text-cream/55' : 'text-brown/60'}`}
      >
        Coffee &middot; Kitchen
      </span>
    </span>
  </Link>
);

export default Logo;
