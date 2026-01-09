"use client";

import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import { Quote, Star } from "lucide-react";
import { fadeInUpScroll, scaleIn, staggerFadeIn } from "@/lib/animations";

const testimonials = [
  {
    name: "Sarah Johnson",
    role: "Tech Newsletter Creator",
    subscribers: "45K subscribers",
    quote:
      "Adsloty transformed how I monetize my newsletter. I went from chasing sponsors to having them book slots automatically. Earned $12K in the first month!",
    avatar: "SJ",
    rating: 5,
  },
  {
    name: "Michael Chen",
    role: "Marketing Director",
    company: "TechStart Inc",
    quote:
      "Finding the right newsletters for our campaigns was always a challenge. Adsloty made it ridiculously easy. We've booked 20+ campaigns and the ROI is incredible.",
    avatar: "MC",
    rating: 5,
  },
  {
    name: "Emma Williams",
    role: "Finance Newsletter",
    subscribers: "120K subscribers",
    quote:
      "The automated payout system is a game-changer. I focus on creating content while Adsloty handles all the business logistics. Best decision I made for my newsletter.",
    avatar: "EW",
    rating: 5,
  },
];

const stats = [
  { value: "10,000+", label: "Active Newsletters" },
  { value: "$2M+", label: "Paid to Creators" },
  { value: "50,000+", label: "Ads Booked" },
  { value: "98%", label: "Satisfaction Rate" },
];

export function SocialProof() {
  const headingRef = useRef<HTMLDivElement>(null);
  const statsRef = useRef<HTMLDivElement>(null);
  const testimonialsRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      fadeInUpScroll(headingRef.current);

      const statElements = statsRef.current?.querySelectorAll(".stat-card");

      if (statElements && statElements.length) {
        scaleIn(statElements, statsRef.current);
      }

      const testimonialCards =
        testimonialsRef.current?.querySelectorAll(".testimonial-card");

      if (testimonialCards && testimonialCards.length) {
        staggerFadeIn(testimonialCards, testimonialsRef.current);
      }
    },
    { scope: testimonialsRef },
  );

  return (
    <section className="section-padding bg-background-light dark:bg-background-dark relative overflow-hidden">
      <div className="absolute top-1/4 right-0 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
      <div className="absolute bottom-1/4 left-0 w-80 h-80 bg-purple-600/5 rounded-full blur-3xl" />

      <div className="container-padding mx-auto max-w-7xl relative z-10">
        <div ref={headingRef} className="text-center mb-16 space-y-4">
          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold">
            Trusted by <span className="gradient-text">Thousands</span>
          </h2>
          <p className="text-lg text-text-secondary max-w-3xl mx-auto">
            Join the growing community of newsletter creators and sponsors who
            are already seeing results.
          </p>
        </div>

        <div
          ref={statsRef}
          className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-20"
        >
          {stats.map((stat, index) => (
            <div
              key={index}
              className="stat-card glass-strong rounded-2xl p-8 text-center border-2 border-primary/10 hover:border-primary/30 transition-all"
            >
              <div className="text-4xl md:text-5xl font-bold gradient-text mb-2">
                {stat.value}
              </div>
              <div className="text-sm text-text-secondary">{stat.label}</div>
            </div>
          ))}
        </div>

        <div ref={testimonialsRef} className="grid md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <div
              key={index}
              className="testimonial-card glass-strong rounded-2xl p-8 border-2 border-primary/10 hover:border-primary/30 transition-all group hover:shadow-lg hover:shadow-primary/10"
            >
              <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-6 group-hover:bg-primary/20 transition-colors">
                <Quote className="w-6 h-6 text-primary" />
              </div>

              <div className="flex gap-1 mb-4">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <Star key={i} className="w-5 h-5 fill-primary text-primary" />
                ))}
              </div>

              <p className="text-text-secondary leading-relaxed mb-6">
                &quot;{testimonial.quote}&quot;
              </p>

              <div className="flex items-center gap-4 pt-4 border-t border-border">
                <div className="w-12 h-12 rounded-full bg-linear-to-br from-primary to-purple-600 flex items-center justify-center text-white font-bold">
                  {testimonial.avatar}
                </div>
                <div>
                  <div className="font-semibold text-white">
                    {testimonial.name}
                  </div>
                  <div className="text-sm text-text-secondary">
                    {testimonial.role}
                  </div>
                  {testimonial.subscribers && (
                    <div className="text-xs text-text-secondary">
                      {testimonial.subscribers}
                    </div>
                  )}
                  {testimonial.company && (
                    <div className="text-xs text-text-secondary">
                      {testimonial.company}
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-20 text-center">
          <p className="text-text-secondary mb-8">
            Featured in and trusted by leading publications
          </p>
          <div className="glass-strong rounded-2xl p-8 flex flex-wrap items-center justify-center gap-12">
            {[1, 2, 3, 4, 5].map((i) => (
              <div
                key={i}
                className="w-32 h-12 rounded-lg bg-linear-to-br from-primary/10 to-purple-600/10 flex items-center justify-center"
              >
                <span className="text-text-secondary text-xs">Logo {i}</span>
              </div>
            ))}
          </div>
          <p className="text-text-secondary text-xs mt-4">
            Image: Add logos of well-known newsletters or publications using
            Adsloty (Product Hunt, TechCrunch, etc.)
          </p>
        </div>
      </div>
    </section>
  );
}
