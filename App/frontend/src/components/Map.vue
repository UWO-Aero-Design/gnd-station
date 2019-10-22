<template>
<div>
    <Sidebar></Sidebar>
    <div class="main-box">
        <MapTiles v-bind:planePos="planePos" v-bind:gliderPos="gliderPos" v-bind:planeLoc="planeLoc" v-bind:gliderLoc="gliderLoc"></MapTiles>
    </div>
</div>
</template>

<script>
import Sidebar from "@/components/Sidebar";
import MapTiles from "@/components/MapComponents/MapTiles";

export default {
    name: "Map",
    components: {
        Sidebar,
        MapTiles
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
  margin-left: 300px;
  height: 100vh;
  margin-top: 0px;
}
</style>
