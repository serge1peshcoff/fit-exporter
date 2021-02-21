# mi-router-4-exporter

Reads Google Fit from the API and exports it in a Prometheus format.

## How does it work?
- It fetches the data from the Google Fit API ...
- ... parses it ...
- ... and exposes it in a format that Prometheus can consume.

## How to run it?
1. Get a Google application (see here; https://developers.google.com/fit/rest/v1/get-started)
2. Set its redirect URL to `https://localhost`
3. Clone the repo and `cd` there
4. Create the `.env` file in the root folderet the CLIENT_ID, CLIENT_SECRET and REDIRECT_URL from the Google app
5. Run `npm install`
6. Run `node authorize.js` and follow the instructions.
7. You are authorized now, you should have the `./tokens/tokens.js` file with authhorization tokens.
8. Build the container:

```
docker build -t fit-exporter .
```

3. Run the container (for configuration, see below):

```
docker run -it \
    -d --name=fit-exporter \
    -e PASSWORD=<insert your admin password here> \
    -p 3031:3031 \
    --label com.centurylinklabs.watchtower.enable=false \ # so it won't be restarter by Watchtower if it's running
    --restart unless-stopped \ # so it would start together with the system
    -v $(pwd)/tokens:/usr/src/app/tokens
    fit-exporter
```

4. Open `http://localhost:3031/metrics` in browser, it should display metrics.
5. If there were errors, check out the container logs.


## Configration

All the configuration is done through the environmental variables.
- `LOG_LEVEL` - integration logging level. Default: `warn`. If something isn't working, try setting it to `debug` and check what's inside.
- `CLIENT_ID` - Google app client ID
- `CLIENT_SECRET` - Google app client secret
- `REDIRECT_URL` - Google app redirect URL
