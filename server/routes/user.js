import express from 'express';
import { approveUser, getAllUsers } from "../controllers/user.js";

const router = express.Router();

router.get('/all', getAllUsers);
router.put('/approve/:id', approveUser)

export default router;