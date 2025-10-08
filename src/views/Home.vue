<template>
  <div class="page">
    <div class="background-container">
      <!-- caminho corrigido para acessar a imagem da pasta public -->
      <img src="/Imagens/fundo2.jpg" alt="Fundo" class="bg-img" />
      <div class="overlay"></div>
    </div>

    <div class="content">
      <h1>Sistema de Insights Organizacionais</h1>
      <p>Transforme dados e percepções em decisões estratégicas com a força da análise inteligente.</p>
      <div class="buttons">
        <button class="btn-primary">Acessar o Sistema</button>
        <button class="btn-secondary">Saiba Mais</button>
      </div>
    </div>
  </div>
</template>

<script setup>
// (sem script por enquanto)
</script>

<style scoped>
.page {
  position: relative;
  width: 100%;
  height: 100vh;
  overflow: hidden;
  color: white;
  display: flex;
  justify-content: center;
  align-items: center;
  text-align: center;
}

.background-container {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
}

.bg-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
}

.overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.829);
}

.content {
  position: relative;
  z-index: 2; /* sobre o overlay */
  max-width: 800px;
  padding: 1rem;
}

.content h1 {
  font-size: 3rem;       /* título maior */
  margin-bottom: 1rem;
  white-space: nowrap;    /* não quebra a linha */
  overflow-x: visible;    /* garante que o texto não seja cortado */
  margin-left: -10rem;
}


.content p {
  font-size: 1.2rem;
  margin-bottom: 2rem;
}

.buttons {
  display: flex;
  gap: 1rem;
  justify-content: center;
}

.btn-primary, .btn-secondary {
  padding: 0.8rem 1.5rem;
  border: none;
  border-radius: 5px;
  font-size: 1rem;
  cursor: pointer;
  transition: all 0.3s ease; /* suaviza a transição do hover */
}

.btn-primary {
  background-color: #119400; /* amarelo */
  color: #ffffff;
}

.btn-secondary {
  background: transparent;
  border: 1px solid #fff;
  color: #fff;
}

/* efeitos de hover */
.btn-primary:hover {
  background-color: rgb(0, 179, 15); /* amarelo mais escuro */
  transform: scale(1.05); /* aumenta levemente */
}

.btn-secondary:hover {
  background: #ffffff;  /* fundo branco */
  color: #119400;       /* texto preto */
  transform: scale(1.05); /* aumenta levemente */
  border: 1px solid #119400;
}
</style>
