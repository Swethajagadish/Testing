import http from "k6/http";
import { parseHTML } from "k6/html";

import { SSO_URL, API_BASE_URL } from "../utils/constants";
import { sign } from "../utils/digisign";

export const getQid = () => {
    const res = http.get(SSO_URL, { redirects: 5 });

    const doc = parseHTML(res.body);
    const qidJSON = doc.find("input[id=elQrText]").attr("value");
    const parsedQid = JSON.parse(qidJSON).qid;
    console.log("qid=", parsedQid);
    return parsedQid;
};

export const verifyDid = ({ suid, zid, did, privateKey }) => {
    const url = `${API_BASE_URL}/verify/did`;
    console.log("Signing: ", `${suid}||${zid}||${did}`);

    const signature = sign(privateKey, `${suid}||${zid}||${did}`);
    console.log("Sign: ", signature);

    const payload = JSON.stringify({
        dynamicId: did,
        suid,
        zid,
        signature,
    });
    const headers = { "Content-Type": "application/json" };
    const res = http.post(url, payload, headers);
    return res;
};

export const confirmLogin = ({ qid }) => {
    const url = `${API_BASE_URL}/confirm/qid`;

    const payload = JSON.stringify({
        dynamicId: qid,
        confirm: "yes",
    });
    const headers = { "Content-Type": "application/json" };
    const res = http.post(url, payload, headers);
    return res;
};
