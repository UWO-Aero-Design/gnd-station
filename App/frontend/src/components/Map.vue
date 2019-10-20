<template>
<div>
    <Sidebar></Sidebar>
    <div class="main-box">
        <MapTiles></MapTiles>
    </div>
</div>
</template>

<script>
import Sidebar from "@/components/Sidebar";
import MapTiles from "@/components/MapComponents/MapTiles";

export default {
    name: "Map",
    components: {
        Sidebar,
        MapTiles
    }
}
</script>

<style scoped>
.main-box {
  margin-left: 300px;
  height: 100vh;
  margin-top: 0px;
}
</style>
