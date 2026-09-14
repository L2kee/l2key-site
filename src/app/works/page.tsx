import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { WorksGallery } from "@/components/works-gallery";
import { WORK, WORK_CATEGORIES } from "@/lib/content";

export const metadata: Metadata = {
  title: "Work | EVOGENCY",
  description:
    "Real products, actually shipped: a live CRM platform, a professional desktop tool, and real client work.",
};

export default function WorksPage() {
  return (
    <div className="mx-auto max-w-6xl px-6 pb-20">
      {/* Hero */}
      <section className="flex min-h-[55vh] flex-col items-center justify-center py-20 text-center">
        <div className="glass-strong flex items-center gap-2 rounded-full px-4 py-1.5 text-xs font-medium tracking-wide text-white/80">
          <span className="h-1.5 w-1.5 rounded-full bg-[#f0c14b]" />
          Proof, not promises
        </div>
        <h1 className="mt-8 text-4xl font-bold tracking-tight text-white sm:text-6xl">
          We Build Things
          <br />
          <span className="gradient-text">That Actually Ship</span>
        </h1>
        <p className="mt-6 max-w-2xl text-balance text-white/70 sm:text-lg">
          Not mockups. Not concepts sitting in a folder. Real software,
          live and in production right now.
        </p>
      </section>

      <WorksGallery items={WORK} categories={WORK_CATEGORIES} />

      {/* Value copy */}
      <section className="mx-auto mt-24 max-w-3xl text-center">
        <h2 className="text-2xl font-bold text-white sm:text-3xl">
          The same people who build this
          <br />
          <span className="gradient-text">build your website</span>
        </h2>
        <p className="mt-5 text-white/65">
          Building a real CRM platform that runs a business every day means
          handling data, security, and reliability that cannot break. That is
          the standard we bring to every local business site we build: fast,
          clean, and built to bring you customers.
        </p>
      </section>

      {/* CTA */}
      <section className="mx-auto mt-16 max-w-3xl">
        <div className="glass-strong rounded-3xl p-10 text-center">
          <h2 className="text-2xl font-bold text-white sm:text-3xl">
            Want this kind of work for your business?
          </h2>
          <p className="mx-auto mt-3 max-w-md text-white/65">
            Free, no pressure audit of your current site and Google presence.
            We will tell you exactly what is costing you customers.
          </p>
          <div className="mt-8 flex justify-center">
            <Link href="/contact" className="btn-solid">
              Get your free audit <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
