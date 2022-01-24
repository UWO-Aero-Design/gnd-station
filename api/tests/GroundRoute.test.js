const request = require('supertest');
const express = require('express');
const router = require('../routes/GroundRoute');

const app = express();
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use('/', router);

// I need to mock ../config/usb (We dont want to test usb here)
const usb = require('../config/usb')
jest.mock('../config/usb');

describe('Ground Routes Get', function () {

    test('responds to /com with status 200 and filtered list', async () => {
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

    test('responds to /com with status 500 due to rejected promise', async () => {
        usb.list = () => {
            return Promise.reject([]);
        }
        const res = await request(app).get('/com');
        expect(res.statusCode).toBe(500);
    });

    test('responds to /com with status 200 and returns empty list', async () => {
        usb.list = () => {
            return Promise.resolve([]);
        }
        const res = await request(app).get('/com');
        expect(res.body).toEqual([]);
        expect(res.statusCode).toBe(200);   // Should this be 200
    });

    test('responds to /mapkey with status 200', async () => {
        process.env.MAPBOX_API_KEY = 'test';
        const res = await request(app).get('/mapkey');
        expect(res.body).toEqual({'key': 'test'});
        expect(res.statusCode).toBe(200);
    });

    test('responds to /mapkey with status 404', async () => {
        process.env.MAPBOX_API_KEY = '';
        const res = await request(app).get('/mapkey');
        expect(res.body).toEqual({});
        expect(res.statusCode).toBe(404);
    });

    afterEach(() => {
        delete process.env.MAPBOX_API_KEY;
    });
});

describe('Ground Routes Post', function () {
    
    test('post to test responds with 200', async () => {
        usb.write = () => {
            return Promise.resolve('sent some data');
        }
        const res = await request(app).post('/com/test');
        expect(res.statusCode).toBe(200);
    });

    test('post to test responds with 500', async () => {
        usb.write = () => {
            return Promise.reject(new Error('Current port has not yet been selected'));
        }
        const res = await request(app).post('/com/test');
        expect(res.error.toString()).toBe('Error: cannot POST /com/test (500)');
        expect(res.statusCode).toBe(500);
    });
    
    test('post to /com and get 200', async () => {
        usb.select = async (mypath) => {
            return Promise.resolve();
        }
        const res = await request(app)
            .post('/com')
            .set('Accept', 'application/json')
            .send({
                path: '/dev/ttyACM1',
                manufacturer: 'Arduino (www.arduino.cc)',
                serialNumber: '752303138333518011C1',
                pnpId: 'usb-Arduino__www.arduino.cc__0043_752303138333518011C1-if00',
                locationId: 0,
                productId: '0044',
                vendorId: '2341'
            });
        expect(res.statusCode).toBe(200);
    });
});