import { $, QRL, component$, useComputed$, useSignal } from "@builder.io/qwik";
import { z } from "@builder.io/qwik-city";
import {
  SubmitHandler,
  formAction$,
  useForm,
  zodForm$,
} from "@modular-forms/qwik";
import { authUrl, emailSchema, passwordSchema } from "../schemas";
import { log } from "console";

const loginSchema = z.object({
  email: emailSchema,
  password: passwordSchema,
});
type LoginDto = {
  userName: string;
  password: string;
};
type LoginForm = z.infer<typeof loginSchema>;

const useFormAction = formAction$<LoginForm>(async (values: LoginForm, ev) => {
  // Runs on server
  const loginObject: LoginDto = {
    userName: values.email,
    password: values.password,
  };
  const bodySet = JSON.stringify(loginObject);
  const options = {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: bodySet,
  };
  const response = await fetch(authUrl + "keycloak/login", options);
  if (response.status != 200) {
    return { message: "false" };
  }
  const responseJson = await response.json();
  ev.cookie.set("access_token", responseJson.accessToken, {
    path: "/",
    maxAge: 60 * 60 * 24,
    sameSite: "strict",
    secure: true,
  });
  ev.cookie.set("refresh_token", responseJson.refreshToken, {
    path: "/",
    maxAge: 60 * 60 * 24,
    sameSite: "strict",
    secure: true,
  });

  return { message: "true" };
}, zodForm$(loginSchema));

export const Login = component$(() => {
  const [loginForm, { Form, Field }] = useForm<LoginForm>({
    loader: useSignal({
      email: "",
      password: "",
    }),
    action: useFormAction(),
    validate: zodForm$(loginSchema),
  });

  const success = useComputed$(() => {
    return loginForm.response.message;
  });
  return (
    <>
      <p>{success.value}</p>
      <Form>
        <Field name="email">
          {(field, props) => (
            <div>
              <input {...props} type="email" value={field.value} />
              {field.error && <div>{field.error}</div>}
            </div>
          )}
        </Field>
        <Field name="password">
          {(field, props) => (
            <div>
              <input {...props} type="password" value={field.value} />
              {field.error && <div>{field.error}</div>}
            </div>
          )}
        </Field>
        <button
          type="submit"
          // onClick$={() => {
          //   setTimeout(() => {
          //     window.location.reload();
          //   }, 500);
          // }}
        >
          Login
        </button>
      </Form>
    </>
  );
});
