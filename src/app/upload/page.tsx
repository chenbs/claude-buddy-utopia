"use client";

import { useState, useRef, useCallback } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { MagicCircle, PotionBottle, MagicWand, FloatingStars } from "@/components/MagicElements";

type UploadMode = "image" | "text";

export default function UploadPage() {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [mode, setMode] = useState<UploadMode>("image");
  const [name, setName] = useState("");
  const [author, setAuthor] = useState("");
  const [description, setDescription] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [textContent, setTextContent] = useState("");
  const [isDragging, setIsDragging] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleFile = useCallback((f: File) => {
    const allowedTypes = ["image/png", "image/jpeg", "image/gif", "image/webp"];
    if (!allowedTypes.includes(f.type)) {
      setError("Please upload a PNG, JPEG, GIF, or WebP image.");
      return;
    }
    if (f.size > 5 * 1024 * 1024) {
      setError("Image must be under 5MB.");
      return;
    }
    setError(null);
    setFile(f);
    const reader = new FileReader();
    reader.onloadend = () => setPreview(reader.result as string);
    reader.readAsDataURL(f);
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragging(false);
      const f = e.dataTransfer.files[0];
      if (f) handleFile(f);
    },
    [handleFile]
  );

  const handleModeSwitch = (newMode: UploadMode) => {
    setMode(newMode);
    setError(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (mode === "image" && (!file || !name.trim())) {
      setError("Please provide a name and an image.");
      return;
    }
    if (mode === "text" && (!textContent.trim() || !name.trim())) {
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

      if (mode === "image" && file) {
        formData.append("image", file);
      } else if (mode === "text") {
        formData.append("text_content", textContent);
      }

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

  const canSubmit =
    mode === "image"
      ? !!file && !!name.trim()
      : !!textContent.trim() && !!name.trim();

  return (
    <div className="relative max-w-lg mx-auto px-6 sm:px-8 py-16 sm:py-24 overflow-hidden">
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
        {/* Mode Switch */}
        <div className="flex justify-center gap-2">
          <button
            type="button"
            onClick={() => handleModeSwitch("image")}
            className={`px-5 py-2.5 font-display text-xs tracking-[0.15em] uppercase border transition-all duration-300 ${
              mode === "image"
                ? "bg-accent text-background border-accent"
                : "border-card-border text-muted hover:border-accent/50 hover:text-accent"
            }`}
          >
            &#x1F5BC; Portrait
          </button>
          <button
            type="button"
            onClick={() => handleModeSwitch("text")}
            className={`px-5 py-2.5 font-display text-xs tracking-[0.15em] uppercase border transition-all duration-300 ${
              mode === "text"
                ? "bg-accent text-background border-accent"
                : "border-card-border text-muted hover:border-accent/50 hover:text-accent"
            }`}
          >
            &#x2328; ASCII Art
          </button>
        </div>

        {/* Image Upload Zone */}
        {mode === "image" && (
          <div className="relative">
            {/* Magic circle behind the drop zone */}
            <MagicCircle className="summon-pulse absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[340px] h-[340px] text-accent pointer-events-none" />

            <div
              onDragOver={(e) => {
                e.preventDefault();
                setIsDragging(true);
              }}
              onDragLeave={() => setIsDragging(false)}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
              className={`
                relative z-10 border border-dashed p-2 cursor-pointer transition-all duration-300
                ${
                  isDragging
                    ? "border-accent bg-accent-light drop-zone-active"
                    : "border-card-border hover:border-accent/50"
                }
              `}
            >
              <input
                ref={fileInputRef}
                type="file"
                accept="image/png,image/jpeg,image/gif,image/webp"
                className="hidden"
                onChange={(e) => {
                  const f = e.target.files?.[0];
                  if (f) handleFile(f);
                }}
              />

              <div className="bg-card-inner">
                {preview ? (
                  <div className="flex flex-col items-center gap-4 p-8">
                    <div className="relative w-48 h-48 overflow-hidden border border-card-border/20">
                      <Image
                        src={preview}
                        alt="Preview"
                        fill
                        className="object-cover"
                      />
                    </div>
                    <p className="text-card-text/50 text-xs italic">
                      Click or drag to replace
                    </p>
                  </div>
                ) : (
                  <div className="py-14 text-center">
                    <p className="text-accent text-2xl mb-3">&#x2726;</p>
                    <p className="text-card-text text-sm font-display tracking-wider uppercase mb-2">
                      Drop your buddy&apos;s portrait here
                    </p>
                    <p className="text-card-text/40 text-xs italic">
                      PNG, JPEG, GIF, WebP &mdash; max 5 MB
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Text Input Zone */}
        {mode === "text" && (
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
                  rows={12}
                  className="input-field w-full px-4 py-3 bg-surface/30 border border-card-border text-sm
                             font-mono leading-relaxed placeholder:text-muted/20 resize-none whitespace-pre"
                />
                <p className="text-card-text/30 text-[10px] italic mt-2 text-center">
                  Box-drawing characters (─ ╰ │ ╭ ╮ ╯) will be automatically removed
                </p>
              </div>
            </div>
          </div>
        )}

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
