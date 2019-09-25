<template>
<div>
  <div>
    <h1> {{ msg }} </h1>
    <button v-on:click="pingBackend"> Connect to Backend </button>
  </div>
  <sidebar-menu :menu="menu"/>
</div>
</template>

<script>
import axios from 'axios'

export default {
  name: 'Base',
  data () {
    return {
      msg: 'Hello',
      menu: [
        {
          header: true,
          title: 'Menu'
        }
      ]
    }
  },

  methods: {
    pingBackend: function () {
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
</style>
