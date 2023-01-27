import storage from "./storage";

const TOKEN_KEY = "token";
const MONTHS = {

};

export const getToken = () => {
    if (storage.isItem(TOKEN_KEY)) {
        return storage.getItem(TOKEN_KEY);
    }

    return null;
};

export const getSessionStartDateTime = (timestamps) => {
    const _date = new Date(timestamps);
    return _date.toLocaleString() + " " + Intl.DateTimeFormat().resolvedOptions().timeZone;
};

export const getSessoionDuration = (startTimestamp, endTimestamp) => {
    const startTime = new Date(startTimestamp);
    const endTime = new Date(endTimestamp);

    return Math.round((((endTime - startTime) % 86400000) % 3600000) / 60000) + " minutes";
};