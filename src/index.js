const app = require('./app')
const fs = require('fs')
const path = require('path')
const https = require('https')

require('./database')

// const httpsOptions = {
//   cert: fs.readFileSync(path.join(__dirname, 'config', 'ssl','server.crt')),
//   key: fs.readFileSync(path.join(__dirname, 'config', 'ssl','server.key'))
// }

// async function main() {
//   await app.listen(app.get('port'))
//   console.log('Server on port', app.get('port'))
// }

// main()
const httpsServer = https.createServer(
  {
    key: fs.readFileSync(path.join(__dirname, 'ssl', 'key.pem')),
    cert: fs.readFileSync(path.join(__dirname, 'ssl', 'cert.pem')),
  },
  app
)
httpsServer.listen(3443, () => console.log('Server running at port 3443'))

// const port = 3443
// https.createServer(httpsOptions, app).listen(port, function(){
//   console.log(`Server is running at port ${port}`)
// })

// console.log('Path', path.join(__dirname))
