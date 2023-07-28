import { component$, useSignal } from "@builder.io/qwik";
import { type DocumentHead, RequestHandler } from "@builder.io/qwik-city";
import { Logout } from "~/components/auth/logout/logout";
import { GetDsa } from "~/components/dsa/get/get";
import { FileUpload } from "~/components/dsa/upload/upload";
import projects from "~/components/projects.json";
import { check } from "..";

export const onRequest: RequestHandler = async (event) => {

  const access_token = event.cookie.get("access_token")?.value;
  if (access_token == undefined) {
    throw event.redirect(308, new URL("/", event.url).toString());
  }
  if (!(await check(access_token, "user"))) {
    throw event.redirect(308, new URL("/", event.url).toString());
  }
  await event.next();

};

export default component$(() => {
  const updateGet = useSignal(false)
  return (
    <>
      <Logout></Logout>
      {projects.projects.map((project) => (
        <>
          <FileUpload fileName={project.fileName} updateGet={updateGet}></FileUpload>
        </>
      ))}

      <GetDsa></GetDsa>
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
