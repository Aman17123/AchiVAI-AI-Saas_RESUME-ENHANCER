import html2canvas from "html2canvas-pro";
import { jsPDF } from "jspdf";

const PAGE_RATIO = 297 / 210;
const MAX_FILL = 0.95;

export const downloadResumePDF = async (data, theme, templateLayout) => {
  // Find the live preview already rendered in the DOM
  const livePreview = document.querySelector(".pdf-render-target");
  if (!livePreview) {
    throw new Error("No resume preview found. Please wait for the editor to load.");
  }

  // 1. Create an off-screen A4 container placed at (0,0) behind the page
  // (Avoids offscreen clip issues when left is negative)
  const wrapper = document.createElement("div");
  wrapper.id = "achivai-pdf-wrapper";
  wrapper.style.cssText = [
    "position: fixed",
    "top: 0",
    "left: 0",
    "width: 794px",      // ≈ 210mm @ 96dpi (A4 width)
    "background: #ffffff",
    "z-index: -9999",
    "pointer-events: none",
    "overflow: visible",
    "opacity: 1",
  ].join(";");

  const clone = livePreview.cloneNode(true);
  clone.style.cssText = "width: 794px !important; max-width: none !important; transform: none !important; overflow: visible !important; background: #ffffff !important;";
  wrapper.appendChild(clone);
  document.body.appendChild(wrapper);

  // 2. Pre-convert any computed exotic colors to sRGB
  inlineComputedColors(wrapper);

  // 3. Wait for layout, fonts, and assets to settle
  if (document.fonts && document.fonts.ready) {
    await document.fonts.ready;
  }
  await new Promise((r) => setTimeout(r, 250));

  try {
    const wrapperRect = wrapper.getBoundingClientRect();

    // 4. Section snap points for clean page breaks
    const boundaries = [0];
    wrapper.querySelectorAll(".pdf-section-start, .break-inside-avoid").forEach((el) => {
      const top = el.getBoundingClientRect().top - wrapperRect.top;
      if (top > 1) boundaries.push(Math.round(top));
    });

    // 5. Capture with html2canvas-pro (native oklch, lab, color() support)
    const canvas = await html2canvas(wrapper, {
      scale: 2,
      useCORS: true,
      allowTaint: true,
      backgroundColor: "#ffffff",
      logging: false,
      windowWidth: 794,
      onclone: (clonedDoc) => {
        const el = clonedDoc.getElementById("achivai-pdf-wrapper");
        if (el) {
          el.style.position = "static";
          el.style.zIndex = "1";
        }
      },
    });

    // 6. Calculate dimensions & pages
    const widthPx = wrapperRect.width || 794;
    const pageHeightPx = widthPx * PAGE_RATIO;
    const ratio = canvas.width / widthPx;
    const totalPx = canvas.height / ratio;

    const pages = [];
    if (totalPx <= pageHeightPx * 1.05) {
      // Fits on a single A4 page
      pages.push({ top: 0, bottom: totalPx });
    } else {
      boundaries.push(Math.round(totalPx));
      let start = 0;
      while (start < totalPx - 1) {
        const endMax = start + pageHeightPx * MAX_FILL;
        const candidates = boundaries.filter((b) => b > start + 10 && b <= endMax);
        const end = candidates.length
          ? candidates[candidates.length - 1]
          : Math.min(start + pageHeightPx, totalPx);
        pages.push({ top: start, bottom: end });
        start = end;
        if (pages.length > 30) break;
      }
    }

    // 7. Build the PDF
    const PDFDoc = typeof jsPDF === "function" ? jsPDF : (jsPDF?.jsPDF || window.jspdf?.jsPDF);
    const pdf = new PDFDoc({ orientation: "portrait", unit: "mm", format: "a4" });
    const imgWidth = 210;

    pages.forEach((page, i) => {
      const sliceH = Math.max(1, Math.round((page.bottom - page.top) * ratio));
      const sliceW = canvas.width;
      const startY = Math.round(page.top * ratio);

      const slice = document.createElement("canvas");
      slice.width = sliceW;
      slice.height = sliceH;
      const ctx = slice.getContext("2d");
      if (!ctx) return;

      ctx.fillStyle = "#ffffff";
      ctx.fillRect(0, 0, sliceW, sliceH);
      ctx.drawImage(canvas, 0, startY, sliceW, sliceH, 0, 0, sliceW, sliceH);

      const imgData = slice.toDataURL("image/png");
      const imgH = (sliceH * imgWidth) / sliceW;
      if (i > 0) pdf.addPage();
      pdf.addImage(imgData, "PNG", 0, 0, imgWidth, imgH);
    });

    // 8. Trigger download
    const safeName = (data?.name || "Resume").trim().replace(/[^a-zA-Z0-9_-]/g, "_");
    pdf.save(`${safeName}_${templateLayout || "resume"}.pdf`);

    return true;
  } finally {
    if (wrapper?.parentNode) {
      wrapper.parentNode.removeChild(wrapper);
    }
  }
};

/**
 * Walk every element and replace any oklch / lab / color() value
 * with the browser-resolved RGB equivalent using a canvas 2D probe.
 */
function inlineComputedColors(root) {
  const probe = document.createElement("canvas");
  probe.width = probe.height = 1;
  const ctx = probe.getContext("2d");
  if (!ctx) return;

  const COLOR_PROPS = [
    "color",
    "backgroundColor",
    "borderTopColor",
    "borderRightColor",
    "borderBottomColor",
    "borderLeftColor",
    "outlineColor",
    "fill",
    "stroke",
  ];

  const EXOTIC = /oklch\s*\(|oklab\s*\(|lab\s*\(|lch\s*\(|color\s*\(/i;

  root.querySelectorAll("*").forEach((el) => {
    const computed = window.getComputedStyle(el);

    COLOR_PROPS.forEach((prop) => {
      const val = computed[prop];
      if (!val || !EXOTIC.test(val)) return;

      try {
        ctx.clearRect(0, 0, 1, 1);
        ctx.fillStyle = val;
        const rgb = ctx.fillStyle;
        if (rgb && rgb !== val) {
          el.style.setProperty(
            prop.replace(/([A-Z])/g, (m) => `-${m.toLowerCase()}`),
            rgb,
            "important"
          );
        }
      } catch {
        el.style.setProperty(
          prop.replace(/([A-Z])/g, (m) => `-${m.toLowerCase()}`),
          prop.includes("background") ? "#ffffff" : "#000000",
          "important"
        );
      }
    });

    const shadow = computed.boxShadow;
    if (shadow && EXOTIC.test(shadow)) {
      el.style.setProperty("box-shadow", "none", "important");
    }
  });
}