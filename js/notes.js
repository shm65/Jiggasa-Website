document.addEventListener("DOMContentLoaded", () => {
    const container = document.getElementById("notes-container");
    if (!container) return;

    fetch("data/notes.json")
        .then(response => response.json())
        .then(notes => {
            if (notes.length === 0) {
                container.innerHTML = `<p style="color: var(--text-muted);">No notes available at the moment.</p>`;
                return;
            }

            container.innerHTML = notes.map(n => `
                <div class="note-card" style="background: var(--white); border: 1px solid var(--border); border-radius: 12px; padding: 20px; display: flex; justify-content: space-between; align-items: center; box-shadow: var(--shadow-sm); margin-bottom: 16px;">
                    <div class="note-info">
                        <div style="font-size: 0.75rem; color: var(--text-muted); margin-bottom: 4px;">Class ${n.class} • ${n.subject}</div>
                        <h3 style="font-size: 1.1rem; margin-bottom: 4px;">${n.title}</h3>
                        <p style="font-size: 0.85rem; color: var(--text-muted);">Chapter: ${n.chapter}</p>
                    </div>
                    <a href="${n.file}" target="_blank" class="btn-download" style="background: var(--primary-light); color: var(--primary); padding: 8px 16px; border-radius: 6px; font-weight: 600; font-size: 0.9rem; display: flex; align-items: center; gap: 6px; text-decoration: none;">
                        <i class="ph ph-download-simple"></i> View / Download
                    </a>
                </div>
            `).join("");
        })
        .catch(error => {
            console.error("Error loading notes:", error);
            container.innerHTML = `<p style="color: red;">Could not load notes data.</p>`;
        });
});