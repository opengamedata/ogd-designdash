import axios from 'axios';

export async function fetchFromApi(url: string) {
  // TODO: fetch data using axios and handle caching
  return axios.get(url);
}
