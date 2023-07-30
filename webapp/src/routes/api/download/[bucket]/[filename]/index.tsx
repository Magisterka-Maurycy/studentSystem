import { type RequestHandler } from "@builder.io/qwik-city";
import { dsaUrl } from "~/components/dsa/schemas";

export const onGet: RequestHandler = async (event) => {
  const userName = event.params.bucket;
  const fileName = event.params.filename;
  const accessToken = event.cookie.get("access_token")?.value;
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
  const response = await fetch(
    dsaUrl + "v2/store/" + userName + "/" + fileName,
    options
  );
  // return response;
  event.send(response);
};
