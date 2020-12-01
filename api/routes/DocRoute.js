const router = require('express').Router();

const fs = require('fs')
const path = require('path');

const redoc = require('redoc-express');
const jsyaml = require('js-yaml');

router.get('/open_api', (req, res) => { 
    const docs = jsyaml.safeLoad(fs.readFileSync(path.join(__dirname, '../docs/open_api.yml'), 'utf8'))
    res.send(docs)
});

router.get('/', redoc({ title: 'Backend Documentation', specUrl: '/docs/open_api' }) );



module.exports = router;
