<template>
  <div id="app">
    <img alt="Vue logo" src="./assets/logo.png">
    <Chips />
  </div>
</template>

<script>
import Chips from './components/Chips.vue'

export default {
  name: 'App',
  components: {
    Chips
  }
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
