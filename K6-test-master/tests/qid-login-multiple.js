import qidLoginTest from "./qid-login";

export const options = {
    stages: [
        { duration: "30s", target: 8 },
        { duration: "1m30s", target: 5 },
        { duration: "20s", target: 2 },
    ],
};

export default function () {
    qidLoginTest();
}
