const { Router } = require( "express" );
const router = Router( );

const {
    getSummaryOfPublications,
    getPublication,
    addPublication
} = require( "../controllers/publication.controller" );

const {
    addPublicationToAuthor
} = require( "../controllers/user.controller" );

const {
    updateNotifications
} = require( "../controllers/notification.controller" );

const {
    updatePublications
} = require( "../controllers/category.controller" );


router
    .route( "/get-publication/:publicationId" )
    .get( getPublication );

router
    .route( "/get-all-publications/:categoryId" )
    .get( getSummaryOfPublications );

const { isAuthenticated } = require( "../helpers/authenticated" );

router
    .route( "/add-publication" )
    .post( isAuthenticated, addPublication, addPublicationToAuthor, updateNotifications, updatePublications );

module.exports = router;