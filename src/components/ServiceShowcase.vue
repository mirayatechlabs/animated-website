<template>
  <div class="agency-showcase">
    <!-- Accordion List (Left) -->
    <div class="service-accordion">
      <div 
        v-for="(service, index) in services" 
        :key="index"
        class="accordion-item"
        :class="{ active: activeIndex === index }"
        @click="activeIndex = index"
      >
        <div class="accordion-header">
          <span class="number">0{{ index + 1 }}</span>
          <h3 class="title">{{ service.shortTitle }}</h3>
          <span class="icon-arrow">↗</span>
        </div>
        
        <transition 
          @enter="enterAccordion" 
          @leave="leaveAccordion"
          :css="false"
        >
          <div class="accordion-body" v-if="activeIndex === index">
            <div class="body-content">
              <h4>{{ service.title }}</h4>
              <p>{{ service.desc }}</p>
            </div>
          </div>
        </transition>
      </div>
    </div>

    <!-- Media Window (Right) -->
    <div class="media-window">
      <transition name="media-fade" mode="out-in">
        <div class="media-inner" :key="activeIndex">
          <template v-if="services[activeIndex].videoUrl">
            <video 
              class="media-video" 
              :src="services[activeIndex].videoUrl" 
              autoplay loop muted playsinline>
            </video>
          </template>
          <template v-else>
            <div class="media-shape" :class="'shape-' + activeIndex"></div>
          </template>
        </div>
      </transition>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { gsap } from 'gsap';

const activeIndex = ref(0);

const services = [
  {
    shortTitle: "Siti Web AI-Ready",
    title: "Ottimizzazione per Motori IA (AIO)",
    desc: "I motori di ricerca si sono evoluti. Strutturiamo il tuo sito web con un'architettura semantica avanzata per fare in modo che venga letto, compreso e citato come fonte primaria dalle Intelligenze Artificiali generative (ChatGPT, Perplexity, Claude).",
    videoUrl: "/video_web.mp4"
  },
  {
    shortTitle: "Automazioni Aziendali",
    title: "Flussi di Lavoro IA su Misura",
    desc: "Liberiamo il tuo bene più prezioso: il tempo. Analizziamo i tuoi processi e creiamo agenti IA personalizzati per gestire task ripetitivi o analisi dati. Meno burocrazia, più spazio per il lavoro ad alto valore aggiunto."
  },
  {
    shortTitle: "Sviluppo Software",
    title: "Software Gestionale Personalizzato",
    desc: "Quel file Excel infinito o quel gestionale obsoleto che usi da 10 anni sta bloccando la tua crescita. Lo trasformiamo in un'applicazione web o mobile moderna, scalabile e ultrasicura, disegnata chirurgicamente sulle tue procedure."
  }
];

// GSAP Accordion Animations
const enterAccordion = (el, done) => {
  gsap.fromTo(el, 
    { height: 0, opacity: 0 }, 
    { height: 'auto', opacity: 1, duration: 0.6, ease: 'power3.out', onComplete: done }
  );
};

const leaveAccordion = (el, done) => {
  gsap.to(el, 
    { height: 0, opacity: 0, duration: 0.4, ease: 'power3.inOut', onComplete: done }
  );
};
</script>

<style scoped>
.agency-showcase {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 5rem;
  margin-top: 4rem;
  align-items: start;
}
@media (max-width: 900px) {
  .agency-showcase {
    grid-template-columns: 1fr;
    gap: 3rem;
  }
}

/* ACCORDION */
.service-accordion {
  display: flex;
  flex-direction: column;
  border-top: 1px solid rgba(255,255,255,0.1);
}
.accordion-item {
  border-bottom: 1px solid rgba(255,255,255,0.1);
  cursor: pointer;
  overflow: hidden;
  group: true;
}
.accordion-header {
  display: flex;
  align-items: center;
  padding: 2.5rem 0;
  transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1);
}
.number {
  font-family: 'Cormorant Garamond', serif;
  font-size: 1.5rem;
  font-style: italic;
  opacity: 0.3;
  width: 40px;
  transition: opacity 0.4s;
}
.title {
  font-size: 2.5rem;
  font-weight: 500;
  letter-spacing: -0.03em;
  color: rgba(255,255,255,0.5);
  margin: 0;
  flex-grow: 1;
  transition: color 0.4s, transform 0.4s;
}
.icon-arrow {
  font-size: 2rem;
  opacity: 0;
  transform: translate(-20px, 20px);
  transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1);
}

/* Hover & Active States */
.accordion-item:hover .title {
  color: rgba(255,255,255,0.8);
  transform: translateX(10px);
}
.accordion-item:hover .icon-arrow {
  opacity: 0.5;
  transform: translate(0, 0);
}
.accordion-item.active .number {
  opacity: 1;
}
.accordion-item.active .title {
  color: #fff;
  transform: translateX(10px);
}
.accordion-item.active .icon-arrow {
  opacity: 1;
  transform: translate(0, 0) rotate(45deg); /* Pointing down-right to the content */
}

/* Accordion Content */
.accordion-body {
  overflow: hidden;
}
.body-content {
  padding: 0 0 3rem 40px; /* Aligned with title */
}
.body-content h4 {
  font-size: 1.25rem;
  font-weight: 600;
  margin-bottom: 1rem;
  color: #fff;
  letter-spacing: -0.01em;
}
.body-content p {
  font-size: 1.15rem;
  line-height: 1.6;
  color: rgba(255,255,255,0.6);
  margin: 0;
  font-weight: 300;
}

@media (max-width: 768px) {
  .title { font-size: 1.8rem; }
  .accordion-header { padding: 1.5rem 0; }
  .body-content { padding-left: 0; }
}

/* MEDIA WINDOW */
.media-window {
  position: sticky;
  top: 120px;
  height: 600px;
  border-radius: 24px;
  overflow: hidden;
  background: rgba(255,255,255,0.02);
  border: 1px solid rgba(255,255,255,0.05);
}
@media (max-width: 900px) {
  .media-window {
    position: relative;
    top: 0;
    height: 400px;
  }
}
.media-inner {
  width: 100%;
  height: 100%;
}
.media-video {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

/* Abstract Shapes */
.media-shape {
  width: 100%;
  height: 100%;
  background-size: cover;
  background-position: center;
}
.shape-1 {
  background: radial-gradient(circle at top right, rgba(43, 226, 138, 0.15) 0%, transparent 60%);
}
.shape-2 {
  background: repeating-linear-gradient(45deg, rgba(255,255,255,0.02) 0px, rgba(255,255,255,0.02) 2px, transparent 2px, transparent 10px);
}

/* Media Fade Transitions */
.media-fade-enter-active, .media-fade-leave-active {
  transition: opacity 0.8s ease, transform 0.8s cubic-bezier(0.16, 1, 0.3, 1);
}
.media-fade-enter-from {
  opacity: 0;
  transform: scale(1.05);
}
.media-fade-leave-to {
  opacity: 0;
  transform: scale(0.95);
}
</style>
