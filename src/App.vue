<template>
<div id="app">
  <base-clock/>
</div>
</template>

<script>


import BaseClock from './components/base.vue'

export default {
    name: 'App',
    
    components: {
        BaseClock
    }
}

</script>

<style>
html,
body {
  margin: 0;
  padding: 0;
  height: 360px;
  width: 360px;
  font-family: sans-serif;
}

#app {
  background-color: #000;
  color: #fff;
  position: relative;
  border-radius: 50%;
  font-size: 1em;
  font-weight: bold;
  text-align: center;
  min-height: 360px;
  width: 360px;
}
</style>
