import { Router } from "express";
import * as recipeController from "../controllers/recipeController";

const router = Router();

router.get("/search", recipeController.search);
router.get("/", recipeController.browse);
router.get("/:id", recipeController.read);
router.post("/", recipeController.add);
router.put("/:id", recipeController.edit);
router.delete("/:id", recipeController.remove);

export default router;
