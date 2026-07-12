<template>
  <div class="service-showcase">
    <!-- Elenco Servizi (Interattivo) -->
    <div class="service-list">
      <button 
        v-for="(service, index) in services" 
        :key="index"
        class="service-btn"
        :class="{ active: activeIndex === index }"
        @click="activeIndex = index"
      >
        <span class="service-number">0{{ index + 1 }}</span>
        <span class="service-title">{{ service.shortTitle }}</span>
      </button>
    </div>
    
    <!-- Dettagli Servizio -->
    <div class="service-details">
      <transition name="fade" mode="out-in">
        <div class="detail-card" :key="activeIndex">
          <h3 class="detail-title">{{ services[activeIndex].title }}</h3>
          <p class="detail-desc">{{ services[activeIndex].desc }}</p>
          <div class="detail-visual">
            <template v-if="services[activeIndex].videoUrl">
              <video 
                :key="'vid-' + activeIndex"
                class="service-video" 
                :src="services[activeIndex].videoUrl" 
                autoplay loop muted playsinline>
              </video>
            </template>
            <template v-else>
              <div class="abstract-shape" :class="'shape-' + activeIndex"></div>
            </template>
          </div>
        </div>
      </transition>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';

const activeIndex = ref(0);

const services = [
  {
    shortTitle: "Siti Web AI-Ready",
    title: "Ottimizzazione per Motori IA (AIO)",
    desc: "I motori di ricerca si sono evoluti. Non basta più piacere a Google. Strutturiamo il tuo sito web con un'architettura semantica avanzata per fare in modo che venga letto, compreso e citato come fonte primaria dalle Intelligenze Artificiali generative (ChatGPT, Perplexity, Claude).",
    videoUrl: "/video_web.mp4"
  },
  {
    shortTitle: "Automazioni Aziendali",
    title: "Flussi di Lavoro IA su Misura",
    desc: "Liberiamo il tuo bene più prezioso: il tempo. Analizziamo i tuoi processi e creiamo agenti IA e automazioni personalizzate per gestire task ripetitivi, servizio clienti o analisi dati. Meno burocrazia, più spazio per il lavoro ad alto valore aggiunto."
  },
  {
    shortTitle: "Sviluppo Software",
    title: "Software Gestionale Personalizzato",
    desc: "Quel file Excel infinito o quel gestionale obsoleto che usi da 10 anni sta bloccando la tua crescita. Lo trasformiamo in un'applicazione web o mobile moderna, scalabile e ultrasicura, disegnata chirurgicamente sulle esatte procedure della tua azienda."
  }
];
</script>

<style scoped>
.service-showcase {
  display: grid;
  grid-template-columns: 1fr 1.2fr;
  gap: 4rem;
  margin-top: 4rem;
}
@media (max-width: 900px) {
  .service-showcase {
    grid-template-columns: 1fr;
    gap: 2rem;
  }
}
.service-list {
  display: flex;
  flex-direction: column;
}
.service-btn {
  display: flex;
  align-items: center;
  width: 100%;
  text-align: left;
  background: none;
  border: none;
  border-bottom: 1px solid rgba(255,255,255,0.1);
  padding: 2.5rem 0;
  cursor: pointer;
  color: rgba(255,255,255,0.4);
  transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1);
}
.service-btn:hover {
  color: rgba(255,255,255,0.8);
  padding-left: 1rem;
}
.service-btn.active {
  color: #fff;
  border-bottom: 1px solid #fff;
  padding-left: 1rem;
}
.service-number {
  font-family: 'Cormorant Garamond', serif;
  font-size: 1.5rem;
  margin-right: 1.5rem;
  opacity: 0.5;
}
.service-btn.active .service-number {
  opacity: 1;
}
.service-title {
  font-size: 2.2rem;
  font-weight: 500;
  letter-spacing: -0.02em;
}
@media (max-width: 768px) {
  .service-title { font-size: 1.5rem; }
  .service-btn { padding: 1.5rem 0; }
}

.detail-card {
  background: rgba(255,255,255,0.02);
  border: 1px solid rgba(255,255,255,0.05);
  border-radius: 24px;
  padding: 3rem;
  height: 100%;
  display: flex;
  flex-direction: column;
  box-shadow: inset 0 0 40px rgba(255,255,255,0.01);
}
.detail-title {
  font-size: 2rem;
  margin-bottom: 1.5rem;
  color: #fff;
}
.detail-desc {
  font-size: 1.15rem;
  line-height: 1.7;
  color: rgba(255,255,255,0.7);
  margin-bottom: 2rem;
  font-weight: 300;
}
.detail-visual {
  flex-grow: 1;
  border-radius: 12px;
  background: rgba(0,0,0,0.3);
  min-height: 250px;
  position: relative;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
}

/* Abstract shapes to give a unique look to each tab */
.abstract-shape {
  width: 100%;
  height: 100%;
  background-size: cover;
  background-position: center;
  opacity: 0.8;
  transition: all 0.5s ease;
}
.shape-0 {
  background: radial-gradient(circle at center, rgba(217, 119, 87, 0.2) 0%, transparent 70%); /* Muted Terracotta */
  border: 1px solid rgba(255,255,255,0.1);
  border-radius: 100px;
  width: 80%; height: 80%;
}
.shape-1 {
  background: linear-gradient(45deg, rgba(43, 226, 138, 0.1) 0%, transparent 100%);
  border-radius: 24px;
  width: 90%; height: 60%;
}
.shape-2 {
  background: repeating-linear-gradient(45deg, rgba(255,255,255,0.02) 0px, rgba(255,255,255,0.02) 10px, transparent 10px, transparent 20px);
  width: 100%; height: 100%;
}

/* Transitions */
.fade-enter-active, .fade-leave-active {
  transition: opacity 0.4s ease, transform 0.4s cubic-bezier(0.16, 1, 0.3, 1);
}
.fade-enter-from {
  opacity: 0;
  transform: translateY(20px);
}
.fade-leave-to {
  opacity: 0;
  transform: translateY(-20px);
}

.service-video {
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 12px;
  position: absolute;
  top: 0;
  left: 0;
}
</style>
