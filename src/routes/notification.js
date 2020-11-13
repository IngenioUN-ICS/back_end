const { Router } = require( "express" );
const router = Router( );

const {
    removeAllNotifications,
    removeNotification,
    getAllNotifications

} = require( "../controllers/notification.controller" );

const { isAuthenticated } = require( "../helpers/authenticated" );

router
    .route( '/get-notifications/:authorId/:categoryId' )
    .get( isAuthenticated, getAllNotifications );

router
    .route( '/remove-notification' )
    .post( isAuthenticated, removeNotification );

router
    .route( '/remove-all-notifications' )
    .post( isAuthenticated, removeAllNotifications );

module.exports = router;