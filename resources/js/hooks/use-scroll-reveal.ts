import { useEffect, useRef } from 'react';

interface UseScrollRevealOptions {
    rootMargin?: string;
    threshold?: number;
    once?: boolean;
    enterClass?: string;
}

const DEFAULT_INITIAL_CLASSES = ['opacity-0', 'translate-y-6', 'transition-all', 'duration-700', 'ease-out'];
const DEFAULT_ENTER_CLASSES = ['opacity-100', 'translate-y-0'];

export function useScrollReveal<T extends HTMLElement = HTMLElement>({
    rootMargin = '0px 0px -10% 0px',
    threshold = 0.15,
    once = true,
    enterClass = 'animate-fade-in-up',
}: UseScrollRevealOptions = {}) {
    const elementRef = useRef<T | null>(null);

    useEffect(() => {
        const element = elementRef.current;
        if (!element || typeof window === 'undefined' || !('IntersectionObserver' in window)) {
            return;
        }

        element.classList.add(...DEFAULT_INITIAL_CLASSES);

        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        if (enterClass) {
                            element.classList.add(enterClass);
                        }
                        element.classList.add(...DEFAULT_ENTER_CLASSES);
                        element.classList.remove(...DEFAULT_INITIAL_CLASSES);
                        if (once) {
                            observer.unobserve(entry.target);
                        }
                    } else if (!once) {
                        element.classList.remove(enterClass);
                        element.classList.remove(...DEFAULT_ENTER_CLASSES);
                        element.classList.add(...DEFAULT_INITIAL_CLASSES);
                    }
                });
            },
            {
                rootMargin,
                threshold,
            },
        );

        observer.observe(element);

        return () => {
            observer.disconnect();
        };
    }, [enterClass, once, rootMargin, threshold]);

    return elementRef;
}

export default useScrollReveal;
