const express = require('express');
const ejs = require('ejs');

const logger = require('./logger');
const morgan = require('./morgan');
const { getStats } = require('./stats');

const server = express();
server.use(morgan);
server.get('/metrics', async (req, res) => {
    try {
        const stats = await getStats();
        logger.debug({ stats }, 'Stats from Google Fit');

        const data = await ejs.renderFile('./response.ejs', { stats });
        res.set('Content-Type', 'text/plain; version=0.0.4; charset=utf-8');
        res.end(data);
    } catch (err) {
        logger.error({ err }, 'Getting stats error');
        res.status(500).end(err.message);
    }
});

const port = 3031;
logger.info(`Server listening to ${port}, metrics exposed on /metrics endpoint`);
server.listen(port);