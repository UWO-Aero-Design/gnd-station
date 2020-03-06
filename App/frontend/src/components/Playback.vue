<template>
  <div class="selectBox">
    <!-- select v-model="flight">
        <option disabled value="">Flight</option>
        <option v-for="(path,index) in flightPaths">{{ path }}</option>
    </select>
    <span>Selected: flight </span-->
    <select v-model="flightID">
        <option disabled value="">Flight</option>
        <option v-for="n in 10">{{ n }}</option>
    </select>
    <span>Selected: flightID </span>
    <button @click="getflight">Get Flight </button>
    <button @click="playflight">Play Flight </button>
    <!-- div v-for="point in flightPath2">
        <h2> {{ point }}</h2-->
        <h2> Altitude: {{ this.altitudeString }}</h2>
        <h2> Latitude: {{ this.latitudeString }}</h2>
        <h2> Longitude: {{ this.longitudeString }}</h2>
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
        .then(response => (this.flightPaths = response.data));
    },
    data () {
      return {
          flightID: '',
          flightPathAltitude:'',
          flightPathLongitude:'',
          flightPathLatitude:'',
          altitudeString: '',
          latitudeString: '',
          longitudeString: '',
          flightPath2: [0, 1234.5, 1233.5, 1234345.5, 1434.5, 12342.5, 1234.5, 122334.5, 1253434.5, 1234.5, 1234.5, 1234.5, 1234.5, 1234.5, 1234.5,
1234.5, 1345234.5, 1234.5, 1234.5, 1234.5, 1234.5, 1233454.5, 1234.5, 1234.5, 1234.5, 1234.5, 1234.5, 1234.5]
      };
    },
    methods: {
        getflight() {
            var flightChosen = this.flightID.toString();
            var request = 'http://localhost:5000/api/flight/flights?flightID=';
            var getrequest = request.concat(flightChosen);
          axios.get(getrequest)
          .then(response => (this.flightPathAltitude = response.data));

          var request = 'http://localhost:5000/api/flight/flightlats?flightID=';
            var getrequest = request.concat(flightChosen);
          axios.get(getrequest)
          .then(response => (this.flightPathLatitude = response.data));

          var request = 'http://localhost:5000/api/flight/flightlons?flightID=';
            var getrequest = request.concat(flightChosen);
          axios.get(getrequest)
          .then(response => (this.flightPathLongitude = response.data));
          alert("flight request");
      },
      playflight: function() { 
      const altitudeit = this.flightPathAltitude[Symbol.iterator](); // convenient for yeilding values
      const latitudeit = this.flightPathLatitude[Symbol.iterator](); // convenient for yeilding values
      const longitudeit = this.flightPathLongitude[Symbol.iterator](); // convenient for yeilding values
      const int = setInterval(() => { // time interval
        const altitudenext = altitudeit.next(); // next value 
        const latitudenext = latitudeit.next();
        const longitudenext = longitudeit.next();
        if (!altitudenext.done) { // done = true when the end of array reached
          this.altitudeString = ' ' + altitudenext.value; // concatenate word to the string
          this.latitudeString = ' ' + latitudenext.value; // concatenate word to the string
          this.longitudeString = ' ' + longitudenext.value; // concatenate word to the string
        } else {
          clearInterval(int); // when done - clear interval
        }
      }, 1000) // interval duration, 1s
    }
  },
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
