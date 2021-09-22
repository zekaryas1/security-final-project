import { HttpContextContract } from "@ioc:Adonis/Core/HttpContext";

export default class ComplaintsController {
  public async index({ view }: HttpContextContract) {
    return view.render("complaint/index");
  }

  public async create({ view }: HttpContextContract) {
    return view.render("complaint/create");
  }

  public async show({ view, params }: HttpContextContract) {
    return view.render("complaint/detail", {
      id: params.id,
    });
  }

  public async edit({ view, params }: HttpContextContract) {
    return view.render("complaint/edit", {
      id: params.id,
    });
  }
  public async store({}: HttpContextContract) {}

  public async update({}: HttpContextContract) {}

  public async destroy({}: HttpContextContract) {}
}
