import { component$, Signal, type NoSerialize } from "@builder.io/qwik";
import { z } from "@builder.io/qwik-city";
import { formAction$, useForm, zodForm$ } from "@modular-forms/qwik";
import { dsaUrl, getUserName } from "../schemas";

const UploadSchema = z.object({
  fileName: z.any(),
  file: z.custom<NoSerialize<Blob>>((input) => input instanceof Blob),
});

type UploadForm = z.infer<typeof UploadSchema>;

const useFormAction = formAction$<UploadForm>(
  async (values, event) => {
    var formData = new FormData();
    if (values.file == undefined) {
      return;
    }
    const index = values.file.name.lastIndexOf(".");
    const extension = values.file.name.substring(index);
    formData.append("files", values.file, values.fileName + extension);

    const accessToken = event.cookie.get("access_token")?.value;
    if (accessToken == undefined) {
      return;
    }
    const userName = getUserName(accessToken);
    const bearer = "Bearer " + accessToken;
    const options = {
      method: "POST",
      headers: {
        Authorization: bearer,
      },
      body: formData,
    };

    const response = await fetch(dsaUrl + "v2/store/" + userName, options);
  },
  {
    validate: zodForm$(UploadSchema),
    files: ["file"],
  }
);

interface FileUploadProps {
  fileName: string;
  updateGet: Signal<boolean>
}

export const FileUpload = component$((cProps: FileUploadProps) => {
  const [, { Form, Field }] = useForm<UploadForm>({
    loader: { value: { file: undefined, fileName: cProps.fileName } },
    action: useFormAction(),
    validate: zodForm$(UploadSchema),
  });

  return (
    <div>
      {cProps.fileName}
      <Form
        onSubmit$={(values) => {
          console.log(values)
          cProps.updateGet.value=true
        }}
        encType="multipart/form-data"
      >
        <Field name="fileName">
        {(_field, props) => <input hidden value={cProps.fileName} {...props} />}
        </Field>
        <Field name="file" type="File">
          {(_field, props) => <input type="file" {...props} />}
        </Field>
        <button type="submit">Submit</button>
      </Form>
    </div>
  );
});
