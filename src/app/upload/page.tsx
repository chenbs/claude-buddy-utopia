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
    <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <h1 className="text-3xl font-bold mb-2">Upload Your Buddy</h1>
      <p className="text-muted mb-8">
        Share your Claude Code companion with the community!
      </p>

      <form onSubmit={handleSubmit} className="space-y-6">
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
            relative border-2 border-dashed rounded-xl p-8 text-center cursor-pointer
            transition-colors duration-200
            ${
              isDragging
                ? "border-accent bg-accent/5 drop-zone-active"
                : "border-card-border hover:border-accent/50 hover:bg-accent-light/30"
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
            <div className="flex flex-col items-center gap-4">
              <div className="relative w-48 h-48 rounded-lg overflow-hidden">
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
            <div className="py-8">
              <p className="text-4xl mb-3">📸</p>
              <p className="font-medium mb-1">
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
            className="block text-sm font-medium mb-1.5"
          >
            Buddy Name <span className="text-red-500">*</span>
          </label>
          <input
            id="name"
            type="text"
            required
            maxLength={60}
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder='e.g. "Gravy the Capybara"'
            className="w-full px-4 py-2.5 bg-card-bg border border-card-border rounded-lg
                       focus:outline-none focus:ring-2 focus:ring-accent/50 focus:border-accent
                       placeholder:text-muted/50 transition-colors"
          />
        </div>

        {/* Author */}
        <div>
          <label
            htmlFor="author"
            className="block text-sm font-medium mb-1.5"
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
            className="w-full px-4 py-2.5 bg-card-bg border border-card-border rounded-lg
                       focus:outline-none focus:ring-2 focus:ring-accent/50 focus:border-accent
                       placeholder:text-muted/50 transition-colors"
          />
        </div>

        {/* Description */}
        <div>
          <label
            htmlFor="description"
            className="block text-sm font-medium mb-1.5"
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
            className="w-full px-4 py-2.5 bg-card-bg border border-card-border rounded-lg
                       focus:outline-none focus:ring-2 focus:ring-accent/50 focus:border-accent
                       placeholder:text-muted/50 transition-colors resize-none"
          />
        </div>

        {/* Error */}
        {error && (
          <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg px-4 py-3">
            <p className="text-red-700 dark:text-red-300 text-sm">{error}</p>
          </div>
        )}

        {/* Submit */}
        <button
          type="submit"
          disabled={isSubmitting || !file || !name.trim()}
          className="w-full py-3 bg-accent text-white rounded-lg font-medium
                     hover:bg-accent/90 disabled:opacity-50 disabled:cursor-not-allowed
                     transition-colors"
        >
          {isSubmitting ? "Uploading..." : "Upload Buddy"}
        </button>
      </form>
    </div>
  );
}
