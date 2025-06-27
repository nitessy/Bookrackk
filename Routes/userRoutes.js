import express from "express";
import { getAllUsers, loginController, registerController } from "../controllers/user-controller.js";
const router = express.Router();

// import { Router} from "express";


router.get(' ', getAllUsers);

router.post('/register', registerController);

router.post('/login',loginController);

export default router;