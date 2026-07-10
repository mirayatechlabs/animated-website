<template>
  <div class="video-background">
    <canvas ref="canvasRef"></canvas>
    <div class="overlay"></div>
  </div>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

const canvasRef = ref(null);

onMounted(() => {
  gsap.registerPlugin(ScrollTrigger);

  const canvas = canvasRef.value;
  if (!canvas) return;
  const context = canvas.getContext('2d', { alpha: false });
  
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;

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

  let currentRenderedFrameValue = -1;
  let animationFrameId;

  function renderLoop() {
    animationFrameId = requestAnimationFrame(renderLoop);
    
    const floatFrame = heroParams.frame;
    if (Math.abs(floatFrame - currentRenderedFrameValue) < 0.001) return;
    
    const frameIndex1 = Math.floor(floatFrame);
    const frameIndex2 = Math.min(frameIndex1 + 1, frameCount - 1);
    const mix = floatFrame - frameIndex1;
    
    const img1 = images[frameIndex1];
    const img2 = images[frameIndex2];
    
    if (!img1 || !img1.complete || !img2 || !img2.complete) return;
    
    const hRatio = canvas.width / img1.width;
    const vRatio = canvas.height / img1.height;
    const ratio = Math.max(hRatio, vRatio);
    const centerShift_x = (canvas.width - img1.width * ratio) / 2;
    const centerShift_y = (canvas.height - img1.height * ratio) / 2;  
    
    context.globalAlpha = 1.0;
    context.drawImage(img1, 0, 0, img1.width, img1.height, centerShift_x, centerShift_y, img1.width * ratio, img1.height * ratio);
    
    if (mix > 0 && frameIndex1 !== frameIndex2) {
      context.globalAlpha = mix;
      context.drawImage(img2, 0, 0, img2.width, img2.height, centerShift_x, centerShift_y, img2.width * ratio, img2.height * ratio);
    }
    
    currentRenderedFrameValue = floatFrame;
  }

  animationFrameId = requestAnimationFrame(renderLoop);

  const resizeHandler = () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    currentRenderedFrameValue = -1;
  };
  window.addEventListener('resize', resizeHandler);

  const heroScrollTl = gsap.timeline({
      scrollTrigger: {
        trigger: ".hero",
        start: "top top",
        end: "+=150%",
        scrub: 0.1, // Ridotto drasticamente per rendere lo scroll immediato e non scattoso
        pin: true,
        anticipatePin: 1 // Aiuta a prevenire lo scatto quando si "aggancia"
      }
  });

  heroScrollTl.to(heroParams, {
    frame: frameCount - 1,
    ease: "none"
  }, 0);

  heroScrollTl.to('.hero-content', {
    yPercent: 30,
    opacity: 0,
    ease: "none"
  }, 0);

  // MODO CRITICO: Forza GSAP a ricalcolare le posizioni dopo che il Pin ha aggiunto padding
  setTimeout(() => {
    ScrollTrigger.refresh();
  }, 100);

  onBeforeUnmount(() => {
    cancelAnimationFrame(animationFrameId);
    window.removeEventListener('resize', resizeHandler);
    heroScrollTl.kill();
  });
});
</script>

<style scoped>
.video-background {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 0;
  overflow: hidden;
}
.video-background canvas {
  width: 100%;
  height: 100%;
  display: block;
  object-fit: cover;
  transform: scale(1.05);
}
.overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 102%;
  z-index: 10;
  pointer-events: none;
  background: linear-gradient(180deg, rgba(13,8,20,0.6) 0%, rgba(13,8,20,0.1) 40%, rgba(13,8,20,0) 50%, rgba(13,8,20,1) 95%, rgba(13,8,20,1) 100%);
}
</style>
