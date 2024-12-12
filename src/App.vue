<template>
  <main>
    <Calendar />
    <VersionWarning />
  </main>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import Calendar from './components/Calendar.vue';
import VersionWarning from './components/VersionWarning.vue';

export default defineComponent({
  name: 'App',
  components: {
    Calendar,
    VersionWarning,
  },
});
</script>

<style>
main {
  height: 100%;
  width: 100%;
  box-sizing: border-box;
}
</style>
