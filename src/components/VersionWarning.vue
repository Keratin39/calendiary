<template>
  <div class="alpha-warning">
    <p class="alpha-message">
      🚧 Esta aplicación aún está en desarrollo. Versión actual: 0.1.0-alpha 🚧
    </p>
  </div>
</template>

<script lang="ts">
export default {
  name: 'AvisoAlpha',
};
</script>

<style scoped>
.alpha-warning {
  position: fixed;
  bottom: 0;
  left: 0;
  width: 100%;
  padding: 1rem;
  background-color: rgba(0, 0, 0, 0.75);
  color: #fff;
  text-align: center;
  font-size: 1.05rem;
  font-weight: bold;
  z-index: 9999;
}

.alpha-message {
  margin: 0;
}
</style>
