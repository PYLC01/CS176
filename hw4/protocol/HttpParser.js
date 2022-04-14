class HttpParser {

  constructor(message) {
    this.message = message;
    this.parse();
  }

  parse() {
    this.httpMessage = {url:"/",protocol_type:"http_lc",version:"1.0",headers:{},body:"hello"};
    const messages = this.message.split('\r\n');
    const [head] = messages;
    const [headers] = messages.slice(1, -1);
    const [body] = messages.slice(-1);
    this.parseHead(head);
    this.parseHeaders(headers);
    this.parseBody(body);
  }

  parseHead(headStr) {//headStr: string
    const [protocol_type, url, version] = headStr.split(' ');
    this.httpMessage.protocol_type = protocol_type;
    this.httpMessage.url = url;
    this.httpMessage.version = version;
  }

  parseHeaders(headerStrList) {//headerStrList: string[]
    this.httpMessage.headers = {};
    headerStrList=headerStrList.split(',');
    for (let i = 0; i < headerStrList.length; i++) {
      const header = headerStrList[i];
      let [key, value] = header.split(":");
      key = key.toLocaleLowerCase();
      value = value.trim();
      this.httpMessage.headers[key] = value;
    }
  }

  parseBody(bodyStr) {//bodyStr: string
    if (!bodyStr) return this.httpMessage.body = "";
    this.httpMessage.body = bodyStr;
    this.resMessage=JSON.parse(JSON.stringify(this.httpMessage));
    this.resMessage.body="Reply to <"+bodyStr+">:Hello,client!";
  }
}

const createHttpParser = (message) => {
  return new HttpParser(message)
}

module.exports = {
  createHttpParser,
}