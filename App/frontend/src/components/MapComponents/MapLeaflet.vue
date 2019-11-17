<template>
  <div style="height: 100%">
    <l-map
      style="height: 100%; width: 100%"
      :zoom="zoom"
      :center="center"
      @update:zoom="zoomUpdated"
      @update:center="centerUpdated"
      @update:bounds="boundsUpdated"
      ref="Map"
    >
      <l-tile-layer :url="url" ref="tilelayer"></l-tile-layer>
    </l-map>
  </div>
</template>

<script>

  import {LMap, LTileLayer, LMarker} from 'vue2-leaflet';

  export default {
    name: "MapLeaflet",
    components: {
      LMap,
      LTileLayer,
      LMarker
    },
    data () {
      return {
        url: 'http://localhost:8081/data/FloridaAirfield/{z}/{x}/{y}.png',
        zoom: 17,
        center: [27.975042,-82.024381],
        bounds: null
      };
    },
    mounted() {
      //Removal doesn't work, hidden behind sidebar for now
      /*if (this.$refs.Map.mapObject.zoomControl) {
        this.$refs.Map.mapObject.remove()
      }*/
      this.$nextTick(() => {
        this.zoomControl = L.control.zoom({'position': 'topright'});
        this.$refs.Map.mapObject.addControl(this.zoomControl);
        //L.tileLayer('./../../assets/MapAssets/Maps/Florida/{z}/{x}/{y}.png',{maxZoom: 17}).addTo(this.$refs.Map.mapObject);
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
