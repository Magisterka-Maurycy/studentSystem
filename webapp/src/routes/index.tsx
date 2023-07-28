import { $, component$, useSignal, useVisibleTask$ } from "@builder.io/qwik";
import {
  server$,
  type DocumentHead,
  RequestHandler,
} from "@builder.io/qwik-city";
import { Login } from "~/components/auth/login/login";
import { authUrl } from "~/components/auth/schemas";

export const onRequest: RequestHandler = async (event) => {
  const access_token = event.cookie.get("access_token")?.value;
  if (access_token == undefined) {
    await event.next();
    return;
  }
  if (await check(access_token, "admin")) {
    throw event.redirect(308, new URL("/admin", event.url).toString());
  }
  if (await check(access_token, "user")) {
    throw event.redirect(308, new URL("/student", event.url).toString());
  }
  await event.next();
};

export enum StatusLogged {
  NOT_LOGGED = "NOT_LOGGED",
  ADMIN = "ADMIN",
  USER = "USER",
}
export async function check(token: string, role: string) {
  const checkDto = { token, oneOfRoles: [role] };
  const bodyString = JSON.stringify(checkDto);
  const options = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: bodyString,
  };
  const response = await fetch(authUrl + "util/access", options);
  const value = await response.text();
  if (value === "true") {
    return true;
  }
  return false;
}
export const checkFull = server$(async function () {
  const access_token = this.cookie.get("access_token")?.value;
  if (access_token == undefined) {
    return StatusLogged.NOT_LOGGED;
  }
  if (await check(access_token, "admin")) {
    return StatusLogged.ADMIN;
  }
  if (await check(access_token, "user")) {
    return StatusLogged.USER;
  }

  return StatusLogged.NOT_LOGGED;
});
export default component$(() => {
  const status = useSignal<StatusLogged>();
  const updateStatus = $(async () => {
    status.value = await checkFull();
  });
  let availableRoutes;
  useVisibleTask$(() => {
    updateStatus();
  });
  return (
    <>
      {status.value}
      <br />
      <Login></Login>
      <a href="/forgetPass">forget password</a>

      <br />
      <a href="/admin">admin site</a>
      <br />
      <a href="/student">student site</a>
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
