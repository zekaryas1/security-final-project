import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class Addlocationtocomplaints extends BaseSchema {

  public async up () {
    this.schema.alterTable('complaints', (table) => {
      table.string('location').defaultTo("");
    })
  }

  public async down () {
    this.schema.alterTable('complaints', (table) => {
      table.dropColumn('location')
    })
  }
}
