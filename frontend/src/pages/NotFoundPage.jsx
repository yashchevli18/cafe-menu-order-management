import { Link } from 'react-router-dom';
import { ArrowLeft, Coffee } from 'lucide-react';
import Button from '../components/common/Button';
import useDocumentTitle from '../hooks/useDocumentTitle';

const NotFoundPage = () => {
  useDocumentTitle('Page Not Found');

  return (
    <div className="container-page flex min-h-[65vh] flex-col items-center justify-center py-16 text-center">
      <div className="relative">
        <span className="font-display text-[7rem] leading-none font-semibold text-beige sm:text-[9rem]">404</span>
        <Coffee className="absolute inset-0 m-auto h-14 w-14 text-caramel" aria-hidden="true" />
      </div>
      <h1 className="mt-4 text-3xl font-semibold text-espresso">This cup seems to be empty</h1>
      <p className="mt-3 max-w-md text-espresso/65">
        The page you&apos;re looking for doesn&apos;t exist or may have moved. Let&apos;s get you back to something
        delicious.
      </p>
      <div className="mt-8 flex flex-col gap-3 sm:flex-row">
        <Button as={Link} to="/menu">
          View the menu
        </Button>
        <Button as={Link} to="/" variant="outline" leftIcon={ArrowLeft}>
          Back home
        </Button>
      </div>
    </div>
  );
};

export default NotFoundPage;
