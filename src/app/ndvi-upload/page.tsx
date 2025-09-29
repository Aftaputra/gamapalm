"use client";

import React, { useState } from "react";

export default function NDVIUploadPage() {
  const [redFile, setRedFile] = useState<File | null>(null);
  const [nirFile, setNirFile] = useState<File | null>(null);
  const [ndviImage, setNdviImage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!redFile || !nirFile) return;

    const formData = new FormData();
    formData.append("red", redFile);
    formData.append("nir", nirFile);

    setLoading(true);
    try {
      const res = await fetch("http://localhost:5000/", {
        method: "POST",
        body: formData,
      });

      const html = await res.text();
      const match = html.match(/src="(data:image[^"]+)"/);
      if (match) {
        setNdviImage(match[1]);
      }
    } catch (err) {
      console.error("Upload gagal:", err);
      alert("Terjadi kesalahan saat upload. Coba lagi.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
      <div className="w-full max-w-lg bg-white shadow-md rounded-xl p-6">
        <h1 className="text-2xl font-bold text-gray-800 mb-6 text-center">
          Upload Citra Multispektral
        </h1>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Red (B04.jp2)
            </label>
            <input
              type="file"
              accept=".jp2"
              onChange={(e) => setRedFile(e.target.files?.[0] || null)}
              required
              className="block w-full text-sm text-gray-600 
                        file:mr-4 file:py-2 file:px-4 
                        file:rounded-md file:border-0 
                        file:text-sm file:font-semibold 
                        file:bg-blue-50 file:text-blue-700 
                        hover:file:bg-blue-100"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              NIR (B08.jp2)
            </label>
            <input
              type="file"
              accept=".jp2"
              onChange={(e) => setNirFile(e.target.files?.[0] || null)}
              required
              className="block w-full text-sm text-gray-600 
                        file:mr-4 file:py-2 file:px-4 
                        file:rounded-md file:border-0 
                        file:text-sm file:font-semibold 
                        file:bg-green-50 file:text-green-700 
                        hover:file:bg-green-100"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 px-4 rounded-lg shadow 
                       font-semibold text-white 
                       bg-blue-600 hover:bg-blue-700 
                       transition-all disabled:opacity-50"
          >
            {loading ? "Memproses..." : "Proses NDVI"}
          </button>
        </form>

        {ndviImage && (
          <div className="mt-8">
            <h2 className="text-lg font-semibold text-gray-700 mb-3">
              Hasil NDVI
            </h2>
            <img
              src={ndviImage}
              alt="NDVI"
              className="rounded-lg shadow-lg border"
            />
          </div>
        )}
      </div>
    </div>
  );
}
