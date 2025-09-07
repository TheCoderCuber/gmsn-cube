// =========================
// Fade-in animation (existing)
const faders = document.querySelectorAll('.fade-in');
const appearOptions = { threshold: 0.2 };
const appearOnScroll = new IntersectionObserver(function(entries, appearOnScroll) {
  entries.forEach(entry => {
    if (!entry.isIntersecting) return;
    entry.target.classList.add('visible');
    appearOnScroll.unobserve(entry.target);
  });
}, appearOptions);
faders.forEach(fader => { appearOnScroll.observe(fader); });

// =========================
// Helper function to clean text
function cleanText(text) {
  return text ? text.replace(/"/g,'').trim().toLowerCase() : "";
}

// =========================
// Search by name using PapaParse with Change Events button
const changeBtn = document.getElementById('changeEventsBtn');

document.getElementById('searchBtn').onclick = function() {
  const nameInput = cleanText(document.getElementById('nameInput').value);
  const result = document.getElementById('result');
  changeBtn.style.display = 'none'; // hide initially
  result.textContent = "Searching...";

  const csvUrl = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vSReTGk9XBcgQXvvpMy_B4lnU6EgYCjiPAlw3IcDEUbYygTYQqNAW6tgZDZbQA_0uWa2fRrJ2gxYEbJ/pub?output=csv&gid=416130700';

  Papa.parse(csvUrl, {
    download: true,
    header: true,
    skipEmptyLines: true,
    complete: function(results) {
      const data = results.data;
      let found = false;

      data.forEach(row => {
        const name = cleanText(row["What is your full name? Ex: Mark Smith"]);
        if (!name) return;

        if (name === nameInput) {
          const events = row["What events will you be competing in? (Cubes are not provided, bring your own cubes for the events you are competing in)"] || "No events listed";

          // Show results
          result.innerHTML = `
            <div class="result-card">
              <strong>Name:</strong> ${row["What is your full name? Ex: Mark Smith"]}<br>
              <strong>Events:</strong> ${events}
            </div>
          `;

          // Show the "Change Events" button
          changeBtn.style.display = 'inline-block';
          changeBtn.href = `mailto:3003046@geneva304.org?subject=Change Events for ${encodeURIComponent(row["What is your full name? Ex: Mark Smith"])}&body=Hi,%0D%0A%0D%0AMy events listed are incorrect. Please update them to the following:%0D%0A[Enter your events here]%0D%0A%0D%0AThank you!`;

          found = true;
        }
      });

      if (!found) {
        result.textContent = "Name not found.";
        changeBtn.style.display = 'none';
      }
    },
    error: function(err) {
      console.error("CSV parse error:", err);
      result.textContent = "Error loading data. Check the CSV URL.";
      changeBtn.style.display = 'none';
    }
  });
};
