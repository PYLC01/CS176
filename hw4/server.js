const http_lc =require('./protocol/protocol');

function handleHTTPRequest(req, res) {
  console.log('服务器：收到请求');
  console.log("请求内容是：",JSON.stringify(req.httpMessage));
  if (req.httpMessage.protocol_type == "http_lc"){
    res.setHeader('Content-Type', 'text/plain');
    res.end(200,JSON.stringify(req.resMessage));
  }
  else{
    res.end(404,"");
  }
}

const httpServer = http_lc.createServer(handleHTTPRequest);
httpServer.listen(8080)