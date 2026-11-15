import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import SectionHeading from './SectionHeading';
import MenuList from '../menu/MenuList';
import Button from '../common/Button';
import EmptyState from '../common/EmptyState';
import useMenuItems from '../../hooks/useMenuItems';

const FEATURED_PARAMS = { featured: true, available: true, limit: 8 };

const FeaturedItems = () => {
  const { items, loading, error, refetch } = useMenuItems(FEATURED_PARAMS);

  return (
    <section className="container-page py-16 sm:py-20" aria-labelledby="featured-heading">
      <SectionHeading
        eyebrow="Guest favourites"
        title={<span id="featured-heading">Featured on our menu</span>}
        description="The cups and plates our regulars come back for, made fresh with every order."
        action={
          <Button as={Link} to="/menu" variant="outline" rightIcon={ArrowRight}>
            View full menu
          </Button>
        }
      />
      <div className="mt-10">
        <MenuList
          items={items}
          loading={loading}
          error={error}
          onRetry={refetch}
          skeletonCount={4}
          emptyState={
            <EmptyState
              compact
              title="Our favourites are brewing"
              description="Featured items will appear here soon. In the meantime, explore the full menu."
            />
          }
        />
      </div>
    </section>
  );
};

export default FeaturedItems;
