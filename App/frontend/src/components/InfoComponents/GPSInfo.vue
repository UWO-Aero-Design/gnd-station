<template>
  <div class="infoBox">
    <h2>Latitude: {{ GPSData.lat }}</h2>
    <h2>Longitude: {{ GPSData.lon }}</h2>
    <h2>Altitude: {{ GPSData.altitude }}</h2>
    <h2>Satellites: {{ GPSData.satellites }}</h2>
    <h2>Speed: {{ GPSData.speed }}</h2>
    <h2>Time: {{ GPSData.time }}</h2>
    <h2>Date: {{ GPSData.date }}</h2>
  </div>
</template>

<script>

  export default {
    name: "GPSInfo",
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
    GPSChannel: function(data) {
      this.GPSData = data;
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
