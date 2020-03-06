<template>
  <div class="selectBox">
    <select v-model="flightID">
        <option disabled value="">Flight ID</option>
        <option v-for="n in 10">{{ n }}</option>
    </select>
    <span>Selected: hi </span>
  </div>
</template>

<script>

  import axios from 'axios';

  export default {
    name: "Playback",
    components: {

    },
    props: {
    },
    mounted() {
        axios.get('http://localhost:5000/api/flight/flightpaths')
        .then(response => (this.flightPaths = response));
    },
    data () {
      return {
          flightID: '',
          flightPaths:''
      };
    },
    methods: {
    }
  }
</script>

<style scoped>
  .selectBox {
    color: white;
    position: relative;
    left: 20px;
    top:40px;
  }

  h2 {
    font-size: 15px;
  }


</style>
