import bcrypt from "bcrypt";

const HACH = async ({ Key, saltOrRounds }) => {
  return bcrypt.hashSync(Key, saltOrRounds);
};

export default HACH;
