import bcrypt from "bcryptjs";

import db from "../db.js";
import { generateToken } from "../utils/generate-token.js";

export async function authUser(req, res) {
  const { email, password } = req.body;

  if (!email || !password) {
    res.status(400);

    throw new Error("Tous les champs sont obligatoires.");
  }

  const user = await db.query("SELECT * FROM users WHERE email = $1", [email]);

  if (user?.rows[0]) {
    const matchPasswords = await bcrypt.compare(
      password,
      user.rows[0].password
    );

    if (matchPasswords) {
      const { id, fname, lname, email } = user.rows[0];

      generateToken(res, id);

      res.status(201).json({ id, fname, lname, email });
    } else {
      res.status(401);

      throw new Error("Email ou mot de passe invalide.");
    }
  } else {
    res.status(401);

    throw new Error("Email ou mot de passe invalide.");
  }
}

export async function registerUser(req, res) {
  const { fname, lname, email, password, role = "viewer" } = req.body;

  if (!fname || !lname || !email || !password) {
    res.status(400);

    throw new Error("Tous les champs sont obligatoires.");
  }

  try {
    const existingUser = await db.query(
      "SELECT id FROM users WHERE email = $1",
      [email]
    );

    if (existingUser.rows.length > 0) {
      res.status(409);

      throw new Error("Cet email est déjà utilisé.");
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const result = await db.query(
      `INSERT INTO users (fname, lname, email, password, role)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING id, fname, lname, email, role`,
      [fname, lname, email, hashedPassword, role]
    );

    const user = result.rows[0];

    res
      .status(201)
      .json({ message: "Utilisateur enregistré avec succès.", user });
  } catch (error) {
    res.status(500);

    throw new Error(error.message);
  }
}

export function logoutUser(req, res) {
  res.cookie("jwt", "", {
    httpOnly: true,
    expires: new Date(0),
  });

  res.status(200).json({ message: "Utilisateur déconnecté." });
}

export function getUserProfile(req, res) {
  res.status(200).json(req.user);
}

export async function updateUserProfile(req, res) {
  const { rows } = await db.query("SELECT * FROM users WHERE id = $1", [
    req.user.id,
  ]);

  const user = rows[0];

  if (user) {
    const fname = req.body.fname || user.fname;
    const lname = req.body.lname || user.lname;
    let password = user.password;

    if (req.body.password) {
      const salt = await bcrypt.genSalt(10);
      password = await bcrypt.hash(req.body.password, salt);
    }
  } else {
    res.status(404);

    throw new Error("Utilisateur non trouvé.");
  }
}

export function getMe(req, res) {
  const { id, fname, lname, email, role } = req.user;

  res.status(200).json({ id, fname, lname, email, role });
}
