// import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

import Hash from "@ioc:Adonis/Core/Hash";
import { HttpContextContract } from "@ioc:Adonis/Core/HttpContext";
import { rules, schema } from "@ioc:Adonis/Core/Validator";
import Database from "@ioc:Adonis/Lucid/Database";

export default class AccountsController {
  public async loginPage({ view }: HttpContextContract) {
    return view.render("account/login");
  }

  public async login({ view, request, response, auth }: HttpContextContract) {
    const loginSchema = schema.create({
      email: schema.string({ trim: true }, [rules.email(), rules.required()]),
      password: schema.string({ trim: true }, [
        rules.minLength(6),
        rules.required(),
      ]),
    });

    const payload = await request.validate({
      schema: loginSchema,
    });

    try {
      await auth.use("web").attempt(payload.email, payload.password);
      response.redirect("/complaint");
    } catch (error) {
      return view.render("account/login", {
        loginError: "Invalid credentials",
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
    const registerationSchema = schema.create({
      name: schema.string({}, [rules.required()]),
      email: schema.string({ trim: true }, [rules.email(), rules.required()]),
      password: schema.string({ trim: true }, [
        rules.minLength(6),
        rules.required(),
        rules.confirmed(),
      ]),
    });

    const payload = await request.validate({
      schema: registerationSchema,
    });

    const user = { ...payload, id: "" };
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
    const id = await Database.from("users")
      .where("id", params.userId)
      .whereNot("role", "Admin")
      .update({
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
    const id = await Database.from("users")
      .where("id", params.userId)
      .whereNot("role", "Admin")
      .update({
        blocked: false,
      });
    return response.redirect("/complaint");
  }
}
