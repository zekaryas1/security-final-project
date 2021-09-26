import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class Complaints extends BaseSchema {
  protected tableName = 'complaints';

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id').primary();
      table.integer("complaintTypeId")
        .unsigned()
        .references("complaintType.id");
      table.text("comment");
      table.text("fileName");
      /**
       * Uses timestamptz for PostgreSQL and DATETIME2 for MSSQL
       */
      table.timestamp('created_at', {useTz: true}).defaultTo(this.now());
      table.timestamp('updated_at', {useTz: true}).defaultTo(this.now())
    })
  }

  public async down() {
    this.schema.dropTable(this.tableName)
  }
}
