import mycontroller from './controller.js';
// const Router = require('express').Router();
import express from 'express'
const router = express.Router();

router.post('/api/savedetails',mycontroller.saveTemplate);
router.get('/api/getdetails/:shop',mycontroller.getTemplate);
router.patch('/api/updatedetails/:id',mycontroller.updateTemplate);




export default router
