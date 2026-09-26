import type { Metadata } from "next";
import { ClassNotesApp } from "@/components/class-notes/class-notes-app";

// Personal study tool: records an online class, live-transcribes it, and
// keeps timestamped notes. All data lives in the browser (IndexedDB), so
// the page is kept out of search results and the sitemap.

export const metadata: Metadata = {
  title: "Class Notes | Record, Transcribe & Take Notes",
  description: "Record an online class, get a live transcript, and take timestamped notes in your browser.",
  alternates: { canonical: "/class-notes" },
  robots: { index: false, follow: false },
};

export default function ClassNotesPage() {
  return <ClassNotesApp />;
}
