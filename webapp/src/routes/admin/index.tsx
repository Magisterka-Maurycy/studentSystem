import { component$, useVisibleTask$ } from "@builder.io/qwik";
import { RequestHandler, type DocumentHead } from "@builder.io/qwik-city";
import { Logout } from "~/components/auth/logout/logout";
import { Register } from "~/components/auth/register/register";
import { StatusLogged, check, checkFull } from "..";
import { GetAdmin } from "~/components/dsa/getAdmin/getAdmin";

export const onRequest: RequestHandler = async (event) => {
  const access_token = event.cookie.get("access_token")?.value;
  if (access_token == undefined) {
    throw event.redirect(308, new URL("/", event.url).toString());
  }
  if (!(await check(access_token, "admin"))) {
    throw event.redirect(308, new URL("/", event.url).toString());
  }
  await event.next();
};

export default component$(() => {
  useVisibleTask$(async () => {});
  return (
    <>
      <Logout />
      <Register />
      <GetAdmin />
    </>
  );
});

export const head: DocumentHead = {
  title: "Student System",
  meta: [
    {
      name: "description",
      content: "Qwik site description",
    },
  ],
};
