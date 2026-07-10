import './style.css';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Lenis from 'lenis';

// Register GSAP Plugins
gsap.registerPlugin(ScrollTrigger);

// 1. Initialize Smooth Scrolling (Lenis)
const lenis = new Lenis({
  duration: 1.5, // Smoother and slower
  easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
  direction: 'vertical',
  gestureDirection: 'vertical',
  smooth: true,
  mouseMultiplier: 1,
  smoothTouch: false,
  touchMultiplier: 2,
  infinite: false,
});

function raf(time) {
  lenis.raf(time);
  requestAnimationFrame(raf);
}
requestAnimationFrame(raf);

lenis.on('scroll', ScrollTrigger.update);
gsap.ticker.add((time)=>{
  lenis.raf(time * 1000);
});
gsap.ticker.lagSmoothing(0, 0);

// --- PREMIUM ANIMATIONS ---

// 1. Hero Entrance Animation
// (Rimossa l'animazione lettera per lettera che rimuoveva il <br> e risultava scattosa)
const tlHero = gsap.timeline();
tlHero.from('.tagline', {
  y: 40,
  opacity: 0,
  duration: 1.5,
  ease: "power3.out",
  delay: 0.2
});
tlHero.from('.scroll-indicator', {
  opacity: 0,
  y: 20,
  duration: 1,
  ease: "power2.out"
}, "-=0.8");

// 2. Canvas Image Sequence Animation (Ultra-Optimized)
const canvas = document.getElementById('hero-canvas');
// Disabilita il canale alpha (trasparenza) per un boost enorme di performance sulla GPU
const context = canvas.getContext('2d', { alpha: false });

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

// Imposta da che frame iniziare per evitare le parti iniziali meno visibili
const startFrame = 35;
const endFrame = 99;
const frameCount = (endFrame - startFrame) + 1;

const currentFrame = index => {
  const actualIndex = startFrame + index;
  return `/hero_anim/Neural_network_glowing_in_void_202607101738_${String(actualIndex).padStart(3, '0')}.jpg`;
};

const images = [];
const heroParams = { frame: 0 };

for (let i = 0; i < frameCount; i++) {
  const img = new Image();
  img.src = currentFrame(i);
  images.push(img);
}

// Variabile per tenere traccia dell'esatto valore decimale disegnato
let currentRenderedFrameValue = -1;

function renderLoop() {
  requestAnimationFrame(renderLoop);
  
  const floatFrame = heroParams.frame;
  
  // Se non c'è stato alcun movimento significativo, non ridisegnare
  if (Math.abs(floatFrame - currentRenderedFrameValue) < 0.001) return;
  
  // Calcoliamo i due frame tra cui ci troviamo (es. 15.6 -> frame 15 e frame 16)
  const frameIndex1 = Math.floor(floatFrame);
  const frameIndex2 = Math.min(frameIndex1 + 1, frameCount - 1);
  const mix = floatFrame - frameIndex1; // La parte decimale (es. 0.6)
  
  const img1 = images[frameIndex1];
  const img2 = images[frameIndex2];
  
  if (!img1 || !img1.complete || !img2 || !img2.complete) return;
  
  const hRatio = canvas.width / img1.width;
  const vRatio = canvas.height / img1.height;
  const ratio = Math.max(hRatio, vRatio);
  const centerShift_x = (canvas.width - img1.width * ratio) / 2;
  const centerShift_y = (canvas.height - img1.height * ratio) / 2;  
  
  // 1. Disegna il frame base (completamente opaco)
  context.globalAlpha = 1.0;
  context.drawImage(img1, 0, 0, img1.width, img1.height, centerShift_x, centerShift_y, img1.width * ratio, img1.height * ratio);
  
  // 2. Disegna il frame successivo in sovrapposizione con l'opacità pari al decimale (effetto Crossfade/Blending)
  if (mix > 0 && frameIndex1 !== frameIndex2) {
    context.globalAlpha = mix;
    context.drawImage(img2, 0, 0, img2.width, img2.height, centerShift_x, centerShift_y, img2.width * ratio, img2.height * ratio);
  }
  
  currentRenderedFrameValue = floatFrame;
}

// Avvia il loop infinito slegato da GSAP
requestAnimationFrame(renderLoop);

window.addEventListener('resize', () => {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  currentRenderedFrameValue = -1; // Forza un ridisegno
});

// GSAP Anima il valore decimale (non arrotondiamo!)
gsap.to(heroParams, {
  frame: frameCount - 1,
  ease: "none",
  scrollTrigger: {
    trigger: ".hero",
    start: "top top",
    end: "+=150%", // Il trucco magico: pinna la Hero per il 150% dell'altezza dello schermo!
    scrub: true,
    pin: true, // Blocca lo scroll della pagina finché l'animazione non finisce
    anticipatePin: 1
  }
});

gsap.to('.hero-content', {
  yPercent: 50,
  opacity: 0,
  ease: "none",
  scrollTrigger: {
    trigger: ".hero",
    start: "top top",
    end: "bottom top",
    scrub: true
  }
});

// 3. Brand Story Fade Up
gsap.from('.story-text > *', {
  y: 60,
  opacity: 0,
  duration: 1.2,
  stagger: 0.2,
  ease: "power3.out",
  scrollTrigger: {
    trigger: ".brand-story",
    start: "top 75%",
  }
});
gsap.from('.elegant-product', {
  y: 100,
  opacity: 0,
  duration: 1.5,
  ease: "power4.out",
  scrollTrigger: {
    trigger: ".brand-story",
    start: "top 75%",
  }
});

// 4. Pillars
gsap.from('.pillar', {
  y: 60,
  opacity: 0,
  duration: 1,
  stagger: 0.2,
  ease: "back.out(1.2)",
  scrollTrigger: {
    trigger: ".pillars",
    start: "top 80%",
  }
});

// 5. Product Cards
gsap.from('.product-card', {
  y: 80,
  opacity: 0,
  duration: 1,
  stagger: 0.15,
  ease: "power3.out",
  scrollTrigger: {
    trigger: ".product-showcase",
    start: "top 75%",
  }
});

// 6. CTA Parallax
gsap.from('.cta h2, .cta p, .signup-form', {
  y: 50,
  opacity: 0,
  duration: 1,
  stagger: 0.2,
  ease: "power3.out",
  scrollTrigger: {
    trigger: ".cta",
    start: "top 80%",
  }
});
