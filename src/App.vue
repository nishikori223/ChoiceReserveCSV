<template>
  <div id="app">
    <img class="mb-4" src="./assets/logo.png" />
    <csvAnalysis />
  </div>
</template>

<script>
import CsvAnalysis from './components/CsvAnalysis.vue'

export default {
  name: 'App',
  components: {
    CsvAnalysis,
  },
}
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
