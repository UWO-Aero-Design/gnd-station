<template>
  <div style="height: 100%">
    <radial-menu class="radialMenu" :itemSize="55" :radius="120" :angle-restriction="90" :rotate="90">
      <radial-menu-item class="radialMenuItem" v-for="(item,index) in menuItems" :key="index">
        <button class="button" @click="activateScroll(item)">{{ item }}</button>
      </radial-menu-item>
    </radial-menu>
    <button class="flightbutton" @click="getflight">Set Flight </button>
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
      <!-- Vue2leaflet components not used due to popup binding difficulties -->
      <!--l-marker
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
      <l-popup ref="planePopUp">
        <MapInfo :data="gliderData"></MapInfo>
      </l-popup-->
      <!-- l-polyline
        :lat-lngs="[[27.94,-82.03],[27.99,-82.015]]"
        :color="'blue'" v-if="this.flightPlaying === true">
      </l-polyline -->
      <l-rectangle
        :bounds="dropZone.bounds"
        :l-style="dropZone.style">
      </l-rectangle>
      <l-circle
        :lat-lng="target.center"
        :radius="target.radius"
        :l-style="target.style">
      </l-circle>
      <l-control-layers
        position="topright">
      </l-control-layers>
    </l-map>
  </div>
</template>

<script>

  import {LMap, LTileLayer, LMarker, LIcon, LPopup, LRectangle, LCircle, LControlLayers, LPolyline} from 'vue2-leaflet';
  import {latLngBounds, latLng} from "leaflet";
  import GPSInfo from "@/components/InfoComponents/GPSInfo";
  import { RadialMenu, RadialMenuItem } from 'vue-radial-menu';
  import 'leaflet-easybutton';
  var movingMarker = require('../../assets/js/MovingMarker.js');

  export default {
    name: "MapLeaflet",
    components: {
      LMap,
      LTileLayer,
      LMarker,
      LIcon,
      LPopup,
      GPSInfo,
      RadialMenu,
      RadialMenuItem,
      LRectangle,
      LCircle,
      LControlLayers,
      LPolyline
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
          latitude: 25,
          longitude: -82.02,
          altitude: 100
        },
        gliderData: {
          latitude: 27.94,
          longitude: -82.03,
          altitude: 50
        },

        //Dropzone and Target
        dropZone: {
          bounds: [[27.985,-82.02],[27.995,-82.01]],
          style: { color: 'blue', weight: 3, fillOpacity: 0.2, fillColor: 'blue'}
        },
        target: {
          center: [27.99,-82.015],
          radius: 100,
          style: { color: 'red', weight: 1}
        },

        //Menu Data
        menuItems: ['Plane','Glider'],

        //Markers
        planeMarker: "",

        //Flight Data
        flightPlayButton: "",
        flightPlaySpeed: "10000",
        flightPlayingID: "",
        flightPlaying: "",

        //Popups
        planePopup: "",

        flightID: 3,
        flightPathLatitude: '',
        flightPathLongitude: '',
        flightPathLatitude2: [27.99,28,28.01,28.02,28.03,28.04],
        flightPathLongitude2: [-82.015,-82.016,-82.017,-82.018,-82.019,-82.020],
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

        //Add flight play button (State toggling not working)
        this.flightPlayButton = L.easyButton({position: 'bottomright',states:
            [{stateName: 'Play',icon: 'fas fa-play',title: 'Play',onClick: this.playFlight},
              {stateName: 'Pause',icon: 'fas fa-pause',title: 'Pause',onClick: this.pauseFlight}]}).addTo(this.$refs.Map.mapObject);
        this.flightPlayButton.button.style.width = '32px';
        this.flightPlayButton.button.style.height = '32px';

        /*this.planeMarker = L.Marker.movingMarker([[27.94,-81],[27.99,-82.015]],[this.flightPlaySpeed],{icon: this.planeIcon})
          .bindPopup("<p>" + "Latitude: " + this.planeData.latitude + "</p> <p> Longitude: " + this.planeData.longitude + "</p> <p> Altitude: " + this.planeData.altitude + "</p>").addTo(this.$refs.Map.mapObject);
        this.planeMarker.on('start',this.flightUpdate);*/
      });
    },
    methods: {
      //Update current zoom level
      zoomUpdated (zoom) {
        this.zoom = zoom;
      },
      //Update current center coordinates
      centerUpdated (center) {
        this.center = center;
      },
      //Update map boundaries
      boundsUpdated (bounds) {
        this.bounds = bounds;
      },
      //Redraw map tiles on resize (called by base component)
      redrawMapTiles() {
        this.$refs.Map.mapObject.invalidateSize();
      },
      //Change view location
      activateScroll(item) {
        if (item === "Plane") {
          this.$refs.Map.mapObject.flyTo([this.planeData.latitude,this.planeData.longitude],17);
        }
        else if (item === "Glider") {
          this.$refs.Map.mapObject.flyTo([this.gliderData.latitude,this.gliderData.longitude],17);
        }
      },
      //Start marker movement
      playFlight() {
        //this.getflight();
        this.planeMarker.start();
      },
      //Pause marker movement
      pauseFlight() {
        this.planeMarker.pause();
      },
      //Update marker location (set on start event on marker)
      flightUpdate() {
        //Update at intervals of 500ms
        this.flightPlaying = true;
        this.flightPlayingID = setInterval(()=> {
          const currentPlaneData = this.planeMarker.getLatLng();
          this.planeData.latitude = currentPlaneData.lat;
          this.planeData.longitude = currentPlaneData.lng;
          this.planeMarker.setPopupContent("<p>" + "Latitude: " + this.planeData.latitude + "</p> <p> Longitude: " + this.planeData.longitude + "</p> <p> Altitude: " + this.planeData.altitude + "</p>");
        },500);
        //Stop updating once end event happens on marker
        this.planeMarker.on('end',()=> {clearInterval(this.flightPlayingID);this.flightPlaying = false});
      },
      getflight() {
          var flightChosen = 3;//this.flightID.toString();
          /*var request = 'http://localhost:5000/api/flight/flightlats?flightID=';
          var getrequest = request.concat(flightChosen);
          axios.get(getrequest)
          .then(response => (this.flightPathLatitude = response.data));

          var request = 'http://localhost:5000/api/flight/flightlons?flightID=';
          var getrequest = request.concat(flightChosen);
          axios.get(getrequest)
          .then(response => (this.flightPathLongitude = response.data));*/

          var path = [];

          for (var i = 0; i < this.flightPathLongitude2.length; i++) {
            var point = [this.flightPathLatitude2[i],this.flightPathLongitude2[i]];
            path.push(point);
          }
          alert(path.length);
          this.planeMarker = L.Marker.movingMarker(path,[this.flightPlaySpeed],{icon: this.planeIcon})
          .bindPopup("<p>" + "Latitude: " + this.planeData.latitude + "</p> <p> Longitude: " + this.planeData.longitude + "</p> <p> Altitude: " + this.planeData.altitude + "</p>").addTo(this.$refs.Map.mapObject);
          this.planeMarker.on('start',this.flightUpdate);
      },
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

  .flightbutton {
    position: relative;
    z-index: 800;
    top: 100px;
    left: 100px;
  }
</style>
