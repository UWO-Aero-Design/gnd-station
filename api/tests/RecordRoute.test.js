const request = require('supertest');
const express = require('express');
const router = require('../routes/RecordRoute.js');

const app = express();
app.use('/', router);
app.use(express.json());
app.use(express.urlencoded());

const Recording = require('../models/RecordingModel')
jest.mock('../models/RecordingModel');

describe('Record Routes Get', function () {
    
    test('if we are recording true with 200', async () => {
        Recording.is_recording = () => {
            return Promise.resolve(true);
        }
        const res = await request(app).get('/status')
        expect(res.statusCode).toBe(200);
        expect(res.body.status).toEqual(true)
    });

    test('if we are recording false with 200', async () => {
        Recording.is_recording = () => {
            return Promise.resolve(false);
        }
        const res = await request(app).get('/status')
        expect(res.statusCode).toBe(200);
        expect(res.body.status).toEqual(false)
    });
});