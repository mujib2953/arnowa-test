import cryptoJS from "crypto-js";
const SECRET_KEY = "JS is awesome";

class Storage {

    setItem(key, value) {
        const data = typeof value !== "string" ? JSON.stringify(value) : value;
        const encryptedData = cryptoJS.AES.encrypt(data, SECRET_KEY);

        localStorage.setItem(key, encryptedData);
    }

    getItem(key) {
        const encryptedData = localStorage.getItem(key);
        if (encryptedData) {
            try {
                const decryptedText = cryptoJS.AES.decrypt(encryptedData, SECRET_KEY);
                const decryptedString = decryptedText.toString(cryptoJS.enc.Utf8);

                return decryptedString;
            } catch (e) {
                console.error(`Error in localStorage decryption methods for ${key}`);
            }
        }
    }

    isItem(key) {
        return !!localStorage.getItem(key);
    }

    deleteItem(key) {
        if (this.isItem(key)) {
            localStorage.removeItem(key);
        } else {
            console.error(`Error in localStorage, unable to delete ${key}`);
        }
    }

    clearAll() {
        localStorage.clear();
    }
}

const storage = new Storage();

export default storage;