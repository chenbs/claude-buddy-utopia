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
    <div className="max-w-xl mx-auto px-6 sm:px-8 py-16 sm:py-20">
      <p className="text-sm font-medium tracking-[0.2em] uppercase text-accent mb-4">
        New Submission
      </p>
      <h1 className="font-display text-4xl sm:text-5xl italic mb-3">
        Upload Your Buddy
      </h1>
      <p className="text-muted text-lg mb-12">
        Share your Claude Code companion with the community!
      </p>

      <form onSubmit={handleSubmit} className="space-y-8">
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
            relative border-2 border-dashed rounded-2xl p-10 text-center cursor-pointer
            transition-all duration-300
            ${
              isDragging
                ? "border-accent bg-accent-light drop-zone-active"
                : "border-card-border hover:border-accent/40 hover:bg-surface/50"
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
            <div className="flex flex-col items-center gap-5">
              <div className="relative w-52 h-52 rounded-xl overflow-hidden shadow-lg">
                <Image
                  src={preview}
                  alt="Preview"
                  fill
                  className="object-cover"
                />
              </div>
              <p className="text-muted text-sm">
                Click or drag to replace
              </p>
            </div>
          ) : (
            <div className="py-10">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-surface flex items-center justify-center">
                <span className="text-3xl">📸</span>
              </div>
              <p className="font-medium mb-1.5">
                Drop your buddy image here
              </p>
              <p className="text-muted text-sm">
                or click to browse — PNG, JPEG, GIF, WebP (max 5MB)
              </p>
            </div>
          )}
        </div>

        {/* Name */}
        <div>
          <label
            htmlFor="name"
            className="block text-xs font-medium tracking-[0.15em] uppercase text-muted mb-2"
          >
            Buddy Name <span className="text-accent">*</span>
          </label>
          <input
            id="name"
            type="text"
            required
            maxLength={60}
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder='e.g. "Gravy the Capybara"'
            className="input-field w-full px-4 py-3 bg-card-bg border border-card-border rounded-xl
                       placeholder:text-muted/40"
          />
        </div>

        {/* Author */}
        <div>
          <label
            htmlFor="author"
            className="block text-xs font-medium tracking-[0.15em] uppercase text-muted mb-2"
          >
            Your Name
          </label>
          <input
            id="author"
            type="text"
            maxLength={40}
            value={author}
            onChange={(e) => setAuthor(e.target.value)}
            placeholder="Anonymous"
            className="input-field w-full px-4 py-3 bg-card-bg border border-card-border rounded-xl
                       placeholder:text-muted/40"
          />
        </div>

        {/* Description */}
        <div>
          <label
            htmlFor="description"
            className="block text-xs font-medium tracking-[0.15em] uppercase text-muted mb-2"
          >
            Description
          </label>
          <textarea
            id="description"
            maxLength={500}
            rows={3}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Tell us about your buddy..."
            className="input-field w-full px-4 py-3 bg-card-bg border border-card-border rounded-xl
                       placeholder:text-muted/40 resize-none"
          />
        </div>

        {/* Error */}
        {error && (
          <div className="bg-accent-light border-l-4 border-accent rounded-r-xl px-4 py-3">
            <p className="text-accent text-sm font-medium">{error}</p>
          </div>
        )}

        {/* Submit */}
        <button
          type="submit"
          disabled={isSubmitting || !file || !name.trim()}
          className="btn-primary w-full py-3.5 bg-accent text-white rounded-full font-medium
                     tracking-wide uppercase text-sm
                     disabled:opacity-40 disabled:cursor-not-allowed"
        >
          {isSubmitting ? "Uploading..." : "Upload Buddy"}
        </button>
      </form>
    </div>
  );
}
