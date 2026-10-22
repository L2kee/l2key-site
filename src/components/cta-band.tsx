import Link from "next/link";
import { ArrowRight } from "lucide-react";

// href points a page at its own funnel (/start/<slug>). Pages without a
// matching funnel keep the free audit at /contact.
export function CtaBand({
  text = "Get your free site audit",
  href = "/contact",
}: {
  text?: string;
  href?: string;
}) {
  return (
    <div className="flex justify-center py-4">
      <Link href={href} className="btn-solid">
        {text} <ArrowRight size={16} />
      </Link>
    </div>
  );
}
