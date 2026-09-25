document.addEventListener("DOMContentLoaded", () => {
    const globalSearchInput = document.getElementById("global-search");
    if (!globalSearchInput) return;

    globalSearchInput.addEventListener("keypress", (e) => {
        if (e.key === "Enter") {
            const query = globalSearchInput.value.trim().toLowerCase();
            if (query.length > 0) {
                // Redirect user to quizzes page with search query or filter items
                window.location.href = `quizzes.html?search=${encodeURIComponent(query)}`;
            }
        }
    });
});