document.addEventListener('DOMContentLoaded', () => {

  // Fade-in sections
  const faders = document.querySelectorAll('.fade-in');
  const observer = new IntersectionObserver((entries, obs) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add('visible');
      obs.unobserve(entry.target);
    });
  }, { threshold: 0.2 });
  faders.forEach(fader => observer.observe(fader));

  // Countdown
  const countDownDate = new Date("Jan 5, 2030").getTime();
  setInterval(() => {
    const now = new Date().getTime();
    const distance = countDownDate - now;
    const days = Math.floor(distance / (1000*60*60*24));
    const hours = Math.floor((distance % (1000*60*60*24)) / (1000*60*60));
    const minutes = Math.floor((distance % (1000*60*60)) / (1000*60));
    const seconds = Math.floor((distance % (1000*60)) / 1000);
    document.getElementById("days").textContent = days;
    document.getElementById("hours").textContent = hours;
    document.getElementById("minutes").textContent = minutes;
    document.getElementById("seconds").textContent = seconds;
    if (distance < 0) {
      document.getElementById("timer").innerHTML = "🎉 The event has started!";
    }
  }, 1000);

  // Helper for CSV search
  function cleanText(text) { return text ? text.replace(/"/g,'').trim().toLowerCase() : ""; }

  const changeBtn = document.getElementById('changeEventsBtn');
  const result = document.getElementById('result');
  const spinner = document.getElementById('loadingSpinner');
  const searchBtn = document.getElementById('searchBtn');

  searchBtn.addEventListener('click', () => {
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
            result.innerHTML = `<div class="result-card"><strong>Name:</strong> ${row["What is your full name? Ex: Mark Smith"]}<br><strong>Events:</strong> ${events}</div>`;
            changeBtn.style.display = 'inline-block';
            changeBtn.href = `mailto:3003046@geneva304.org?subject=Change Events for ${encodeURIComponent(row["What is your full name? Ex: Mark Smith"])}&body=Hi,%0D%0A%0D%0AMy events listed are incorrect. Please update them to the following:%0D%0A[Enter your events here]%0D%0A%0D%0AThank you!`;
            return true;
          }
          return false;
        });
        if (!found) { result.innerHTML = `<div class="result-card error">Name not registered.</div>`; changeBtn.style.display = 'none'; }
      },
      error: function(err) {
        console.error("CSV parse error:", err);
        spinner.style.display = 'none';
        result.innerHTML = `<div class="result-card error">Error loading data. Check the CSV URL.</div>`;
        changeBtn.style.display = 'none';
      }
    });
  });

});
