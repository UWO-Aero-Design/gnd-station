const request = require('supertest');
const express = require('express');
const router = require('../routes/GroundRoute');

// I need to mock ../config/usb (We dont want to test usb here)
const usb = require('../config/usb')
jest.mock('../config/usb');
const SerialPort = require('serialport'); 

const app = new express();
app.use('/', router);

describe('Ground Routes', function () {

    usb.list = () => {
        return SerialPort.list();   // Ideally replace this with something manmade
    }

    test('responds to /com', async () => {
        const res = await request(app).get('/com');
        expect(res.statusCode).toBe(200);
    });
});