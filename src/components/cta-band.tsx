import Link from "next/link";
import { ArrowRight } from "lucide-react";

export function CtaBand({
  text = "Get your free site audit",
}: {
  text?: string;
}) {
  return (
    <div className="flex justify-center py-4">
      <Link href="/contact" className="btn-solid">
        {text} <ArrowRight size={16} />
      </Link>
    </div>
  );
}
