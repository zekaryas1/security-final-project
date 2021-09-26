import {HttpContextContract} from '@ioc:Adonis/Core/HttpContext'

export default class Role {
  public async handle({auth, response}: HttpContextContract, next: () => Promise<void>) {
    if (auth.isAuthenticated && auth.user!.role == "Admin") {
      await next();
      return;
    }
    return response.redirect("/404");
  }
}
