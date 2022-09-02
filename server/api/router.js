// import {create_temp,get_temp} from './controller.js';
import getroute from "./controller.js";
// const Router = require('express').Router();
import express from "express";
const router = express.Router();

router.post("/api/template", getroute.create_temp);
router.get("/api/template/:shop", getroute.get_temp);
router.patch("/api/template/:id", getroute.update);

export default router;
