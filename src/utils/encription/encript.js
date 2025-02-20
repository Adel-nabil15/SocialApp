import CryptoJS from "crypto-js";

const EN_CRYPT = async ({ Key, KEY_SECRIT }) => {
  return CryptoJS.AES.encrypt(Key, KEY_SECRIT).toString();
};
export default EN_CRYPT;
