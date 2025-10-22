const startBtn = document.getElementById('startBtn');

startBtn.addEventListener('click', () => {
  startBtn.disabled = true;
  startBtn.innerText = 'Loading...';
  setTimeout(() => {
     window.location.href = 'index.html';
    startBtn.innerHTML = 'Start Explore <span class="arrow">→</span>';
    startBtn.disabled = false;
  }, 700);
});
