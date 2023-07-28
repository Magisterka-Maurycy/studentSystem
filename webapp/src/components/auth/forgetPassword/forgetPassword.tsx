import { component$, useSignal } from "@builder.io/qwik";
import { z } from "@builder.io/qwik-city";
import { formAction$, useForm, zodForm$ } from "@modular-forms/qwik";
import { authUrl, emailSchema } from "../schemas";

const forgetSchema = z.object({
  email: emailSchema,
});
type ForgetDto = {
  email: string;
};
type ForgetForm = z.infer<typeof forgetSchema>;

const useFormAction = formAction$<ForgetForm>(async (values) => {
  // Runs on server
  const forgetObject: ForgetDto = {
    email: values.email,
  };
  const bodySet = JSON.stringify(forgetObject);
  const options = {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: bodySet,
  };
  const response = await fetch(authUrl + "util/forget-password", options);
  if (response.status != 200) {
    return //{ data: "failed" };
  }
  const responseText = await response.text();
  if (responseText == "true") {
    return
    // return {
    //   data: "success",
    // };
  }
  return //{ data: "failed" };
}, zodForm$(forgetSchema));

export const ForgetPassword = component$(() => {
  const [loginForm, { Form, Field }] = useForm<ForgetForm>({
    loader: useSignal({
      email: "",
    }),
    action: useFormAction(),
    validate: zodForm$(forgetSchema),
  });

  return (
    <>
      <p>{loginForm.response.data}</p>
      <Form>
        <Field name="email">
          {(field, props) => (
            <div>
              <input {...props} type="email" value={field.value} />
              {field.error && <div>{field.error}</div>}
            </div>
          )}
        </Field>
        <button type="submit">Reset Password</button>
      </Form>
    </>
  );
});
