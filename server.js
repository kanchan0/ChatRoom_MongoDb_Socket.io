const app               =       require("express")()
const bodyParser        =       require("body-parser")
var http                =       require('http').createServer(app);
const driverfunction    =       require("./modals")

app.use(bodyParser.urlencoded({
    extended: true
  }));
  
app.use(bodyParser.json());

app.get('/chat', function(req, res){
    res.sendFile(__dirname + '/index.html');
  });

driverfunction();
http.listen(5500, function(){
    console.log('listening on *:5500');
  });