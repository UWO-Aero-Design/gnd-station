<template>
  <div class="infoBox">
    <h1>Latitude: {{ data.latitude }}</h1>
    <h1>Longitude: {{ data.longitude }}</h1>
    <h1>Altitude: {{ data.altitude }}</h1>
  </div>
</template>

<script>

  export default {
    name: "MapInfo",
    components: {

    },
    props: {
      data: Object
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
    color: #315CF4;
  }
</style>
