<template>
  <sidebar-menu class="sidebar" ref="sidebar" :menu="menu" :hide-toggle="false" :width="'220px'"
                @item-click="onItemClick" :collapsed="true"/>
</template>
<script>

export default {
  name: "Sidebar",
  components: {
  },
  mounted() {
  },
  data () {
    return {
      //Sidebar menu elements
      menu: [
        {
          header: true,
          title: 'Groundstation',
          hiddenOnCollapse: true
        },
        {
          title: 'Map',
          icon: 'fas fa-map',
          componentType: 'Page',
          componentName: 'Map'
        },
        {
          title: 'Components',
          icon: 'fas fa-dice-d6',
          child: [
            {
              title: 'Data',
              icon: 'fas fa-hdd',
              componentSize: '2BlockH',
              componentType: 'Grid',
              componentName: 'Data'
            },
            {
              title: 'Communication',
              icon: 'fas fa-satellite',
              componentSize: '1Block',
              componentType: 'Grid',
              componentName: 'Communication'
            },
            {
              title: 'Map Data',
              icon: 'fas fa-crosshairs',
              componentSize: '2BlockH',
              componentType: 'Grid',
              componentName: 'MapInfo'
            },
            {
              title: 'Commands',
              icon: 'fas fa-gamepad',
              componentSize: '4Block',
              componentType: 'Grid',
              componentName: 'Command Console'
            }
          ],
          componentType: 'None'
        }
      ]
    }
  },
  methods: {
      onItemClick (event, item) {
      console.log(item);
      this.$emit('update',item);
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

.sidebar {
  background-color: #41B682;
}

</style>
