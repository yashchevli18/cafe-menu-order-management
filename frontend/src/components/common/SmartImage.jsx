import { useState } from 'react';
import placeholderImage from '../../assets/images/placeholder-food.svg';

const SmartImage = ({ src, alt, className = '', ...props }) => {
  const [failedSrc, setFailedSrc] = useState(null);
  const [loaded, setLoaded] = useState(false);
  const resolvedSrc = !src || failedSrc === src ? placeholderImage : src;

  return (
    <img
      src={resolvedSrc}
      alt={alt}
      loading="lazy"
      decoding="async"
      onLoad={() => setLoaded(true)}
      onError={() => setFailedSrc(src)}
      className={`bg-beige/60 object-cover transition-opacity duration-500 ${loaded ? 'opacity-100' : 'opacity-0'} ${className}`}
      {...props}
    />
  );
};

export default SmartImage;
