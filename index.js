import express from 'express';
import approotes from './utils/app.controller.js';
import { config } from "dotenv";
config();
// avve agst fuxq hugh
const app = express();
const port = process.env.PORT
approotes(app,express)
app.listen(port,()=> console.log(`http://localhost:${port}`));