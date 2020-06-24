const { Router } = require( "express" );
const router = Router( );

const {
    // Juan
    getAllUserCategories,
    getAllFollowings,
    getAllFollowers,
    getAllUserAuthors,
    // Valeria
    addAuthor,
    getAllUsers,
    getAllAuthors,
    addMySavePublications,
    getAllSavedPublications,
    // Carlos

    // Tatiana
    getPersonalData,
    getRandomUsers,
    startFollowing,
    stopFollowing,
    getAuthorPublications
} = require( "../controllers/user.controller" );

const {
    subscribe,
    unsubscribe,
    createSubscribers
} = require( "../controllers/notification.controller" )

// Juan

// Valeria

// Carlos
router
    .route( "/get-random-users/:role/:categoryId" )
    .get( getRandomUsers )
// Tatiana

const { isAuthenticated } = require( "../helpers/authenticated" );
const { route } = require("./session");

// Juan
router
    .route( "/get-user-categories/:userId")
    .get( isAuthenticated, getAllUserCategories)

 router
    .route( "/get-following/:userId")
    .get( isAuthenticated, getAllFollowings)

router
    .route( "/get-user-authors/:userId")
    .get( isAuthenticated, getAllUserAuthors)

router
    .route( "/get-followers/:userId")
    .get( isAuthenticated, getAllFollowers)
// Valeria
router
    .route( "/add-author" )
    .put( isAuthenticated, addAuthor, createSubscribers )

router
    .route( "/get-users" )
    .get( isAuthenticated, getAllUsers )

router
    .route( "/get-authors" )
    .get( isAuthenticated, getAllAuthors )

router
    .route( "/add-save-publication" )
    .post( isAuthenticated, addMySavePublications );

router
    .route( "/get-save-publication" )
    .get( isAuthenticated, getAllSavedPublications );
// Carlos

// Tatiana
router
    .route( "/get-personal-data/:userId" )
    .get( isAuthenticated, getPersonalData )

router
    .route( "/start-following" )
    .post( isAuthenticated, startFollowing, subscribe )

router
    .route( "/stop-following" )
    .post( isAuthenticated, stopFollowing, unsubscribe )

router
    .route( "/get-author-publications/:authorId" )
    .get( isAuthenticated, getAuthorPublications );

module.exports = router;