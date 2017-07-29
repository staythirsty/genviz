var express = require('express')
var vizualizer = require('./routers/vizualizer')

var app = express();

app.use(express.static('public'))

app.use('/viz', vizualizer)

app.listen(5000, function () {
  console.log('listening on port 5000!')
})