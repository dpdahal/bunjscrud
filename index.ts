import { Elysia, t } from "elysia";
import UsersDatabase from "./database/index.ts";
import { html } from '@elysiajs/html'
import fs from "fs";
const page = fs.readFileSync('./index.html', 'utf-8');
const jspage = fs.readFileSync('./script.js','utf-8');


new Elysia()
  .use(html())
  .decorate("db", new UsersDatabase())
  .get("/", () => page)
  .get("/script.js", () => jspage)
  .get("/users", ({ db }) => db.index())
  .get("/users/:id", ({ db, params }) =>db.show(parseInt(params.id)))
  .post(
    "/users",
    async ({ db, body }) => {
      const id = (await db.create(body)).id
      return { success: true, id };
    },
    {
      schema: {
        body: t.Object({
          name: t.String(),
          email: t.String(),
          address:t.String(),
          phone:t.Number()
        }),
      },
    }
  )
  .put(
    "/users/:id",
    ({ db, params, body }) => {
      try {
        db.update(parseInt(params.id), body) 
        return { success: true };
      } catch (e) {
        return { success: false };
      }
    },
    {
      schema: {
        body: t.Object({
          name: t.String(),
          email: t.String(),
          address:t.String(),
          phone:t.String()
        }),
      },
    }
  )

  .delete("/users/:id", ({ db, params }) => {
    try {
      db.delete(parseInt(params.id))
      return { success: true };
    } catch (e) {
      return { success: false };
    }
  })
  .listen(3000);


