<template>
  <div id="app">
    <img class="mb-4 mr-3" style="width: 50px; height: 75px" src="./assets/noa.png" />
    <img class="mb-4" src="./assets/logo.png" />
    <img class="mb-4" style="width: 70px; height: 70px" src="./assets/chinu.png" />
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
