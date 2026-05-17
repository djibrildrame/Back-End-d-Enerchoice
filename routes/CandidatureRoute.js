const express = require("express");
const router = express.Router();
const nodemailer = require("nodemailer");
const multer = require("multer");

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },

  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

const upload = multer({ storage });

router.post("/postuler", upload.single("cv"), async (req, res) => {

  try {

    const {
      nom,
      prenom,
      email,
      telephone,
      ville,
      poste,
      message,
    } = req.body;

    const transporter = nodemailer.createTransport({
      service: "gmail",

      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    await transporter.sendMail({
      from: process.env.EMAIL_USER,

      to: process.env.EMAIL_EMPLOYEUR,

      subject: `Nouvelle candidature - ${poste}`,

      html: `
        <h2>Nouvelle candidature reçue</h2>

        <p><strong>Nom :</strong> ${nom}</p>

        <p><strong>Prénom :</strong> ${prenom}</p>

        <p><strong>Email :</strong> ${email}</p>

        <p><strong>Téléphone :</strong> ${telephone}</p>

        <p><strong>Ville :</strong> ${ville}</p>

        <p><strong>Poste souhaité :</strong> ${poste}</p>

        <p><strong>Message :</strong> ${message}</p>
      `,

      attachments: req.file
        ? [
            {
              filename: req.file.originalname,
              path: req.file.path,
            },
          ]
        : [],
    });

    res.status(200).json({
      message: "Candidature envoyée avec succès",
    });

  } catch (error) {

    console.log(error);

    res.status(500).json({
      message: "Erreur serveur",
    });
  }
});

module.exports = router;