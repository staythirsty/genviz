var express = require('express')
var vizualizer = require('./routers/vizualizer')

var app = express();
var port = process.env.PORT || 5000;


app.use(express.static('public'))

app.use('/viz', vizualizer)

app.listen(port, function () {
  console.log('listening on port 5000!')
})