<template>
<div>
  <sidebar-menu class="sidebar" :menu="menu" :hide-toggle="true" @item-click="onItemClick"/>
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
      <grid-item v-for="item in panes"
                 style="background-color: #27293D; border: 1px black; margin: 5px; color:white;"
                 :x="item.x"
                 :y="item.y"
                 :w="item.w"
                 :h="item.h"
                 :i="item.i"
                 :key="item.i">
        <i class="fa fa-times exit-symbol" aria-hidden="true" @click="removePane(item.i)"></i>
        {{item.i}}
        <TestComponent v-if="item.componentType == 'Map'"></TestComponent>
        <TestComponent v-if="item.componentType == 'speed'"></TestComponent>
        <br><br>

      </grid-item>
    </grid-layout>
  </div>

</div>
</template>

<script>
import axios from 'axios'
import VueGridLayout from 'vue-grid-layout';
import TestComponent from "@/components/TestComponent";

export default {
  name: 'Base',
  components: {
      GridLayout: VueGridLayout.GridLayout,
      GridItem: VueGridLayout.GridItem,
      TestComponent
  },
  mounted() {

  },
  data () {
    return {
      msg: 'Hello',
      menu: [
        {
          header: true,
          title: 'Ground Station'
        },
        {
            title: 'Map',
            icon: 'fas fa-map',
            componentSize: '4Block',
            componentType: 'Map'
        },
        {
            title: 'Data',
            icon: 'fas fa-hdd',
            componentSize: '2BlockH',
            componentType: 'Data'
        },
        {
            title: 'Communication',
            icon: 'fas fa-satellite',
            componentSize: '1Block',
            componentType: 'Communication'
        },
      ],
      numOfPanes: 2,
      panes: [
          {"x":0,"y":0,"w":4,"h":8,"i":"0"},
          {"x":0,"y":0,"w":4,"h":8,"i":"1"},
          {"x":0,"y":0,"w":4,"h":8,"i":"2"}
      ]
    }
  },
  methods: {
    onItemClick (event, item) {
      console.log(item);
      if (item.componentSize == "2BlockV") {
        this.numOfPanes++;
        this.panes.push({
          "x": 0,
          "y": 0,
          "w": 4,
          "h": 12,
          "i": String(this.numOfPanes)
        });
      }
      else if (item.componentSize == "2BlockH") {
        this.numOfPanes++;
        this.panes.push({
          "x": 0,
          "y": 0,
          "w": 8,
          "h": 7,
          "i": String(this.numOfPanes)
        });
      }
      else if(item.componentSize == "4Block"){
        this.numOfPanes++;
        this.panes.push({
          "x": 0,
          "y": 0,
          "w": 8,
          "h": 12,
          "i": String(this.numOfPanes),
          "componentType": String(item.componentType)
        });
      }
      else {
        this.numOfPanes++;
        this.panes.push({
          "x": 0,
          "y": 0,
          "w": 4,
          "h": 7,
          "i": String(this.numOfPanes)
        });
      }
    },
    removePane(index){
        this.numOfPanes--;
        this.$delete(this.panes, index)
    },
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
  margin-left: 300px;
  height: 100vh;
  margin-top: 0px;
}

.sidebar {
  width: 300px;
  background-color: #1F86F7;
}


.exit-symbol{
  position: absolute;
  top: 5px;
  right: 9px;
  cursor: pointer;
}
</style>
