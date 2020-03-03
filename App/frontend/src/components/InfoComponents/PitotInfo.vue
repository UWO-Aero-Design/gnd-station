<template>
  <div class="infoBox">
    <h2>Differential Pressure: {{ PitotData.differentialpressure }}</h2>
  </div>
</template>

<script>

  export default {
    name: "PitotInfo",
    components: {

    },
    props: {
    },
    data () {
      return {
        isConnected: false,
        PitotData: ''
      };
    },
    methods: {
    },
    sockets: {
      connect() {
      this.isConnected = true;
    },
    PitotChannel: function(data) {
      this.PitotData = data;
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
