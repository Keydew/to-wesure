<template>
  <div id="app">
    <router-view />
  </div>
</template>

<script>
export default {
  name: "App",
};
</script>

<style>
html,
body {
  height: 100%;
}
#app {
  max-width: 480px;
  min-width: 320px;
  margin: 0 auto;
  height: 100%;
}
</style>
