const Koa = require('koa');
const Router = require('koa-router');
const app = new Koa();
const router = new Router(); 
const cors = require('koa2-cors');
const MongoClient = require('mongodb').MongoClient;
const assert = require('assert');

const mongoUrl = 'mongodb://127.0.0.1:27017';
const dbName = 'test';

// Create a new MongoClient
const client = new MongoClient(mongoUrl);

// Use connect method to connect to the Server
let Db = '';
client.connect(function(err) {
  console.log("Connected successfully to server");
  Db = client.db(dbName);
});



app.use(cors({
    exposeHeaders: ['WWW-Authenticate', 'Server-Authorization', 'Date'],
    maxAge: 100,
    credentials: true,
    allowMethods: ['GET', 'POST', 'OPTIONS'],
    allowHeaders: ['Content-Type', 'Authorization', 'Accept', 'X-Custom-Header', 'anonymous'],
}));

function getData() {
    return new Promise((resolve,reject)=> {
        var result = Db.collection('test').find({})
        result.toArray((err,docs) => {
            resolve(docs)
        })
    })
}

router.get('/get',async(ctx)=>{
    // ctx.body = 'hello';
    let url = ctx.url;
    let request = ctx.request;
    let req_query = request.query;
    let req_queryString = request.querystring;
    let res = await getData()
    ctx.body = {
        url,
        req_query,
        req_queryString,
        data: res
    }
});
app.use(router.routes())
app.listen(3000,()=>{
    console.log('http://127.0.0.1:3000');
});