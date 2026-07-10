<template>
  <!-- Livello dedicato solo alle bolle, posizionato su tutta la sezione genitore -->
  <div class="cursor-layer" ref="cursorLayerRef">
    <div class="main-bubble" ref="mainBubbleRef" :class="{ active: isHovering }"></div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue';
import { gsap } from 'gsap';

const cursorLayerRef = ref(null);
const mainBubbleRef = ref(null);
const isHovering = ref(false);

let xTo, yTo;
let parentSection = null;

onMounted(() => {
  xTo = gsap.quickTo(mainBubbleRef.value, "x", {duration: 0.15, ease: "power3"});
  yTo = gsap.quickTo(mainBubbleRef.value, "y", {duration: 0.15, ease: "power3"});

  // Attach events directly to the parent section (.brand-story) so we don't break CSS flexbox or GSAP
  parentSection = document.querySelector('.brand-story');
  if (parentSection) {
    parentSection.addEventListener('mousemove', onMouseMove);
    parentSection.addEventListener('mouseenter', onMouseEnter);
    parentSection.addEventListener('mouseleave', onMouseLeave);
    // Nasconde il cursore normale sulla sezione
    parentSection.style.cursor = 'none';
  }
});

onUnmounted(() => {
  if (parentSection) {
    parentSection.removeEventListener('mousemove', onMouseMove);
    parentSection.removeEventListener('mouseenter', onMouseEnter);
    parentSection.removeEventListener('mouseleave', onMouseLeave);
    parentSection.style.cursor = 'auto';
  }
});

let lastSpawn = 0;

const onMouseMove = (e) => {
  if (!parentSection || !cursorLayerRef.value) return;
  const rect = parentSection.getBoundingClientRect();
  const x = e.clientX - rect.left;
  const y = e.clientY - rect.top;

  xTo(x);
  yTo(y);

  const now = Date.now();
  if (now - lastSpawn > 40) {
    spawnTrail(x, y);
    lastSpawn = now;
  }
};

const spawnTrail = (x, y) => {
  if (!cursorLayerRef.value) return;
  
  const bubble = document.createElement('div');
  bubble.classList.add('trail-bubble');
  
  const size = Math.random() * 12 + 6;
  bubble.style.width = `${size}px`;
  bubble.style.height = `${size}px`;
  bubble.style.left = `${x - size/2}px`;
  bubble.style.top = `${y - size/2}px`;
  
  cursorLayerRef.value.appendChild(bubble);

  gsap.to(bubble, {
    y: `-=${Math.random() * 50 + 20}`,
    x: `+=${Math.random() * 30 - 15}`,
    scale: 0.1,
    opacity: 0,
    duration: Math.random() * 0.8 + 0.6,
    ease: "power1.out",
    onComplete: () => bubble.remove()
  });
};

const onMouseEnter = () => isHovering.value = true;
const onMouseLeave = () => isHovering.value = false;
</script>

<style scoped>
.cursor-layer {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none; /* Lascia passare i click verso i testi sotto */
  z-index: 50;
  overflow: hidden;
}

.main-bubble {
  position: absolute;
  top: -20px;
  left: -20px;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  border: 1px solid rgba(216, 180, 254, 0.6);
  background: radial-gradient(circle at 30% 30%, rgba(255,255,255,0.5), rgba(168, 85, 247, 0.15) 50%, rgba(0,0,0,0) 100%);
  box-shadow: 0 0 20px rgba(168, 85, 247, 0.4), inset 0 0 10px rgba(255,255,255,0.6);
  backdrop-filter: blur(2px);
  opacity: 0;
  transform: scale(0);
  transition: opacity 0.3s ease, transform 0.3s ease;
}

.main-bubble.active {
  opacity: 1;
  transform: scale(1);
}

:global(.trail-bubble) {
  position: absolute;
  border-radius: 50%;
  border: 1px solid rgba(192, 132, 252, 0.5);
  background: radial-gradient(circle at 30% 30%, rgba(255,255,255,0.4), rgba(168, 85, 247, 0.1) 60%, rgba(0,0,0,0) 100%);
  box-shadow: inset 0 0 5px rgba(255,255,255,0.4);
  pointer-events: none;
  z-index: 49;
}
</style>
