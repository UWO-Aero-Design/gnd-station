<template>
  <div class="infoBox">
    <h1>Latitude: {{ GPSData.latitude }}</h1>
    <h1>Longitude: {{ GPSData.longitude }}</h1>
    <h1>Altitude: {{ GPSData.altitude }}</h1>
    <h1>Satellites: {{ GPSData.satellites }}</h1>
    <h1>Speed: {{ GPSData.speed }}</h1>
    <h1>Time: {{ GPSData.time }}</h1>
    <h1>Date: {{ GPSData.date }}</h1>
  </div>
</template>

<script>

  export default {
    name: "MapInfo",
    components: {

    },
    props: {
    },
    data () {
      return {
        isConnected: false,
        GPSData: ''
      };
    },
    methods: {
    },
    sockets: {
      connect() {
      this.isConnected = true;
    },
    dataChannel: function(data) {
      this.GPSData = data;
    }
    }
  }
</script>

<style scoped>
  .infoBox {
    color: white;
  }

  h1 {
    position: relative;
    left: 20px;
  }
</style>
