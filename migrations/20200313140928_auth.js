exports.up = function(knex) {
 return knex.schema.createTable("users", table => {
  table.increments();

  table
   .string("username", 255)
   .notNull()
   .unique();
  table.string("password", 255).notNull();
 });
};

exports.down = function(knex) {
 return knex.schema.dropTableIfExists("users");
};
