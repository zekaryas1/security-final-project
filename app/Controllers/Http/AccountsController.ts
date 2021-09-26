// import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

import Hash from "@ioc:Adonis/Core/Hash";
import { HttpContextContract } from "@ioc:Adonis/Core/HttpContext";
import Database from "@ioc:Adonis/Lucid/Database";

export default class AccountsController {
  public async loginPage({ view }: HttpContextContract) {
    return view.render("account/login");
  }

  public async login({ view, request, response, auth }: HttpContextContract) {
    const email = request.input("email");
    const password = request.input("password");

    try {
      await auth.use("web").attempt(email, password);
      response.redirect("/complaint");
    } catch {
      return view.render("account/login", {
        loginError: "Invalid credential",
      });
    }
  }

  public async registerPage({ view }: HttpContextContract) {
    return view.render("account/register");
  }

  public async register({
    view,
    request,
    auth,
    response,
  }: HttpContextContract) {
    const user = request.body();
    user.password = await Hash.make(user.password);

    const id = await Database.table("users").returning("id").insert(user);
    if (id) {
      user.id = id;
      await auth.use("web").login(user);
      return response.redirect("complaint/");
    } else {
      return view.render("account/register", {
        loginError: "Email already exists",
      });
    }
  }

  public async logout({ auth, response }: HttpContextContract) {
    await auth.use("web").logout();
    response.redirect("/");
  }

  public async blockUser({
    request,
    auth,
    response,
    params,
  }: HttpContextContract) {
    const id = await Database.from("users").where("id", params.userId).update({
      blocked: true,
    });
    return response.redirect("/complaint");
  }

  public async unblockUser({
    request,
    auth,
    response,
    params,
  }: HttpContextContract) {
    const id = await Database.from("users").where("id", params.userId).update({
      blocked: false,
    });
    return response.redirect("/complaint");
  }
}
