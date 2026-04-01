"use client";

import { useState, useRef, useCallback } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";

export default function UploadPage() {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [name, setName] = useState("");
  const [author, setAuthor] = useState("");
  const [description, setDescription] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file || !name.trim()) {
      setError("Please provide a name and an image.");
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      const formData = new FormData();
      formData.append("name", name.trim());
      formData.append("author", author.trim() || "Anonymous");
      formData.append("description", description.trim());
      formData.append("image", file);

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

  return (
    <div className="max-w-lg mx-auto px-6 sm:px-8 py-20 sm:py-28">
      <h1 className="font-display text-4xl font-light tracking-tight text-center mb-3">
        Upload
      </h1>
      <p className="text-muted text-sm text-center mb-16">
        Share your Claude Code companion with the community.
      </p>

      <form onSubmit={handleSubmit} className="space-y-10">
        {/* Drop Zone */}
        <div
          onDragOver={(e) => {
            e.preventDefault();
            setIsDragging(true);
          }}
          onDragLeave={() => setIsDragging(false)}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
          className={`
            border border-dashed p-12 text-center cursor-pointer transition-all duration-300
            ${
              isDragging
                ? "border-highlight bg-accent-light drop-zone-active"
                : "border-card-border hover:border-muted"
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

          {preview ? (
            <div className="flex flex-col items-center gap-6">
              <div className="relative w-48 h-48 overflow-hidden">
                <Image
                  src={preview}
                  alt="Preview"
                  fill
                  className="object-cover"
                />
              </div>
              <p className="text-muted text-xs tracking-wide">
                Click or drag to replace
              </p>
            </div>
          ) : (
            <div className="py-6">
              <p className="text-muted text-sm mb-2">
                Drop image here or click to browse
              </p>
              <p className="text-muted/60 text-xs">
                PNG, JPEG, GIF, WebP — max 5 MB
              </p>
            </div>
          )}
        </div>

        {/* Name */}
        <div>
          <label htmlFor="name" className="block text-xs tracking-[0.1em] uppercase text-muted mb-3">
            Name <span className="text-highlight">*</span>
          </label>
          <input
            id="name"
            type="text"
            required
            maxLength={60}
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Gravy the Capybara"
            className="input-field w-full px-0 py-3 bg-transparent border-0 border-b border-card-border
                       placeholder:text-muted/30 text-sm"
          />
        </div>

        {/* Author */}
        <div>
          <label htmlFor="author" className="block text-xs tracking-[0.1em] uppercase text-muted mb-3">
            Author
          </label>
          <input
            id="author"
            type="text"
            maxLength={40}
            value={author}
            onChange={(e) => setAuthor(e.target.value)}
            placeholder="Anonymous"
            className="input-field w-full px-0 py-3 bg-transparent border-0 border-b border-card-border
                       placeholder:text-muted/30 text-sm"
          />
        </div>

        {/* Description */}
        <div>
          <label htmlFor="description" className="block text-xs tracking-[0.1em] uppercase text-muted mb-3">
            Description
          </label>
          <textarea
            id="description"
            maxLength={500}
            rows={3}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Tell us about your buddy..."
            className="input-field w-full px-0 py-3 bg-transparent border-0 border-b border-card-border
                       placeholder:text-muted/30 text-sm resize-none"
          />
        </div>

        {/* Error */}
        {error && (
          <div className="border border-card-border px-5 py-3">
            <p className="text-sm">{error}</p>
          </div>
        )}

        {/* Submit */}
        <button
          type="submit"
          disabled={isSubmitting || !file || !name.trim()}
          className="btn-primary w-full py-3.5 bg-foreground text-background text-xs tracking-[0.15em] uppercase font-medium
                     disabled:opacity-30 disabled:cursor-not-allowed transition-opacity duration-300"
        >
          {isSubmitting ? "Uploading..." : "Submit"}
        </button>
      </form>
    </div>
  );
}
