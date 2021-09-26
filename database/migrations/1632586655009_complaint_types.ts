import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class ComplaintTypes extends BaseSchema {
  protected tableName = 'complaintType';

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id').primary();
      table.text("name");

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
