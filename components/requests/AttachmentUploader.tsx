"use client";

import { ImagePlus, X } from "lucide-react";
import { useRef, useState } from "react";
import { Button } from "@/components/ui/button";

const allowedTypes = ["image/jpeg", "image/png", "image/webp"];
const maxSize = 5 * 1024 * 1024;

export function AttachmentUploader() {
  const inputRef = useRef<HTMLInputElement>(null);
  const [urls, setUrls] = useState<string[]>([]);
  const [message, setMessage] = useState("Attach JPEG, PNG, or WebP evidence up to 5 MB.");
  const [uploading, setUploading] = useState(false);

  async function upload(file: File) {
    if (!allowedTypes.includes(file.type)) {
      setMessage("Only JPEG, PNG, or WebP images are allowed.");
      return;
    }

    if (file.size > maxSize) {
      setMessage("Image must be 5 MB or smaller.");
      return;
    }

    setUploading(true);
    const formData = new FormData();
    formData.set("file", file);
    const response = await fetch("/api/upload", { method: "POST", body: formData });
    const body = (await response.json()) as { url?: string; error?: string };
    setUploading(false);

    if (!response.ok || !body.url) {
      setMessage(body.error ?? "Upload failed.");
      return;
    }

    setUrls((current) => [...current, body.url as string]);
    setMessage("Evidence uploaded.");
  }

  return (
    <div className="grid gap-3 rounded-lg border border-dashed border-stone-300 bg-stone-50 p-4">
      <input type="hidden" name="attachments" value={urls.join("\n")} />
      <input
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp"
        className="sr-only"
        onChange={(event) => {
          const file = event.target.files?.[0];
          if (file) void upload(file);
          event.currentTarget.value = "";
        }}
      />
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-sm text-stone-600">{message}</p>
        <Button type="button" variant="outline" onClick={() => inputRef.current?.click()} disabled={uploading}>
          <ImagePlus className="h-4 w-4" aria-hidden="true" />
          {uploading ? "Uploading" : "Add evidence"}
        </Button>
      </div>
      {urls.length ? (
        <div className="grid gap-2 sm:grid-cols-2">
          {urls.map((url) => (
            <div key={url} className="flex items-center justify-between gap-3 rounded-md border border-stone-200 bg-white p-2 text-xs text-stone-600">
              <span className="truncate">{url}</span>
              <button type="button" onClick={() => setUrls((current) => current.filter((item) => item !== url))} className="rounded p-1 hover:bg-stone-100">
                <X className="h-3.5 w-3.5" aria-hidden="true" />
                <span className="sr-only">Remove</span>
              </button>
            </div>
          ))}
        </div>
      ) : null}
    </div>
  );
}
