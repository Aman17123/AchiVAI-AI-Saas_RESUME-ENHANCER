import html2canvas from "html2canvas";
import jsPDF from "jspdf";

const PAGE_RATIO = 297 / 210;
const MAX_FILL = 0.95;

export const downloadResumePDF = async (data, theme, templateLayout) => {
  // Find the live preview already rendered in the DOM
  const livePreview = document.querySelector(".pdf-render-target");
  if (!livePreview) {
    throw new Error("No resume preview found. Please wait for the editor to load.");
  }

  // 1. Clone the live preview into an off-screen A4 wrapper
  const wrapper = document.createElement("div");
  wrapper.style.cssText = [
    "position:fixed",
    "top:0",
    "left:-99999px",
    "width:794px",      // ≈ 210mm @ 96dpi
    "background:#ffffff",
    "z-index:-9999",
    "overflow:visible",
  ].join(";");

  const clone = livePreview.cloneNode(true);
  clone.style.cssText = "width:794px;max-width:none;transform:none;overflow:visible;";
  wrapper.appendChild(clone);
  document.body.appendChild(wrapper);

  // 2. Inline ALL computed colors so html2canvas never sees oklch / lab / color()
  inlineComputedColors(wrapper);

  // 3. Wait for layout + fonts
  await document.fonts.ready;
  await new Promise((r) => setTimeout(r, 300));

  try {
    const wrapperRect = wrapper.getBoundingClientRect();

    // 4. Section snap points for clean page breaks
    const boundaries = [0];
    wrapper.querySelectorAll(".pdf-section-start").forEach((el) => {
      const top = el.getBoundingClientRect().top - wrapperRect.top;
      if (top > 1) boundaries.push(Math.round(top));
    });

    // 5. Capture with html2canvas
    const canvas = await html2canvas(wrapper, {
      scale: 2,
      useCORS: true,
      allowTaint: true,
      backgroundColor: "#ffffff",
      logging: false,
      // No onclone needed — we already inlined all colors above
    });

    document.body.removeChild(wrapper);

    // 6. Slice into A4 pages
    const widthPx = wrapperRect.width || 794;
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

    // 7. Build the PDF
    const pdf = new jsPDF({ orientation: "portrait", unit: "mm", format: "a4" });
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
  } catch (err) {
    if (wrapper?.parentNode) document.body.removeChild(wrapper);
    throw err;
  }
};

/**
 * Walk every element and replace any oklch / lab / color() value
 * with the browser-resolved RGB equivalent using a canvas 2D probe.
 * This must run BEFORE html2canvas, not inside onclone.
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
        ctx.fillStyle = val;           // browser converts oklch → sRGB internally
        const rgb = ctx.fillStyle;     // returns '#rrggbb' or 'rgb(...)'
        if (rgb && rgb !== val) {
          el.style.setProperty(
            prop.replace(/([A-Z])/g, (m) => `-${m.toLowerCase()}`),
            rgb,
            "important"
          );
        }
      } catch {
        // If conversion fails, fall back to a neutral colour
        el.style.setProperty(
          prop.replace(/([A-Z])/g, (m) => `-${m.toLowerCase()}`),
          prop.includes("background") ? "#ffffff" : "#000000",
          "important"
        );
      }
    });

    // Also kill any box-shadow that uses exotic colors (html2canvas can't parse them)
    const shadow = computed.boxShadow;
    if (shadow && EXOTIC.test(shadow)) {
      el.style.setProperty("box-shadow", "none", "important");
    }
  });
}