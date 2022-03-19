<template>
  <div id="app">
    <router-view/>
    <notifications group="commandNotifications" class="n-light"/>
  </div>
</template>

<script>
export default {
  name: 'App'
}
</script>

<style lang="scss">

body {
  margin: 0;
  background-color: #1E1E2F;

}
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  /*text-align: center;*/
  color: #2c3e50;
  background-color: #1E1E2F;
  /*margin-top: 25%;*/
}

.notification.n-light {
  margin: 10px;
  margin-bottom: 0;
  border-radius: 3px;
  font-size: 13px;
  padding: 10px 20px;
  color: #495061;
  background: #EAF4FE;
  border: 1px solid #D4E8FD;
  .notification-title {
    letter-spacing: 1px;
    text-transform: uppercase;
    font-size: 10px;
    color: #2589F3;
  }
}
</style>
