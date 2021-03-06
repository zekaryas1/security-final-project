/*
|--------------------------------------------------------------------------
| Routes
|--------------------------------------------------------------------------
|
| This file is dedicated for defining HTTP routes. A single file is enough
| for majority of projects, however you can define routes in different
| files and just make sure to import them inside this file. For example
|
| Define routes in following two files
| ├── start/routes/cart.ts
| ├── start/routes/customer.ts
|
| and then import them inside `start/routes.ts` as follows
|
| import './routes/cart'
| import './routes/customer''
|
*/

import Route from "@ioc:Adonis/Core/Route";

Route.group(() => {
  Route.get("/", "AccountsController.loginPage");
  Route.get("/login", "AccountsController.loginPage");
  Route.post("/login", "AccountsController.login");
  Route.get("/register", "AccountsController.registerPage");
  Route.post("/register", "AccountsController.register");
  Route.post("/logout", "AccountsController.logout");
});

Route.group(() => {
  Route.get("complaint/monitor", "ComplaintsController.monitorPage");
  Route.post("account/block/:userId", "AccountsController.blockUser");
  Route.post("account/unblock/:userId", "AccountsController.unblockUser");
}).middleware(["auth", "isAdmin", "blocked"]);

Route.group(() => {
  Route.resource("complaint", "ComplaintsController");
  Route.get("/download/:fileName", "AccountsController.download");
}).middleware(["auth", "blocked"]);

Route.get("/404", async ({ view }) => {
  return view.render("errors/not-found");
});

Route.get("/403", async ({ view }) => {
  return view.render("errors/unauthorized");
});
