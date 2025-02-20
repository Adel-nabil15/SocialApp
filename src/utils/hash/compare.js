import bcrypt from "bcrypt";

const COMPARE = async ({ Key, KEY_HASH }) => {
  return bcrypt.compareSync(Key, KEY_HASH);
};

export default COMPARE;
