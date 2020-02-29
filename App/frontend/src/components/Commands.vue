<template>
  <div class="infoBox">
    <div class="dropbox">
      <button class="dropbutton" @click="sendDrop(1)"> <i class="fas fa-globe-americas"/> </button>
      <button class="dropbutton" style="top:120px" @click="sendDrop(2)"> <i class="fa fa-paper-plane"/> </button>
      <button class="dropbutton" style="top:200px" @click="sendDrop(3)"> <i class="fa fa-paper-plane"/> </button>
      <button class="dropbutton" style="top:280px" @click="sendDrop(4)"> <i class="fa fa-tint"/> </button>
    </div>
    <div class="pitchbox">
      <button class="pitchbutton"  @click="sendPitch"> <i class="fas fa-plane-departure"/> </button>
      <button class="pitchbutton" style="top:80px" @click="sendPitch"> <i class="fas fa-plane-departure"/> </button>
      <h3 style="position: absolute;top:-50px; left:20px"> Pitch </h3>
    </div>
    <div class="servoboxon">
        <!-- h3 class="servoformat" v-for="n in 8"> Servo {{ n }} </h3 -->
        <button class="servobutton" v-for="n in 8" @click="sendServo"> {{ n }} </button>
        <h3 style="position: absolute;top:-30px; left:50px;"> Servo </h3>
    </div>
    <div class="servoboxoff">
        <!-- h3 class="servoformat" v-for="n in 8"> Servo {{ n }} </h3 -->
        <button class="servobutton" v-for="n in 8" @click="sendServo"> {{ n }} </button>
    </div>
    
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
            drop: '0',
            servo: '0',
            pitch: '0',
            point: '1',
            flightID: '1'
          },
          servoBoxScrollOps: {
          vuescroll: {
            mode: 'native'
          },
          scrollPanel: {},
          rail: {},
          bar: {}
        }
      };
    },
    methods: {
      //Post request to command api
      sendCMD(cmd,type) {
          axios.post('http://localhost:5000/api/communication/sendcmd',{
              body: this.commandBody
          })
          .then(response => {})
          .catch(e => {
              this.errors.push(e);
          });
          this.$notify({
            group: 'commandNotifications',
            title: 'Command Sent',
            text: type
          });
      },
      //Send drop command
      sendDrop(item) {
        var cmd = {
          drop: '0',
          servo: '0',
          pitch: '0',
          point: this.point,
          flightID: this.flightID
        };
        var type = '';
        switch (item) {
          case 1:
            console.log("Drop water command");
            cmd.drop = '1';
            type = 'Water Drop'
            break;
          
          case 2:
            console.log("Drop glider 1 command");
            cmd.drop = '2';
            type = 'Glider 1 Drop'
            break;
          
          case 3:
            console.log("Drop glider 2 command");
            cmd.drop = '3';
            type = 'Glider 2 Drop'
            break;
          
          case 4:
            console.log("Drop habitat command");
            cmd.drop = '4';
            type = 'Habitat Drop'
            break;

          default:
            console.log("No command");
            break;
        }
        this.sendCMD(cmd,type);
      },
      sendServo() {
        var cmd = {
          drop: '0',
          servo: '1',
          pitch: '0',
          point: this.point,
          flightID: this.flightID
        };
        this.sendCMD(cmd,'Servo');
      },
      sendPitch() {
        var cmd = {
          drop: '0',
          servo: '0',
          pitch: '1',
          point: this.point,
          flightID: this.flightID
        };
        this.sendCMD(cmd,'Pitch');
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
  button {
    display: inline-block;
    width: 7em;
    padding: 15px 25px;
    font-size: 24px;
    cursor: pointer;
    text-align: center;
    text-decoration: none;
    outline: none;
    color: #fff;
    background-color: #4CAF50;
    border: none;
    border-radius: 15px;
    box-shadow: 0 9px #999;
    transition-duration: 0.4s;
  }

  button:active {
    background-color: #3e8e41;
    box-shadow: 0 5px #666;
    transform: translateY(4px);
  }

  button:hover {
  background-color: rgb(206, 2, 2); /* Green */
  color: white;
  }

  .dropbutton {
    position: absolute;
    left: 20px;
    top: 40px;
  }

  .servobutton {
    position: relative;
    left: 50px;
    top: 10px;
  }

  .pitchbutton {
    position: absolute;
    left: 20px;
  }

  .dropbox {
    position: absolute;
    left: 0px;
    top: 0px;
  }

  .pitchbox {
    position: absolute;
    top: 400px;
  }

  .servoboxon {
    position: absolute;
    top: 20px;
    left: 200px;
    display: flex;
    flex-direction: column
  }

  .servoboxon > .servobutton {
    margin: 10px;
    padding: 15px;
  }

  .servoboxoff {
    position: absolute;
    top: 20px;
    left: 400px;
    display: flex;
    flex-direction: column;
  }

  .servoboxoff > .servobutton {
    margin: 10px;
    padding: 15px;
  }

  .servoformat {
    position: relative;
    left:100px;
  }

</style>