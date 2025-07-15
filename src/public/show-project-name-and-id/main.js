window.handelCTX = function(ctx = null) {
  if (ctx != null) {
    // 1. HREF aus Settings oder Default
    const defaultHref = 'https://cdn.jsdelivr.net/gh/sheeeesh-bit/suessco@latest/src/public/show-project-name-and-id/design.css';
    const cssHref = ctx.settings?.cssHref || defaultHref;

    // 2. Nur einmalig ins <head> einfügen
    if (!document.querySelector(`link[href="${cssHref}"]`)) {
      const linkEl = document.createElement('link');
      linkEl.rel = 'stylesheet';
      linkEl.href = cssHref;
      document.head.appendChild(linkEl);
    }

    // 3. Daten extrahieren
    const userLabel = ctx.data?.[0]?.data?.[0]?.[1] || 'No Data';
    const name      = ctx.data?.[1]?.data?.[0]?.[1] || 'No Data';

    // 4. Übersetzungen
    const userLabelLabel = ctx.translate?.instant('dashboard.sensor.sensor-project') || 'Project';
    const nameLabel      = ctx.translate?.instant('dashboard.sensor.sensor-project-id') || 'Project ID';

    // 5. Nur das Content-HTML zurückgeben
    return `
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

  // Fallback
  return `
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
};
