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
    <div className="win2k-desktop py-6 px-4 min-h-screen">
      {/* Window */}
      <div className="win2k-window max-w-2xl mx-auto">
        {/* Title Bar */}
        <div className="win2k-titlebar">
          <div className="flex items-center gap-1.5">
            <img
              src="/placeholder.svg?width=16&height=16"
              alt=""
              className="w-4 h-4"
              aria-hidden="true"
            />
            <span>Upload Buddy - Buddy Utopia</span>
          </div>
          <div className="flex items-center gap-0.5">
            <button className="win2k-caption-btn" aria-label="Minimize">_</button>
            <button className="win2k-caption-btn" aria-label="Maximize">□</button>
            <button className="win2k-caption-btn win2k-close-btn" aria-label="Close">✕</button>
          </div>
        </div>

        {/* Menu Bar */}
        <div className="win2k-menubar">
          <button className="win2k-menu-item">File</button>
          <button className="win2k-menu-item">Edit</button>
          <button className="win2k-menu-item">View</button>
          <button className="win2k-menu-item">Help</button>
        </div>

        {/* Toolbar */}
        <div className="win2k-toolbar">
          <button className="win2k-toolbar-btn" title="Back">◄</button>
          <button className="win2k-toolbar-btn" title="Forward">►</button>
          <div className="win2k-toolbar-sep" />
          <button className="win2k-toolbar-btn" title="Home">🏠</button>
          <div className="win2k-address-bar">
            <span className="win2k-address-label">Address</span>
            <div className="win2k-address-input">C:\BuddyUtopia\Upload</div>
          </div>
        </div>

        {/* Window Body */}
        <div className="win2k-body p-4">
          <p className="win2k-info-text mb-4">
            Share your Claude Code companion with the community!
          </p>

          <form onSubmit={handleSubmit}>
            {/* Drop Zone Fieldset */}
            <fieldset className="win2k-fieldset mb-4">
              <legend className="win2k-legend">Buddy Image</legend>
              <div
                onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
                onDragLeave={() => setIsDragging(false)}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
                className={`win2k-dropzone ${isDragging ? "win2k-dropzone-active" : ""}`}
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
                  <div className="flex flex-col items-center gap-3">
                    <div className="win2k-img-preview">
                      <Image src={preview} alt="Preview" fill className="object-cover" />
                    </div>
                    <p className="win2k-small-text">Click or drag to replace</p>
                  </div>
                ) : (
                  <div className="flex flex-col items-center gap-2 py-6">
                    <div className="win2k-folder-icon" aria-hidden="true">
                      <svg width="48" height="40" viewBox="0 0 48 40" fill="none">
                        <rect x="0" y="8" width="48" height="32" rx="1" fill="#FFD700" stroke="#B8860B" strokeWidth="1.5"/>
                        <path d="M0 8 L12 8 L16 4 L48 4 L48 8" fill="#FFEC8B" stroke="#B8860B" strokeWidth="1.5"/>
                      </svg>
                    </div>
                    <p className="win2k-drop-label">Drop your buddy image here</p>
                    <p className="win2k-small-text">or click to browse — PNG, JPEG, GIF, WebP (max 5MB)</p>
                  </div>
                )}
              </div>
            </fieldset>

            {/* Details Fieldset */}
            <fieldset className="win2k-fieldset mb-4">
              <legend className="win2k-legend">Buddy Details</legend>
              <div className="flex flex-col gap-3 p-2">
                {/* Name */}
                <div className="flex items-center gap-2">
                  <label htmlFor="name" className="win2k-label w-28 shrink-0">
                    Buddy Name:<span className="text-red-600">*</span>
                  </label>
                  <input
                    id="name"
                    type="text"
                    required
                    maxLength={60}
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder='e.g. "Gravy the Capybara"'
                    className="win2k-input flex-1"
                  />
                </div>

                {/* Author */}
                <div className="flex items-center gap-2">
                  <label htmlFor="author" className="win2k-label w-28 shrink-0">
                    Your Name:
                  </label>
                  <input
                    id="author"
                    type="text"
                    maxLength={40}
                    value={author}
                    onChange={(e) => setAuthor(e.target.value)}
                    placeholder="Anonymous"
                    className="win2k-input flex-1"
                  />
                </div>

                {/* Description */}
                <div className="flex items-start gap-2">
                  <label htmlFor="description" className="win2k-label w-28 shrink-0 pt-1">
                    Description:
                  </label>
                  <textarea
                    id="description"
                    maxLength={500}
                    rows={3}
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Tell us about your buddy..."
                    className="win2k-input win2k-textarea flex-1"
                  />
                </div>
              </div>
            </fieldset>

            {/* Error Box */}
            {error && (
              <div className="win2k-error-box mb-4">
                <span className="win2k-error-icon" aria-hidden="true">⚠</span>
                <p>{error}</p>
              </div>
            )}

            {/* Button Row */}
            <div className="flex justify-end gap-2">
              <button
                type="button"
                onClick={() => router.back()}
                className="win2k-btn"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting || !file || !name.trim()}
                className="win2k-btn win2k-btn-default"
              >
                {isSubmitting ? "Uploading..." : "Upload Buddy"}
              </button>
            </div>
          </form>
        </div>

        {/* Status Bar */}
        <div className="win2k-statusbar">
          <span>Ready</span>
          <span className="win2k-statusbar-sep" />
          <span>{file ? `1 file selected (${(file.size / 1024).toFixed(0)} KB)` : "No file selected"}</span>
        </div>
      </div>
    </div>
  );
}
