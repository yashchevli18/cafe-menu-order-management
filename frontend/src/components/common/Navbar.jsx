import { useEffect, useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { Menu, ShoppingBag, X } from 'lucide-react';
import Logo from './Logo';
import TableBadge from './TableBadge';
import useCart from '../../hooks/useCart';

const NAV_LINKS = [
  { to: '/', label: 'Home', end: true },
  { to: '/menu', label: 'Menu' },
  { to: '/track-order', label: 'Track Order' },
];

const navLinkClass = ({ isActive }) =>
  `relative rounded-full px-4 py-2 text-sm font-medium transition-colors ${
    isActive ? 'bg-beige/70 text-espresso' : 'text-espresso/70 hover:text-espresso'
  }`;

const Navbar = () => {
  const { itemCount, tableNumber, openCart } = useCart();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const { pathname } = useLocation();

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 8);
    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => setIsMenuOpen(false), [pathname]);

  return (
    <header
      className={`sticky top-0 z-40 border-b transition-all duration-300 print:hidden ${
        isScrolled || isMenuOpen
          ? 'border-beige/70 bg-cream/90 shadow-[0_6px_24px_-18px_rgba(44,33,27,0.5)] backdrop-blur-lg'
          : 'border-transparent bg-cream'
      }`}
    >
      <nav className="container-page flex h-16 items-center justify-between gap-4 sm:h-18" aria-label="Main">
        <Logo />

        <ul className="hidden items-center gap-1 md:flex">
          {NAV_LINKS.map((link) => (
            <li key={link.to}>
              <NavLink to={link.to} end={link.end} className={navLinkClass}>
                {link.label}
              </NavLink>
            </li>
          ))}
        </ul>

        <div className="flex items-center gap-2">
          <span className="hidden sm:block">
            <TableBadge tableNumber={tableNumber} />
          </span>
          <button
            type="button"
            onClick={openCart}
            className="relative flex h-11 items-center gap-2 rounded-full bg-espresso pr-4 pl-3.5 text-sm font-semibold text-cream shadow-soft transition hover:bg-brown"
            aria-label={`Open cart, ${itemCount} ${itemCount === 1 ? 'item' : 'items'}`}
          >
            <ShoppingBag className="h-4.5 w-4.5" aria-hidden="true" />
            <span className="hidden sm:inline">Cart</span>
            <span
              key={itemCount}
              className={`flex h-5.5 min-w-5.5 items-center justify-center rounded-full px-1.5 text-xs tabular-nums ${
                itemCount > 0 ? 'animate-scale-in bg-caramel text-white' : 'bg-cream/15 text-cream/80'
              }`}
            >
              {itemCount}
            </span>
          </button>
          <button
            type="button"
            onClick={() => setIsMenuOpen((open) => !open)}
            className="flex h-11 w-11 items-center justify-center rounded-full text-espresso transition hover:bg-beige/60 md:hidden"
            aria-label={isMenuOpen ? 'Close navigation menu' : 'Open navigation menu'}
            aria-expanded={isMenuOpen}
            aria-controls="mobile-navigation"
          >
            {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </nav>

      {isMenuOpen && (
        <div id="mobile-navigation" className="animate-fade-in border-t border-beige/70 md:hidden">
          <ul className="container-page flex flex-col gap-1 py-3">
            {NAV_LINKS.map((link) => (
              <li key={link.to}>
                <NavLink
                  to={link.to}
                  end={link.end}
                  className={({ isActive }) =>
                    `block rounded-2xl px-4 py-3 text-base font-medium ${
                      isActive ? 'bg-beige/70 text-espresso' : 'text-espresso/75 hover:bg-beige/40'
                    }`
                  }
                >
                  {link.label}
                </NavLink>
              </li>
            ))}
            {tableNumber && (
              <li className="px-4 pt-2">
                <TableBadge tableNumber={tableNumber} />
              </li>
            )}
          </ul>
        </div>
      )}
    </header>
  );
};

export default Navbar;
