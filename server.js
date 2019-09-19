const mongo = require("mongodb").MongoClient;
const client = require('socket.io').listen(4000).sockets;

//connect to mongo
mongo.connect('mongodb://127.0.0.1/mongochat',{ useNewUrlParser: true,useUnifiedTopology: true },function(err,cl){
    if(err){
       
        throw err;
    }
    console.log("MongoDB connected ...");
    const db = cl.db("mongochat");


    //connect to socket.io
    client.on('connection',function(socket){
            let chat = db.collection('chats');
            
            //function to send status
            sendStatus = function(s){
                socket.emit("status",s)
            }

            //get chats from mongo collection
            chat.find().limit(100).sort({_id:1}).toArray(function(err,res){
                if(err){
                    throw err;
                }
                //emit the messages
                socket.emit("output",res)
            });


            //handle input events
            socket.on('input',function(data){
                let name = data.name;
                let message = data.message;
            
            //check for name and message
            if(name==""||message==""){
                //send error status
                sendStatus("please ,enter the name and message");
            }else{
                //insert message
                chat.insert({name:name,message:message},function(){
                client.emit("output",[data])

                //send status object
                 sendStatus({
                       message:"message sent",
                        clear:true
                    })
                })
            }
        });
        socket.on('clear',function(){
            //remove all chats from collection
            chat.remove({},function(){
                socket.emit('cleared')
            })
        })
    })
})