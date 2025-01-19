import dotenv from 'dotenv';
dotenv.config();
import bcrypt from "bcrypt"
export const hashing = async ({password,saltRounds = process.env.BYCRYPTSOLT_ROUNDS})=>{
    // const salat = Number(saltRounds)
    return await bcrypt.hashSync(password, saltRounds);
}