import { component$ } from "@builder.io/qwik";
import { server$ } from "@builder.io/qwik-city";

const logoutFunction = server$(function () {
  this.cookie.set("access_token", "", {
    path: "/",
    expires: new Date(0),
  });
  this.cookie.set("refresh_token", "", {
    path: "/",
    expires: new Date(0),
  });
});
export const Logout = component$(() => {
  return (
    <button
      onClick$={() => {
        logoutFunction();
        setTimeout(() => {
          window.location.reload();
        },15);
      }}
    >
      Logout
    </button>
  );
});
