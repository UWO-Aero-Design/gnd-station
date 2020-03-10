<template>
  <div class="infoBox">
    <!-- h3> Altitude: {{ this.altitude }} </h3 -->
    <h2> Altitude: {{ this.altitude }} <br> Gliders: {{ this.glider }} <br> Water: {{ this.water }} <br> Habitats: {{ this.habitat }}</h2>
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
        glider: 'Unreleased',
        water: 'Unreleased',
        habitat: 'Unreleased',
        altitude: 0
      };
    },
    methods: {
    },
    sockets: {
      connect() {
      this.isConnected = true;
    },
    PayloadChannel: function(data) {
      if (data.payload == 'glider') {
        this.glider = data.altitude;
      }
      else if (data.payload == 'water') {
        this.water = data.altitude;
        this.habitat = data.altitude;
      }
      else {
        this.habitat = data.altitude;
      }
    },
    EnviroChannel: function(data) {
      this.altitude = data.altitude;
    }
    }
  }
</script>

<style scoped>
  .infoBox {
    color: white;
    position: relative;
    left: 20px;
    top:5px;
  }

  h2 {
    font-size: 0.7in;
    padding: 0px;
  }


</style>
