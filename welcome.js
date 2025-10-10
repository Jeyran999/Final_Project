const canvas = document.getElementById('starCanvas');
const ctx = canvas.getContext('2d');

let width = canvas.width = window.innerWidth;
let height = canvas.height = window.innerHeight;

const numStars = 150;
const stars = [];

for (let i = 0; i < numStars; i++) {
    stars.push({
        x: Math.random() * width,
        y: Math.random() * height,
        radius: Math.random() * 1.2 + 0.5,
        alpha: Math.random() * 0.5 + 0.3
    });
}

function drawStars() {
    ctx.clearRect(0, 0, width, height);
    stars.forEach(star => {
        ctx.beginPath();
        ctx.arc(star.x, star.y, star.radius, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255,255,255,${star.alpha})`;
        ctx.fill();
    });
}

function animateStars() {
    stars.forEach(star => {
        star.alpha += (Math.random() - 0.5) * 0.02;
        if (star.alpha < 0) star.alpha = 0;
        if (star.alpha > 1) star.alpha = 1;
    });
    drawStars();
    requestAnimationFrame(animateStars);
}

animateStars();

window.addEventListener('resize', () => {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
});

const box = document.querySelector('.welcome-box');
document.addEventListener('mousemove', e => {
    const x = (e.clientX / window.innerWidth - 0.5) * 15;
    const y = (e.clientY / window.innerHeight - 0.5) * 15;
    box.style.transform = `translate(${x}px, ${y}px) scale(1.03)`;
});
