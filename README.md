Exchange arbitration data collection worker - Binance
=====================================================

Environment variables available

| environment variable    | default | required | description |
|-------------------------|---------|----------|-------------|
| EXCHANGE_NAME           |         | false    | it becomes *required* when the there is no *SYMBOL_DELIMTER* separating the pair of currencies in the exchange |
| SYMBOL_DELIMITER        |         | false    | it defines the pair of currencies separator, e.g. BTC-LTC the `-` is the separator |
| API_URL                 |         | true     | the full API URL route/path you can collect the pair prices |
| COLLECT_SPECIFIC_PRICES | false   | false    | if you wish to collect only specific prices and not all the prices available in the exchange |
| COLLECT_PAIRS           |         | false    | the comma separated list of pairs to collect, e.g. "BTC-LTC, ETH-XRP" |
| INTERVAL_IN_SECONDS     | 300     | false    | the interval in seconds to update the pairs |
| NODE_CONFIG_DIR         |         | true     | set it to `./src/config` |
