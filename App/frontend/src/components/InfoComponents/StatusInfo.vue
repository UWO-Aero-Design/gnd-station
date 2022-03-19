<template>
  <div class="infoBox">
    <h2>RSSI: {{ StatusData.rssi }}</h2>
    <h2>State: {{ StatusData.state }}</h2>
  </div>
</template>

<script>

  export default {
    name: "Statusnfo",
    components: {

    },
    props: {
    },
    data () {
      return {
        isConnected: false,
        StatusData: ''
      };
    },
    methods: {
    },
    sockets: {
      connect() {
      this.isConnected = true;
    },
    StatusChannel: function(data) {
      this.StatusData = data;
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
