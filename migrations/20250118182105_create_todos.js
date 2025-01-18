/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
  return knex.schema.createTable('todos', (table) => {
    table.increments('id').primary(); // Auto-incrementing ID
    table.string('description').notNullable(); // Task description
    table.string('state').defaultTo('INCOMPLETE'); // Task state
    table.timestamp('createdAt').defaultTo(knex.fn.now()); // Creation timestamp
    table.timestamp('completedAt').nullable(); // Completion timestamp (optional)
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
  return knex.schema.dropTable('todos'); // Rollback: Drop the table
};
