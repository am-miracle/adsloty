import gsap from "gsap";

export const animateStatsCards = (cards: HTMLElement[]) => {
  gsap.fromTo(
    cards,
    {
      opacity: 0,
      y: 30,
      scale: 0.95,
    },
    {
      opacity: 1,
      y: 0,
      scale: 1,
      duration: 0.6,
      stagger: 0.1,
      ease: "power3.out",
    }
  );
};

export const animateCardHover = (card: HTMLElement, isHovering: boolean) => {
  gsap.to(card, {
    y: isHovering ? -4 : 0,
    scale: isHovering ? 1.02 : 1,
    duration: 0.3,
    ease: "power2.out",
  });
};

export const animateAdRequestCard = (card: HTMLElement, index: number) => {
  gsap.fromTo(
    card,
    {
      opacity: 0,
      x: -50,
      rotateY: -15,
    },
    {
      opacity: 1,
      x: 0,
      rotateY: 0,
      duration: 0.8,
      delay: index * 0.15,
      ease: "power3.out",
    }
  );
};

export const animateAvailabilitySlots = (slots: HTMLElement[]) => {
  gsap.fromTo(
    slots,
    {
      opacity: 0,
      x: 50,
    },
    {
      opacity: 1,
      x: 0,
      duration: 0.6,
      stagger: 0.1,
      ease: "power2.out",
    }
  );
};

export const animateTableRows = (rows: HTMLElement[]) => {
  gsap.fromTo(
    rows,
    {
      opacity: 0,
      x: -20,
    },
    {
      opacity: 1,
      x: 0,
      duration: 0.5,
      stagger: 0.05,
      ease: "power2.out",
    }
  );
};

export const animateButtonClick = (button: HTMLElement) => {
  gsap.to(button, {
    scale: 0.95,
    duration: 0.1,
    yoyo: true,
    repeat: 1,
    ease: "power2.inOut",
  });
};

export const animateNumberCounter = (
  element: HTMLElement,
  start: number,
  end: number,
  duration: number = 1.5
) => {
  const obj = { value: start };
  gsap.to(obj, {
    value: end,
    duration: duration,
    ease: "power2.out",
    onUpdate: () => {
      if (element) {
        const value = Math.round(obj.value);
        element.textContent = value.toLocaleString();
      }
    },
  });
};

export const animatePercentageCounter = (
  element: HTMLElement,
  start: number,
  end: number,
  duration: number = 1.5
) => {
  const obj = { value: start };
  gsap.to(obj, {
    value: end,
    duration: duration,
    ease: "power2.out",
    onUpdate: () => {
      if (element) {
        element.textContent = `${obj.value.toFixed(1)}%`;
      }
    },
  });
};

export const animateProgressBar = (bar: HTMLElement, percentage: number) => {
  gsap.fromTo(
    bar,
    {
      width: "0%",
    },
    {
      width: `${percentage}%`,
      duration: 1,
      ease: "power2.out",
    }
  );
};

export const animateNotification = (notification: HTMLElement) => {
  const timeline = gsap.timeline();

  timeline
    .fromTo(
      notification,
      {
        opacity: 0,
        y: -20,
        scale: 0.9,
      },
      {
        opacity: 1,
        y: 0,
        scale: 1,
        duration: 0.4,
        ease: "back.out(1.7)",
      }
    )
    .to(notification, {
      opacity: 0,
      y: -20,
      duration: 0.3,
      delay: 3,
      ease: "power2.in",
    });
};

export const animateFadeIn = (element: HTMLElement, delay: number = 0) => {
  gsap.fromTo(
    element,
    {
      opacity: 0,
      y: 20,
    },
    {
      opacity: 1,
      y: 0,
      duration: 0.6,
      delay: delay,
      ease: "power2.out",
    }
  );
};

export const shimmerAnimation = (element: HTMLElement) => {
  gsap.to(element, {
    backgroundPosition: "200% center",
    duration: 1.5,
    repeat: -1,
    ease: "linear",
  });
};
