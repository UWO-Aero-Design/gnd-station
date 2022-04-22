const request = require('supertest');
const express = require('express');
const router = require('../routes/CommandRoute.js');

const app = express();
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use('/', router);

describe('Command Routes', function () {
    test('Give no commands in body', async () => {
        const res = await request(app).post('/').send({commands: ""});
        expect(res.statusCode).toBe(400);
        expect(res.error.text).toEqual('No command specified');
    });

    // Fails because 500 is received instead but commandroute doesnt seem to ever return 500
    test('Give body that is valid but not in a list', async () => {
        const res = await request(app).post('/').send({commands: "OPEN_DOORS"});
        expect(res.statusCode).toBe(406);
        expect(res.error.text).toEqual('Invalid command');
    });

    // Fails because idk
    test('Give body that is valid in a list', () => {
        console.log = jest.fn();
        request(app).post('/').send({commands: ["OPEN_DOORS"]});
        expect(console.log.mock.calls[0][0]).stringContaining('Serialized message');
    });

    // Fails because 500 is received instead but commandroute doesnt seem to ever return 500
    test('Give invalid body that is not a list', async () => {
        const res = await request(app).post('/').send({commands: "lalalalalal"});
        expect(res.statusCode).toBe(406);
        expect(res.error.text).toEqual('Invalid command');
    });

    test('Give invalid body that is in a list', async () => {
        const res = await request(app).post('/').send({commands: ["lalalalalal"]});
        expect(res.statusCode).toBe(406);
        expect(res.error.text).toEqual('Invalid command');
    });
});