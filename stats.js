require('dotenv').config();

const {google} = require('googleapis');

const tokens = require('./tokens/tokens');

const oauth2Client = new google.auth.OAuth2(
    process.env.CLIENT_ID,
    process.env.CLIENT_SECRET,
    process.env.REDIRECT_URL
);
oauth2Client.setCredentials(tokens);
google.options({auth: oauth2Client});

const fitness = google.fitness('v1');

module.exports.getStats = async () => {
    const res = await fitness.users.dataSources.list({ userId: 'me' });
    const { dataSource } =  res.data;

    const results = await Promise.all(dataSource.map(source =>  fitness.users.dataSources.datasets.get({
        datasetId: `0-${Date.now()}000000`, // from the beginning till now
        dataSourceId: source.dataStreamId,
        userId: 'me'
    })));

    return results
        .filter(result => result.data.point.length > 0)
        .map(result => {
            const name = result.data.dataSourceId;
            const point = result.data.point[result.data.point.length - 1];
            const time = new Date(parseInt(point.startTimeNanos.substring(0, point.startTimeNanos.length - 6)));

            const valueObject = point.value[point.value.length - 1];
            const value = typeof valueObject.fpVal !== 'undefined'
                ? valueObject.fpVal
                : valueObject.intVal;

            return {
                name,
                time,
                value
            };
        })
}
