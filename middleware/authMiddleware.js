import jwt from "jsonwebtoken";

export const requireSignIn = (req, res, next) => {
  try {
    const token = req.headers.authorization;

    if (!token) return res.status(401).send({ message: "Unauthorized" });

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // stores userId, etc
    next();
  } catch (error) {
    console.log(error);
    res.status(401).send({ message: "Invalid token" });
  }
};


