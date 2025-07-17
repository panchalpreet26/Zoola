const express = require("express");
const userController = require("../Controllers/userController");
const router = express.Router();
const multer = require("multer");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/");
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + "-" + file.originalname);
  },
});
const upload = multer({ storage: storage });

router.get("/usershow", userController.fetchall); // ✅ fetch all users
router.delete("/userdelete/:id", userController.Delete); // ✅ delete user

// Other routes (optional)
router.post("/usersignup", upload.single("image"), userController.signup);
router.post("/userlogin", userController.signin);
router.get("/user/:id", userController.getUserById);
router.put("/update/:id", upload.single("image"), userController.updateUser);
router.post("/firebase-login", userController.firebaseLogin);

module.exports = router;
