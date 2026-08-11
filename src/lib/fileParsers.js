import { createRequire } from "module";
import mammoth from "mammoth";

// pdf-parse v2 exposes a PDFParse class (CommonJS) — load it via require.
const require = createRequire(import.meta.url);
const { PDFParse } = require("pdf-parse");

// Point pdf.js at the real worker so it doesn't fall back to a "fake worker"
// (which emits "Cannot find module './pdf.worker.mjs'" warnings in Node).
try {
  PDFParse.setWorker(require.resolve("pdfjs-dist/build/pdf.worker.mjs"));
} catch {
  // Worker path resolution is best-effort; parsing still works without it.
}

const MAX_CHARS = 30000;

export async function extractText(file, mimeType) {
  const buffer = Buffer.from(await file.arrayBuffer());
  let text = "";

  if (mimeType === "application/pdf") {
    const parser = new PDFParse({ data: buffer, verbosity: 0 });
    try {
      const result = await parser.getText();
      text = result.text;
    } finally {
      await parser.destroy();
    }
  } else {
    // DOCX (and .doc fallback through mammoth)
    const result = await mammoth.extractRawText({ buffer });
    text = result.value;
  }

  text = (text || "")
    .replace(/\s+/g, " ")
    .replace(/-- \d{1,5} of \d{1,5} --/g, "")
    .trim();

  if (!text) {
    throw new Error(
      "No readable text found in this file. Scanned/image PDFs are not supported."
    );
  }

  return text.slice(0, MAX_CHARS);
}