import dotenv from 'dotenv';
import express from 'express';
import mongoose from 'mongoose';
import jwt from 'jsonwebtoken';
const app=express();
dotenv.config()
console.log(process.env.mongo_uri)
app.get("/api/v1/signup",(req,res)=>{})
app.get("/api/v1/signin",(req,res)=>{})
app.get("/api/v1/content",(req,res)=>{})
app.listen(process.env.port,()=>{
    console.log("Started server on port "+process.env.port)

})