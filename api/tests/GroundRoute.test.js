const request = require('supertest');
const express = require('express');
const router = require('../routes/GroundRoute');

// I need to mock ../config/usb (We dont want to test usb here)
const usb = require('../config/usb')
jest.mock('../config/usb');
const SerialPort = require('serialport'); 

const app = express();
app.use('/', router);

describe('Ground Routes', function () {

    test('responds to /com with status 200', async () => {
        usb.list = () => {
            return Promise.resolve([
                {
                    path: '/dev/ttyACM0',
                    manufacturer: 'Arduino (www.arduino.cc)',
                    serialNumber: '752303138333518011C1',
                    pnpId: 'usb-Arduino__www.arduino.cc__0043_752303138333518011C1-if00',
                    locationId: undefined,
                    productId: '0043',
                    vendorId: '2341'
                },
                {
                    path: '/dev/ttyACM1',
                    manufacturer: 'Arduino (www.arduino.cc)',
                    serialNumber: '752303138333518011C1',
                    pnpId: 'usb-Arduino__www.arduino.cc__0043_752303138333518011C1-if00',
                    locationId: undefined,
                    productId: '0044',
                    vendorId: '2341'
                },
                { manufacturer: undefined,
                    serialNumber: undefined,
                    pnpId: undefined,
                    locationId: undefined,
                    vendorId: undefined,
                    productId: undefined,
                    path: '/dev/ttyS0' 
                }
            ]);
        }
        const res = await request(app).get('/com');
        expect(res.body).toEqual([
            {
                path: '/dev/ttyACM0',
                manufacturer: 'Arduino (www.arduino.cc)',
                serialNumber: '752303138333518011C1',
                pnpId: 'usb-Arduino__www.arduino.cc__0043_752303138333518011C1-if00',
                locationId: undefined,
                productId: '0043',
                vendorId: '2341'
            },
            {
                path: '/dev/ttyACM1',
                manufacturer: 'Arduino (www.arduino.cc)',
                serialNumber: '752303138333518011C1',
                pnpId: 'usb-Arduino__www.arduino.cc__0043_752303138333518011C1-if00',
                locationId: undefined,
                productId: '0044',
                vendorId: '2341'
            },
        ])
        expect(res.statusCode).toBe(200);
    });

    test('responds to /com with status 500', async () => {
        usb.list = () => {
            return Promise.reject([]);
        }
        const res = await request(app).get('/com');
        expect(res.statusCode).toBe(500);
    });

    test('responds to /com with status 500', async () => {
        usb.list = () => {
            return Promise.resolve([]);
        }
        const res = await request(app).get('/com');
        expect(res.body).toEqual([]);
        expect(res.statusCode).toBe(200);   // Should this be 200
    });
});

// let get_all = req.query.all;         // What does this do