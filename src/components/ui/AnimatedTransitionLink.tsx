'use client';

import { useCallback, useRef, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { AnimatePresence, motion } from 'framer-motion';

type AnimatedTransitionLinkProps = {
  href: string;
  children: React.ReactNode;
  className?: string;
  animationSrc?: string;
  prefetch?: boolean;
  onClick?: React.MouseEventHandler<HTMLAnchorElement>;
};

const DEFAULT_ANIMATION_SRC = '/animations/loading.mp4';

function shouldUseNativeNavigation(
  event: React.MouseEvent<HTMLAnchorElement>,
  href: string,
) {
  return (
    event.metaKey ||
    event.ctrlKey ||
    event.shiftKey ||
    event.altKey ||
    event.currentTarget.target === '_blank' ||
    href.startsWith('#') ||
    href.startsWith('mailto:') ||
    href.startsWith('tel:') ||
    /^https?:\/\//.test(href)
  );
}

function getVideoType(src: string) {
  if (src.endsWith('.webm')) return 'video/webm';
  if (src.endsWith('.mov')) return 'video/quicktime';
  return 'video/mp4';
}

export function AnimatedTransitionLink({
  href,
  children,
  className,
  animationSrc = DEFAULT_ANIMATION_SRC,
  prefetch,
  onClick,
}: AnimatedTransitionLinkProps) {
  const router = useRouter();
  const [isTransitioning, setIsTransitioning] = useState(false);
  const hasNavigatedRef = useRef(false);

  const finishNavigation = useCallback(() => {
    if (hasNavigatedRef.current) return;

    hasNavigatedRef.current = true;
    router.push(href);
  }, [href, router]);

  const handleClick: React.MouseEventHandler<HTMLAnchorElement> = (event) => {
    onClick?.(event);

    if (
      event.defaultPrevented ||
      isTransitioning ||
      shouldUseNativeNavigation(event, href)
    ) {
      return;
    }

    event.preventDefault();
    hasNavigatedRef.current = false;
    setIsTransitioning(true);
  };

  const handleVideoError = () => {
    window.setTimeout(finishNavigation, 700);
  };

  return (
    <>
      <Link
        href={href}
        prefetch={prefetch}
        onClick={handleClick}
        className={className}
      >
        {children}
      </Link>

      <AnimatePresence>
        {isTransitioning && (
          <motion.div
            role="status"
            aria-live="polite"
            aria-label="Memuat halaman"
            className="fixed inset-0 z-[9999] flex items-center justify-center overflow-hidden bg-slate-950"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.18, ease: 'easeOut' }}
          >
            <motion.div
              className="relative flex h-full w-full items-center justify-center px-6"
              initial={{ scale: 0.96, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.28, ease: 'easeOut' }}
            >
              <Image
                src="/logo-full.png"
                alt=""
                width={240}
                height={96}
                className="absolute h-24 w-auto opacity-30"
                aria-hidden="true"
              />
              <video
                className="relative z-10 max-h-[70vh] w-[min(84vw,560px)] object-contain pointer-events-none"
                autoPlay
                muted
                playsInline
                preload="auto"
                onEnded={finishNavigation}
                onError={handleVideoError}
                aria-hidden="true"
              >
                <source src={animationSrc} type={getVideoType(animationSrc)} />
              </video>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
