import html2canvas from "html2canvas";
import jsPDF from "jspdf";

const PAGE_RATIO = 297 / 210;
const MAX_FILL = 0.95;

/**
 * Renders the resume template into an offscreen DOM node,
 * captures it with html2canvas, then slices into A4 pages.
 *
 * Works in Next.js App Router (no renderToString needed).
 */
export const downloadResumePDF = async (data, theme, templateLayout) => {
  // 1. Create a hidden, off-screen A4-width wrapper
  const wrapper = document.createElement("div");
  wrapper.style.cssText = `
    position: fixed;
    top: 0;
    left: -99999px;
    width: 210mm;
    background: #ffffff;
    z-index: -9999;
  `;
  wrapper.className = "pdf-export";
  document.body.appendChild(wrapper);

  // 2. Find the live preview element in the page (it's already rendered)
  //    and clone it so we can force a full A4 width without affecting the UI.
  const livePreview = document.querySelector(".pdf-render-target");

  let container;
  if (livePreview) {
    container = livePreview.cloneNode(true);
    container.style.width = "210mm";
    container.style.maxWidth = "none";
    container.style.transform = "none";
    wrapper.appendChild(container);
  } else {
    // Fallback: render using an iframe-style approach
    wrapper.innerHTML = `<div id="pdf-inner" style="width:210mm;background:#fff;padding:0;margin:0;"></div>`;
    container = wrapper.querySelector("#pdf-inner");
  }

  document.body.appendChild(wrapper);

  // 3. Wait for fonts + layout
  await document.fonts.ready;
  await new Promise((r) => setTimeout(r, 400));

  try {
    const containerRect = wrapper.getBoundingClientRect();

    // 4. Snap boundaries at section starts
    const boundaries = [0];
    wrapper.querySelectorAll(".pdf-section-start").forEach((el) => {
      const top = el.getBoundingClientRect().top - containerRect.top;
      if (top > 1) boundaries.push(Math.round(top));
    });

    // 5. Capture with html2canvas
    const canvas = await html2canvas(wrapper, {
      scale: 2,
      useCORS: true,
      allowTaint: true,
      backgroundColor: "#ffffff",
      logging: false,
      onclone: (doc) => normalizeExoticColors(doc),
    });

    document.body.removeChild(wrapper);

    // 6. Compute page slices
    const widthPx = containerRect.width || 794;
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
      if (pages.length > 30) break;
    }

    // 7. Build PDF
    const pdf = new jsPDF({
      orientation: "portrait",
      unit: "mm",
      format: "a4",
    });

    const imgWidth = 210;

    pages.forEach((page, i) => {
      const sliceHeightPx = Math.max(1, Math.round((page.bottom - page.top) * ratio));
      const sliceWidthPx = canvas.width;
      const startY = Math.round(page.top * ratio);

      const sliceCanvas = document.createElement("canvas");
      sliceCanvas.width = sliceWidthPx;
      sliceCanvas.height = sliceHeightPx;
      const ctx = sliceCanvas.getContext("2d");

      if (ctx) {
        ctx.fillStyle = "#ffffff";
        ctx.fillRect(0, 0, sliceWidthPx, sliceHeightPx);
        ctx.drawImage(canvas, 0, startY, sliceWidthPx, sliceHeightPx, 0, 0, sliceWidthPx, sliceHeightPx);

        const sliceData = sliceCanvas.toDataURL("image/png");
        const sliceHeightMm = (sliceHeightPx * imgWidth) / sliceWidthPx;

        if (i > 0) pdf.addPage();
        pdf.addImage(sliceData, "PNG", 0, 0, imgWidth, sliceHeightMm);
      }
    });

    // 8. Trigger download
    const cleanFileName = (data?.name || "Resume")
      .trim()
      .replace(/[^a-zA-Z0-9_-]/g, "_");
    pdf.save(`${cleanFileName}_${templateLayout || "resume"}.pdf`);

    return true;
  } catch (err) {
    console.error("PDF generation failed:", err);
    if (wrapper?.parentNode) {
      document.body.removeChild(wrapper);
    }
    throw err; // Re-throw so caller can show real error
  }
};

// html2canvas can't parse lab()/oklch()/color() — normalize to rgb
function normalizeExoticColors(doc) {
  const probe = document.createElement("canvas").getContext("2d");
  if (!probe) return;

  const props = [
    "color", "backgroundColor",
    "borderTopColor", "borderRightColor",
    "borderBottomColor", "borderLeftColor",
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