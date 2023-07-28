import { component$ } from "@builder.io/qwik";
import { server$ } from "@builder.io/qwik-city";
import students from "../../students.json";
import { authUrl } from "../schemas";
type RegisterDto = {
  userName: string;
  email: string;
};

const register = server$(async function (registerDto: RegisterDto) {
  const accessToken = this.cookie.get("access_token")?.value;
  const bearer = "Bearer " + accessToken;
  const bodyString = JSON.stringify(registerDto);
  const options = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: bearer,
    },
    body: bodyString,
  };
  const response = await fetch(authUrl + 'admin/util/register-without-password', options)
  
});

function run() {
  students.students.forEach((student) => {
    const registerDto: RegisterDto = {
      email: student.email,
      userName: student.userName,
    };
    register(registerDto);
  });
}

export const Register = component$(() => {
  
  return (
    <>
      <button
        onClick$={() => {
          run();
        }}
        type="submit"
      >
        Register students from json list
      </button>
    </>
  );
});
