const mongoose = require( "mongoose" );

//mongoose.connect( 'mongodb://localhost/ingenio_database', {
//mongoose.connect( 'mongodb+srv://Ingenio123:Ingenio123@clusteringenio-jv1l1.gcp.mongodb.net/<dbname>?retryWrites=true&w=majority', {
mongoose.connect( 'mongodb+srv://IngenioUN:IngenioUN@cluster0.ejd2r.mongodb.net/<dbname>?retryWrites=true&w=majority', {
    useCreateIndex: true,
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false
})
.then( db => console.log( "DB is connected" ) )
.catch( err => console.error( err ));