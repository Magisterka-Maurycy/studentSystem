import {
  Signal,
  component$,
  useSignal,
  useVisibleTask$,
} from "@builder.io/qwik";
import {
  type DocumentHead,
  RequestHandler,
  server$,
} from "@builder.io/qwik-city";
import { Logout } from "~/components/auth/logout/logout";
import { GetDsa } from "~/components/dsa/get/get";
import { FileUpload } from "~/components/dsa/upload/upload";
import projects from "~/components/projects.json";
import { check } from "..";
import { dsaUrl, getUserName } from "~/components/dsa/schemas";

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

const getForStudent = server$(async function () {
  const accessToken = this.cookie.get("access_token")?.value;
  if (accessToken == undefined) {
    return [];
  }
  const userName = getUserName(accessToken);
  const bearer = "Bearer " + accessToken;
  const options = {
    method: "GET",
    headers: {
      Authorization: bearer,
    },
  };

  const response = await fetch(dsaUrl + "v2/store/" + userName, options);
  try {
    const data = await response.json();
    return data;
  } catch (error) {
    console.log("get for student error");
    console.log(error);
  }
  return [];
});

interface FileUploadWrapperProps {
  fileName: string;
  projectName: string;
  updateGet: Signal<boolean>;
}
const FileUploadWrapper = component$((props: FileUploadWrapperProps) => {
  const showSignal = useSignal(false);
  useVisibleTask$(async () => {
    const getData = await getForStudent();
    console.log("getData", getData);
    const da = getData as string[];
    let daProcessed: string[] = [];
    da.forEach((el) => {
      daProcessed.push(el.substring(0, el.lastIndexOf(".")));
    });
    showSignal.value = !daProcessed.includes(props.fileName);
  });

  if (showSignal.value) {
    return (
      <>
        <FileUpload
          fileName={props.fileName}
          updateGet={props.updateGet}
        ></FileUpload>
      </>
    );
  } else return <>project {props.fileName} uploaded already</>;
});

export default component$(() => {
  const updateGet = useSignal(false);

  return (
    <>
      <Logout></Logout>
      <button
        onClick$={async () => {
          const t = await getForStudent();
          console.log(t);
        }}
      >
        {" "}
        testing
      </button>
      {projects.projects.map((project) => (
        <>
          <br />
          <FileUploadWrapper
            fileName={project.fileName}
            updateGet={updateGet}
            projectName={project.projectName}
          ></FileUploadWrapper>
        </>
      ))}

      {/* <GetDsa></GetDsa> */}
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
