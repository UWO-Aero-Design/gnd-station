<template>
  <div style="height: 100%">
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
      :lat-lng="[27.96,-82.05]"
      :icon="planeIcon">
    </l-marker>
    </l-map>
  </div>
</template>

<script>

  import {LMap, LTileLayer, LMarker, LIcon} from 'vue2-leaflet';
  import {latLngBounds, latLng} from "leaflet";

  export default {
    name: "MapLeaflet",
    components: {
      LMap,
      LTileLayer,
      LMarker,
      LIcon
    },
    data () {
      return {
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
        planeIcon: L.icon({
          iconUrl: '../../../static/MapAssets/plane.png',
          iconSize: [32,32],
          iconAnchor: [16,16]
        })
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
      }
    }
  }
</script>
