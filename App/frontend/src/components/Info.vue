<template>
<div>
  <div class="main-box">
    <grid-layout
      :layout.sync="panes"
      :col-num="12"
      :row-height="30"
      :is-draggable="true"
      :is-resizable="false"
      :is-mirrored="false"
      :vertical-compact="true"
      :prevent-collision="false"
      :margin="[10, 10]"
      :use-css-transforms="true"
    >
      <grid-item v-for="(item,index) in panes"
                 style="background-color: #27293D; border: 1px black; margin: 5px; color:white;"
                 :x="item.x"
                 :y="item.y"
                 :w="item.w"
                 :h="item.h"
                 :i="item.i"
                 :key="index"
                 :isResizable="false">
        <i class="fa fa-times exit-symbol" aria-hidden="true" @click="removePane(index)"></i>
        <div style="position:absolute;left:10px;top:10px;">{{ item.componentName }}</div>
        <GPSInfo v-if="item.componentName === 'GPS Info'"></GPSInfo>
        <IMUInfo v-if="item.componentName === 'IMU Info'"></IMUInfo>
        <EnviroInfo v-if="item.componentName === 'Environment Info'"></EnviroInfo>
        <BatteryInfo v-if="item.componentName === 'Battery Info'"></BatteryInfo>
        <StatusInfo v-if="item.componentName === 'Status Info'"></StatusInfo>
        <ServoInfo v-if="item.componentName === 'Servo Info'"></ServoInfo>
        <PitotInfo v-if="item.componentName === 'Pitot Info'"></PitotInfo>
        <Commands v-if="item.componentName === 'Command Console'"></Commands>
        <Payload v-if="item.componentName === 'Payload Info'"></Payload>
        <br><br>
      </grid-item>
    </grid-layout>
  </div>
</div>
</template>

<script>
import axios from 'axios'
import VueGridLayout from 'vue-grid-layout';
import PitotInfo from "@/components/InfoComponents/PitotInfo"
import GPSInfo from "@/components/InfoComponents/GPSInfo";
import IMUInfo from "@/components/InfoComponents/IMUInfo";
import EnviroInfo from "@/components/InfoComponents/EnviroInfo";
import BatteryInfo from "@/components/InfoComponents/BatteryInfo";
import StatusInfo from "@/components/InfoComponents/StatusInfo";
import ServoInfo from "@/components/InfoComponents/ServoInfo";
import Commands from "@/components/Commands";
import Payload from "@/components/InfoComponents/Payload";

export default {
  name: 'Info',
  components: {
      GridLayout: VueGridLayout.GridLayout,
      GridItem: VueGridLayout.GridItem,
      GPSInfo,
      IMUInfo,
      EnviroInfo,
      BatteryInfo,
      StatusInfo,
      ServoInfo,
      Commands,
      PitotInfo,
      Payload
  },
  mounted() {

  },
  data () {
    return {
      //Gridlayout elements
      numOfPanes: 0, //Tracks current number of panes
      paneID: 0, //Pane ID always increases to avoid having multiple panes with same ID
      panes: [],
      leftPos: '250px'
    }
  },
  computed: {
    computedLeftPos: function () {
      return this.leftPos;
    }
  },
  methods: {
    updateGrid (item) {
      console.log(item);
      if (item.componentSize === "2BlockV") {
        this.panes.push({
          "x": 0,
          "y": 0,
          "w": 5.5,
          "h": 19.5,
          "i": String(this.paneID),
          "componentName": String(item.componentName)
        });
        this.numOfPanes++;
        this.paneID++;
      }
      else if (item.componentSize === "2BlockH") {
        this.panes.push({
          "x": 0,
          "y": 0,
          "w": 8,
          "h": 7,
          "i": String(this.paneID),
          "componentName": String(item.componentName)
        });
        this.numOfPanes++;
        this.paneID++;
      }
      else if(item.componentSize === "4Block"){
        this.panes.push({
          "x": 0,
          "y": 0,
          "w": 8,
          "h": 12,
          "i": String(this.paneID),
          "componentName": String(item.componentName)
        });
        this.numOfPanes++;
        this.paneID++;
      }
      else {
        this.panes.push({
          "x": 0,
          "y": 0,
          "w": item.w,
          "h": item.h,
          "i": String(this.paneID),
          "componentName": String(item.componentName)
        });
        this.numOfPanes++;
        this.paneID++;
      }
    },
    //Remove panes
    removePane(index){
      this.numOfPanes--;
      this.panes.splice(index,1); //Remove pane and shift proceceding values to prevent holes in array
    },
    //Test call to backend
    pingBackend: function() {
      axios.get('http://127.0.0.1:5000/Ping')
        .then((response) => {
          this.msg = response.data
        })
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

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
  position:relative;
  height: 100vh;
  left: 0px;
}

.exit-symbol{
  position: absolute;
  top: 5px;
  right: 9px;
  cursor: pointer;
}

</style>
