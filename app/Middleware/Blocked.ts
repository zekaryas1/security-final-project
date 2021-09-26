import { HttpContextContract } from "@ioc:Adonis/Core/HttpContext";

export default class Blocked {
  public async handle(
    { auth, response }: HttpContextContract,
    next: () => Promise<void>
  ) {
    if (auth.user!.blocked) {
      return response.redirect("/403");
    }
    await next();
  }
}
