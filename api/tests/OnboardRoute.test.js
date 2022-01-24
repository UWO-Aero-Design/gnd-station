const request = require('supertest');
const express = require('express');

const app = express();
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use('/onboardconfig', require('../routes/OnboardRoute'))

describe('Onboard Routes Post', function () {
    
    test('to Servo and expect 200', async () => {
        const servolist = [
            {
                name: 'servo1',
                open: true,
                close: false,
                bind: true
            },
            {
                name: 'servo2',
                open: true,
                close: false,
                bind: true
            },
            {   name: 'servo3',
                open: true,
                close: false,
                bind: true
            },
            {
                name: 'servo4',
                open: true,
                close: false,
                bind: true
            },
        ]
        const res = await request(app)
            .post('/onboardconfig/servo')
            .send({ servos: servolist })
            .set({ Accept: "application/json" })
            .expect(200)
    });
});