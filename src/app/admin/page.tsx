"use client";

import { useState } from "react";

export default function AdminPage() {
  const [questionPdf, setQuestionPdf] = useState<File | null>(null);
  const [answerPdf, setAnswerPdf] = useState<File | null>(null);
  const [message, setMessage] = useState("");

  const handleUpload = async () => {
    if (!questionPdf || !answerPdf) {
      setMessage("Please select both PDFs");
      return;
    }

    const formData = new FormData();

    formData.append("questionPdf", questionPdf);
    formData.append("answerPdf", answerPdf);

    const res = await fetch("/api/upload", {
      method: "POST",
      body: formData,
    });

    const data = await res.json();

    if (data.success) {
      setMessage("PDFs uploaded successfully");
    } else {
      setMessage("Upload failed");
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-10">
      <h1 className="text-4xl font-bold mb-8 text-black">
        JEE Simulator Admin
      </h1>

      <div className="bg-white border-2 border-gray-400 rounded-lg p-6 max-w-2xl shadow">

        <h2 className="text-2xl font-semibold mb-6 text-black">
          Upload Mock Test
        </h2>

        <div className="mb-6">
          <label className="block text-lg font-semibold mb-2 text-black">
            Question Paper PDF
          </label>

          <input
            type="file"
            accept=".pdf"
            onChange={(e) =>
              setQuestionPdf(e.target.files?.[0] || null)
            }
            className="border p-2 w-full bg-white text-black"
          />
        </div>

        <div className="mb-6">
          <label className="block text-lg font-semibold mb-2 text-black">
            Answer Key PDF
          </label>

          <input
            type="file"
            accept=".pdf"
            onChange={(e) =>
              setAnswerPdf(e.target.files?.[0] || null)
            }
            className="border p-2 w-full bg-white text-black"
          />
        </div>

        <button
          onClick={handleUpload}
          className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded font-bold"
        >
          Upload PDFs
        </button>

        <p className="mt-4 text-black font-medium">
          {message}
        </p>
      </div>
    </div>
  );
}