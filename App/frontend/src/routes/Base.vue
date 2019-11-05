<template>
  <div>
  <Sidebar @update="updatePage"></Sidebar>
  <multipane class="custom-resizer" layout="vertical">
    <div class="pane">
      <Map></Map>
  </div>
   <multipane-resizer></multipane-resizer>
    <div class="pane" :style="{ flexGrow: 1 }">
      <Info ref="Info"></Info>
    </div>
  </multipane>
  </div>
</template>

<script>
  import Sidebar from "@/components/Sidebar";
  import { Multipane, MultipaneResizer } from 'vue-multipane';
  import Map from "@/components/Map";
  import Info from "@/components/Info";

export default {
  name: 'Base',
  components: {
    Sidebar,
    Multipane,
    MultipaneResizer,
    Map,
    Info
  },
  mounted() {
  },
  data () {
    return {
    }
  },
  methods: {
    updatePage(item) {
      if (item.componentType === "Grid") {}
      this.$refs.Info.updateGrid(item);
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
  margin-left: 300px;
  height: 100vh;
  margin-top: 0px;
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
   width: 3px;
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
