import express from "express";
import authController from "../../contollers/auth-controller";
import followController from "../../contollers/follow-controller";
import replyController from "../../contollers/reply-controller";
import threadController from "../../contollers/thread-controller";
import userController from "../../contollers/user-controller";
import { authentication } from "../../middlewares/authentication";
import { authorize } from "../../middlewares/authorization";
import { upload } from "../../middlewares/upload/upload-file";

export const routerV1 = express.Router();

routerV1.get("/users", userController.find);
routerV1.get("/users/:id", userController.findById);
routerV1.get("/users/email/:email", userController.findByEmail);
routerV1.get("/users/fullName/:fullName", userController.findByFullname);
routerV1.get("/users/:userId/thread", threadController.findThreadByUserId);
routerV1.get("/users/:userId/suggestion", userController.getSuggestion);
routerV1.post("/users", userController.create);
routerV1.patch(
  "/users/:id",
  authentication,
  upload.fields([
    { name: "image", maxCount: 1 },
    { name: "backgroundImage", maxCount: 1 },
  ]),
  userController.update
);
routerV1.delete("/users/:id", userController.delete);

routerV1.post("/auth/login", authController.login);
routerV1.post("/auth/register", authController.register);
routerV1.post("/auth/forgot-password", authController.forgotPassword);
routerV1.post("/auth/reset-password", authController.resetPassword);
routerV1.post("/auth/logout", authController.logout);
routerV1.get("/auth/check", authentication, authController.check);

routerV1.get("/dashboard", authentication, authorize("ADMIN"), (req, res) => {
  res.json({ message: "Hello from dashboard!" });
});

routerV1.get("/google", authController.googleOAuth);
routerV1.get("/google/callback", authController.googleOAuthCallback);

routerV1.get("/thread", authentication, threadController.find);
routerV1.get("/thread/:id", authentication, threadController.findById);
routerV1.post("/thread", authentication, upload.single("image"), threadController.create);
routerV1.post(
  "/threads/:threadId/like",
  authentication,
  threadController.LikeFromThread
);
routerV1.post(
  "/threads/:threadId/unlike",
  authentication,
  threadController.removeLikeFromThread
);
routerV1.patch("/thread/:id", authentication, threadController.update);
routerV1.delete("/thread/:id", authentication, threadController.delete);

routerV1.get("/followers", authentication, followController.getFollowers);
routerV1.get("/following", authentication, followController.getFollowing);
routerV1.post("/follow", authentication, followController.followUser);
routerV1.post("/unfollow", authentication, followController.unfollowUser);

routerV1.get("/replies", authentication, replyController.findReply);
routerV1.get(
  "/replies/:id",
  authentication,
  replyController.getRepliesByThreadId
);
routerV1.post(
  "/replies",
  authentication,
  upload.single("image"),
  replyController.createReply
);
routerV1.post(
  "/replies/:replyId/like",
  authentication,
  replyController.addLikeFromReply
);
routerV1.delete(
  "/replies/:replyId/unlike",
  authentication,
  replyController.removeLikeFromReply
);
