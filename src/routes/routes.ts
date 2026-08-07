import { Router } from "express";
import { authMiddleware } from "../middlewares/authMiddleware";
import { validateBody } from "../middlewares/validate";
import { UserController } from "../controllers/UserController";
import { AddressController } from "../controllers/AddressController";
import { createUser, updateUser } from "../config/UserValidator";
import { createAddress, updateAddress } from "../config/AddressValidator";


const router = Router();

//userRoutes
router.post("/user", validateBody(createUser), UserController.createUser);
router.post("/login", UserController.login);
router.get("/users", authMiddleware, UserController.readAllUsers);
router.get("/user/:userId", authMiddleware, UserController.readUser);
router.put("/user/:userId", authMiddleware, validateBody(updateUser), UserController.updateUser);
router.delete("/user/:userId", authMiddleware, UserController.deleteUser);

//addressRoutes
router.post("/user/:userId/address", authMiddleware, validateBody(createAddress), AddressController.createAddress);
router.get("/user/:userId/address", authMiddleware, AddressController.readAllAddresses);
router.get("/user/:userId/address/:id", authMiddleware, AddressController.readAddress);
router.put("/user/:userId/address/:id", authMiddleware, validateBody(updateAddress), AddressController.updateAddress);
router.delete("/user/:userId/address/:id", authMiddleware, AddressController.deleteAddress);


export default router;