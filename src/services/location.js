import { request } from "graphql-request";

const BASE_URL = "https://dev-api.benu.at/graphql";

const query = value => `query{
    findLocation(key: "${value}"){
      city
      province
      zipCode
      available    
    }
  }`;

const fetchLocations = (value, callback) =>
  request(BASE_URL, query(value))
    .then(data => data.findLocation)
    .then(callback);

export default fetchLocations;
