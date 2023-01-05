import axios from "axios";
import { axiosObjectSkeleton, paginationLimit } from "../shared/endpoints";

export function getCris(callback) {
  axios(axiosObjectSkeleton({ type: "query", coll: "cris", id: true, attr: "name" }))
    .then((res) => {
      if (res.status === 200) {
        callback(res.data.data.cris.data);
      } else {
        console.log(res);
      }
    })
    .catch((err) => {
      console.log(err);
    });
}

export function getCons(callback) {
  axios(
    axiosObjectSkeleton({
      type: "query",
      coll: "cons",
      id: true,
      attr: "con_number name",
      collAttrs: `(sort: "con_number:asc")`,
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

export function getScores(cris, juds, callback1, callback2) {
  axios(
    axiosObjectSkeleton({
      type: "query",
      coll: "scores",
      id: true,
      attr: "con cri jud raw_score",
      collAttrs: `(filters: { cri: { eq: "${cris}" }, jud: { eq: "${juds}" } }, pagination: {limit: ${paginationLimit}}, sort: "con:asc")`,
    })
  )
    .then((res) => {
      if (res.status === 200) {
        callback1(res.data.data.scores.data);
      } else {
        console.log(res);
      }
      return res.data.data.scores.data;
    })
    .then((res) => {
      const arr = res.map((e) => e.attributes.raw_score);
      const sorted = arr.slice().sort((a, b) => b - a);
      const ranks = arr.map((v) => sorted.indexOf(v) + 1);
      callback2(ranks);
    })
    .catch((err) => {
      console.log(err);
    });
}

export function createScores(con, cri, jud, raw_score, callback) {
  axios(
    axiosObjectSkeleton({
      type: "mutation",
      coll: "createScore",
      id: true,
      attr: "",
      collAttrs: `(data: { con: "${con}", cri: "${cri}", jud: "${jud}", raw_score: ${raw_score} })`,
    })
  )
    .then((res) => {
      if (res.status === 200) {
        console.log("new score store created");
      } else {
        console.log(res);
      }
    })
    .catch((err) => {
      console.log(err);
    });
}

export function updateScores(scoreID, raw_score, callback) {
  axios(
    axiosObjectSkeleton({
      type: "mutation",
      coll: "updateScore",
      id: true,
      attr: "",
      collAttrs: `(id: "${scoreID}", data: { raw_score: ${raw_score} })`,
    })
  )
    .then((res) => {
      if (res.status === 200) {
        console.log("a score store was updated");
      } else {
        console.log(res);
      }
    })
    .catch((err) => {
      console.log(err);
    });
}

export function getMisc(callback1, callback2) {
  axios(
    axiosObjectSkeleton({
      type: "query",
      coll: "misc",
      id: false,
      attr: "contest_name disableCoronation",
    })
  )
    .then((res) => {
      if (res.status === 200) {
        callback1 && callback1(res.data.data.misc.data.attributes.contest_name);
        callback2 && callback2(res.data.data.misc.data.attributes.disableCoronation);
      } else {
        console.log(res);
      }
    })
    .catch((err) => {
      console.log(err);
    });
}
