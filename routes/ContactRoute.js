const express = require("express");
const router = express.Router();
const nodemailer = require("nodemailer");

router.post("/envoyer", async (req, res) => {
  try {
    const { nom, prenom, email, sujet, message } = req.body;

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
      subject: `Nouveau message contact - ${sujet}`,
      html: `
        <h2>Nouveau message depuis la page Contact</h2>

        <p><strong>Nom :</strong> ${nom}</p>
        <p><strong>Prénom :</strong> ${prenom}</p>
        <p><strong>Email :</strong> ${email}</p>
        <p><strong>Sujet :</strong> ${sujet}</p>
        <p><strong>Message :</strong></p>
        <p>${message}</p>
      `,
    });

    res.status(200).json({
      message: "Message envoyé avec succès",
    });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      message: "Erreur serveur",
    });
  }
});

module.exports = router;