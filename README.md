Exchange arbitration data collection worker - Binance
=====================================================

[![build status](https://gitlab.com/x-data/x-financial-arbitration-data-collection-worker-binance/badges/master/build.svg)](https://gitlab.com/x-data/x-financial-arbitration-data-collection-worker-binance/commits/master)
[![coverage](https://gitlab.com/x-data/x-financial-arbitration-data-collection-worker-binance/badges/master/coverage.svg?job=test)](https://gitlab.com/x-data/x-financial-arbitration-data-collection-worker-binance/commits/master)

This worker aims to collect data from the exchange Binance.

**NOTE:** The `price` field should always be in the `quote asset` value

**NOTE:** This project relies on environment variables to work, so make sure to set up everything before running.

## Running the tests

Requirements:

    * Node (tested with 8.9.4)
    * npm (tested with (5.6.0)

Run:

    npm test

Done. It will check lint issues and run the available tests, displaying a coverage status.

## Installing and using

Here you will find two section, running with docker and without it. We definitely recommend the docker usage for it's simplicity and other several benefits

### Running with docker

Requirements:

    * Docker (tested with 17.12.0-ce)
    * Docker Compose (tested with 1.18.0)

Running the project:

    docker-compose up

### Running without docker

Requirements:

    * Node (tested with 8.9.4)
    * npm (tested with (5.6.0)

Installing dependencies:

    npm install

Running the project:

    npm run local

Environment variables available are listed below and you can check it's usage in the `src/config/default.js` file.

| environment variable    | default                                     | required | description |
|-------------------------|---------------------------------------------|----------|-------------|
| EXCHANGE_NAME           | binance                                     | true     | it becomes *required* when the there is no *SYMBOL_DELIMTER* separating the pair of currencies in the exchange |
| SYMBOL_DELIMITER        |                                             | false    | it defines the pair of currencies separator, e.g. BTC-LTC the `-` is the separator |
| API_URL                 | https://api.binance.com/api/v3/ticker/price | true     | the full API URL route/path you can collect the pair prices |
| COLLECT_SPECIFIC_PRICES | true                                        | false    | if you wish to collect only specific prices and not all the prices available in the exchange |
| COLLECT_PAIRS           | ETH-BTC,BCH-BTC                             | false    | the comma separated list of pairs to collect, e.g. "BTC-LTC, ETH-XRP" |
| INTERVAL_IN_SECONDS     | 300                                         | false    | the interval in seconds to update the pairs |
| NODE_CONFIG_DIR         |                                             | true     | set it to `./src/config` |
| RUNNING_MODE            | single-mode                                 | false    | it specifies if the collect data process should run once (`single-mode`) or forever as a `worker` |
| DB_NAME                 | db                                          | true     | the database name |
| DB_USERNAME             | worker                                      | true     | the username that will login into the database |
| DB_PASSWORD             | worker                                      | true     | the database password |
| DB_HOST                 | localhost                                   | true     | the database host |
| DB_PORT                 | 3306                                        | true     | the database port |
| DB_DEBUG                | false                                       | true     | debugging the database |
| DB_LOGGING              | undefined                                   | true     | whether the database should log or not |
| DB_POOL_MAX             | 20                                          | true     | the maximum pool number |
| DB_POOL_MIN             | 5                                           | true     | the minimum pool number |
| DB_POOL_IDLE            | 10000                                       | true     | the number of pools allowed to be idle |
| LOGGING_LEVEL           | debug                                       | true     | the application logging level |
