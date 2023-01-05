import axios from "axios";
import { paginationLimit, axiosObjectSkeleton } from "../shared/endpoints";

export function getList(endpoint, callback) {
  axios(
    axiosObjectSkeleton({
      type: "query",
      coll: `${endpoint}s`,
      id: true,
      attr: `${endpoint === "con" ? "con_number" : ""} ${endpoint === "jud" ? "jud_number" : ""} name`,
    })
  )
    .then((res) => {
      if (res.status === 200) {
        callback(res.data.data[`${endpoint}s`].data);
      } else {
        console.log(res);
      }
    })
    .catch((err) => {
      console.log(err);
    });
}

export function createListItem(data, endpoint, callback) {
  axios(
    axiosObjectSkeleton({
      type: "mutation",
      coll: `create${endpoint.charAt(0).toUpperCase() + endpoint.slice(1)}`,
      id: true,
      attr: "name",
      collAttrs: `(data: {name: "${data}"})`,
    })
  )
    .then((res) => {
      if (res.status === 200) {
        callback(res.data.data[`create${endpoint.charAt(0).toUpperCase() + endpoint.slice(1)}`].data);
      } else {
        console.log(res);
      }
    })
    .catch((err) => {
      console.log(err);
    });
}

export function delListItem(dbID, listIndex, endpoint, callback) {
  axios(
    axiosObjectSkeleton({
      type: "mutation",
      coll: `delete${endpoint.charAt(0).toUpperCase() + endpoint.slice(1)}`,
      id: true,
      attr: "",
      collAttrs: `(id: ${dbID})`,
    })
  )
    .then((res) => {
      if (res.status === 200) {
        callback(listIndex);
      } else {
        console.log(res);
      }
    })
    .catch((err) => {
      console.log(err);
    });
}

export function updateListItem(data1, data2, dbID, endpoint, callback) {
  axios(
    axiosObjectSkeleton({
      type: "mutation",
      coll: `update${endpoint.charAt(0).toUpperCase() + endpoint.slice(1)}`,
      id: true,
      attr: "",
      collAttrs: `(id: ${dbID}, data: { name: "${data1}", ${
        endpoint === "con" ? "con_number" : "jud_number"
      }: ${data2} })`,
    })
  )
    .then((res) => {
      if (res.status === 200) {
        callback();
      } else {
        console.log(res);
      }
    })
    .catch((err) => {
      console.log(err);
    });
}

export function getAllLists(callback) {
  axios(
    axiosObjectSkeleton({
      queryOverride: `query{
      cons{ data{ id attributes{ con_number name } }}
      juds{ data{ id attributes{ jud_number name } }}
      cris{ data{ id attributes{ name } }}
    }`,
    })
  )
    .then((res) => {
      callback(res.data.data);
    })
    .catch((err) => {
      console.log(err);
    });
}

export function getMisc(callback1, callback2, callback3, callback4, callback5) {
  axios(
    axiosObjectSkeleton({
      type: "query",
      coll: "misc",
      id: false,
      attr: "contest_name client_token server_token finalist_number disableCoronation",
    })
  )
    .then((res) => {
      if (res.status === 200) {
        callback1 && callback1(res.data.data.misc.data.attributes.client_token);
        callback2 && callback2(res.data.data.misc.data.attributes.server_token);
        callback3 && callback3(res.data.data.misc.data.attributes.finalist_number);
        callback4 && callback4(res.data.data.misc.data.attributes.contest_name);
        callback5 && callback5(res.data.data.misc.data.attributes.disableCoronation);
      } else {
        console.log(res);
      }
    })
    .catch((err) => {
      console.log(err);
    });
}

export function updateMisc(id, data) {
  axios(
    axiosObjectSkeleton({
      type: "mutation",
      coll: "updateMisc",
      id: false,
      attr: "client_token",
      collAttrs: `(data: { ${id}: ${data} })`,
    })
  )
    .then((res) => {
      if (res.status === 200) {
        // ignore
      } else {
        // ignore
      }
    })
    .catch((err) => {
      console.log(err);
    });
}

export function getAllScores(callback) {
  axios(
    axiosObjectSkeleton({
      type: "query",
      coll: "scores",
      id: true,
      attr: "con jud cri raw_score",
      collAttrs: `(pagination: {limit: ${paginationLimit}})`,
    })
  )
    .then((res) => {
      if (res.status === 200) {
        callback(res.data.data.scores.data);
      } else {
        console.log(res);
      }
    })
    .catch((err) => {
      console.log(err);
    });
}

export function getRawFinalistData(callback) {
  axios(
    axiosObjectSkeleton({
      type: "query",
      coll: "misc",
      id: false,
      attr: "rawFinalistData",
    })
  )
    .then((res) => {
      if (res.status === 200) {
        let conFinalistIDs = res.data.data.misc.data.attributes.rawFinalistData;
        // get indexes of finalists; if successful, get cons using results gotten
        axios(
          axiosObjectSkeleton({
            type: "query",
            coll: "cons",
            id: true,
            attr: "name con_number",
            collAttrs: `(filters: { id: { in: [${conFinalistIDs}] } })`,
          })
        )
          .then((res1) => {
            if (res1.status === 200) {
              callback(res1.data.data.cons.data);
            } else {
              console.log(res1);
            }
          })
          .catch((err1) => {
            console.log(err1);
          });
      } else {
        console.log(res);
      }
    })
    .catch((err) => {
      console.log(err);
    });
}

export function updateRawFinalistData(data) {
  axios(
    axiosObjectSkeleton({
      type: "mutation",
      coll: "updateMisc",
      id: false,
      attr: "rawFinalistData",
      collAttrs: `(data: { rawFinalistData: "${data}" })`,
    })
  )
    .then((res) => {
      if (res.status === 200) {
        // ignore
      } else {
        // ignore
      }
    })
    .catch((err) => {
      console.log(err);
    });
}

export function getFinalistScores(callback) {
  axios(
    axiosObjectSkeleton({
      type: "query",
      coll: "scores",
      id: true,
      attr: "con jud cri raw_score",
      collAttrs: `(filters: { cri: { eq: "-1" } })`,
    })
  )
    .then((res) => {
      if (res.status === 200) {
        callback(res.data.data.scores.data);
      } else {
        console.log(res);
      }
    })
    .catch((err) => {
      console.log(err);
    });
}