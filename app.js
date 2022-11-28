require("dotenv").config()
const express = require("express")
const nodemailer = require("nodemailer")
const app = express()

app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use(express.static("./public"))
app.set("view engine", "ejs")

app.get("/", (req, res) => {
    res.render("index", {sent: false, error: false})
})

app.post("/send", async (req, res) => {
    const { name, email, subject, message } = req.body
    if(!name || !email || !subject || !message || name === "" || email === "" || subject === "" || message === "") {
        return res.status(400).json({msg: "Please provide required information"})
    }
    const output = `
        <h1>Your Header Here</h1>
        <p>${message}</p>
    `
    let transporter = nodemailer.createTransport({
        host: "smtp-mail.outlook.com",
        port: 587,
        secure: false, // true for 465, false for other ports
        auth: {
            user: process.env.USER, // generated ethereal user
            pass: process.env.PASS, // generated ethereal password
        },
    });

    // send mail with defined transport object
    try {
        let info = await transporter.sendMail({
        from: `${name} <${process.env.USER}>`, // sender address
        to: "receiver1@example.com, receiver2@example.com", // list of receivers
        subject: subject, // Subject line
        text: message, // plain text body
        html: output, // html body
        });

        console.log("Message sent: %s", info.messageId);
        res.status(200).render("index", {sent: true})
    } catch (error) {
        console.log(error);
        res.status(400).render("index", {error: true, sent: false})
    }
    
})

const port = 5000
app.listen(port, console.log(`Server is listening on port ${port}`))