// Fade-in animation
const faders = document.querySelectorAll('.fade-in');
const appearOptions = { threshold: 0.2 };
const appearOnScroll = new IntersectionObserver((entries, observer) => {
  entries.forEach(entry => {
    if (!entry.isIntersecting) return;
    entry.target.classList.add('visible');
    observer.unobserve(entry.target);
  });
}, appearOptions);
faders.forEach(fader => appearOnScroll.observe(fader));

// Helper: clean text
function cleanText(text) {
  return text ? text.replace(/"/g,'').trim().toLowerCase() : "";
}

// Search
const changeBtn = document.getElementById('changeEventsBtn');
const result = document.getElementById('result');
const spinner = document.getElementById('loadingSpinner');

document.getElementById('searchBtn').onclick = function() {
  const nameInput = cleanText(document.getElementById('nameInput').value);
  changeBtn.style.display = 'none';
  result.innerHTML = "";
  spinner.style.display = 'block';

  const csvUrl = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vSReTGk9XBcgQXvvpMy_B4lnU6EgYCjiPAlw3IcDEUbYygTYQqNAW6tgZDZbQA_0uWa2fRrJ2gxYEbJ/pub?output=csv&gid=416130700';

  Papa.parse(csvUrl, {
    download: true,
    header: true,
    skipEmptyLines: true,
    complete: function(resultsData) {
      spinner.style.display = 'none';
      const data = resultsData.data;

      const found = data.some(row => {
        const name = cleanText(row["What is your full name? Ex: Mark Smith"]);
        if (!name) return false;

        if (name === nameInput) {
          const events = row["What events will you be competing in? (Cubes are not provided, bring your own cubes for the events you are competing in)"] || "No events listed";

          result.innerHTML = `
            <div class="result-card">
              <strong>Name:</strong> ${row["What is your full name? Ex: Mark Smith"]}<br>
              <strong>Events:</strong> ${events}
            </div>
          `;

          changeBtn.style.display = 'inline-block';
          changeBtn.href = `mailto:3003046@geneva304.org?subject=Change Events for ${encodeURIComponent(row["What is your full name? Ex: Mark Smith"])}&body=Hi,%0D%0A%0D%0AMy events listed are incorrect. Please update them to the following:%0D%0A[Enter your events here]%0D%0A%0D%0AThank you!`;

          return true; // stop iteration
        }

        return false;
      });

      if (!found) {
        result.innerHTML = `<div class="result-card error">Name not registered.</div>`;
        changeBtn.style.display = 'none';
      }
    },
    error: function(err) {
      console.error("CSV parse error:", err);
      spinner.style.display = 'none';
      result.innerHTML = `<div class="result-card error">Error loading data. Check the CSV URL.</div>`;
      changeBtn.style.display = 'none';
    }
  });
};
