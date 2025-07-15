export default function handelCTX(ctx = null) {
  if (ctx != null) {
    // Extract data
    const userLabel = ctx.data?.[0]?.data?.[0]?.[1] || "No Data";
    const name = ctx.data?.[1]?.data?.[0]?.[1] || "No Data";

    // Translations
    const userLabelLabel = ctx.translate?.instant('dashboard.sensor.sensor-project') || "Project";
    const nameLabel = ctx.translate?.instant('dashboard.sensor.sensor-project-id') || "Project ID";

    // HTML content with external CSS via jsDelivr
    return `
      <link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/sheeeesh-bit/suessco@v0.0.4/src/public/show-project-name-and-id/design.css">
      <div class="container">
        <br>
        <span class="font-large">
          <strong>${userLabelLabel}</strong> <span>${userLabel}</span>
        </span>
        <br>
        <span class="font-large">
          <strong>${nameLabel}</strong> <span>${name}</span>
        </span>
      </div>
    `;
  }

  // Fallback when context is not available
  return `
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/sheeeesh-bit/suessco@v0.0.4/src/public/show-project-name-and-id/design.css">
    <div class="container">
      <br>
      <span class="font-large">
        <strong>Project</strong> <span>No Data</span>
      </span>
      <br>
      <span class="font-large">
        <strong>Project ID</strong> <span>No Data</span>
      </span>
    </div>
  `;
}
