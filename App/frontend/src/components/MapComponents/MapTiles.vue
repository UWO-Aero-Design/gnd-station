<template>
<div>
<div class="scrollable" id="Map" style="position:relative" v-dragscroll>
    <img src="../../assets/MapAssets/WorldMap.jpg" alt="Map" class="Map">
    <radial-menu class="radialMenu" :itemSize="60" :radius="120" :angle-restriction="90">
        <radial-menu-item class="radialMenuItem" v-for="(item,index) in menuItems" :key="index">
            <button class="button" @click="scrollToItem(item)">{{ item }}</button>
        </radial-menu-item>
    </radial-menu>
    <img src="../../assets/MapAssets/plane.png" alt="Plane" id="Plane" v-bind:style="planeStyle">
</div>
</div>

</template>

<script>
import {dragscroll} from 'vue-dragscroll'
import { RadialMenu, RadialMenuItem } from 'vue-radial-menu'

export default {
    name: "MapTiles",
    directives: {
        'dragscroll': dragscroll
    },
    components: {
        RadialMenu,
        RadialMenuItem
    },
    data () {
        return {
            //Plane Parameters
            planeStyle: {
                position: 'absolute',
                top: '1000px', /*Max distance is 1580px */
                left: '1000px', /*Max distance is 2535px */
                'z-index': '2'
            },
            xOffset : '700px',

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
                newScrollX = parseInt(this.planeStyle.left,10) - currentScrollX;
                
            }
            else if (item == "Glider") {
                newScrollX = parseInt(this.planeStyle.left,10) - currentScrollX;
            }
            document.getElementById('Map').style.scrollBehavior = "smooth";
            document.getElementById('Map').scrollLeft += newScrollX;
            document.getElementById('Map').style.scrollBehavior = "auto";

            //Scroll to y-position
            var VueScrollTo = require('vue-scrollto');
            var options = {
                easing: 'ease-in',
                offset: -500,
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
                cancelScroll = this.$scrollTo('#Plane', 1000, options);
            }
            else if (item == "Glider") {
                cancelScroll = this.$scrollTo('#Glider', 1000, options);
            }
            
        }
    }
}
</script>

<style scoped>
.scrollable {
    height: 100%;
    width:100%;
    overflow-x:hidden;
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
</style>
