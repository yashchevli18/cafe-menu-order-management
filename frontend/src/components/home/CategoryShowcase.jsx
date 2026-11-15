import { Link } from 'react-router-dom';
import SectionHeading from './SectionHeading';
import SmartImage from '../common/SmartImage';
import { MENU_CATEGORIES } from '../../utils/constants';

const unsplash = (photoId) => `https://images.unsplash.com/photo-${photoId}?auto=format&fit=crop&w=500&q=70`;

const CATEGORY_IMAGES = {
  Coffee: unsplash('1511920170033-f8396924c348'),
  Tea: unsplash('1576092768241-dec231879fc3'),
  'Cold Drinks': unsplash('1551024709-8f23befc6f87'),
  Pizza: unsplash('1513104890138-7c749659a591'),
  Burgers: unsplash('1550547660-d9450f859349'),
  Sandwiches: unsplash('1553909489-cd47e0907980'),
  Desserts: unsplash('1488477181946-6428a0291777'),
};

const CategoryShowcase = () => (
  <section className="bg-beige-light py-16 sm:py-20" aria-labelledby="categories-heading">
    <div className="container-page">
      <SectionHeading
        align="center"
        eyebrow="Something for every craving"
        title={<span id="categories-heading">Popular categories</span>}
        description="From your first espresso of the morning to a late-evening slice of pizza."
      />
      <ul className="mt-10 grid grid-cols-2 gap-4 sm:grid-cols-4 lg:grid-cols-7">
        {MENU_CATEGORIES.map((category, index) => (
          <li
            key={category}
            className={index === MENU_CATEGORIES.length - 1 ? 'col-span-2 sm:col-span-1 lg:col-span-1' : ''}
          >
            <Link
              to={`/menu?category=${encodeURIComponent(category)}`}
              className="group relative block aspect-[4/3] overflow-hidden rounded-3xl shadow-soft sm:aspect-[3/4]"
            >
              <SmartImage
                src={CATEGORY_IMAGES[category]}
                alt=""
                className="h-full w-full transition-transform duration-700 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-espresso/80 via-espresso/10 to-transparent" />
              <div className="absolute inset-x-0 bottom-0 p-4">
                <p className="font-display text-lg font-semibold text-cream">{category}</p>
                <p className="text-xs font-medium text-cream/70 transition group-hover:text-caramel">Explore &rarr;</p>
              </div>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  </section>
);

export default CategoryShowcase;
