<template>
  <div style="height: 100%">
    <radial-menu class="radialMenu" :itemSize="55" :radius="120" :angle-restriction="90" :rotate="90">
      <radial-menu-item class="radialMenuItem" v-for="(item,index) in menuItems" :key="index">
        <button class="button" @click="activateScroll(item)">{{ item }}</button>
      </radial-menu-item>
    </radial-menu>
    <l-map
      style="height: 100%; width: 100%"
      :zoom="zoom"
      :center="center"
      :maxBounds="maxBounds"
      :minZoom="minZoom"
      :maxZoom="maxZoom"
      :maxBoundsViscosity="maxBoundsViscosity"
      @update:zoom="zoomUpdated"
      @update:center="centerUpdated"
      @update:bounds="boundsUpdated"
      ref="Map"
    >
    <l-tile-layer
      :url="url"
      ref="tilelayer">
    </l-tile-layer>
    <l-marker 
      :lat-lng="[planeData.latitude,planeData.longitude]"
      :icon="planeIcon">
      <l-popup>
        <MapInfo :data="planeData"></MapInfo>
      </l-popup>
    </l-marker>
      <l-marker
        :lat-lng="[gliderData.latitude,gliderData.longitude]"
        :icon="gliderIcon">
        <l-popup>
          <MapInfo :data="gliderData"></MapInfo>
        </l-popup>
      </l-marker>
    </l-map>
  </div>
</template>

<script>

  import {LMap, LTileLayer, LMarker, LIcon, LPopup} from 'vue2-leaflet';
  import {latLngBounds, latLng} from "leaflet";
  import MapInfo from "@/components/MapComponents/MapInfo";
  import { RadialMenu, RadialMenuItem } from 'vue-radial-menu';

  export default {
    name: "MapLeaflet",
    components: {
      LMap,
      LTileLayer,
      LMarker,
      LIcon,
      LPopup,
      MapInfo,
      RadialMenu,
      RadialMenuItem
    },
    data () {
      return {
        //Map data
        url: 'http://localhost:8081/data/FloridaAirfield/{z}/{x}/{y}.png',
        zoom: 15,
        center: [27.975042,-82.024381],
        bounds: null,
        maxBounds: latLngBounds([
          [27.93751,-82.06301],
          [27.99990,-82.00014]
        ]),
        minZoom: 15,
        maxZoom: 17,
        maxBoundsViscosity: 1,

        //Plane data
        planeIcon: L.icon({
          iconUrl: '../../../static/MapAssets/plane.png',
          iconSize: [32,32],
          iconAnchor: [16,16]
        }),
        gliderIcon: L.icon({
          iconUrl: '../../../static/MapAssets/glider.png',
          iconSize: [32,32],
          iconAnchor: [16,16]
        }),
        planeData: {
          latitude: 27.96,
          longitude: -82.05,
          altitude: 100
        },
        gliderData: {
          latitude: 27.94,
          longitude: -82.03,
          altitude: 50
        },

        //Menu Data
        menuItems: ['Plane','Glider']
      };
    },
    mounted() {
      //Removal doesn't work, hidden behind sidebar for now
      /*if (this.$refs.Map.mapObject.zoomControl) {
        this.$refs.Map.mapObject.remove()
      }*/

      this.$nextTick(() => {
        //Add zoom controller to map
        this.zoomControl = L.control.zoom({'position': 'topright'});
        this.$refs.Map.mapObject.addControl(this.zoomControl);
      });
    },
    methods: {
      zoomUpdated (zoom) {
        this.zoom = zoom;
      },
      centerUpdated (center) {
        this.center = center;
      },
      boundsUpdated (bounds) {
        this.bounds = bounds;
      },
      redrawMapTiles() {
        this.$refs.Map.mapObject.invalidateSize();
      },
      activateScroll(item) {
        if (item === "Plane") {
          this.$refs.Map.mapObject.flyTo([this.planeData.latitude,this.planeData.longitude],17);
        }
        else if (item === "Glider") {
          this.$refs.Map.mapObject.flyTo([this.gliderData.latitude,this.gliderData.longitude],17);
        }
      }
    }
  }
</script>

<style scoped>
  .radialMenu {
    position: fixed;
    top: 93%;
    left: 4%;
    background-color: #315CF4;
    z-index: 800;
    color: white;
  }

  .radialMenuItem {
    background-color: #315CF4;
    z-index: 800;
  }

  .button {
    background-color: #315CF4;
    color: white;
    height:100%;
    width:100%;
    border: none;
    border-radius: 50%;
  }
</style>
