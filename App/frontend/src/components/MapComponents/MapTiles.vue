<template>
<div>
<div class="scrollable" id="Map" style="position:relative" v-dragscroll>
    <img src="../../assets/MapAssets/WorldMap.jpg" alt="Map" class="Map">
    <radial-menu class="radialMenu" :itemSize="60" :radius="120" :angle-restriction="90">
        <radial-menu-item class="radialMenuItem" v-for="(item,index) in menuItems" :key="index">
            <button class="button" @click="scrollToItem(item)">{{ item }}</button>
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
            xOffset : '500px',

            //Menu Data
            menuItems: ['Plane','Glider']
        }
    },
    methods: {
        //Scrolling
        scrollToItem(item) {
            //Scroll to x-position
            var currentScrollX = document.getElementById('Map').scrollLeft + parseInt(this.xOffset,10);
            var newScrollX = 0;
            if (item == "Plane") {
                newScrollX = parseInt(this.planePos[0],10) - currentScrollX;
                
            }
            else if (item == "Glider") {
                newScrollX = parseInt(this.gliderPos[0],10) - currentScrollX;
            }
            document.getElementById('Map').style.scrollBehavior = "smooth";
            document.getElementById('Map').scrollLeft += newScrollX;
            document.getElementById('Map').style.scrollBehavior = "auto";

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
            if (item == "Plane") {
                var cancelScroll = this.$scrollTo('#Plane', 800, options);
            }
            else if (item == "Glider") {
                var cancelScroll = this.$scrollTo('#Glider', 800, options);
            }
            
        }
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
}

.Map {
    position:relative;
    top:0;
    left:0;
    z-index: 1;
}

.radialMenu {
    position: fixed;
    top: 93%;
    left: 95%;
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
