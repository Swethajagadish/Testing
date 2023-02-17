import { Base64 } from "js-base64";

var rs = require("jsrsasign");

function hexToBase64(hexstring) {
    return Base64.btoa(
        hexstring
            .match(/\w{2}/g)
            .map(function (a) {
                return String.fromCharCode(parseInt(a, 16));
            })
            .join("")
    );
}

export function sign(pvtKey, text) {
    const sig = new rs.KJUR.crypto.Signature({ alg: "SHA256withRSA" });
    sig.init(pvtKey);
    sig.updateString(text);
    const sigHex = sig.sign();
    const base64Str = hexToBase64(sigHex);
    return base64Str;
}
