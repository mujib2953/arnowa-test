import storage from "./storage";

export const getData = async (url) => {
    const resp = await fetch(url);
    const respData = await resp.json();

    return respData;
};

export const postData = async (url, data, token) => {

    const payload = {};
    const header = {
        "Content-Type": "application/json"
    };

    if (token)
        header["Auth-Token"] = storage.getItem("token");

    if (data)
        payload.body = JSON.stringify(data);

    payload.headers = header;
    payload.method = "post";

    const resp = await fetch(url, payload);
    const respData = await resp.json();

    return respData;
};