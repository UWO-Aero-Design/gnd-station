<template>
  <div class="infoBox">
    <h2> Water: {{ this.water }} </h2>
    <h2> Habitat 1: {{ this.habitat1 }} </h2>
    <h2> Habitat 2: {{ this.habitat2 }} </h2>
    </div>
      
  </div>
</template>

<script>

  export default {
    name: "Payload",
    components: {

    },
    props: {
    },
    data () {
      return {
        isConnected: false,
        water: 0,
        habitat1: 0,
        habitat2: 0
      };
    },
    methods: {
    },
    sockets: {
      connect() {
      this.isConnected = true;
    },
    PayloadChannel: function(data) {
      if (data.payload == 'water') {
        this.water = data.altitude;
      }
      else if (data.payload == 'habitat1') {
        this.habitat1 = data.altitude;
      }
      else {
        this.habitat2 = data.altitude;
      }
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
    font-size: 0.5in;
  }


</style>
