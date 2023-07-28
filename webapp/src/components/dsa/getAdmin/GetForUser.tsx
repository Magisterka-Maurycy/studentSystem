import { component$, useStore } from "@builder.io/qwik";
import { server$ } from "@builder.io/qwik-city";
import { dsaUrl } from "../schemas";
import projects from '~/components/projects.json'

const getForStudent = server$(async function (userName: string) {
  const accessToken = this.cookie.get("access_token")?.value;
  if (accessToken == undefined) {
    return [];
  }
  const bearer = "Bearer " + accessToken;
  const options = {
    method: "GET",
    headers: {
      Authorization: bearer,
    },
  };

  const response = await fetch(dsaUrl + "v2/store/" + userName, options);
  const data = await response.json();
  return data;
});
interface GetForUserProps{
  userName: string
}
export const GetForUser = component$((props:GetForUserProps) => {
  const data = useStore<{ files: string[] }>({ files: [] });

  return (
    <div>
      <button
        onClick$={async () => {
          data.files = await getForStudent(props.userName);
        }}
      >
        get data
      </button>
      <br />
      {data.files.map((value) => (
        <>
          {value}
          <br />
        </>
      ))}
    </div>
  );
});
