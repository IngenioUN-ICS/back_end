const { Router } = require("express");
const router = Router();

const {
    // Juan

    // Valeria

    // Carlos

    // Tatiana
    getSummaryOfPublications,
    addPublication
} = require("../controllers/publication.controller");

// Juan

// Valeria

// Carlos

// Tatiana

router
    .route("/get-all-publications")
    .get(getSummaryOfPublications);

const { isAuthenticated } = require("../helpers/authenticated");

// Juan

// Valeria

// Carlos

// Tatiana
router
    .route("/add-publication")
    .post(isAuthenticated, addPublication);

module.exports = router;