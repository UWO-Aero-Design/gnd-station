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

    test('to Servo, and give empty servo list for updating and expect 200', async () => {
        const servolist = [];
        const res = await request(app)
            .post('/onboardconfig/servo')
            .send({ servos: servolist })
            .set({ Accept: "application/json" })
            .expect(200)
    });

    test('to Servo, give no list for updating and expect 400', async () => {
        const res = await request(app)
            .post('/onboardconfig/servo')
            .send({ servos: "" })
            .set({ Accept: "application/json" })
            .expect(400)
    });

    test('to Servo, give empty json and expect 400', async () => {
        const res = await request(app)
            .post('/onboardconfig/servo')
            .send({ })
            .set({ Accept: "application/json" })
            .expect(400)
    });

    test('to Servo, give servo with empty name and expect 400', async () => {
        const servolist = [
            {
                name: 'servo1',
                open: true,
                close: false,
                bind: true
            },
            {
                name: '',
                open: true,
                close: false,
                bind: true
            },
        ];
        const res = await request(app)
            .post('/onboardconfig/servo')
            .send({ servos: servolist })
            .set({ Accept: "application/json" });
            expect(res.statusCode).toBe(400);
            expect(res.error.text).toEqual('Error: Invalid servo formatting');
    });

    test('to Servo, give servo with no name field and expect 400', async () => {
        const servolist = [
            {
                open: true,
                close: false,
                bind: true
            },
        ];
        const res = await request(app)
            .post('/onboardconfig/servo')
            .send({ servos: servolist })
            .set({ Accept: "application/json" });
            expect(res.statusCode).toBe(400);
            expect(res.error.text).toEqual('Error: Invalid servo formatting');
    });

    test('to Servo, give servo with nothing to update and expect 400', async () => {
        const servolist = [
            {
                name: 'servo1',
                open: false,
                close: false,
                bind: false
            },
        ];
        const res = await request(app)
            .post('/onboardconfig/servo')
            .send({ servos: servolist })
            .set({ Accept: "application/json" });
            expect(res.statusCode).toBe(400);
            expect(res.error.text).toEqual('Error: Nothing to update in servo');
    });
});