<template>
<div>
  <sidebar-menu class="sidebar" :menu="menu" :hide-toggle="true" @item-click="onItemClick"/>
  <div class="main-box">
    <splitpanes class="default-theme">
      <div v-for="pane in panes" :key="pane.i"> {{pane.text}} </div>
    </splitpanes>
  </div>

</div>
</template>

<script>
import axios from 'axios'
import Splitpanes from 'splitpanes'
import 'splitpanes/dist/splitpanes.css'

export default {
  name: 'Base',
  components: {Splitpanes},
  data () {
    return {
      msg: 'Hello',
      menu: [
        {
          header: true,
          title: 'Menu'
        },
        {
            title: 'Add Pane'
        }

      ],
      panes: [
            {
                i: 0,
                text: 'Hello'
            },
            {
                i: 1,
                text: 'Hello2'
            }
      ]
    }
  },

  methods: {
    onItemClick (event, item) {
        console.log(item);
        if(item.title == "Add Pane"){
            this.panes.push({
                i: 2,
                text: "new Pane"
            });
        }
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
}

.sidebar {
  width: 300px;
}

.splitpanes.default-theme.splitpanes__pane {
  justify-content: center;
  align-items: center;
  display: flex;
  background-color: #2c3e50!important;

}

.splitpanes__pane span {
  font-family: Helvetica, Arial, sans-serif;
  color: #fff;
  font-size: 5em;
  opacity: 0.6;
}
</style>
