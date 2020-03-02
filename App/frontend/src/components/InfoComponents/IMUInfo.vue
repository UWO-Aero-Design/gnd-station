<template>
  <div class="infoBox">
    <h2>Accelerometer X: {{ IMUData.ax }}</h2>
    <h2>Accelerometer Y: {{ IMUData.ay }}</h2>
    <h2>Accelerometer Z: {{ IMUData.az }}</h2>
    <h2>Gyroscope X: {{ IMUData.gx }}</h2>
    <h2>Gyroscope Y: {{ IMUData.gy }}</h2>
    <h2>Gyroscope Z: {{ IMUData.gz }}</h2>
    <h2>Magnetometer X: {{ IMUData.mx }}</h2>
    <h2>Magnetometer Y: {{ IMUData.my }}</h2>
    <h2>Magnetometer Z: {{ IMUData.mz }}</h2>
    <h2>Yaw: {{ IMUData.yaw }}</h2>
    <h2>Pitch: {{ IMUData.pitch }}</h2>
    <h2>Roll: {{ IMUData.roll }}</h2>
  </div>
</template>

<script>

  export default {
    name: "IMUInfo",
    components: {

    },
    props: {
    },
    data () {
      return {
        isConnected: false,
        IMUData: ''
      };
    },
    methods: {
    },
    sockets: {
      connect() {
      this.isConnected = true;
    },
    IMUChannel: function(data) {
      this.IMUData = data;
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
