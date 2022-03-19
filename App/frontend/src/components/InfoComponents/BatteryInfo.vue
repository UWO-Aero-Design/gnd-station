<template>
  <div class="infoBox">
    <h2>Voltage: {{ BatteryData.voltage }}</h2>
    <h2>Current: {{ BatteryData.current }}</h2>
  </div>
</template>

<script>

  export default {
    name: "BatteryInfo",
    components: {

    },
    props: {
    },
    data () {
      return {
        isConnected: false,
        BatteryData: ''
      };
    },
    methods: {
    },
    sockets: {
      connect() {
      this.isConnected = true;
    },
    BatteryChannel: function(data) {
      this.BatteryData = data;
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
