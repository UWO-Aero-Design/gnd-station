<template>
  <div class="infoBox">
    <h2>Servo 0: {{ ServoState.Servo0 }}</h2>
    <h2>Servo 1: {{ ServoState.Servo1 }}</h2>
    <h2>Servo 2: {{ ServoState.Servo2 }}</h2>
    <h2>Servo 3: {{ ServoState.Servo3 }}</h2>
    <h2>Servo 4: {{ ServoState.Servo4 }}</h2>
    <h2>Servo 5: {{ ServoState.Servo5 }}</h2>
    <h2>Servo 6: {{ ServoState.Servo6 }}</h2>
  </div>
</template>

<script>

  export default {
    name: "ServoInfo",
    components: {

    },
    props: {
    },
    data () {
      return {
        isConnected: false,
        ServoData: '',
        DefaultServoState: {
            'Servo0': 'Closed',
            'Servo1': 'Closed',
            'Servo2': 'Closed',
            'Servo3': 'Closed',
            'Servo4': 'Closed',
            'Servo5': 'Closed',
            'Servo6': 'Closed',
        },
        ServoState: {
            'Servo0': 'Closed',
            'Servo1': 'Closed',
            'Servo2': 'Closed',
            'Servo3': 'Closed',
            'Servo4': 'Closed',
            'Servo5': 'Closed',
            'Servo6': 'Closed',
        }
      };
    },
    methods: {
    },
    sockets: {
      connect() {
      this.isConnected = true;
    },
    ServoChannel: function(data) {
      this.ServoData = data;
      this.ServoState = this.DefaultServoState;
      if (ServoData.servo7 == 1) {
          this.ServoState.Servo0 = 'Open'
      }
      if (ServoData.servo8 == 1) {
          this.ServoState.Servo1 = 'Open'
      }
      if (ServoData.servo9 == 1) {
          this.ServoState.Servo2 = 'Open'
      }
      if (ServoData.servo10 == 1) {
          this.ServoState.Servo3 = 'Open'
      }
      if (ServoData.servo11 == 1) {
          this.ServoState.Servo4 = 'Open'
      }
      if (ServoData.servo12 == 1) {
          this.ServoState.Servo5 = 'Open'
      }
      if (ServoData.servo13 == 1) {
          this.ServoState.Servo6 = 'Open'
      }
    }
    }
  }
</script>

<style scoped>
  .infoBox {
    color: white;
    position: relative;
    left: 20px;
    top:20px;
  }

  h2 {
    font-size: 15px;
  }


</style>
