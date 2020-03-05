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
          title: 'Data',
          icon: 'fas fa-dice-d6',
          child: [
            {
              title: 'Pitot',
              icon: 'fas fa-wind',
              componentSize: 'Custom',
              componentType: 'Grid',
              componentName: 'Pitot Info',
              w: 5,
              h: 2
            },
            {
              title: 'IMU',
              icon: 'fas fa-sync',
              componentSize: 'Custom',
              componentType: 'Grid',
              componentName: 'IMU Info',
              w: 5,
              h: 10
            },
            {
              title: 'GPS',
              icon: 'fas fa-crosshairs',
              componentSize: 'Custom',
              componentType: 'Grid',
              componentName: 'GPS Info',
              w: 5,
              h: 6
            },
            {
              title: 'Environment',
              icon: 'fas fa-seedling',
              componentSize: 'Custom',
              componentType: 'Grid',
              componentName: 'Environment Info',
              w: 5,
              h: 3.5
            },
            {
              title: 'Battery',
              icon: 'fas fa-battery-three-quarters',
              componentSize: 'Custom',
              componentType: 'Grid',
              componentName: 'Battery Info',
              w: 5,
              h: 2.5
            },
            {
              title: 'Status',
              icon: 'fas fa-satellite',
              componentSize: 'Custom',
              componentType: 'Grid',
              componentName: 'Status Info',
              w: 5,
              h: 2.5
            },
            {
              title: 'Servo',
              icon: 'fas fa-tachometer-alt',
              componentSize: 'Custom',
              componentType: 'Grid',
              componentName: 'Servo Info',
              w: 5,
              h: 6.5
            },
            {
              title: 'Payload',
              icon: 'fas fa-tachometer-alt',
              componentSize: 'Custom',
              componentType: 'Grid',
              componentName: 'Payload Info',
              w: 5,
              h: 8
            }
          ],
          componentType: 'None'
        },
        {
          title: 'Communication',
          icon: 'fas fa-satellite-dish',
          child: [
            {
              title: 'Commands',
              icon: 'fas fa-gamepad',
              componentSize: '2BlockV',
              componentType: 'Grid',
              componentName: 'Command Console'
            }
          ],
          ComponentType: 'None'
        },
        {
          title: 'Flights',
          icon: 'fas fa-draw-polygon',
          componentType: 'Page',
          componentName: 'Map'
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
