const http_lc = require('./protocol/protocol');
require('./server');
// 通过 http.request 发起一个请求，返回一个表示请求的对象 clientRequest
const clientRequest = http_lc.request("localhost",8080, 'Content-Type:text/plain', 
    (res) => { // 收到响应时的回调
        console.log('客户端：收到响应');
        console.log('客户端：响应数据：\n', res.toString('utf-8'));
        console.log('客户端：响应结束');
        process.exit();
    }
);
// 给服务器发送请求体
clientRequest.write("Hello,server!");
// 标记请求结束
clientRequest.end();