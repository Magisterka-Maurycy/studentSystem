import { Signal, component$, useComputed$, useResource$, useStore } from "@builder.io/qwik";
import { server$ } from "@builder.io/qwik-city";
import { dsaUrl, getUserName } from "../schemas";

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
  const data = await response.json();
  return data;
});

interface GetProps {
  updateGet: Signal<boolean>
}

export const GetDsa = component$((cProps: GetProps) => {
  const data = useStore<{ files: string[] }>({ files: [] });
  const capitalizedName = useResource$(async({track}) => {
    track((()=>cProps.updateGet.value))
    console.log('update')
    data.files = await getForStudent();
    return cProps.updateGet.value
  });
  return (
    <div>
      <button
        onClick$={async () => {
          data.files = await getForStudent();
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
