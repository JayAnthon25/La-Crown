import axios from "axios";
import { paginationLimit, axiosObjectSkeleton } from "../shared/endpoints";

export function getSingleCri(cri, callback) {
  axios(
    axiosObjectSkeleton({
      type: "query",
      coll: "scores",
      id: true,
      attr: "con cri jud raw_score",
      collAttrs: `(filters: { cri: { eq: "${cri}" } }, pagination: {limit: ${paginationLimit}})`,
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

export function getContestName(callback) {
  axios(
    axiosObjectSkeleton({
      type: "query",
      coll: "misc",
      id: false,
      attr: "contest_name",
    })
  )
    .then((res) => {
      if (res.status === 200) {
        callback(res.data.data.misc.data.attributes.contest_name);
      } else {
        console.log(res);
      }
    })
    .catch((err) => {
      console.log(err);
    });
}

export function getCri(id, callback) {
  axios(
    axiosObjectSkeleton({
      type: "query",
      coll: "cri",
      id: true,
      attr: "name",
      collAttrs: `(id: "${id}")`,
    })
  )
    .then((res) => {
      if (res.status === 200) {
        if (id !== "-1") callback(res.data.data.cri.data); // Coronation is built-in
      } else {
        console.log(res);
      }
    })
    .catch((err) => {
      console.log(err);
    });
}

export function getJud(callback) {
  axios(
    axiosObjectSkeleton({
      type: "query",
      coll: "juds",
      id: true,
      attr: "jud_number name",
    })
  )
    .then((res) => {
      if (res.status === 200) {
        callback(res.data.data.juds.data);
      } else {
        console.log(res);
      }
    })
    .catch((err) => {
      console.log(err);
    });
}

export function getCon(callback) {
  axios(
    axiosObjectSkeleton({
      type: "query",
      coll: "cons",
      id: true,
      attr: "name con_number",
    })
  )
    .then((res) => {
      if (res.status === 200) {
        callback(res.data.data.cons.data);
      } else {
        console.log(res);
      }
    })
    .catch((err) => {
      console.log(err);
    });
}
