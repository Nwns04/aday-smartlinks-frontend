// src/utils/getGeoLocation.js
import API from "../services/api";
import { retry } from "./retry";

export async function getGeoLocation(slug) {
  try {
    // hit your own backend, not ipapi.co
    const { data } = await API.get(`/campaigns/${slug}/geo`);
    return data;  // { country, city, region, lat, lon }
  } catch (err) {
    console.warn('Geo lookup failed, continuing without it', err);
    return null;
  }
}
