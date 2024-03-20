import axios from "axios";
const baseUrl = "http://localhost:3000";

export function signin(payload) {
  return new Promise((resolve, reject) => {
    let uri = baseUrl + "/signup";

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
