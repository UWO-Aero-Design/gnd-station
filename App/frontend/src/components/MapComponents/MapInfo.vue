<template>
  <div class="infoBox">
    <h1>Latitude: {{ latitude }}</h1>
    <h1>Longitude: {{ longitude }}</h1>
    <h1>Altitude: {{ altitude }}</h1>
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
        latitude: '0',
        longitude: '0',
        altitude: '0'
      };
    },
    methods: {
    },
    sockets: {
      connect() {
      this.isConnected = true;
    },
    dataChannel: function(data) {
      this.latitude = data.latitude;
      this.longitude = data.longitude;
      this.altitude = data.altitude;
    }
    }
  }
</script>

<style scoped>
  .infoBox {
    color: white;
  }
</style>
