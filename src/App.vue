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
body,
#app {
  width: 100%;
  height: 100%;
  overflow: auto;
}
#app {
  max-width: 480px;
  min-width: 320px;
  margin: 0 auto;
}
</style>
