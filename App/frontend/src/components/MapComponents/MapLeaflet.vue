<template>
<div>
<div class="scrollable" id="Map" v-dragscroll>
    <img src="../../assets/MapAssets/WorldMap.jpg" alt="Map" class="MapTile">
    <radial-menu class="radialMenu" :itemSize="55" :radius="120" :angle-restriction="90" :rotate="90">
        <radial-menu-item class="radialMenuItem" v-for="(item,index) in menuItems" :key="index">
            <button class="button" @click="activateScroll(item)">{{ item }}</button>
        </radial-menu-item>
    </radial-menu>
    <MapMarker markerType="plane" v-bind:lat="planeLoc[0]" v-bind:lon="planeLoc[1]" class="marker" id="Plane" v-bind:style="{top: planePos[1], left: planePos[0], 'z-index': 2}"></MapMarker>
    <MapMarker markerType="glider" v-bind:lat="gliderLoc[0]" v-bind:lon="gliderLoc[1]" class="marker" id="Glider" v-bind:style="{top: gliderPos[1], left: gliderPos[0], 'z-index': 2}"></MapMarker>
</div>
</div>

</template>

<script>
import {dragscroll} from 'vue-dragscroll'
import { RadialMenu, RadialMenuItem } from 'vue-radial-menu'
import MapMarker from '@/components/MapComponents/MapMarker'

export default {
    name: "MapTiles",
    directives: {
        'dragscroll': dragscroll
    },
    components: {
        RadialMenu,
        RadialMenuItem,
        MapMarker
    },
    props: ['planePos','gliderPos','planeLoc','gliderLoc'],
    data () {
        return {
            xOffset : '800px',
            yOffset : '200px',

            //Menu Data
            menuItems: ['Plane','Glider']
        }
    },
    methods: {
      //Scrolling
      activateScroll(item) {
        this.scrollToItemX(item);
        setTimeout(this.scrollToItemY,500,item);
      },
      scrollToItemX(item) {
        let newScrollX = 0;
        if (item === "Plane") {
          newScrollX = parseInt(this.planePos[0],10) - parseInt(this.xOffset,10);

        }
        else if (item === "Glider") {
          newScrollX = parseInt(this.gliderPos[0],10) - parseInt(this.xOffset,10);
        }

        document.getElementById('Map').style.scrollBehavior = "smooth";
        document.getElementById('Map').scrollLeft = newScrollX;
        document.getElementById('Map').style.scrollBehavior = "auto";
      },
      scrollToItemY(item) {
        let newScrollY = 0;
        if (item === "Plane") {
          newScrollY = parseInt(this.planePos[1],10) - parseInt(this.yOffset,10);

        }
        else if (item === "Glider") {
          newScrollY = parseInt(this.gliderPos[1],10) - parseInt(this.yOffset,10);
        }

        document.getElementById('Map').style.scrollBehavior = "smooth";
        document.getElementById('Map').scrollTop = newScrollY;
        document.getElementById('Map').style.scrollBehavior = "auto";
      }
        /*scrollToItem(item) {
          //Scroll to y-position
          var VueScrollTo = require('vue-scrollto');
          var options = {
            easing: 'ease-in',
            offset: -300,
            force: true,
            cancelable: true,
            onStart: function(element) {
            // scrolling started
            },
            onDone: function(element) {
            // scrolling is done
            },
            onCancel: function() {
            // scrolling has been interrupted
            },
            x: true,
            y: true
          }
          if (item === "Plane") {
            this.$scrollTo('#Plane', 800, options);
          }
          else if (item === "Glider") {
            this.$scrollTo('#Glider', 800, options);
          }
        }*/
    }
}
</script>

<style scoped>
.scrollable {
    height: 100%;
    width:100%;
    overflow:hidden;
    direction: ltr;
    scroll-behavior: auto;
    position: absolute;
}

.MapTile {
    position:relative;
    top:0;
    left:0;
    z-index: 1;
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

.button {
    background-color: #315CF4;
    color: white;
    height:100%;
    width:100%;
    border: none;
    border-radius: 50%;
}

.marker {
    position: absolute;
}
</style>
