"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { MagicCircle, PotionBottle, MagicWand, FloatingStars } from "@/components/MagicElements";

export default function UploadPage() {
  const router = useRouter();

  const [name, setName] = useState("");
  const [author, setAuthor] = useState("");
  const [description, setDescription] = useState("");
  const [textContent, setTextContent] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!textContent.trim() || !name.trim()) {
      setError("Please provide a name and paste your buddy's appearance.");
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      const formData = new FormData();
      formData.append("name", name.trim());
      formData.append("author", author.trim() || "Anonymous");
      formData.append("description", description.trim());
      formData.append("text_content", textContent);

      const res = await fetch("/api/buddies", {
        method: "POST",
        body: formData,
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Upload failed");
      }

      const buddy = await res.json();
      router.push(`/buddy/${buddy.id}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
      setIsSubmitting(false);
    }
  };

  const canSubmit = !!textContent.trim() && !!name.trim();

  return (
    <div className="relative max-w-2xl mx-auto px-6 sm:px-8 py-16 sm:py-24 overflow-hidden">
      {/* Floating sparkles */}
      <FloatingStars />

      {/* Decorative elements */}
      <PotionBottle className="absolute top-12 right-4 w-8 h-14 text-accent opacity-20 rotate-12" variant={1} />
      <PotionBottle className="absolute top-20 right-16 w-6 h-10 text-accent opacity-15 -rotate-6" variant={2} />
      <MagicWand className="absolute top-16 left-2 w-14 text-accent opacity-15 -rotate-45" />

      {/* Header */}
      <div className="relative z-10 text-center mb-14">
        <p className="text-accent text-sm tracking-[0.3em] uppercase mb-4">
          &#x2726; New Entry &#x2726;
        </p>
        <h1 className="font-display text-3xl sm:text-4xl tracking-[0.05em] uppercase font-medium mb-3">
          Summon Your Buddy
        </h1>
        <div className="w-16 h-px bg-accent/40 mx-auto mb-4" />
        <p className="text-muted italic">
          Register a new companion to the enchanted archive.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="relative z-10 space-y-8">
        {/* Text Input Zone */}
        <div className="relative">
          <MagicCircle className="summon-pulse absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[340px] h-[340px] text-accent pointer-events-none" />

          <div className="relative z-10 border border-dashed border-card-border p-2">
            <div className="bg-card-inner p-4">
              <p className="text-accent text-lg mb-3 text-center">&#x2328;</p>
              <p className="text-card-text/60 text-xs font-display tracking-wider uppercase mb-4 text-center">
                Paste your buddy&apos;s ASCII appearance
              </p>
              <textarea
                value={textContent}
                onChange={(e) => setTextContent(e.target.value)}
                placeholder={"Paste your CLI buddy here...\n\n   /\\_/\\\n  ( o.o )\n   > ^ <"}
                rows={20}
                className="input-field w-full px-4 py-3 bg-surface/30 border border-card-border text-sm
                           font-mono leading-relaxed placeholder:text-muted/50 resize-y whitespace-pre min-h-[320px]"
              />
              <p className="text-card-text/30 text-[14px] italic mt-2 text-center">
                Box-drawing characters (─ ╰ │ ╭ ╮ ╯) will be automatically removed
              </p>
            </div>
          </div>
        </div>

        {/* Name */}
        <div>
          <label htmlFor="name" className="block font-display text-xs tracking-[0.2em] uppercase text-muted mb-3">
            Companion Name <span className="text-accent">*</span>
          </label>
          <input
            id="name"
            type="text"
            required
            maxLength={60}
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Gravy the Capybara"
            className="input-field w-full px-4 py-3 bg-surface/50 border border-card-border text-sm italic
                       placeholder:text-muted/30"
          />
        </div>

        {/* Author */}
        <div>
          <label htmlFor="author" className="block font-display text-xs tracking-[0.2em] uppercase text-muted mb-3">
            Wizard Name
          </label>
          <input
            id="author"
            type="text"
            maxLength={40}
            value={author}
            onChange={(e) => setAuthor(e.target.value)}
            placeholder="Anonymous"
            className="input-field w-full px-4 py-3 bg-surface/50 border border-card-border text-sm italic
                       placeholder:text-muted/30"
          />
        </div>

        {/* Description */}
        <div>
          <label htmlFor="description" className="block font-display text-xs tracking-[0.2em] uppercase text-muted mb-3">
            Lore
          </label>
          <textarea
            id="description"
            maxLength={500}
            rows={3}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Tell the tale of your companion..."
            className="input-field w-full px-4 py-3 bg-surface/50 border border-card-border text-sm italic
                       placeholder:text-muted/30 resize-none"
          />
        </div>

        {/* Error */}
        {error && (
          <div className="border border-accent/30 bg-accent-light px-5 py-3">
            <p className="text-accent text-sm italic">{error}</p>
          </div>
        )}

        {/* Submit */}
        <button
          type="submit"
          disabled={isSubmitting || !canSubmit}
          className="btn-magic w-full py-3.5 bg-accent text-background font-display text-xs tracking-[0.2em] uppercase
                     disabled:opacity-30 disabled:cursor-not-allowed transition-all duration-300"
        >
          {isSubmitting ? "Casting..." : "Register Companion"}
        </button>
      </form>
    </div>
  );
}
