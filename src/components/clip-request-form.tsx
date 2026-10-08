"use client";

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowRight, Film, X } from "lucide-react";
import { submitClipRequest } from "@/app/job-site-studio/actions";
import {
  BASE_PATH,
  CLIPS_BUCKET,
  CLIPS_PUBLISHABLE_KEY,
  CLIPS_SUPABASE_URL,
  MAX_CLIP_MB,
  MAX_CLIPS,
} from "@/lib/job-site-studio";
import { TRADES } from "@/lib/trades";

type Field = "firstName" | "business" | "trade" | "phone" | "email" | "city" | "clips";

const inputClass =
  "mt-1.5 w-full rounded-xl border border-white/15 bg-black/30 px-4 py-3 text-white placeholder:text-white/35 outline-none transition focus:border-[#f0c14b]/70 focus:ring-2 focus:ring-[#f0c14b]/25";

const EXTENSIONS: Record<string, string> = {
  "video/mp4": "mp4",
  "video/quicktime": "mov",
  "video/x-m4v": "m4v",
  "video/webm": "webm",
  "video/3gpp": "3gp",
};

function extensionFor(file: File): string | null {
  if (EXTENSIONS[file.type]) return EXTENSIONS[file.type];
  const ext = file.name.split(".").pop()?.toLowerCase() ?? "";
  return Object.values(EXTENSIONS).includes(ext) ? ext : null;
}

function contentTypeFor(ext: string): string {
  return Object.entries(EXTENSIONS).find(([, e]) => e === ext)?.[0] ?? "video/mp4";
}

// Straight to Supabase Storage with progress, so big phone videos never touch our server.
function uploadClip(path: string, file: File, contentType: string, onProgress: (sent: number) => void) {
  return new Promise<void>((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.open("POST", `${CLIPS_SUPABASE_URL}/storage/v1/object/${CLIPS_BUCKET}/${path}`);
    xhr.setRequestHeader("apikey", CLIPS_PUBLISHABLE_KEY);
    xhr.setRequestHeader("Content-Type", contentType);
    xhr.setRequestHeader("x-upsert", "false");
    xhr.upload.onprogress = (e) => onProgress(e.loaded);
    xhr.onload = () => (xhr.status >= 200 && xhr.status < 300 ? resolve() : reject(new Error(xhr.responseText)));
    xhr.onerror = () => reject(new Error("network"));
    xhr.send(file);
  });
}

function FieldError({ message }: { message?: string }) {
  if (!message) return null;
  return <p className="mt-1.5 text-sm text-rose-300">{message}</p>;
}

export function ClipRequestForm() {
  const router = useRouter();
  const fileInput = useRef<HTMLInputElement>(null);
  const [clips, setClips] = useState<File[]>([]);
  const [errors, setErrors] = useState<Partial<Record<Field, string>>>({});
  const [message, setMessage] = useState("");
  const [progress, setProgress] = useState<number | null>(null);

  function addClips(list: FileList | null) {
    if (!list) return;
    const next = [...clips];
    let problem = "";
    for (const file of Array.from(list)) {
      if (next.length >= MAX_CLIPS) {
        problem = `Up to ${MAX_CLIPS} clips, please.`;
        break;
      }
      if (!extensionFor(file)) problem = `${file.name} isn't a video file.`;
      else if (file.size > MAX_CLIP_MB * 1024 * 1024)
        problem = `${file.name} is over ${MAX_CLIP_MB}MB. Keep clips under 30 seconds, or film in 1080p instead of 4K.`;
      else next.push(file);
    }
    setClips(next);
    setErrors((e) => ({ ...e, clips: problem || undefined }));
    if (fileInput.current) fileInput.current.value = "";
  }

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (progress !== null) return;
    const data = new FormData(event.currentTarget);
    const value = (key: string) => String(data.get(key) ?? "").trim();
    const form = {
      firstName: value("firstName"),
      business: value("business"),
      trade: value("trade"),
      phone: value("phone"),
      email: value("email"),
      city: value("city"),
      company_url: value("company_url"),
    };

    const found: Partial<Record<Field, string>> = {};
    if (!form.firstName) found.firstName = "Please enter your first name.";
    if (!form.business) found.business = "Please enter your business name.";
    if (!form.trade) found.trade = "Pick your trade.";
    const digits = form.phone.replace(/\D/g, "");
    if (digits.length < 10 || digits.length > 15) found.phone = "Please enter a valid phone number.";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) found.email = "Please enter a valid email so we can send your videos.";
    if (clips.length === 0) found.clips = "Add at least one clip.";
    setErrors(found);
    if (Object.keys(found).length > 0) {
      setMessage("Please fix the highlighted fields.");
      return;
    }

    setMessage("");
    const folder = crypto.randomUUID();
    const total = clips.reduce((sum, f) => sum + f.size, 0);
    const sent = clips.map(() => 0);
    setProgress(0);

    try {
      const paths: string[] = [];
      for (const [i, file] of clips.entries()) {
        const ext = extensionFor(file)!;
        const path = `${folder}/${i + 1}.${ext}`;
        await uploadClip(path, file, contentTypeFor(ext), (n) => {
          sent[i] = n;
          setProgress(Math.min(99, Math.round((sent.reduce((a, b) => a + b, 0) / total) * 100)));
        });
        paths.push(path);
      }
      const result = await submitClipRequest({ ...form, clips: paths });
      if ("message" in result) {
        setProgress(null);
        setMessage(result.message);
        return;
      }
      setProgress(100);
      router.push(`${BASE_PATH}/thanks`);
    } catch {
      setProgress(null);
      setMessage(
        "The upload didn't go through. Check your connection and try again, or text your clips to (813) 897 1954.",
      );
    }
  }

  const busy = progress !== null;

  return (
    <form onSubmit={onSubmit} noValidate className="space-y-4 text-left">
      {/* Honeypot: hidden from people, tempting to bots. */}
      <div aria-hidden="true" className="absolute -left-[9999px] h-0 w-0 overflow-hidden">
        <label>
          Company URL
          <input type="text" name="company_url" tabIndex={-1} autoComplete="off" />
        </label>
      </div>

      <div>
        <p className="text-sm font-medium text-white/80">Your clips (up to {MAX_CLIPS}, 10 to 30 seconds each)</p>
        <input
          ref={fileInput}
          type="file"
          accept="video/*"
          multiple
          className="hidden"
          onChange={(e) => addClips(e.target.files)}
          disabled={busy}
        />
        {clips.length > 0 && (
          <ul className="mt-2 space-y-2">
            {clips.map((file, i) => (
              <li
                key={`${file.name}-${i}`}
                className="flex items-center justify-between gap-3 rounded-xl border border-white/10 bg-black/30 px-4 py-2.5 text-sm text-white/80"
              >
                <span className="flex min-w-0 items-center gap-2">
                  <Film size={16} className="shrink-0 text-[#f0c14b]" />
                  <span className="truncate">{file.name}</span>
                  <span className="shrink-0 text-white/45">{(file.size / 1024 / 1024).toFixed(1)}MB</span>
                </span>
                {!busy && (
                  <button
                    type="button"
                    onClick={() => setClips(clips.filter((_, j) => j !== i))}
                    className="text-white/50 hover:text-white"
                    aria-label={`Remove ${file.name}`}
                  >
                    <X size={16} />
                  </button>
                )}
              </li>
            ))}
          </ul>
        )}
        {clips.length < MAX_CLIPS && (
          <button
            type="button"
            onClick={() => fileInput.current?.click()}
            disabled={busy}
            className="mt-2 flex w-full items-center justify-center gap-2 rounded-xl border-2 border-dashed border-[#f0c14b]/50 bg-[#f0c14b]/5 px-4 py-6 font-semibold text-[#f0c14b] transition hover:bg-[#f0c14b]/10"
          >
            <Film size={20} /> {clips.length === 0 ? "Pick clips from your phone" : "Add another clip"}
          </button>
        )}
        <FieldError message={errors.clips} />
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <label className="block text-sm font-medium text-white/80">
          First name
          <input name="firstName" autoComplete="given-name" className={inputClass} placeholder="Mike" disabled={busy} />
          <FieldError message={errors.firstName} />
        </label>
        <label className="block text-sm font-medium text-white/80">
          Business name
          <input name="business" autoComplete="organization" className={inputClass} placeholder="Smith Plumbing" disabled={busy} />
          <FieldError message={errors.business} />
        </label>
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <label className="block text-sm font-medium text-white/80">
          Your trade
          <select name="trade" defaultValue="" className={inputClass} disabled={busy}>
            <option value="" disabled>
              Pick one
            </option>
            {TRADES.map((t) => (
              <option key={t} value={t} className="bg-[#111111]">
                {t}
              </option>
            ))}
          </select>
          <FieldError message={errors.trade} />
        </label>
        <label className="block text-sm font-medium text-white/80">
          City you serve
          <input name="city" autoComplete="address-level2" className={inputClass} placeholder="Orlando" disabled={busy} />
        </label>
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <label className="block text-sm font-medium text-white/80">
          Cell phone
          <input name="phone" type="tel" autoComplete="tel" className={inputClass} placeholder="(407) 555 0123" disabled={busy} />
          <FieldError message={errors.phone} />
        </label>
        <label className="block text-sm font-medium text-white/80">
          Email (your videos go here)
          <input name="email" type="email" autoComplete="email" className={inputClass} placeholder="mike@smithplumbing.com" disabled={busy} />
          <FieldError message={errors.email} />
        </label>
      </div>

      {message && (
        <p className="text-sm text-rose-300" aria-live="polite">
          {message}
        </p>
      )}

      <button type="submit" disabled={busy} className="btn-solid w-full justify-center text-lg disabled:opacity-70">
        {busy ? (progress === 100 ? "Done!" : `Uploading ${progress}%...`) : "Send My Clips"}
        {!busy && <ArrowRight size={18} />}
      </button>
      <p className="text-center text-xs text-white/45">
        Free. No card needed. Your clips are only used to make your videos, and we delete them after.
      </p>
    </form>
  );
}
