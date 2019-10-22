<template>
<div>
    <button class="marker" @click="toggleMarker">
        <img v-if="markerType == 'plane'" class="markerImage" src="../../assets/MapAssets/plane.png">
        <img v-if="markerType == 'glider'" class="markerImage" src="../../assets/MapAssets/glider.png">
    </button>
    <div v-if="markerShow">
        <svg height="60" width="200">
            <polyline points="30,45 40,35 175,35" class="line"/>
        </svg>
        <p class="coordinate" style="top:0px;left:83px">Latitude:{{ lat }}</p>
        <p class="coordinate" style="top:25px;left:70px">Longitude:{{ lon }}</p>
    </div>
</div>
</template>

<script>

export default {
    name: "MapMarker",
    components: {
    },
    props: ['markerType','lat','lon'],
    data () {
        return {
            markerShow: false
        }
    },
    methods: {
        toggleMarker() {
            this.markerShow = !this.markerShow;
        }
    }
}
</script>

<style scoped>
.line {
    fill:none;
    stroke:white;
    stroke-width:3;
}

.marker {
    position:absolute;
    top: 40px;
    left: 0px;
    border:none;
    width:24px;
    height:24px;
    border-radius:50%;
}

.coordinate {
    position:absolute;
    color:#66ffff;
    font-size: 15px;
}

.markerImage {
    position:absolute;
    top: 0px;
    left: 0px;
}
</style>
