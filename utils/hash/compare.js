import dotenv from 'dotenv';
dotenv.config();
import bcrypt from "bcrypt"


export const hashCompare = async ({cruunt,old})=>{
    // const salat = Number(saltRounds)
    return await bcrypt.compareSync(cruunt, old);
}