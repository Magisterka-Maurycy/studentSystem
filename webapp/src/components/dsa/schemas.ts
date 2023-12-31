export const dsaUrl = "http://dsa.localhost/"

export function parseJwt(token:string) {
    var base64Payload = token.split('.')[1];
    var payload = Buffer.from(base64Payload, 'base64');
    return JSON.parse(payload.toString());
  }

  export function getUserName(token: string){
    return parseJwt(token).preferred_username
  }