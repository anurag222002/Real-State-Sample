"use client";

import { FormEvent, useState } from "react";
import { site, socials } from "@/lib/data";
import { ChampagneButton } from "@/components/ui/ChampagneButton";
import { Hoverable } from "@/components/ui/Hoverable";
import { RevealText } from "@/components/motion/RevealText";
import { RevealImage } from "@/components/motion/RevealImage";
import { TransitionLink } from "@/components/transition/TransitionLink";

const slides = [
  "https://images.unsplash.com/photo-1572116469696-31de0f17cc34?auto=format&fit=crop&w=900&q=80",
  "https://images.unsplash.com/photo-1559339352-11d035aa65de?auto=format&fit=crop&w=900&q=80",
  "https://images.unsplash.com/photo-1514933651103-005eec06c04b?auto=format&fit=crop&w=900&q=80",
];

export function Footer() {
  const [sent, setSent] = useState(false);

  const onSubmit = (e: FormEvent) => {
    e.preventDefault();
    setSent(true);
  };

  return (
    <footer className="relative overflow-hidden border-t border-champagne/15 bg-void">
      <div className="site-offset grid gap-16 py-24 lg:grid-cols-[1fr_0.9fr] lg:py-32">
        <div>
          <p className="text-[11px] uppercase tracking-[0.35em] text-champagne">
            Feedback
          </p>
          <RevealText
            as="h2"
            className="mt-5 font-display text-4xl font-light italic text-ivory sm:text-6xl"
          >
            it&apos;s time to get acquainted
          </RevealText>

          <div className="mt-14 grid grid-cols-3 gap-4">
            {slides.map((src, i) => (
              <RevealImage
                key={src}
                src={src}
                alt=""
                sizes="20vw"
                parallax={40 + i * 26}
                className="aspect-[3/4] w-full opacity-80"
              />
            ))}
          </div>
        </div>

        <form onSubmit={onSubmit} className="flex flex-col gap-8">
          {sent ? (
            <div>
              <p className="font-display text-3xl italic text-ivory">Thanks</p>
              <p className="mt-3 max-w-sm text-sm leading-relaxed text-cream/70">
                Your application has been successfully submitted. We will
                contact you as soon as possible to clarify the details.
              </p>
              <p className="mt-8 text-[11px] uppercase tracking-[0.28em] text-champagne">
                With love, TIMELESS
              </p>
            </div>
          ) : (
            <>
              <Field label="Name" name="name" />
              <Field label="E-mail" name="email" type="email" />
              <Field label="Message" name="message" textarea />
              <p className="text-[11px] leading-relaxed text-cream/45">
                Clicking the button, you agree with privacy policy
              </p>
              <ChampagneButton magnetic type="submit">
                Send
              </ChampagneButton>
            </>
          )}

          <div className="mt-6 flex flex-wrap gap-5 border-t border-champagne/10 pt-6">
            {socials.map((s) => (
              <Hoverable key={s.name}>
                <a
                  href={s.href}
                  target="_blank"
                  rel="noreferrer"
                  className="link-underline text-[11px] uppercase tracking-[0.24em] text-champagne"
                >
                  {s.name}
                </a>
              </Hoverable>
            ))}
          </div>
        </form>
      </div>

      <div className="site-offset flex flex-col gap-4 border-t border-champagne/10 py-8 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-[11px] uppercase tracking-[0.22em] text-cream/50">
          {site.ageNote}
        </p>
        <Hoverable>
          <TransitionLink
            href="/locations"
            className="link-underline text-[11px] uppercase tracking-[0.22em] text-champagne"
          >
            Locations on map
          </TransitionLink>
        </Hoverable>
      </div>
    </footer>
  );
}

function Field({
  label,
  name,
  type = "text",
  textarea,
}: {
  label: string;
  name: string;
  type?: string;
  textarea?: boolean;
}) {
  const cls =
    "w-full border-b border-champagne/25 bg-transparent py-3 text-sm text-ivory outline-none transition-colors duration-500 placeholder:text-cream/25 focus:border-champagne";

  return (
    <label className="block">
      <span className="mb-1 block text-[11px] uppercase tracking-[0.28em] text-champagne/80">
        {label}
      </span>
      {textarea ? (
        <textarea name={name} rows={3} className={`${cls} resize-none`} />
      ) : (
        <input name={name} type={type} className={cls} />
      )}
    </label>
  );
}
