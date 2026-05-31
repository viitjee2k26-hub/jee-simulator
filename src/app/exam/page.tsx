"use client";

import { useEffect, useState } from "react";

const TOTAL_QUESTIONS = 75;

export default function ExamPage() {
  const [currentQuestion, setCurrentQuestion] = useState(1);
  const [activeSubject, setActiveSubject] = useState("Physics");

  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [reviewed, setReviewed] = useState<number[]>([]);

  const [timeLeft, setTimeLeft] = useState(180 * 60);
  const [showImagePopup, setShowImagePopup] = useState(false);
  const [zoom, setZoom] = useState(1);

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          alert("Time Up!");
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const minutesLeft = Math.ceil(timeLeft / 60);

  const isNumeric =
    (currentQuestion >= 21 && currentQuestion <= 25) ||
    (currentQuestion >= 46 && currentQuestion <= 50) ||
    (currentQuestion >= 71 && currentQuestion <= 75);

  const saveAndNext = () => {
    if (currentQuestion < TOTAL_QUESTIONS) {
      setCurrentQuestion(currentQuestion + 1);
    }
  };

  const markReview = () => {
    if (!reviewed.includes(currentQuestion)) {
      setReviewed([...reviewed, currentQuestion]);
    }

    if (currentQuestion < TOTAL_QUESTIONS) {
      setCurrentQuestion(currentQuestion + 1);
    }
  };

  const clearResponse = () => {
    const updated = { ...answers };
    delete updated[currentQuestion];
    setAnswers(updated);
  };

  const keypadPress = (value: string) => {
    setAnswers({
      ...answers,
      [currentQuestion]:
        (answers[currentQuestion] || "") + value,
    });
  };

  const backspace = () => {
    setAnswers({
      ...answers,
      [currentQuestion]:
        (answers[currentQuestion] || "").slice(0, -1),
    });
  };

  const clearNumeric = () => {
    setAnswers({
      ...answers,
      [currentQuestion]: "",
    });
  };

  return (
    <div className="min-h-screen bg-gray-100">

      {/* Header */}

      <div className="bg-white border-b shadow p-4 flex justify-between items-center">

        <div>
          <h1 className="font-extrabold text-3xl text-black">
            JEE Simulator
          </h1>

          <p className="text-sm text-gray-600">
            JEE Main Mock Test
          </p>
        </div>

        <div className="bg-red-600 text-white px-6 py-2 rounded font-bold text-lg border border-gray-500">
          {minutesLeft} min
        </div>

      </div>

      {/* Subject Tabs */}

      <div className="bg-white border-b p-2 flex gap-2">

        {["Physics", "Chemistry", "Maths"].map((sub) => (
          <button
            key={sub}
            onClick={() => {
            setActiveSubject(sub);

            if (sub === "Physics")
                setCurrentQuestion(1);

            if (sub === "Chemistry")
                setCurrentQuestion(26);

            if (sub === "Maths")
                setCurrentQuestion(51);
            }}
            className={`px-4 py-2 rounded ${
              activeSubject === sub
                ? "bg-red-600 text-white"
                : "bg-white border-2 border-gray-500 text-black font-semibold"
            }`}
          >
            {sub}
          </button>
        ))}

      </div>

      <div className="flex">

        {/* LEFT */}

        <div className="w-3/4 p-5">

          <div className="bg-white border-2 border-gray-700 rounded p-5 shadow-xl">

            <div className="flex gap-3 mb-4">

              <h2 className="font-extrabold text-3xl text-black">
                Question {currentQuestion}
              </h2>

              <span className="border-2 border-gray-600 rounded-full px-3 py-1 text-sm font-bold text-black bg-white">
                +4 / -1
              </span>

              <span className="border-2 border-gray-600 rounded-full px-3 py-1 text-sm font-bold text-black bg-white">
                {isNumeric ? "Numeric" : "MCQ"}
              </span>

            </div>

            {/* Question Image */}

            <div className="border-2 border-black bg-white p-3 h-[420px] flex items-center justify-center">

                <img
                    src={`/questions/q${currentQuestion}.png`}
                    alt={`Question ${currentQuestion}`}
                    className="max-h-full max-w-full object-contain cursor-pointer"
                    onClick={() => setShowImagePopup(true)}
                />

            </div>

            {/* Answer Area */}

            {!isNumeric ? (
              <div className="mt-6 space-y-4">

                {["A", "B", "C", "D"].map((option) => (
                  <label
                    key={option}
                    className="block text-2xl font-bold text-black"
                  >
                    <input
                      type="radio"
                      name={`q-${currentQuestion}`}
                      checked={
                        answers[currentQuestion] === option
                      }
                      onChange={() =>
                        setAnswers({
                          ...answers,
                          [currentQuestion]: option,
                        })
                      }
                    />{" "}
                    Option {option}
                  </label>
                ))}

              </div>
            ) : (
              <div className="mt-6">

                <input
                  value={
                    answers[currentQuestion] || ""
                  }
                  readOnly
                  className="border-2 border-black bg-white text-black p-3 text-2xl font-bold w-60 mb-4"
                />

                <div className="grid grid-cols-3 gap-2 w-60">

                  {[1,2,3,4,5,6,7,8,9,"-",0,"."].map((key) => (
                    <button
                      key={String(key)}
                      onClick={() =>
                        keypadPress(String(key))
                      }
                      className="border-2 border-black bg-white text-black p-3 text-xl font-bold hover:bg-gray-300"
                    >
                      {key}
                    </button>
                  ))}

                  <button
                    onClick={backspace}
                    className="col-span-3 bg-gray-500 text-white font-bold p-3"
                  >
                    Backspace
                  </button>

                  <button
                    onClick={clearNumeric}
                    className="col-span-3 bg-red-500 text-white p-3"
                  >
                    Clear All
                  </button>

                </div>

              </div>
            )}

            {/* Buttons */}

            <div className="mt-8 flex gap-3">

              <button
                onClick={saveAndNext}
                className="bg-green-600 text-white px-5 py-2 rounded"
              >
                SAVE & NEXT
              </button>

              <button
                onClick={clearResponse}
                className="bg-gray-300 px-5 py-2 rounded"
              >
                CLEAR
              </button>

              <button
                onClick={markReview}
                className="bg-red-600 text-white px-5 py-2 rounded"
              >
                SAVE & MARK REVIEW
              </button>

            </div>

          </div>

        </div>

   {/* RIGHT PANEL */}

<div className="w-1/4 bg-white border-l-2 border-black p-4">

  <div className="mb-4">

    <div className="font-bold text-lg mb-2">
      {activeSubject.toUpperCase()}
    </div>

    <div className="text-sm mb-1">
      🟩 Answered
    </div>

    <div className="text-sm mb-1">
      ⬜ Not Visited
    </div>

    <div className="text-sm mb-3">
      🟪 Mark Review
    </div>

  </div>

  {/* MCQ Section */}

  <div className="mb-4">

    <h3 className="font-bold border-b pb-1 mb-2">
      MCQ Questions
    </h3>

    <div className="grid grid-cols-5 gap-2">

      {(
        activeSubject === "Physics"
          ? Array.from({ length: 20 }, (_, i) => i + 1)
          : activeSubject === "Chemistry"
          ? Array.from({ length: 20 }, (_, i) => i + 26)
          : Array.from({ length: 20 }, (_, i) => i + 51)
      ).map((q) => (

        <button
          key={q}
          onClick={() => setCurrentQuestion(q)}
          className={`h-12 font-bold border-2 border-gray-500

          ${
            currentQuestion === q
              ? "bg-blue-500 text-white"
              : reviewed.includes(q)
              ? "bg-purple-600 text-white"
              : answers[q]
              ? "bg-green-500 text-white"
              : "bg-white text-black"
          }`}
        >
          {q}
        </button>

      ))}

    </div>

  </div>

  {/* Numeric Section */}

  <div>

    <h3 className="font-bold border-b pb-1 mb-2">
      Numeric Questions
    </h3>

    <div className="grid grid-cols-5 gap-2">

      {(
        activeSubject === "Physics"
          ? [21,22,23,24,25]
          : activeSubject === "Chemistry"
          ? [46,47,48,49,50]
          : [71,72,73,74,75]
      ).map((q) => (

        <button
          key={q}
          onClick={() => setCurrentQuestion(q)}
          className={`h-12 font-bold border-2 border-gray-500

          ${
            currentQuestion === q
              ? "bg-blue-500 text-white"
              : reviewed.includes(q)
              ? "bg-purple-600 text-white"
              : answers[q]
              ? "bg-green-500 text-white"
              : "bg-white text-black"
          }`}
        >
          {q}
        </button>

      ))}

    </div>

  </div>

  <button
    className="w-full mt-6 bg-green-700 text-white py-3 rounded font-bold"
  >
    SUBMIT TEST
  </button>

</div>

      </div>
    
      {showImagePopup && (
        <div
          className="fixed inset-0 bg-black/70 flex items-center justify-center z-50"
          onClick={() => setShowImagePopup(false)}
        >
          <img
            src={`/questions/q${currentQuestion}.png`}
            alt={`Question ${currentQuestion}`}
            className="max-w-[95vw] max-h-[95vh] object-contain bg-white"
          />
        </div>
      )}


    </div>
  );
}