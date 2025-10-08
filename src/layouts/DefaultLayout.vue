<!-- src/layouts/DefaultLayout.vue -->
<template>
  <div>
    <Navbar />
    <slot />
  </div>
</template>

<script setup>
import Navbar from '../components/Navbar.vue'
</script>

<style scoped>
/* estilos globais do layout, se necessário */
</style>
