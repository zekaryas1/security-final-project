// import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

import { HttpContextContract } from "@ioc:Adonis/Core/HttpContext";
import Database from "@ioc:Adonis/Lucid/Database";
import Hash from "@ioc:Adonis/Core/Hash";

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
}
