import  jwt  from "jsonwebtoken";

const V_token=async ({token,SECRT_KEY})=>{
    return  jwt.verify(token,SECRT_KEY)
}

export default V_token