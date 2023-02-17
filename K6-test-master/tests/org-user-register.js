import http from "k6/http";
import { check } from "k6";

export const options = {
    stages: [
        { duration: "30s", target: 20 },
        { duration: "1m30s", target: 10 },
        { duration: "20s", target: 0 },
    ],
};

export const orgUserRegister = () => {
    const BASE_URL = "https://api.scramble.id/dev/orguser/register";
    const payload = JSON.stringify({
        org_email: "sid5@vpsdomaintest.com",
        activation_code: "SID7TEST",
    });
    const headers = { "Content-Type": "application/json" };
    const res = http.post(`${BASE_URL}`, payload, headers);
    check(res, {
        "Post status is 200": (_r) => res.status === 200,
        "Post Content-Type header": (_r) => res.headers["Content-Type"] === "application/json",
    });
};

export default function () {
    orgUserRegister();
}
