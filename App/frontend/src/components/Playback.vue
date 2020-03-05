<template>
  <div class="infoBox">
    <h2>Voltage: {{ BatteryData.voltage }}</h2>
    <h2>Current: {{ BatteryData.current }}</h2>
  </div>
</template>

<script>

  export default {
    name: "Playback",
    components: {

    },
    props: {
    },
    data () {
      return {
      };
    },
    methods: {
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
