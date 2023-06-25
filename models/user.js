const knex = require('knex')(require('../knexfile.js')['development']);

class User {
  constructor(user) {
    this.id = user.id;
    this.username = user.username;
    this.password = user.password;
    this.is_active = user.is_active;
    this.is_admin = user.is_admin;
  }

  static create(user) {
    return knex('users').insert(user)
      .returning('id')
    then(ids => ids[0]);
  }

  static findOne(username) {
    return knex('users').where({ username }).first();
  }

  static findById(id) {
    return knex('users').where({ id }).first();
  }
}

module.exports = User;
