import {
  component$,
  noSerialize,
  useStore,
  useVisibleTask$,
} from "@builder.io/qwik";
import { server$ } from "@builder.io/qwik-city";
import { dsaUrl } from "../schemas";
import students from "../../students.json";

const getForStudent = server$(async function (userName: string) {
  const accessToken = this.cookie.get("access_token")?.value;
  let fullData = new Map<string, string[]>();

  const bearer = "Bearer " + accessToken;
  const options = {
    method: "GET",
    headers: {
      Authorization: bearer,
    },
  };
  const response = await fetch(dsaUrl + "v2/store/" + userName, options);
  if (response.status != 200) {
    return undefined;
  }
  const data = await response.json();

  return data as string[];
});
export const GetAdmin = component$(() => {
  return (
    <div>
      {students.students.map(async (student) => {
        const res = await getForStudent(student.userName);
        return res?.map((val) => {
          return <p>{student.userName}: {val} <a href={"/api/download/"+student.userName+"/"+val} >download</a></p>;
        });
      })}
    </div>
  );
});
