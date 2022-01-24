const request = require('supertest');
const express = require('express');
const router = require('../routes/RecordRoute.js');

const app = express();
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use('/', router);

const Recording = require('../models/RecordingModel')
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
    
    test('post record id', async () => {
        const res = await request(app).post('/1');
        expect(res.statusCode).toBe(200);
        expect(res.body.id).toEqual(1);
    });

    test('post with no action expects 400 back', async () => {
        const res = await request(app).post('/').send({action: ""});
        expect(res.statusCode).toBe(400);
    });

});