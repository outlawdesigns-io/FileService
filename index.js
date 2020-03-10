const express = require('express');
const fileupload = require('express-fileupload');
const mime = require('mime-types');
const http = require('https');
const config = require('./config');
const Upload = require('./src/models/upload');
const app = express();


function _verifyToken(auth_token){
  if(auth_token === undefined){
    throw {error:'Token not present'};
  }
  return new Promise(function(resolve, reject){
    let options = {
      hostname:config.ACCNTHOST,
      port:config.ACCNTPORT,
      path:config.ACCNTVERIFYEND,
      method:'GET',
      headers:{
        'Content-Type':'application/json; charset=utf-8',
        'auth_token':auth_token,
      }
    };
    let req = http.request(options,function(response){
      let data = '';
      response.on('data',function(chunk){
        data += chunk;
      });
      response.on('end',function(){
        resolve(JSON.parse(data));
      });
    }).on('error',function(err){
      reject(err.message);
    });
    req.write(JSON.stringify(auth_token));
  });
}


app.use(fileupload());

app.post('/upload',async (req,res)=>{
  console.log(req.params);
  let user = null;
  try{
    user = await _verifyToken(req.headers.auth_token);
  }catch(err){
    return res.status(403).send(err);
  }
  if(!req.files || Object.keys(req.files).length === 0){
    return res.status(400).send('No files were uploaded');
  }
  let sampleFile = req.files.file;
  let extension = mime.extension(sampleFile.mimetype);
  let upload = new Upload();
  let uuid = await upload.db.uuid();
  let fileName = uuid.uuid + '.' + extension;
  upload.id = uuid.uuid;
  upload.file_path = config.UPLOADDIR + fileName;
  upload.url = config.URLPREFIX + fileName;
  upload.userId = String(user.UID);
  upload = await upload._create();

  sampleFile.mv(config.UPLOADDIR + '/' + fileName,(err)=>{
    if(err) return res.status(500).send(err);
    res.send(upload._buildPublicObj());
  });
});

https.createServer({
  key: fs.readFileSync(config.SSLKEYPATH),
  cert: fs.readFileSync(config.SSLCERTPATH)
},app).listen(config.LIVEPORT,()=>{
  console.log('Listening on port: ' + config.LIVEPORT);
});

// app.listen(config.LIVEPORT,()=>{
//   console.log('Listening on port: ' + config.LIVEPORT);
// });
