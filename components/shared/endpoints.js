export const base = `http://localhost:1337/`;
export const gqlendpoint = `${base}graphql/`;
export const paginationLimit = "4000";

export function axiosObjectSkeleton(obj) {
  // obj attributes should be this structure:
  // type - required - string; either "query" or "mutation"
  // coll - required - string; the collection to be queried
  // attr - optional - string; list of attr to be returned
  // id - optional - boolean; if record "id" needs to be returned
  // collAttrs - optional - string; filters, sorts, etc. params for "coll"
  // queryOverride - optional - string; if queryOveride is defined all other attr is disregarded

  let collAttrs = obj.collAttrs ? obj.collAttrs : "";
  let attr = obj.attr ? `attributes{ ${obj.attr} }` : "";
  let tobeReturned = {
    // this is called inventing-the-wheel-while-the-car-is-running
    url: `http://${window.location.hostname}:1337/graphql/`,
    // this is fucked. I dont like it. ^
    method: "POST",
    data: {
      query: obj.queryOverride ?? `${obj.type}{ ${obj.coll + collAttrs}{ data{ ${obj.id ? "id" : ""} ${attr} } } }`,
    },
  };

  return tobeReturned;
}
