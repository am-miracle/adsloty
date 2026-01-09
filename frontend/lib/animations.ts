import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export const fadeInUp = (
  element: gsap.TweenTarget,
  options?: gsap.TweenVars,
) => {
  return gsap.from(element, {
    y: 50,
    opacity: 0,
    duration: 1,
    ease: "power3.out",
    ...options,
  });
};

export const fadeInUpScroll = (
  element: gsap.TweenTarget,
  trigger?: gsap.DOMTarget,
) => {
  return gsap.fromTo(
    element,
    { y: 50, autoAlpha: 0 },
    {
      y: 0,
      autoAlpha: 1,
      duration: 1,
      ease: "power3.out",
      scrollTrigger: {
        trigger: (trigger || element) as gsap.DOMTarget,
        start: "top 85%",
        once: true,
      },
    },
  );
};

export const staggerFadeIn = (
  elements: gsap.TweenTarget,
  trigger?: gsap.DOMTarget,
) => {
  return gsap.fromTo(
    elements,
    { y: 60, autoAlpha: 0 },
    {
      y: 0,
      autoAlpha: 1,
      duration: 0.8,
      stagger: 0.15,
      ease: "power3.out",
      scrollTrigger: {
        trigger: trigger as gsap.DOMTarget,
        start: "top 85%",
        once: true,
      },
    },
  );
};

export const scaleIn = (
  elements: gsap.TweenTarget,
  trigger?: gsap.DOMTarget,
) => {
  return gsap.fromTo(
    elements,
    { scale: 0.85, autoAlpha: 0 },
    {
      scale: 1,
      autoAlpha: 1,
      duration: 0.6,
      stagger: 0.1,
      ease: "back.out(1.7)",
      scrollTrigger: {
        trigger: trigger as gsap.DOMTarget,
        start: "top 85%",
        once: true,
      },
    },
  );
};

export const floatingAnimation = (
  element: gsap.TweenTarget,
  yOffset: number = -20,
  duration: number = 2,
) => {
  return gsap.to(element, {
    y: yOffset,
    duration,
    repeat: -1,
    yoyo: true,
    ease: "power1.inOut",
  });
};

export const rotatingFloat = (
  element: gsap.TweenTarget,
  yOffset: number = -15,
  rotation: number = 5,
  duration: number = 3,
) => {
  return gsap.to(element, {
    y: yOffset,
    rotation,
    duration,
    repeat: -1,
    yoyo: true,
    ease: "power1.inOut",
  });
};

export const slideInFromLeft = (
  elements: gsap.TweenTarget,
  trigger?: gsap.DOMTarget,
  options?: gsap.TweenVars,
) => {
  return gsap.from(elements, {
    scrollTrigger: {
      trigger: trigger as gsap.DOMTarget,
      start: "top 75%",
    },
    x: -60,
    opacity: 0,
    duration: 0.8,
    stagger: 0.2,
    ease: "power3.out",
    ...options,
  });
};

export const slideInFromRight = (
  elements: gsap.TweenTarget,
  trigger?: gsap.DOMTarget,
  options?: gsap.TweenVars,
) => {
  return gsap.from(elements, {
    scrollTrigger: {
      trigger: trigger as gsap.DOMTarget,
      start: "top 75%",
    },
    x: 60,
    opacity: 0,
    duration: 0.8,
    stagger: 0.2,
    ease: "power3.out",
    ...options,
  });
};
