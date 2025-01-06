import { useState, useEffect, useRef } from "react";


export const useNearScreen = (options?: IntersectionObserverInit, once: boolean = false) => {
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    if (!ref.current) return;
    const onChange: IntersectionObserverCallback = ([{ isIntersecting }], observer) => {
      if (isIntersecting) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
      if (once) observer.disconnect();
    };

    const observer = new IntersectionObserver(onChange, options);
    observer.observe(ref.current);

    return () => {
      observer.disconnect();
    };
  }, [once, options]);

  return {
    isVisible,
    ref,
  };
};

