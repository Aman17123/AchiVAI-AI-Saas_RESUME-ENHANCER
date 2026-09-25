import mammoth from "mammoth";

const MAX_CHARS = 30000;

export async function extractText(file, mimeType) {
  const buffer = Buffer.from(await file.arrayBuffer());
  let text = "";

  const isPdf =
    mimeType === "application/pdf" ||
    (file?.name && file.name.toLowerCase().endsWith(".pdf"));

  if (isPdf) {
    text = await extractPdfText(buffer);
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

async function extractPdfText(buffer) {
  const uint8 = new Uint8Array(buffer);

  // Method 1 (Primary & Serverless-safe): unpdf
  try {
    const { getDocumentProxy, extractText: unpdfExtract } = await import("unpdf");
    const pdf = await getDocumentProxy(uint8);
    const { text } = await unpdfExtract(pdf, { mergePages: true });
    if (text && text.trim()) {
      return text;
    }
  } catch (err) {
    console.warn("unpdf extraction failed, trying fallback:", err.message);
  }

  // Method 2 (Fallback): pdfjs-dist legacy build
  try {
    const pdfjs = await import("pdfjs-dist/legacy/build/pdf.mjs");
    const loadingTask = pdfjs.getDocument({
      data: uint8,
      isEvalSupported: false,
      useWorkerFetch: false,
      disableFontFace: true,
    });
    const doc = await loadingTask.promise;
    let fullText = "";
    for (let i = 1; i <= doc.numPages; i++) {
      const page = await doc.getPage(i);
      const textContent = await page.getTextContent();
      const pageText = textContent.items
        .map((item) => (item.str ? item.str : ""))
        .join(" ");
      fullText += pageText + " ";
    }
    if (fullText && fullText.trim()) {
      return fullText;
    }
  } catch (err) {
    console.warn("pdfjs-dist extraction failed, trying pdf-parse fallback:", err.message);
  }

  // Method 3 (Fallback): pdf-parse
  try {
    const { PDFParse } = await import("pdf-parse");
    const parser = new PDFParse({ data: uint8, verbosity: 0 });
    try {
      const result = await parser.getText();
      if (result.text && result.text.trim()) {
        return result.text;
      }
    } finally {
      await parser.destroy();
    }
  } catch (err) {
    console.error("All PDF parsers failed:", err);
  }

  throw new Error("Failed to parse PDF document. Please ensure it is a valid text PDF.");
}