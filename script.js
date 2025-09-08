// Countdown
var countDownDate = new Date("Jan 5, 2030").getTime();
var x = setInterval(function() {
  var now = new Date().getTime();
  var distance = countDownDate - now;
  var days = Math.floor(distance / (1000*60*60*24));
  var hours = Math.floor((distance % (1000*60*60*24))/(1000*60*60));
  var minutes = Math.floor((distance % (1000*60*60))/(1000*60));
  var seconds = Math.floor((distance % (1000*60))/1000);
  document.getElementById("days").innerHTML = days;
  document.getElementById("hours").innerHTML = hours;
  document.getElementById("minutes").innerHTML = minutes;
  document.getElementById("seconds").innerHTML = seconds;
  if(distance<0){clearInterval(x); document.getElementById("timer").innerHTML="🎉 The event has started!";}
},1000);

// Fade-in animation
const faders = document.querySelectorAll('.fade-in');
const appearOptions = { threshold: 0.2 };
const appearOnScroll = new IntersectionObserver((entries, observer) => {
  entries.forEach(entry => {
    if(!entry.isIntersecting) return;
    entry.target.classList.add('visible');
    observer.unobserve(entry.target);
  });
}, appearOptions);
faders.forEach(fader => appearOnScroll.observe(fader));

// Search
const changeBtn = document.getElementById('changeEventsBtn');
const result = document.getElementById('result');
const spinner = document.getElementById('loadingSpinner');

document.getElementById('searchBtn').onclick = function(){
  const nameInput = document.getElementById('nameInput').value.replace(/"/g,'').trim().toLowerCase();
  changeBtn.style.display='none';
  result.innerHTML="";
  spinner.style.display='block';

  const csvUrl='https://docs.google.com/spreadsheets/d/e/2PACX-1vSReTGk9XBcgQXvvpMy_B4lnU6EgYCjiPAlw3IcDEUbYygTYQqNAW6tgZDZbQA_0uWa2fRrJ2gxYEbJ/pub?output=csv&gid=416130700';

  Papa.parse(csvUrl,{
    download:true,
    header:true,
    skipEmptyLines:true,
    complete:function(resultsData){
      spinner.style.display='none';
      const data=resultsData.data;
      const found=data.some(row=>{
        const name=row["What is your full name? Ex: Mark Smith"]?.replace(/"/g,'').trim().toLowerCase();
        if(!name) return false;
        if(name===nameInput){
          const events=row["What events will you be competing in? (Cubes are not provided, bring your own cubes for the events you are competing in)"]||"No events listed";
          result.innerHTML=`<div class="result-card"><strong>Name:</strong> ${row["What is your full name? Ex: Mark Smith"]}<br><strong>Events:</strong> ${events}</div>`;
          changeBtn.style.display='inline-block';
          changeBtn.href=`mailto:3003046@geneva304.org?subject=Change Events for ${encodeURIComponent(row["What is your full name? Ex: Mark Smith"])}&body=Hi,%0D%0A%0D%0AMy events listed are incorrect. Please update them to the following:%0D%0A[Enter your events here]%0D%0A%0D%0AThank you!`;
          return true;
        }
        return false;
      });
      if(!found){result.innerHTML=`<div class="result-card error">Name not registered.</div>`; changeBtn.style.display='none';}
    },
    error:function(err){console.error(err); spinner.style.display='none'; result.innerHTML=`<div class="result-card error">Error loading data. Check the CSV URL.</div>`; changeBtn.style.display='none';}
  });
};
