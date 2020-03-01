<template>
  <div class="infoBox">
    <div class="dropbox">
      <button class="dropbutton" @click="sendDrop(1)"> <i class="fa fa-door-open"/> </button>
      <button class="dropbutton" style="top:100px" @click="sendDrop(2)"> <i class="fa fa-door-closed"/> </button>
      <button class="dropbutton" style="top:160px" @click="sendDrop(3)"> <i class="fa fa-paper-plane"/> </button>
      <button class="dropbutton" style="top:220px" @click="sendDrop(4)"> <i class="fa fa-tint"/> </button>
      <button class="dropbutton" style="top:280px" @click="sendDrop(5)"> <i class="fas fa-globe-americas"/> </button>>
    </div>
    <div class="pitchbox">
      <button class="pitchbutton"  @click="sendPitch(1)"> <i class="fas fa-plane-departure"/> 1 </button>
      <button class="pitchbutton" style="top:60px" @click="sendPitch(2)"> <i class="fas fa-plane-departure"/> 2 </button>
      <button class="pitchbutton" style="top:120px" @click="sendPitch(3)"> <i class="fas fa-wrench"/> </button>
      <button class="pitchbutton" style="top:180px" @click="sendPitch(4)"> <i class="fas fa-exchange-alt"/> </button>
      <button class="pitchbutton" style="top:240px" @click="sendPitch(5)"> <i class="fas fa-level-up-alt"/> 1 </button>
      <button class="pitchbutton" style="top:300px" @click="sendPitch(6)"> <i class="fas fa-level-up-alt"/> 2 </button>
      <h3 style="position: absolute;top:-50px; left:20px"> Pitch </h3>
    </div>
    <div class="servoboxon">
        <!-- h3 class="servoformat" v-for="n in 8"> Servo {{ n }} </h3 -->
        <button class="servobutton" v-for="(item,index) in buttonLabels" @click="sendServo(index+1,item)"> {{ item }} </button>
        <h3 style="position: absolute;top:-30px; left:50px;"> Servo </h3>
    </div>
    <div class="servoboxoff">
        <!-- h3 class="servoformat" v-for="n in 8"> Servo {{ n }} </h3 -->
        <button class="servobutton" v-for="(item,index) in buttonLabels" @click="sendServo(index+1+7,item)"> {{ item }} </button>
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
            destination: '0',
            point: '1',
            flightID: '1'
          },
          buttonLabels: [
            'Left Glider Drop','Right Glider Drop','Left Door','Right Door','Water Drop','Front Habitat Drop','Back Habitat Drop'
          ]
      }
    },
    methods: {
      //Post request to command api
      sendCMD(cmd,type) {
          axios.post('http://localhost:5000/api/communication/sendcmd',{
              body: cmd
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
        var cmd = Object.assign({},this.commandBody);
        var type = '';
        switch (item) {
          case 1:
            console.log("Open Drop Doors command");
            cmd.drop = '1';
            type = 'Open Drop Doors'
            break;
          
          case 2:
            console.log("Close Drop Doors command");
            cmd.drop = '2';
            type = 'Close Drop Doors'
            break;
          
          case 3:
            console.log("Drop Gliders command");
            cmd.drop = '3';
            type = 'Drop Gliders'
            break;
          
          case 4:
            console.log("Drop Water command");
            cmd.drop = '4';
            type = 'Water Drop'
            break;

          case 5:
            console.log("Drop habitat command");
            cmd.drop = '5';
            type = 'Habitat Drop'
          break;

          default:
            console.log("No command");
            break;
        }
        cmd.destination = '1';
        this.sendCMD(cmd,type);
      },
      sendServo(item,label) {
        var cmd = Object.assign({},this.commandBody);
        cmd.servo = item;
        var type = "Servo ";
        if (item < 8) {
          type = type.concat(label," (Servo ",item.toString(),") Open");
        }
        else {
          type = type.concat(label," (Servo ",(item - 8).toString(),") Close");
        }
        cmd.servo = item;
        cmd.destination = '1';
        this.sendCMD(cmd,type);
      },
      sendPitch(item) {
        var cmd = Object.assign({},this.commandBody);
        var type = '';
        switch(item) {
          case 1:
            console.log("Pitch Up Glider 1 Command");
            cmd.pitch = '1';
            cmd.destination = '2';
            type = 'Glider 1 Pitch Up';
            break;
          case 2:
            console.log("Pitch Up Glider 2 Command");
            cmd.pitch = '2';
            cmd.destination = '3';
            type = 'Glider 2 Pitch Up';
            break;
          case 3:
            console.log("Test Servo Range Command");
            cmd.pitch = '3';
            cmd.destination = '1';
            type = 'Test Servo Range';
            break;
          case 4:
            console.log("Auto/Manual Mode Swap Command");
            cmd.pitch = '4';
            cmd.destination = '1';
            type = 'Swap Auto/Manual Mode';
            break;
          case 5:
            console.log("Glider 1 Engage Command");
            cmd.pitch = '5';
            cmd.destination = '2';
            type = 'Glider 1 Engage';
            break;
          case 6:
            console.log("Glider 2 Engage Command");
            cmd.pitch = '6';
            cmd.destination = '3';
            type = 'Glider 2 Engage'
            break;
          default:
            console.log("No command")
            break;
        }
        this.sendCMD(cmd,type);
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
    padding: 10px 15px;
    font-size: 20px;
    cursor: pointer;
    text-align: center;
    text-decoration: none;
    outline: none;
    color: #fff;
    background-color: #4CAF50;
    border: none;
    border-radius: 15px;
    box-shadow: 0 8px #999;
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
    font-size: 15px;
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
    left: 130px;
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
    left: 250px;
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
