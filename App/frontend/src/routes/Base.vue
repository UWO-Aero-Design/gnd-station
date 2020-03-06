<template>
  <div>
  <Sidebar @update="updatePage"></Sidebar>
  <multipane class="custom-resizer" layout="vertical" @paneResizeStop="redrawMapTiles">
    <div v-if="this.mapActive === true" class="pane" :style="{ minWidth: '60px'}">
      <MapLeaflet ref="Map"></MapLeaflet>
      <!--Map ref="Map"></Map-->
    </div>
   <multipane-resizer v-if="this.mapActive === true"></multipane-resizer>
    <div class="pane" :style="{ flexGrow: 1 }">
      <Info ref="Info"></Info>
    </div>
  </multipane>
  
  </div>
</template>

<script>
  import Sidebar from "@/components/Sidebar";
  import { Multipane, MultipaneResizer } from 'vue-multipane';
  import Info from "@/components/Info";
  import MapLeaflet from "@/components/MapComponents/MapLeaflet";
  import Map from "@/components/Map";
  import axios from 'axios';
  import Playback from "@/components/Playback";

export default {
  name: 'Base',
  components: {
    Sidebar,
    Multipane,
    MultipaneResizer,
    Info,
    MapLeaflet,
    Map,
    Playback
  },
  mounted() {
    axios.get('http://localhost:5000/ping')
      .then(function(response) {
        alert("Backend Started");
      });
  },
  data () {
    return {
      mapActive: true,
      playbackActive: false,
      response: 'No response yet',
      isConnected: false,
      startUp: false
    }
  },
  methods: {
    updatePage(item) {
      if (item.componentType === "Grid") {
        this.$refs.Info.updateGrid(item);
      }
      if (item.componentType === "Page") {
        this.mapActive = !this.mapActive;
      }
      if (item.componentType === "Playback") {
        this.playbackActive = !this.playbackActive;
      }
    },
    redrawMapTiles() {
      this.$refs.Map.redrawMapTiles();
    },
    pingBackend (event,item) {
      axios.get('http://localhost:5000/Ping')
      .then(function(response) {
        //alert("Backend Started");
      });
    }
  },
  sockets: {
    connectStatus: function(status) {
      this.isConnected = status;
    },
    dataChannel: function(data) {
      this.data = data;
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">

h1, h2 {
  font-weight: normal;
}
ul {
  list-style-type: none;
  padding: 0;
}
li {
  display: inline-block;
  margin: 0 10px;
}
a {
  color: #42b983;
}

.main-box {
  margin-left: 100px;
  height: 100vh;
  margin-top: 0;
}

.sidebar {
  width: 300px;
  background-color: #41B682;
}

.exit-symbol{
  position: absolute;
  top: 5px;
  right: 9px;
  cursor: pointer;
}

.custom-resizer {
  width: 100%;
  height: 100%;
  position: absolute;
  top: 0;
  left: 0;
}
.custom-resizer > .pane {
  text-align: left;
  overflow: hidden;
  border: 1px solid #ccc;
  background-color: #1E1E2F;
}
.custom-resizer > .pane ~ .pane {
}
.custom-resizer > .multipane-resizer {
  margin: 0; left: 0;
  position: relative;
&:before {
   display: block;
   content: "";
   width: 0px;
   height: 40px;
   position: absolute;
   top: 50%;
   left: 50%;
   margin-top: -20px;
   margin-left: -1.5px;
   border-left: 1px solid #ccc;
   border-right: 1px solid #ccc;
 }
&:hover {
&:before {
   border-color: #999;
 }
}
}


</style>
