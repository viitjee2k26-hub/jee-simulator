import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

export async function POST(req: Request) {
  try {
    const formData = await req.formData();

    const questionPdf = formData.get("questionPdf") as File;
    const answerPdf = formData.get("answerPdf") as File;

    if (!questionPdf || !answerPdf) {
      return NextResponse.json(
        { success: false, error: "Missing PDFs" },
        { status: 400 }
      );
    }

    const uploadsDir = path.join(process.cwd(), "uploads");

    if (!fs.existsSync(uploadsDir)) {
      fs.mkdirSync(uploadsDir, { recursive: true });
    }

    const questionBuffer = Buffer.from(
      await questionPdf.arrayBuffer()
    );

    const answerBuffer = Buffer.from(
      await answerPdf.arrayBuffer()
    );

    fs.writeFileSync(
      path.join(uploadsDir, "question.pdf"),
      questionBuffer
    );

    fs.writeFileSync(
      path.join(uploadsDir, "answerkey.pdf"),
      answerBuffer
    );

    return NextResponse.json({
      success: true,
      message: "PDFs uploaded successfully",
    });
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      {
        success: false,
        error: "Upload failed",
      },
      { status: 500 }
    );
  }
}