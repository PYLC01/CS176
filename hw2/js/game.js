initMap = (size, count, score) => {
    var Map =new Array();
    random=myrandom(size,count);
    console.log(random);
    for(var i=0;i<size.height;i++){
        Map[i]=new Array();
        for(var j=0;j<size.width;j++){
            Map[i][j]=0;
            for(var k=0;k<count;++k){
                if (Math.floor(random[k]/10)==i&&(random[k]-(10*Math.floor(random[k]/10)))==j){
                    Map[i][j]=score;
                }
            }
        }
    }
    return Map;
}

const myrandom = (size,count) => {
    var random = new Array();
    for(var i=0;i<count;++i){
        random[i]=Math.floor(Math.random()*(size.width*size.height))+1;
        for (var j=0;j<i;++j){
            if(random[i]==random[j]){
                i--;
                break;
            }
        }
    }
    return random;
}

const draw =(id,w,h,c,s) =>{
    var map=initMap({width:w,height:h},c,s);
    var canvas = document.getElementById(id);
    var ctx = canvas.getContext("2d");

    var width = canvas.width/w;  //width of grid
    var height = canvas.height/h; //height of grid 

    for(var i=0;i<h;i++){
        for(var j=0;j<w;j++){
            ctx.rect(j*width,i*height,width,height);
            ctx.stroke();
        }
    }

    robot = new Image();
    robot.onload = function(){//必须等图片加载好后才能画
        ctx.drawImage(robot, 10, 10, width-20, height-20);
    }
    robot.src = '../image/robot.svg';

    prize = new Image();
    prize.onload = function(){
        for(var i=0;i<h;i++){
            for(var j=0;j<w;j++){
                if (map[i][j]>0)
                    ctx.drawImage(prize, j*width+10,i*height+10, width-20, height-20);
            }
        }
    }
    prize.src = '../image/prize.svg';

    var x=10;
    var y=10;
    var score=0;
    var haveGot=0;
    var leftTime=30;
    var div = document.getElementById("timer");
    setInterval (function () {
        div.innerHTML = (leftTime-=1);
        if(leftTime==0) {window.alert("You lose!");location.reload();}
    }, 1000);

    document.onkeydown=function(event){
        var e = event || window.event || arguments.callee.caller.arguments[0];
        if(e && e.keyCode==87){ //W上
            if(y-height>=0){
                y-=height;
                ctx.clearRect(x,y,width-20,height-20);
                ctx.drawImage(robot, x, y, width-20, height-20);
                ctx.clearRect(x,y+height,width-20,height-20);
                if(map[Math.floor(y/height)][Math.floor(x/width)]>0){
                    score+=map[Math.floor(y/height)][Math.floor(x/width)];
                    document.getElementById("score").innerHTML=score;
                    map[Math.floor(y/height)][Math.floor(x/width)]=0;
                    haveGot++;
                    if(haveGot==c) {window.alert("You win!");location.reload();}
                }
            }
        }
        else if(e && e.keyCode==65){ //A左
            if(x-width>=0){
                x-=width;
                ctx.clearRect(x,y,width-20,height-20);
                ctx.drawImage(robot, x, y, width-20, height-20);
                ctx.clearRect(x+width,y,width-20,height-20);
                if(map[Math.floor(y/height)][Math.floor(x/width)]>0){
                    score+=map[Math.floor(y/height)][Math.floor(x/width)];
                    document.getElementById("score").innerHTML=score;
                    map[Math.floor(y/height)][Math.floor(x/width)]=0;
                    haveGot++;
                    if(haveGot==c) {window.alert("You win!");location.reload();}
                }
            }
        }
        else if(e && e.keyCode==83){ //S下
            if(y+height<=canvas.height){
                y+=height;
                ctx.clearRect(x,y,width-20,height-20);
                ctx.drawImage(robot, x, y, width-20, height-20);
                ctx.clearRect(x,y-height,width-20,height-20);
                if(map[Math.floor(y/height)][Math.floor(x/width)]>0){
                    score+=map[Math.floor(y/height)][Math.floor(x/width)];
                    document.getElementById("score").innerHTML=score;
                    map[Math.floor(y/height)][Math.floor(x/width)]=0;
                    haveGot++;
                    if(haveGot==c) {window.alert("You win!");location.reload();}
                }
            }
        }
        else if(e && e.keyCode==68){ //D右
            if(x+width<=canvas.width){
                x+=width;
                ctx.clearRect(x,y,width-20,height-20);
                ctx.drawImage(robot, x, y, width-20, height-20);
                ctx.clearRect(x-width,y,width-20,height-20);
                if(map[Math.floor(y/height)][Math.floor(x/width)]>0){
                    score+=map[Math.floor(y/height)][Math.floor(x/width)];
                    document.getElementById("score").innerHTML=score;
                    map[Math.floor(y/height)][Math.floor(x/width)]=0;
                    haveGot++;
                    if(haveGot==c) {window.alert("You win!");location.reload();}
                }
            }
        }
    }
}