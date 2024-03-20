import axios from "axios";
const baseUrl = "http://localhost:3000";

export function login(payload) {
  return new Promise((resolve, reject) => {
    let uri = baseUrl + "/signin";

    axios
      .post(uri, payload)
      .then((response) => {
        return resolve(response);
      })
      .catch((errors) => {
        reject(errors);
      });
  });
}
