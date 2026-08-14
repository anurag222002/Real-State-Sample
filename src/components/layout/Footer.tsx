"use client";

import { FormEvent, useState } from "react";
import { site, socials } from "@/lib/data";
import { BronzeButton } from "@/components/ui/BronzeButton";
import { Hoverable } from "@/components/ui/Hoverable";
import { RevealText } from "@/components/motion/RevealText";
import { RevealImage } from "@/components/motion/RevealImage";
import { TransitionLink } from "@/components/transition/TransitionLink";

const frames = [
  "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=900&q=80",
  "https://images.unsplash.com/photo-1580587771525-78b9dba3b914?auto=format&fit=crop&w=900&q=80",
  "https://images.unsplash.com/photo-1497366754035-f200968a6e72?auto=format&fit=crop&w=900&q=80",
];

const offices = [
  { city: "Mumbai", line: "Meridian House, BKC" },
  { city: "Pune", line: "Riverfront Studio, Mundhwa" },
];

export function Footer() {
  const [sent, setSent] = useState(false);

  const onSubmit = (e: FormEvent) => {
    e.preventDefault();
    setSent(true);
  };

  const fieldClass =
    "w-full border-b border-champagne/25 bg-transparent py-3 text-sm text-ivory outline-none transition-colors duration-500 placeholder:text-cream/25 focus:border-bronze";

  return (
    <footer className="relative overflow-hidden border-t border-champagne/15 bg-void">
      <div className="site-offset grid gap-16 py-24 lg:grid-cols-[1fr_0.9fr] lg:py-32">
        <div>
          <p className="text-[11px] uppercase tracking-[0.35em] text-bronze">
            Get in touch
          </p>
          <RevealText
            as="h2"
            className="mt-5 max-w-lg font-display text-3xl uppercase leading-[1.15] text-ivory sm:text-5xl"
          >
            Looking to invest, collaborate or simply know more
          </RevealText>

          <div className="mt-12 grid grid-cols-3 gap-4">
            {frames.map((src, i) => (
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

          <dl className="mt-12 grid gap-6 border-t border-champagne/12 pt-8 sm:grid-cols-2">
            {offices.map((office) => (
              <div key={office.city}>
                <dt className="text-[11px] uppercase tracking-[0.24em] text-bronze">
                  {office.city}
                </dt>
                <dd className="mt-2 text-sm text-cream/55">{office.line}</dd>
              </div>
            ))}
          </dl>
        </div>

        <form onSubmit={onSubmit} className="flex flex-col gap-8">
          {sent ? (
            <div>
              <p className="font-display text-2xl uppercase text-ivory">
                Thank you
              </p>
              <p className="mt-4 max-w-sm text-sm leading-relaxed text-cream/70">
                Your message has reached our team. We will respond within one
                working day.
              </p>
              <p className="mt-8 text-[11px] uppercase tracking-[0.28em] text-bronze">
                {site.name} — {site.tagline}
              </p>
            </div>
          ) : (
            <>
              <Field label="Name" name="name" className={fieldClass} />
              <Field
                label="Phone"
                name="phone"
                type="tel"
                className={fieldClass}
              />
              <Field
                label="E-mail"
                name="email"
                type="email"
                className={fieldClass}
              />
              <Field
                label="Message"
                name="message"
                textarea
                className={fieldClass}
              />
              <p className="text-[11px] leading-relaxed text-cream/45">
                By submitting, you agree to be contacted about {site.name}
                developments.
              </p>
              <BronzeButton magnetic type="submit">
                Send message
              </BronzeButton>
            </>
          )}

          <div className="mt-6 flex flex-wrap gap-5 border-t border-champagne/10 pt-6">
            {socials.map((s) => (
              <Hoverable key={s.name}>
                <a
                  href={s.href}
                  target="_blank"
                  rel="noreferrer"
                  className="link-underline text-[11px] uppercase tracking-[0.24em] text-bronze"
                >
                  {s.name}
                </a>
              </Hoverable>
            ))}
          </div>
        </form>
      </div>

      <div className="site-offset flex flex-col gap-4 border-t border-champagne/10 py-8 sm:flex-row sm:items-center sm:justify-between">
        <p className="max-w-2xl text-[11px] leading-relaxed text-cream/45">
          {site.reraNote}
        </p>
        <Hoverable>
          <TransitionLink
            href="/collection"
            className="link-underline shrink-0 text-[11px] uppercase tracking-[0.22em] text-bronze"
          >
            View the collection
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
  className,
}: {
  label: string;
  name: string;
  type?: string;
  textarea?: boolean;
  className?: string;
}) {
  return (
    <label className="block">
      <span className="mb-1 block text-[11px] uppercase tracking-[0.28em] text-champagne/80">
        {label}
      </span>
      {textarea ? (
        <textarea name={name} rows={3} className={`${className} resize-none`} />
      ) : (
        <input name={name} type={type} className={className} />
      )}
    </label>
  );
}
