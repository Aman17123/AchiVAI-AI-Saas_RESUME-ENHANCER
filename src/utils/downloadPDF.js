import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import React from "react";
import { renderToString } from "react-dom/server";
import { getPDFTemplate } from "../components/PDFTemplates/PDFTemplateFactory";

const PAGE_RATIO = 297 / 210;
const MAX_FILL = 0.95;

export const downloadResumePDF = async (data, theme, templateLayout) => {
  let container;

  try {
    const TemplateComponent = getPDFTemplate(templateLayout);

    // 1️⃣ Hidden container at exact A4 width
    container = document.createElement("div");
    container.style.width = "210mm";
    container.style.backgroundColor = "#ffffff";
    container.style.position = "fixed";
    container.style.top = "0";
    container.style.left = "-10000px";
    container.style.zIndex = "-1";
    container.className = "pdf-export";

    document.body.appendChild(container);

    // 2️⃣ Render React → HTML
    container.innerHTML += renderToString(<TemplateComponent data={data} />);

    // 3️⃣ Wait for fonts
    await new Promise((r) => setTimeout(r, 800));

    // 4️⃣ Measure block-aware break points (tops of .pdf-section-start)
    const containerRect = container.getBoundingClientRect();
    const boundaries = [0];
    container.querySelectorAll(".pdf-section-start").forEach((el) => {
      const top = el.getBoundingClientRect().top - containerRect.top;
      if (top > 1) boundaries.push(Math.round(top));
    });

    // 5️⃣ html2canvas (colors preserved, exotic color spaces normalized)
    const canvas = await html2canvas(container, {
      scale: 2,
      useCORS: true,
      allowTaint: true,
      backgroundColor: "#ffffff",
      logging: false,
      onclone: (doc) => normalizeExoticColors(doc),
    });

    // 6️⃣ Cleanup
    document.body.removeChild(container);

    // 7️⃣ Compute page slices in layout px, snapping to section boundaries
    const widthPx = container.clientWidth;
    const pageHeightPx = widthPx * PAGE_RATIO;
    const ratio = canvas.width / widthPx;
    const totalPx = canvas.height / ratio;

    boundaries.push(Math.round(totalPx));

    const pages = [];
    let start = 0;
    while (start < totalPx - 1) {
      const endMax = start + pageHeightPx * MAX_FILL;
      const candidates = boundaries.filter((b) => b > start + 1 && b <= endMax);
      const end = candidates.length
        ? candidates[candidates.length - 1]
        : Math.min(start + pageHeightPx, totalPx);
      pages.push({ top: start, bottom: end });
      start = end;
      if (pages.length > 60) break;
    }

    // 8️⃣ Draw slices
    const pdf = new jsPDF({
      orientation: "portrait",
      unit: "mm",
      format: "a4",
    });

    const imgData = canvas.toDataURL("image/png");
    const imgWidth = 210;
    const imgHeight = (canvas.height * imgWidth) / canvas.width;

    pages.forEach((page, i) => {
      if (i > 0) pdf.addPage();
      const topMm = page.top * (imgWidth / widthPx);
      pdf.addImage(imgData, "PNG", 0, -topMm, imgWidth, imgHeight);
    });

    // 9️⃣ Download
    pdf.save(`${data.name || "resume"}_${templateLayout}.pdf`);

    return true;
  } catch (err) {
    console.error("PDF generation failed:", err);
    if (container) document.body.removeChild(container);
    return false;
  }
};

// html2canvas can't parse lab()/oklch()/color() values, so normalize them to
// rgb colors while keeping the intended color (instead of forcing black/white).
function normalizeExoticColors(doc) {
  const probe = document.createElement("canvas").getContext("2d");
  const props = [
    "color",
    "backgroundColor",
    "borderTopColor",
    "borderRightColor",
    "borderBottomColor",
    "borderLeftColor",
  ];

  doc.querySelectorAll("*").forEach((el) => {
    props.forEach((prop) => {
      const value = el.style[prop] || getComputedStyle(el)[prop];
      if (typeof value !== "string") return;
      if (!value.match(/lab\(|oklch\(|color\(/)) return;
      probe.fillStyle = value;
      const rgb = probe.fillStyle;
      if (rgb && rgb !== value) el.style[prop] = rgb;
    });
  });
}