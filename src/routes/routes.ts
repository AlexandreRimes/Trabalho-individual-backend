import { Router } from "express";
import { authMiddleware } from "../middlewares/auth.middleware"; 
import { UserController } from "../controllers/UserController";
import { AddressController } from "../controllers/AddressController";


const router = Router();

//userRoutes
router.post("/user", UserController.createUser);
router.post("/login", UserController.login);
router.get("/users", authMiddleware, UserController.readAllUsers);
router.get("/user/:userId", authMiddleware, UserController.readUser);
router.put("/user/:userId", authMiddleware, UserController.updateUser);
router.delete("/user/:userId", authMiddleware, UserController.deleteUser);

//addressRoutes
router.post("/user/:userId/address", authMiddleware, AddressController.createAddress);
router.get("/user/:userId/address", authMiddleware, AddressController.readAllAddresses);
router.get("/user/:userId/address/:id", authMiddleware, AddressController.readAddress);
router.put("/user/:userId/address/:id", authMiddleware, AddressController.updateAddress);
router.delete("/user/:userId/address/:id", authMiddleware, AddressController.deleteAddress);


export default router;