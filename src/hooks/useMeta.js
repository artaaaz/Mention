import { useEffect } from "react";

const DEFAULT_DESCRIPTION =
  "Mention adalah agensi kreatif: strategi brand, desain, konten, dan web yang bikin brand kamu layak di-mention.";

/** Atur <title> dan meta description per halaman. */
export function useMeta(title, description = DEFAULT_DESCRIPTION) {
  useEffect(() => {
    document.title = title ? `${title} — Mention` : "Mention — Agensi Kreatif";
    document.querySelector('meta[name="description"]')?.setAttribute("content", description);
  }, [title, description]);
}
