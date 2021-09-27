import Application from "@ioc:Adonis/Core/Application";
import Drive from "@ioc:Adonis/Core/Drive";
import { HttpContextContract } from "@ioc:Adonis/Core/HttpContext";
import { rules, schema } from "@ioc:Adonis/Core/Validator";
import Database from "@ioc:Adonis/Lucid/Database";

export default class ComplaintsController {
  public async index({ view, auth }: HttpContextContract) {
    const allComplaints = await Database.from("complaints")
      .join(
        "complainttype",
        "complaints.complainttypeId",
        "=",
        "complainttype.id"
      )
      .select("complaints.*")
      .select("complainttype.name")
      .where("userId", auth.user!.id);
    console.log(allComplaints);
    return view.render("complaint/index", {
      complaints: allComplaints,
    });
  }

  public async create({ view }: HttpContextContract) {
    const allComplaintType = await Database.from("complainttype").select("*");
    return view.render("complaint/create", {
      types: allComplaintType,
    });
  }

  public async edit({ view, params, auth, response }: HttpContextContract) {
    const complaintToEdit = await Database.from("complaints")
      .where("id", params.id)
      .where("userId", auth.user!.id)
      .first();
    if (!complaintToEdit) {
      return response.redirect("/404");
    }

    const allComplaintType = await Database.from("complainttype").select("*");

    console.log(complaintToEdit);
    return view.render("complaint/edit", {
      types: allComplaintType,
      complaintToEdit: complaintToEdit,
    });
  }

  public async store({ request, response, auth }: HttpContextContract) {
    const cstoreSchema = schema.create({
      comment: schema.string({ trim: true }, [rules.required()]),
      complaintTypeId: schema.number([rules.required()]),
      location: schema.string.optional({ trim: true }),
      fileName: schema.file.optional({
        size: "2mb",
        extnames: ["pdf"],
      }),
    });

    const payload = await request.validate({
      schema: cstoreSchema,
    });

    let fileName: string = "";
    if (payload.fileName) {
      fileName = Date.now().toString() + payload.fileName.clientName;
      await payload.fileName.move(Application.tmpPath("uploads"), {
        name: fileName,
      });
    }

    const newComplaints = {
      comment: payload.comment,
      complaintTypeId: payload.complaintTypeId,
      location: payload.location || "",
      fileName: fileName,
      userId: auth.user!.id,
    };
    console.log(newComplaints);
    const id = await Database.table("complaints")
      .returning("id")
      .insert(newComplaints);
    console.log(id);
    return response.redirect("/complaint");
  }

  public async update({
    params,
    request,
    response,
    auth,
  }: HttpContextContract) {
    const cUpdateSchema = schema.create({
      comment: schema.string({ trim: true }, [rules.required()]),
      complaintTypeId: schema.number([rules.required()]),
      location: schema.string.optional({ trim: true }),
      fileName: schema.file.optional({
        size: "2mb",
        extnames: ["pdf"],
      }),
    });

    const payload = await request.validate({
      schema: cUpdateSchema,
    });

    let fileName: string = "";
    if (payload.fileName) {
      fileName = Date.now().toString() + payload.fileName.clientName;
      await payload.fileName.move(Application.tmpPath("uploads"), {
        name: fileName,
      });
    }

    const updateResponse = {
      comment: payload.comment,
      complaintTypeId: payload.complaintTypeId,
      location: payload.location || "",
      fileName: fileName,
      userId: auth.user!.id,
    };

    console.log(updateResponse);

    const id = await Database.from("complaints")
      .where("id", params.id)
      .where("userId", auth.user!.id)
      .update(updateResponse);
    console.log(id);

    return response.redirect("/complaint");
  }

  public async destroy({ params, response, auth }: HttpContextContract) {
    const result = await Database.from("complaints")
      .where("id", params.id)
      .select("fileName")
      .first();
    console.log(result.fileName);
    if (result.fileName) {
      await Drive.delete(result.fileName);
    }

    if (auth.user!.role == "Admin") {
      await Database.from("complaints").where("id", params.id).delete();
      return response.redirect("/complaint");
    }

    const id = await Database.from("complaints")
      .where("id", params.id)
      .where("userId", auth.user!.id)
      .delete();
    return response.redirect("/complaint");
  }

  public async monitorPage({ view, auth }: HttpContextContract) {
    const allComplaints = await Database.from("complaints")
      .join(
        "complainttype",
        "complaints.complainttypeId",
        "=",
        "complainttype.id"
      )
      .join("users", "complaints.userId", "=", "users.id")
      .select("complaints.*")
      .select("complainttype.name")
      .select(
        "users.name as username",
        "users.id as userId",
        "users.blocked as blocked"
      )
      .whereNot("userId", auth.user!.id);
    console.log(allComplaints);

    return view.render("complaint/monitor", {
      complaints: allComplaints,
    });
  }
}
