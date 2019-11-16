<template>
<div class="main-box">
  <!-- MapTiles v-bind:planePos="planePos" v-bind:gliderPos="gliderPos" v-bind:planeLoc="planeLoc" v-bind:gliderLoc="gliderLoc" --><!-- /MapTiles -->
  <MapLeaflet></MapLeaflet>
</div>
</template>

<script>
//import MapTiles from "@/components/MapComponents/MapTiles";
import MapLeaflet from "@/components/MapComponents/MapLeaflet";

export default {
    name: "Map",
    components: {
        //MapTiles
        MapLeaflet
    },
    data () {
        return {
            //Map position
            planePos: ['1000px','1000px'], /*Max distance is 1580px */ /*Max distance is 2535px */
            gliderPos: ['2000px','1300px'],
            planeLoc: ['42.5','35.9'],
            gliderLoc: ['78.1','62.6']
        }
    }
}
</script>

<style scoped>
.main-box {
  position:relative;
  height: 100vh;
  left: -250px;
  width:100%;
}
</style>
