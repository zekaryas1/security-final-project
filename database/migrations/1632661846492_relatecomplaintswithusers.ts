import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class Relatecomplaintswithusers extends BaseSchema {

  public async up() {
    this.schema.alterTable('complaints', (table) => {
      table.integer("userId")
        .unsigned()
        .references("users.id");
    })
  }

  public async down() {
    this.schema.alterTable('complaints', (table) => {
      table.dropColumn('userId')
    })
  }
}
