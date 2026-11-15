import { useEffect } from 'react';

const BASE_TITLE = 'Brew & Bean';

const useDocumentTitle = (title) => {
  useEffect(() => {
    document.title = title ? `${title} | ${BASE_TITLE}` : `${BASE_TITLE} | Specialty Coffee & Kitchen`;
  }, [title]);
};

export default useDocumentTitle;
