import BaseSeeder from '@ioc:Adonis/Lucid/Seeder'
import Database from "@ioc:Adonis/Lucid/Database";


export default class ComplaintTypeSeeder extends BaseSeeder {
  public async run() {
    await Database.table('complaintType').multiInsert([
      {name: "parking problem"},
      {name: "manhole"},
      {name: "public property abuse"},
      {name: "road defects"},
      {name: "other"},
    ])
  }
}
