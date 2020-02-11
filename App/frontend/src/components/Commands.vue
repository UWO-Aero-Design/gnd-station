<template>
  <div class="infoBox">
    <button @click="sendDrop"> Drop </button>
  </div>
</template>

<script>
    import axios from 'axios';
  export default {
    name: "Commands",
    components: {
    },
    props: {
    },
    data () {
      return {
          commandBody: {
              drop: '1',
              servo: '2',
              pitch: '3',
              point: '1',
              flightID: '1'
          }
      };
    },
    methods: {
        sendDrop() {
            axios.post('http://localhost:5000/communication/sendcmd',{
                body: this.commandBody
            })
            .then(response => {})
            .catch(e => {
                this.errors.push(e);
            });
            alert("Command Sent");
        }
    }
  }
</script>

<style scoped>
  .infoBox {
    color: white;
  }
  h1 {
    position: relative;
    left: 20px;
  }
</style>