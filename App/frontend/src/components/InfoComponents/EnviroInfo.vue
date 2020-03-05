<template>
  <div class="infoBox">
    <h2>Altitude: {{ EnviroData.altitude }}</h2>
    <h2>Temperature: {{ EnviroData.temperature }}</h2>
    <h2>Humidity: {{ EnviroData.humidity }}</h2>
  </div>
</template>

<script>

  export default {
    name: "EnviroInfo",
    components: {

    },
    props: {
    },
    data () {
      return {
        isConnected: false,
        EnviroData: ''
      };
    },
    methods: {
    },
    sockets: {
      connect() {
      this.isConnected = true;
    },
    EnviroChannel: function(data) {
      this.EnviroData = data;
    }
    }
  }
</script>

<style scoped>
  .infoBox {
    color: white;
    position: relative;
    left: 20px;
    top:20px;
  }

  h2 {
    font-size: 15px;
  }


</style>
