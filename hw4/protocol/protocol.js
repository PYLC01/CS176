const net = require('net');
const EventEmitter = require('events');
const HttpParser = require('./HttpParser');

class IncomingMessage {
  constructor(message) {//message: string
    this.httpParser = HttpParser.createHttpParser(message);
    this.httpMessage = this.httpParser.httpMessage;
    this.resMessage = this.httpParser.resMessage;
  }
}

class ResponseFormatter {

  constructor() {
    this.status = 200;//200-correct protocol 404-incorrect protocol
    this.version = 'HTTP_lc';
    this.headers = {
      'Content-Type': 'application/json'
    };//headers是一个json数组
    this.body = '';
  }

  setStatus(status) {//status: number
    this.status = status;
  }

  setBody(body) {//body: string
    this.body = body;
  }

  setHeader(key, val) {//key: string, val: string
    this.headers[key] = val;
  }

  format() {//: string
    const head = `${this.version} ${this.status}`;
    let headers = '';
    for (let key in this.headers) {
      const value = this.headers[key];
      headers += `${key.toLocaleLowerCase()}: ${value}\r\n`;
    }
    const combineData = [head, headers, this.body].join('\r\n');
    return combineData;
  }
}

class ServerResponse {
  
  constructor(socket) {//socket: net.Socket
    this.socket = socket;
    this.resFormatter = new ResponseFormatter();
  }

  setHeader(key, val) {//key: string, val: string
    this.resFormatter.setHeader(key, val);
  }
  
  end(status, body) {//status: number, body: string
    if(status==200){
      const resFormatter = this.resFormatter;
      resFormatter.setStatus(status);
      resFormatter.setBody(body);
      console.log("服务器：发送响应");
      this.socket.write(resFormatter.format());
      this.socket.end();
    }
    else{
      this.socket.write("404");
      this.socket.end();
    }
  }
}

class HTTP_lc_server extends EventEmitter{

  constructor(handler) {//handler: Handler
    super();//子类构造函数中必须调用super方法
    this.handler = handler;
    this.createServer();
  }

  createServer() {//void
    this.server = net.createServer((socket) => {
      console.log('服务器：建立连接');
      socket.on('data', (data) => {
        const message = data.toString('utf-8');
        this.request = new IncomingMessage(message);
        this.response = new ServerResponse(socket)
        this.handler(this.request, this.response);
      });

      socket.on('error', error => {//监听客户端发送的信息
        this.emit('error', error)//给该socket的客户端发送消息
      });
    });
  }

  listen(port, cb) {
    this.server.listen(port, cb);
    this.server.on('error', error => this.emit('error', error));
  }
}

const createServer = (handler) => {
  return new HTTP_lc_server(handler)
}

class ClientRequest extends EventEmitter{
  constructor(h,p,headers,cb){
    super();
    let socket = net.createConnection({
      port: p,
      host: h,
    });
    this.callback=cb;
    socket.on('data', (data)=>{
      this.callback(data);
    });
    this.socket=socket;
    this.protocol_type="https ";
    this.url="/ ";
    this.version="1.0 ";
    this.headers=headers;
  }
  write(body){
    console.log("客户端：发送请求");
    var protocol_type=this.protocol_type;
    var url=this.url;
    var version=this.version;
    var headers=this.headers;
    this.socket.write(protocol_type+url+version+'\r\n'+headers+'\r\n'+body);
  }
  end() {// body: string
    this.socket.end();
  }
}

const request = (host,port, options, cb) =>{
  return new ClientRequest(host,port, options, cb);
}

module.exports = {
  createServer,
  request,
}
