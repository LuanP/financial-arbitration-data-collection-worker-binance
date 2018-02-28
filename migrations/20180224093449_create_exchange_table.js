const config = require('config')

exports.up = (knex, Promise) => {
  return knex.schema.createTable(config.exchange.name, (table) => {
    table.increments('id').unsigned().notNullable().primary()

    // base asset / quote asset / timestamp / normalized pair / denormalized pair / price
    table.string('base_asset', 10).notNullable()
    table.string('quote_asset', 10).notNullable()
    table.string('normalized_pair', 20).notNullable()
    table.string('denormalized_pair', 20).notNullable()
    table.string('price', 20).notNullable()

    table.timestamp('created_at').defaultTo(knex.fn.now())

    // indexes
    table.index('created_at', 'index_created_at')
    table.index(['created_at', 'normalized_pair'], 'index_created_at_normalized_pair')

    table.comment(`${config.exchange.name} data collected`)
    table.engine('InnoDB')
  })
}

exports.down = (knex, Promise) => {
  return knex.schema.dropTable(config.exchange.name)
}
