import BaseSchema from "@ioc:Adonis/Lucid/Schema";

export default class Addisblockeds extends BaseSchema {
  public async up() {
    this.schema.alterTable("users", (table) => {
      table.boolean("blocked").defaultTo(false);
    });
  }

  public async down() {
    this.schema.alterTable("users", (table) => {
      table.dropColumn("blocked");
    });
  }
}
