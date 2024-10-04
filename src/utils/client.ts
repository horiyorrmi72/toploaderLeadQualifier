import dotenv from 'dotenv'
dotenv.config();
import Retell from 'retell-sdk';
const retellKey = process.env.RETELL_API_KEY;

export const retellClient = new Retell({
    apiKey: process.env.RETELL_API_KEY,
    
});

// console.log(retellKey);