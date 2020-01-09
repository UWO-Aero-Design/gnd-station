<template>
<div class="main-box">
  <!-- MapTiles v-bind:planePos="planePos" v-bind:gliderPos="gliderPos" v-bind:planeLoc="planeLoc" v-bind:gliderLoc="gliderLoc" --><!-- /MapTiles -->
  <radial-menu class="radialMenu" :itemSize="55" :radius="120" :angle-restriction="90" :rotate="90">
    <radial-menu-item class="radialMenuItem" v-for="(item,index) in menuItems" :key="index">
      <button class="button" @click="activateScroll(item)">{{ item }}</button>
    </radial-menu-item>
  </radial-menu>
  <MapLeaflet ref="Map"></MapLeaflet>
</div>
</template>

<script>
//import MapTiles from "@/components/MapComponents/MapTiles";
import MapLeaflet from "@/components/MapComponents/MapLeaflet";
import { RadialMenu, RadialMenuItem } from 'vue-radial-menu';

export default {
  name: "Map",
  components: {
    //MapTiles
    MapLeaflet,
    RadialMenu,
    RadialMenuItem,
  },
  data () {
      return {
          //Map position
          planePos: ['1000px','1000px'], /*Max distance is 1580px */ /*Max distance is 2535px */
          gliderPos: ['2000px','1300px'],
          planeLoc: ['42.5','35.9'],
          gliderLoc: ['78.1','62.6']
      }
  },
  methods: {
    redrawMapTiles() {
      this.$refs.Map.redrawMapTiles();
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

.radialMenu {
  position: fixed;
  top: 93%;
  left: 4%;
  background-color: #315CF4;
  z-index: 2;
  color: white;
}

.radialMenuItem {
  background-color: #315CF4;
  z-index: 2;
}
</style>
