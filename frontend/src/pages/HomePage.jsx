import HeroSection from '../components/home/HeroSection';
import FeaturedItems from '../components/home/FeaturedItems';
import CategoryShowcase from '../components/home/CategoryShowcase';
import HowItWorks from '../components/home/HowItWorks';
import AboutSection from '../components/home/AboutSection';
import useDocumentTitle from '../hooks/useDocumentTitle';

const HomePage = () => {
  useDocumentTitle();

  return (
    <>
      <HeroSection />
      <FeaturedItems />
      <CategoryShowcase />
      <AboutSection />
      <HowItWorks />
    </>
  );
};

export default HomePage;
