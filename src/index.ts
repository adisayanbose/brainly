import express, { Request, Response } from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import bcrypt from "bcrypt";
import { z } from "zod";
import { UserModel, ContentModel } from "./database/db";
import jwt from "jsonwebtoken";
import { UserMiddleware } from "./Middlewares/userMiddleware";

dotenv.config();
const app = express();

const userSchema = z.object({
  username: z
    .string()
    .min(3, { message: "username too small" })
    .max(10, { message: "username too large" }),
  password: z
    .string()
    .min(8, { message: "password too small" })
    .max(20, { message: "password too large" })
    .refine(
      (val) => {
        return /[a-z]/.test(val) && /[A-Z]/.test(val);
      },
      { message: "single uppercase and lowercase letter required" }
    ),
});

app.use(express.json());

app.post("/signup", async (req, res) => {
  try {
    const user = userSchema.safeParse(req.body);
    const temp = await UserModel.findOne({
      username: req.body.username,
    });
    if (temp) {
      res.status(403).json({
        message: "user already exists",
      });
    } else {
      if (user.success) {
        bcrypt.hash(req.body.password, 10, async (err, hash) => {
          if (err) {
            res.json({
              error: err,
            });
          } else {
            await UserModel.create({
              username: req.body.username,
              password: hash,
            });

            res.status(200).json({
              message: "user created",
            });
          }
        });
      } else if (!user.success) {
        const errormessages = user.error.issues.map((x) => x.message);
        res.status(411).json({
          error: errormessages,
        });
      }
    }
  } catch (e) {
    res.status(500).json({
      message: "Server error",
    });
  }
});

app.post("/signin", async (req, res) => {
  try {
    const username = req.body.username;
    const password = req.body.password;
    const user = await UserModel.findOne({
      username: username,
    });
    if (user) {
      bcrypt.compare(password, user.password!, (err, result) => {
        if (result) {
          const token = jwt.sign(
            {
              userId: user._id,
              username: username,
              password: password,
            },
            process.env.JWT_SECRET!
          );
          res.status(200).json({
            token: token,
          });
        } else {
          res.status(403).json({
            message: "wrong password",
          });
        }
      });
    } else {
      res.status(403).json({
        message: "user not found",
      });
    }
  } catch (e) {
    res.status(500).json({
      message: `server error ${e}`,
    });
  }
});

app.post("/content", UserMiddleware, async (req, res) => {
  const content = req.body;
  await ContentModel.create({
    link: req.body.link,
    type: req.body.type,
    title: req.body.title,
    userId:req.userId,
    tags: [],
  });
  res.json({
    message: "content created",
  });
});

app.get("/contents",UserMiddleware,async (req,res)=>{
    const contents=await ContentModel.find({
        userId:req.userId
    }).populate('userId','username')
    res.json({
        contents:contents
    })
})

app.delete("/contents",UserMiddleware,async (req,res)=>{
    
    const delteedcontent=   await ContentModel.deleteOne({
        _id:req.body.ContentId,
        userId:req.userId
    })
    if(delteedcontent.deletedCount>0){
    res.json({
        message:"content deleted"
    })}
    else{
        res.json({
            message:"improper content id"
        })
    }
})



main();
async function main() {
  await mongoose.connect(process.env.MONGO_URI!);
  app.listen(process.env.PORT, () => {
    console.log("server started on port " + process.env.PORT);
  });
}
