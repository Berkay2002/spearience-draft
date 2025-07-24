"use client";

import { IconArrowLeft, IconArrowRight } from "@tabler/icons-react";
import { motion, AnimatePresence } from "motion/react";

import { useEffect, useState } from "react";

type Testimonial = {
  quote: string;
  name: string;
  designation: string;
  src: string;
};
export const AnimatedTestimonials = ({
  testimonials,
  autoplay = false,
}: {
  testimonials: Testimonial[];
  autoplay?: boolean;
}) => {
  const [active, setActive] = useState(0);

  // Safety check: if testimonials is empty or undefined, return null or loading state
  if (!testimonials || testimonials.length === 0) {
    return (
      <div className="mx-auto max-w-md px-4 py-20 font-sans antialiased md:max-w-5xl md:px-8 lg:px-16 relative z-50">
        <div className="relative grid grid-cols-1 gap-24 md:grid-cols-2">
          <div className="h-96 w-full md:h-[400px] lg:h-[450px] bg-gray-100 dark:bg-neutral-800 rounded-3xl animate-pulse" />
          <div className="flex flex-col justify-between py-4">
            <div>
              <div className="h-8 bg-gray-100 dark:bg-neutral-800 rounded animate-pulse mb-2" />
              <div className="h-6 bg-gray-100 dark:bg-neutral-800 rounded animate-pulse mb-8 w-3/4" />
              <div className="space-y-2">
                <div className="h-4 bg-gray-100 dark:bg-neutral-800 rounded animate-pulse" />
                <div className="h-4 bg-gray-100 dark:bg-neutral-800 rounded animate-pulse w-5/6" />
                <div className="h-4 bg-gray-100 dark:bg-neutral-800 rounded animate-pulse w-4/5" />
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Ensure active index is within bounds
  const safeActive = Math.min(active, testimonials.length - 1);

  const handleNext = () => {
    setActive((prev) => (prev + 1) % testimonials.length);
  };

  const handlePrev = () => {
    setActive((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  };

  const isActive = (index: number) => {
    return index === safeActive;
  };

  useEffect(() => {
    if (autoplay && testimonials.length > 0) {
      const interval = setInterval(handleNext, 5000);
      return () => clearInterval(interval);
    }
  }, [autoplay, testimonials.length]);

  const randomRotateY = () => {
    return Math.floor(Math.random() * 21) - 10;
  };
  return (
    <div className="mx-auto max-w-md px-4 py-20 font-sans antialiased md:max-w-5xl md:px-8 lg:px-16 relative z-50">
      <div className="relative grid grid-cols-1 gap-24 md:grid-cols-2">
        <div>
          <div className="relative h-96 w-full md:h-[400px] lg:h-[450px]">
            <AnimatePresence>
              {testimonials.map((testimonial, index) => (
                <motion.div
                  key={testimonial.src}
                  initial={{
                    opacity: 0,
                    scale: 0.9,
                    z: -100,
                    rotate: randomRotateY(),
                  }}
                  animate={{
                    opacity: isActive(index) ? 1 : 0.7,
                    scale: isActive(index) ? 1 : 0.95,
                    z: isActive(index) ? 0 : -100,
                    rotate: isActive(index) ? 0 : randomRotateY(),
                    zIndex: isActive(index)
                      ? 40
                      : testimonials.length + 2 - index,
                    y: isActive(index) ? [0, -80, 0] : 0,
                  }}
                  exit={{
                    opacity: 0,
                    scale: 0.9,
                    z: 100,
                    rotate: randomRotateY(),
                  }}
                  transition={{
                    duration: 0.4,
                    ease: "easeInOut",
                  }}
                  className="absolute inset-0 origin-bottom"
                >
                  <img
                    src={testimonial.src}
                    alt={testimonial.name}
                    width={500}
                    height={500}
                    draggable={false}
                    className="h-full w-full rounded-3xl object-cover object-center"
                  />
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </div>
        <div className="flex flex-col justify-between py-4">
          <motion.div
            key={safeActive}
            initial={{
              y: 20,
              opacity: 0,
            }}
            animate={{
              y: 0,
              opacity: 1,
            }}
            exit={{
              y: -20,
              opacity: 0,
            }}
            transition={{
              duration: 0.2,
              ease: "easeInOut",
            }}
          >
            <h3 className="text-3xl font-bold text-black dark:text-white md:text-4xl">
              {testimonials[safeActive]?.name || 'Loading...'}
            </h3>
            <p className="text-base text-gray-500 dark:text-neutral-500 md:text-lg">
              {testimonials[safeActive]?.designation || 'Loading...'}
            </p>
            <motion.p className="mt-8 text-xl text-gray-500 dark:text-neutral-300 md:text-2xl leading-relaxed">
              {(testimonials[safeActive]?.quote || '').split(" ").map((word, index) => (
                <motion.span
                  key={index}
                  initial={{
                    filter: "blur(10px)",
                    opacity: 0,
                    y: 5,
                  }}
                  animate={{
                    filter: "blur(0px)",
                    opacity: 1,
                    y: 0,
                  }}
                  transition={{
                    duration: 0.2,
                    ease: "easeInOut",
                    delay: 0.02 * index,
                  }}
                  className="inline-block"
                >
                  {word}&nbsp;
                </motion.span>
              ))}
            </motion.p>
          </motion.div>
          <div className="flex gap-6 pt-12 md:pt-0">
            <button
              onClick={handlePrev}
              className="group/button flex h-10 w-10 items-center justify-center rounded-full bg-gray-100 dark:bg-neutral-800 hover:bg-gray-200 dark:hover:bg-neutral-700 transition-colors"
            >
              <IconArrowLeft className="h-6 w-6 text-black transition-transform duration-300 group-hover/button:rotate-12 dark:text-neutral-400" />
            </button>
            <button
              onClick={handleNext}
              className="group/button flex h-10 w-10 items-center justify-center rounded-full bg-gray-100 dark:bg-neutral-800 hover:bg-gray-200 dark:hover:bg-neutral-700 transition-colors"
            >
              <IconArrowRight className="h-6 w-6 text-black transition-transform duration-300 group-hover/button:-rotate-12 dark:text-neutral-400" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
