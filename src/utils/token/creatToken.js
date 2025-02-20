import  jwt  from "jsonwebtoken";

const C_token=async ({payload={},SECRIT_KEY,option})=>{
    return  jwt.sign(payload,SECRIT_KEY,option)
}

export default C_token