
import { useEffect, useRef, RefObject } from 'react';

type AnimationType = 'fade' | 'scale' | 'highlight';

const useScrollAnimation = <T extends HTMLElement>(
  animationType: AnimationType = 'fade',
  threshold = 0.2,
  delay = 0
): RefObject<T> => {
  const ref = useRef<T>(null);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const className = `${animationType}-on-scroll`;
    element.classList.add(className);

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setTimeout(() => {
              element.classList.add('active');
            }, delay);
          } else {
            element.classList.remove('active');
          }
        });
      },
      {
        threshold,
        rootMargin: '0px 0px -100px 0px',
      }
    );

    observer.observe(element);

    return () => {
      observer.unobserve(element);
    };
  }, [animationType, threshold, delay]);

  return ref;
};

export default useScrollAnimation;
