const request = require('supertest');
const express = require('express');
const router = require('../routes/RecordRoute.js');

const app = express();
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use('/', router);

const Recording = require('../models/RecordingModel');
const { promises } = require('serialport');
jest.mock('../models/RecordingModel');

describe('Record Routes Get', function () {
    
    test('if we are recording true with 200', async () => {
        Recording.is_recording = () => {
            return true;
        }
        const res = await request(app).get('/status')
        expect(res.statusCode).toBe(200);
        expect(res.body.status).toEqual(true)
    });

    test('if we are recording false with 200', async () => {
        Recording.is_recording = () => {
            return false;
        }
        const res = await request(app).get('/status')
        expect(res.statusCode).toBe(200);
        expect(res.body.status).toEqual(false)
    });
});

describe('Not really unit tests', function () {
    
    // Currently fails
    // Recording.findById returns {}
    // test('post record id of 0', async () => {
    //     const res = await request(app).post('/0');
    //     expect(res.statusCode).toBe(200);
    //     expect(res.body.id).toEqual(1);
    // });

    test('post with no action expects 400 back', async () => {
        const res = await request(app).post('/').send({action: ""});
        expect(res.statusCode).toBe(400);
    });

    test('post with invalid action expects 400 back', async () => {
        const res = await request(app).post('/').send({action: "startstop"});
        expect(res.statusCode).toBe(400);
    });



    test('post with action stop when not recording', async () => {
        Recording.is_recording = () => {
            return false;
        }
        const res = await request(app).post('/').send({action: "stop"});
        expect(res.statusCode).toBe(200);
    });

    test('post with action stop when currently recording', async () => {
        Recording.is_recording = () => {
            return true;
        }
        console.log = jest.fn();
        const res = await request(app).post('/').send({action: "stop"});
        expect(res.statusCode).toBe(200);
        expect(console.log.mock.calls[0][0]).toBe('Stopped recording');
    });

    // test('post with action start when not recording', async () => {
    //     Recording.is_recording = () => {
    //         return false;
    //     }
    //     // Dont think this mocked function is working
    //     // Recording() is returning null, how to solve that? Mock DB?
    //     Recording.save = () => {
    //         return promises.resolve({_id: "1"});
    //     }
    //     Recording.get_current_recording = () => {
    //         return "1";
    //     }
    //     console.log = jest.fn();
    //     const res = await request(app).post('/').send({action: "start"});
    //     expect(res.statusCode).toBe(200);
    //     expect(console.log.mock.calls[0][0]).toBe('Started recording');
    // });

    test('post with action start when currently recording', async () => {
        Recording.is_recording = () => {
            return true;
        }
        const res = await request(app).post('/').send({action: "start"});
        expect(res.statusCode).toBe(200);
    });

});