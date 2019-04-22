let express = require('express'),
  http = require('http'),
  app = express()
app.use(express.static(`${__dirname}/dist`))
let port = process.env.PORT || 5000
let server = http.createServer(app).listen(port)
