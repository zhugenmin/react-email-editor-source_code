// const pexelsKey = "563492ad6f91700001000001efd3eadbee21486a9756a5576e4e3b73";

import { createClient } from "pexels";
const client = createClient("563492ad6f91700001000001efd3eadbee21486a9756a5576e4e3b73");

const fetchPhotos = (pagination, pages, query) => {
  if (!query) {
    query = "fun";
  }
  return new Promise((resolve, reject) => {
    client.photos
      .search({ query, per_page: pages, page: pagination })
      .then((photos) => {
        resolve(photos);
      })
      .catch((error) => reject(error));
  });
};

export default fetchPhotos;
