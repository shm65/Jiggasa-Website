document.addEventListener("DOMContentLoaded", () => {
    const container = document.getElementById("quiz-container");
    const searchInput = document.getElementById("quiz-search");
    const filterButtons = document.querySelectorAll(".filter-btn");

    let allQuizzes = [];

    // Fetch quizzes data from data/quizzes.json
    fetch("data/quizzes.json")
        .then(response => response.json())
        .then(data => {
            allQuizzes = data;
            displayQuizzes(allQuizzes);
        })
        .catch(error => {
            console.error("Error loading quizzes:", error);
            container.innerHTML = `<p style="color: red;">Could not load quizzes. Please check your local server or JSON file.</p>`;
        });

    // Render function
    function displayQuizzes(quizzes) {
        if (quizzes.length === 0) {
            container.innerHTML = `<p style="color: var(--text-muted);">No quizzes found.</p>`;
            return;
        }

        container.innerHTML = quizzes.map(q => `
            <div class="quiz-card">
                <div>
                    <div class="quiz-meta">
                        <span>Class ${q.class}</span>
                        <span>${q.subject}</span>
                        <span>${q.difficulty}</span>
                    </div>
                    <div class="quiz-title">${q.title}</div>
                    <p style="font-size: 0.85rem; color: var(--text-muted);">Chapter: ${q.chapter}</p>
                </div>
                <div class="quiz-footer">
                    <span><i class="ph ph-question"></i> ${q.questions} Questions &nbsp;|&nbsp; <i class="ph ph-clock"></i> ${q.time} min</span>
                    <a href="${q.file}" class="btn-start" onclick="saveQuizAttempt('${q.id}', '${q.title}')">Start Quiz</a>
                </div>
            </div>
        `).join("");
    }

    // Search filter
    if (searchInput) {
        searchInput.addEventListener("input", (e) => {
            const term = e.target.value.toLowerCase();
            const filtered = allQuizzes.filter(q => 
                q.title.toLowerCase().includes(term) || 
                q.subject.toLowerCase().includes(term) || 
                q.chapter.toLowerCase().includes(term)
            );
            displayQuizzes(filtered);
        });
    }

    // Category filter buttons
    filterButtons.forEach(btn => {
        btn.addEventListener("click", () => {
            filterButtons.forEach(b => b.classList.remove("active"));
            btn.classList.add("active");
            const filter = btn.getAttribute("data-filter");

            if (filter === "all") {
                displayQuizzes(allQuizzes);
            } else {
                const filtered = allQuizzes.filter(q => q.subject === filter);
                displayQuizzes(filtered);
            }
        });
    });
});

// Helper to save attempt locally when user clicks start
function saveQuizAttempt(id, title) {
    let history = JSON.parse(localStorage.getItem("jiggasha_attempts")) || [];
    history.push({ id, title, date: new Date().toLocaleDateString() });
    localStorage.setItem("jiggasha_attempts", JSON.stringify(history));
}