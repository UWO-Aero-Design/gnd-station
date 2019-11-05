<template>
  <sidebar-menu class="sidebar" ref="sidebar" :menu="menu" :hide-toggle="true" :width="'220px'"
                @toggle-collapse="onToggleCollapse" @item-click="onItemClick" :collapsed="true"/>
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
          href: '/map',
          componentType: 'None'
        },
        {
          title: 'Components',
          icon: 'fas fa-dice-d6',
          href: '/info',
          child: [
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
      this.$emit('update-grid',item);
    },
    onToggleCollapse (collapsed) {
        if (collapsed) {
          this.$emit('update-sidebar','10px');
        }
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
