import { check } from "k6";

import { WS_URL } from "../utils/constants";
import { Devices } from "../utils/test-data";
import { WebSocketExecutor } from "../utils/web-socket";
import { verifyDid, confirmLogin, getQid } from "../functions/login";

export default function () {
    const qid = getQid();
    const testDevice = Devices[0];

    const wsConnectUrl = `${WS_URL}?action=login&qrId=${qid}`;
    const wsExec = new WebSocketExecutor({ name: "qid-login-ws", url: wsConnectUrl });

    wsExec
        .onConnect(() => {
            const verifyResp = verifyDid({
                suid: testDevice.suid,
                zid: testDevice.zid,
                did: qid,
                privateKey: testDevice.privateKey,
            });

            check(verifyResp, {
                "verifyQid response status is 200": (_r) => verifyResp.status === 200,
            });

            const verifyRespData = JSON.parse(verifyResp.body);
            check(verifyRespData, {
                "verifyQid response has org name": (_r) => verifyRespData.org_name === "VPS Organization",
            });

            const confirmResp = confirmLogin({
                qid,
            });
            check(confirmResp, {
                "confirmLogin response status is 200": (_r) => confirmResp.status === 200,
            });
        })
        .onMessage((message) => {
            const msg = JSON.parse(`${message}`);

            check(msg, {
                "WS: status success message received": (_r) => msg.status === "success",
                "WS: message has attributes": (_r) => msg.attributes,
                "WS: message has samlParseResp": (_r) => msg.samlParseResp,
            });
        })
        .onDisconnect(() => {});

    console.log("websocket initialized");
    wsExec.start();
}
