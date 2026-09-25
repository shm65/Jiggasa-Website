document.addEventListener("DOMContentLoaded", () => {
    const historyList = document.getElementById("history-list");
    const clearBtn = document.getElementById("clear-history");

    function loadProgress() {
        if (!historyList) return;
        
        const history = JSON.parse(localStorage.getItem("jiggasha_attempts")) || [];
        
        if (history.length === 0) {
            historyList.innerHTML = `<p style="color: var(--text-muted);">No quiz attempts recorded yet. Take a quiz to track your progress!</p>`;
            if (clearBtn) clearBtn.style.display = "none";
            return;
        }

        if (clearBtn) clearBtn.style.display = "block";
        
        historyList.innerHTML = history.map(h => `
            <div class="history-item" style="display: flex; justify-content: space-between; align-items: center; padding: 12px 0; border-bottom: 1px solid var(--border);">
                <div>
                    <strong>${h.title}</strong>
                    <div style="font-size: 0.75rem; color: var(--text-muted);">Attempted on: ${h.date}</div>
                </div>
                <span style="color: #16a34a; font-weight: 600; font-size: 0.85rem;"><i class="ph ph-check-circle"></i> Completed</span>
            </div>
        `).join("");
    }

    if (clearBtn) {
        clearBtn.addEventListener("click", () => {
            if (confirm("Are you sure you want to clear your local history?")) {
                localStorage.removeItem("jiggasha_attempts");
                loadProgress();
            }
        });
    }

    loadProgress();
});