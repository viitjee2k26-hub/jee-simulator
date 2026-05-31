import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

export async function GET() {
  try {
    const pdfjsLib = await import("pdfjs-dist/legacy/build/pdf.mjs");

    const pdfPath = path.join(
      process.cwd(),
      "uploads",
      "answerkey.pdf"
    );

    const pdfData = new Uint8Array(
      fs.readFileSync(pdfPath)
    );

    const pdf = await pdfjsLib.getDocument({
      data: pdfData,
    }).promise;

    let fullText = "";

    for (let pageNum = 1; pageNum <= pdf.numPages; pageNum++) {
      const page = await pdf.getPage(pageNum);

      const content = await page.getTextContent();

      const pageText = content.items
        .map((item: any) => item.str)
        .join(" ");

      fullText += pageText + "\n";
    }

    const answers: Record<number, string> = {};

    const regex = /(\d+)\s*\(\s*([^)]+)\s*\)/g;

    let match;

    while ((match = regex.exec(fullText)) !== null) {
      answers[Number(match[1])] = match[2];
    }

    return NextResponse.json({
      success: true,
      totalAnswers: Object.keys(answers).length,
      answers,
      extractedText: fullText.substring(0, 2000),
    });
  } catch (error: any) {
    console.error(error);

    return NextResponse.json({
      success: false,
      error: error.message,
    });
  }
}