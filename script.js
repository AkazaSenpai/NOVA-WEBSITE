const canvas = document.getElementById("stars");
const ctx = canvas.getContext("2d");
const cursorGlow = document.querySelector(".cursor-glow");

let w, h, dpr, stars = [], mouse = { x: -999, y: -999 };
function resize() {
  dpr = Math.min(window.devicePixelRatio || 1, 2);
  w = window.innerWidth; h = window.innerHeight;
  canvas.width = Math.floor(w * dpr);
  canvas.height = Math.floor(h * dpr);
  canvas.style.width = w + "px";
  canvas.style.height = h + "px";
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  stars = Array.from({ length: Math.max(90, Math.floor(w / 13)) }, () => ({
    x: Math.random() * w, y: Math.random() * h, r: Math.random() * 1.4 + .2,
    a: Math.random() * .55 + .1, s: Math.random() * .25 + .06
  }));
}
function animateStars() {
  ctx.clearRect(0,0,w,h);
  for (const s of stars) {
    s.y += s.s;
    if (s.y > h + 3) { s.y = -3; s.x = Math.random() * w; }
    const dist = Math.hypot(s.x - mouse.x, s.y - mouse.y);
    const boost = dist < 140 ? (1 - dist / 140) * .5 : 0;
    ctx.beginPath();
    ctx.fillStyle = `rgba(205,232,255,${Math.min(1, s.a + boost)})`;
    ctx.arc(s.x, s.y, s.r + boost * 1.5, 0, Math.PI * 2);
    ctx.fill();
  }
  requestAnimationFrame(animateStars);
}
resize(); animateStars();
window.addEventListener("resize", resize);
window.addEventListener("pointermove", e => {
  mouse.x = e.clientX; mouse.y = e.clientY;
  cursorGlow.style.left = e.clientX + "px";
  cursorGlow.style.top = e.clientY + "px";
});

const observer = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) entry.target.classList.add("visible");
  });
}, { threshold: .12 });
document.querySelectorAll(".reveal").forEach((el, i) => {
  el.style.transitionDelay = `${Math.min(i * 35, 220)}ms`;
  observer.observe(el);
});

document.querySelectorAll(".tilt").forEach(card => {
  card.addEventListener("pointermove", e => {
    if (window.innerWidth < 900) return;
    const r = card.getBoundingClientRect();
    const x = (e.clientX - r.left) / r.width;
    const y = (e.clientY - r.top) / r.height;
    card.style.transform = `perspective(900px) rotateX(${(0.5-y)*5}deg) rotateY(${(x-.5)*6}deg) translateY(-5px)`;
  });
  card.addEventListener("pointerleave", () => card.style.transform = "");
});

document.querySelectorAll('a[href^="#"]').forEach(link => {
  link.addEventListener("click", e => {
    const target = document.querySelector(link.getAttribute("href"));
    if (!target) return;
    e.preventDefault();
    target.scrollIntoView({ behavior: "smooth" });
  });
});
