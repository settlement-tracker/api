/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = async function (knex) {
  return await knex.schema.createTable('users', function (table) {
    table.increments('id');
    table.string('username').notNullable();
    table.string('password').notNullable();
    table.boolean('is_admin').notNullable().defaultTo(false);
    table.boolean('is_active').notNullable().defaultTo(true);
  });
};


/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = async function (knex) {
  return await knex.schema.dropTable('users');
};
