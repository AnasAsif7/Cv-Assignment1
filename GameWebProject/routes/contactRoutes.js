const express = require('express');
const router = express.Router();
const Contact = require('../models/Contact');
const sessionAuth = require("../middleware/sessionAuth");

// Middleware to check if user is admin
function isAdmin(req, res, next) {
  if (res.locals.isAdmin) {
    next();
  } else {
    res.status(403).send("Forbidden");
  }
}

// Handle contact form submission
router.post('/contact', async (req, res) => {
  const { firstName, lastName, email, subject, message } = req.body;
  
  try {
    const newContact = new Contact({ firstName, lastName, email, subject, message });
    await newContact.save();
    res.status(201).send('Message sent successfully');
  } catch (err) {
    console.error(err);
    res.status(500).send('Server Error');
  }
});
router.get('/customer-requests',isAdmin, async (req, res) => {
    try {
        const contacts = await Contact.find().sort({ createdAt: -1 }); // Sorting by newest first
        res.render('customerRequests', { contacts });
    } catch (err) {
        console.error(err);
        res.status(500).send('Server Error');
    }
});

module.exports = router;
