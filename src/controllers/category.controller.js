const Category = require( '../models/Category' );
const logger = require( '../log/facadeLogger');

const categoriesCtrl = { };

// Juan

// Valeria

// Carlos

// Tatiana

// Only the administrator can use this function
categoriesCtrl.addCategory = async ( req, res ) => {
    try{
        if ( req.user.role != 2 )
            throw "You do not have the required permissions";

        const { name, description } = req.body;
        if ( !name || !description )
            throw "The required data is incomplete";

        const newCategory = new Category( req.body );
        await newCategory.save( );

        logger.info("A category has been successfully created");
        return res.status( 201 ).json({
            message: "The category has been created successfully"
        });
    }catch ( err ) {
        if( !err.message ) {
            logger.warn( err );
            return res.status( 400 ).json({ message: err });
        } else {
            logger.error( "There was a problem creating a category" );
            return res.status( 400 ).json({
                message: "The category could not be created"
            });
        }
    }
};

// Any user can access this information
categoriesCtrl.getCategories = async ( req, res ) => {
    try{
        const categories = await Category.find({}, {
            name: 1,
            publications: 1
        });
        return res.status( 201 ).json( categories );
    }catch ( err ) {
        return res.status( 400 ).json({
            message: "Could not access requested information"
        })
    }
};

categoriesCtrl.updatePublications = async ( req, res, next ) => {
    try {
        if( req.user.role != 1 )
            throw "You do not have the required permissions";
        var categorie;
        for ( var i = 0; i < req.body.listCategories.length; i++ ) {
            categorie = await Category.findById( req.body.listCategories[ i ] );
            categorie.publications = categorie.publications + 1;
            await Category.findByIdAndUpdate( categorie.id, categorie );
        }

        logger.info( "The publication was created successfully" );
        return res.status( 201 ).json({
            message: "The publication was created successfully"
        })
    } catch ( err ) {
        if( !err.message ){
            logger.warn( err );
            return res.status( 400 ).json({ message: err });
        } else {
            logger.error( "User entered an invalid category ID" );
            return res.status( 400 ).json({
                message: "Some of the entered categories does not exist"
            })
        }
    }
}

module.exports = categoriesCtrl;