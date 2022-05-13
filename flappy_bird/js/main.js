/*
* 主javascript代码
*/
var score=0;//游戏总得分
var global_id=0;//requestAnimationFrame返回的id，用于最后取消

const draw =(canvas,ctx) =>{

    var background_x=0;
    var background_speed=6;//背景移动速度
    var wind_speed=myrandom(5,0,1)[0];//风速（随机）
    var pipe_num = 5;//同时生成的管道数量
    var pipet_height = myrandom(400,150,pipe_num);//上管道的长度（随机）
    //根据风速设置上下管道之间间隙的大小
    if (wind_speed<=2)
        var pipe_interval = 150;
    else
        var pipe_interval = 200;
    var pipe_arr = new Array();
    var pipe_x=1500;//第一个管道的初始x坐标
    for(var i=0;i<pipe_num;i++){
        pipe_arr[i]={x:pipe_x,yt:0,height:pipet_height[i]};
        pipe_x+=1200;
    }
    //绘制上管道
    pipet = new Image();
    pipet.onload = function(){
        for (var i=0;i<pipe_num;i++){
            pipet_height = myrandom(400,100,0);
            ctx.drawImage(pipet, pipe_arr[i].x,pipe_arr[i].yt, 100, pipe_arr[i].height);
        }
    }
    pipet.src = '../image/pipe_top.png';

    //绘制下管道
    pipeb = new Image();
    pipeb.onload = function(){
        for (var i=0;i<pipe_num;i++){
            ctx.drawImage(pipeb, pipe_arr[i].x,pipe_arr[i].height+pipe_interval, 100, 800-pipe_interval-pipe_arr[i].height);
        }
    }
    pipeb.src = '../image/pipe_bottom.png';

    //绘制金币
    var gold_arr = new Array();
    gold = new Image();
    gold.onload = function(){
        for (var i=0;i<pipe_num;i++){
            if(Math.random()<=0.5){
                gold_arr[i]=1;
                ctx.drawImage(gold, pipe_arr[i].x+30,pipe_arr[i].height+pipe_interval*2/3, 30, 30);
            }
            else
            gold_arr[i]=0;
        }
    }
    gold.src = '../image/gold.png';

    var bird_x =100,bird_y=400;//鸟的位置（x坐标是固定值）
    var time=0;
    var bird_g=4.9;//鸟下落的加速度
    var bird_a=-250;//鸟振翅后的加速度
    var bird_v=0;//鸟的速度

    //绘制鸟
    bird = new Image();
    bird.onload = function(){
        ctx.drawImage(bird,0,0,30,30 ,bird_x,bird_y, 50, 50);
    }
    bird.src = '../image/birds.png';

    var flag=1;//是否已经加过分数

    function render(){
        //每帧先检测是否和管道发生了碰撞
        check_collision_pipe (pipe_arr[0].x,pipe_arr[0].height,100,pipe_arr[0].height,bird_x,bird_y+50,ctx);
        check_collision_pipe (pipe_arr[0].x,800,100,800-pipe_interval-pipe_arr[0].height,bird_x,bird_y+50,ctx);
        //如果通过了最前面的管道，加分
        if (pipe_arr[0].x+100<bird_x&&flag){
            score+=1;
            flag=0;
        }
        //如果吃到了最前面的金币，额外加一分
        if(gold_arr[0]==1)
            score+= check_collision_gold (pipe_arr[0].x+30,pipe_arr[0].height+pipe_interval*2/3+30,30,30,bird_x,bird_y+50,gold_arr,ctx);
        //移动背景、最前面的管道和最前面的金币
        background_x-=(background_speed+wind_speed);
        canvas.style.backgroundPositionX = background_x + 'px';
        ctx.clearRect(pipe_arr[0].x,pipe_arr[0].yt,100,pipe_arr[0].height);
        ctx.clearRect(pipe_arr[0].x,pipe_arr[0].height+pipe_interval,100,800-pipe_interval-pipe_arr[0].height);
        if(gold_arr[0]==1)
            ctx.clearRect(pipe_arr[0].x+30,pipe_arr[0].height+pipe_interval*2/3,30,30);
        pipe_arr[0].x-=(background_speed+wind_speed);
        if (pipe_arr[0].x>=-100){
            ctx.drawImage(pipet, pipe_arr[0].x-(background_speed+wind_speed),pipe_arr[0].yt, 100, pipe_arr[0].height);
            ctx.drawImage(pipeb, pipe_arr[0].x-(background_speed+wind_speed),pipe_arr[0].height+pipe_interval, 100,
            800-pipe_interval-pipe_arr[0].height);
            if (gold_arr[0]==1)
                ctx.drawImage(gold, pipe_arr[0].x-(background_speed+wind_speed)+30,pipe_arr[0].height+pipe_interval*2/3, 30,
                30);
        }
        else{//如果最前面的管道已经到游戏范围之外，删除该管道，再生成一个新管道
            flag=1;
            pipe_arr.splice(0, 1);
            pipe_arr.push({x:pipe_x-1500,yt:0,height:myrandom(400,150,1)[0]});
            if(Math.random()<=0.5){
                gold_arr.splice(0, 1);
                gold_arr.push(1);
            }
            else{
                gold_arr.splice(0, 1);
                gold_arr.push(0);
            }
        }
        //移动剩下的管道和金币
        for (var i=1;i<pipe_num;i++){
            ctx.clearRect(pipe_arr[i].x,pipe_arr[i].yt,100,pipe_arr[i].height);
            ctx.clearRect(pipe_arr[i].x,pipe_arr[i].height+pipe_interval,100,800-pipe_interval-pipe_arr[i].height);
            ctx.clearRect(pipe_arr[i].x+30,pipe_arr[i].height+pipe_interval*2/3,30,30);
            pipe_arr[i].x-=(background_speed+wind_speed);
            ctx.drawImage(pipet, pipe_arr[i].x-(background_speed+wind_speed),pipe_arr[i].yt, 100, pipe_arr[i].height);
            ctx.drawImage(pipeb, pipe_arr[i].x-(background_speed+wind_speed),pipe_arr[i].height+pipe_interval, 100,
            800-pipe_interval-pipe_arr[i].height);
            if (gold_arr[i]==1)
                ctx.drawImage(gold, pipe_arr[i].x-(background_speed+wind_speed)+30,pipe_arr[i].height+pipe_interval*2/3, 30,
                30);
        }
        global_id=window.requestAnimationFrame(render);
    }
    global_id=window.requestAnimationFrame(render);

    //每100ms调用一次，鸟做自由落体运动下落
    window.birdDrop=setInterval (function () {
        var bird_offset;
        time+=0.1;
        bird_offset=bird_v*time+0.1*bird_g*time*time;
        bird_v+=time*bird_g;
        ctx.clearRect(bird_x,bird_y,50,50);
        bird_y+=bird_offset;
        check_bird_position(bird_x,bird_y,ctx);
        ctx.drawImage(bird,0,0,30,30 ,bird_x,bird_y, 50, 50);
    }, 100);

    //玩家每点击一次，鸟会振翅给自己一个bird_a的加速度向上飞。用防抖函数限制玩家鼠标点击的次数
    document.onclick=throttle(function(){
        var bird_offset;
        bird_offset=bird_v*time+0.1*(bird_g+bird_a)*time*time;
        ctx.clearRect(bird_x,bird_y,50,50);
        bird_y+=bird_offset/2;
        ctx.drawImage(bird,30,0,30,30 ,bird_x,bird_y, 50, 50);
        for (var i=0;i<3;++i)
            setTimeout(function(){
                ctx.clearRect(bird_x,bird_y,50,50);
                bird_y+=bird_offset/6;
                ctx.drawImage(bird,60,0,30,30 ,bird_x,bird_y, 50, 50);
            }, 50/3);
        check_bird_position(bird_x,bird_y,ctx);
        setTimeout(function(){
            ctx.clearRect(bird_x,bird_y,50,50);
            ctx.drawImage(bird,0,0,30,30 ,bird_x,bird_y, 50, 50);
        }, 50); 
        time=0;
        bird_v=0.1*bird_a;
    },850);

}

const start = (id) => {
    var canvas = document.getElementById(id);
    var ctx = canvas.getContext("2d");
    const str = 'Start!';
    const str2 = 'Click anywhere...';

    ctx.strokeStyle = 'white';
    ctx.font = '40px sans-serif';
    ctx.strokeText(str,1000,350);
    ctx.strokeText(str2,900,400);

    document.onclick=function(){
    ctx.clearRect(0,0,2000,800);
    draw(canvas,ctx);
    }
}

/*鸟是否飞到了游戏范围之外*/
const check_bird_position = (bird_x,bird_y,ctx) =>{
    if(bird_y<=0 || bird_y>800){
        ctx.clearRect(bird_x,bird_y,50,50);
        window.cancelAnimationFrame(global_id);
        clearInterval(window.birdDrop);
        end(ctx);  
    }
}

/*鸟是否和管道发生了碰撞 */
const check_collision_pipe = (pipe_x,pipe_y,pipe_w,pipe_h,bird_x,bird_y,ctx) =>{
    if(is_collision(pipe_x,pipe_y,pipe_w,pipe_h,bird_x,bird_y,50,50)){
        ctx.clearRect(bird_x,bird_y,50,50);
        window.cancelAnimationFrame(global_id);
        clearInterval(window.birdDrop);
        end(ctx);
    }
}

/*鸟是否和金币发生了碰撞 */
const check_collision_gold = (gold_x,gold_y,gold_w,gold_h,bird_x,bird_y,gold_arr,ctx) =>{
    if(is_collision(gold_x,gold_y,gold_w,gold_h,bird_x,bird_y,50,50)){
        ctx.clearRect(gold_x,gold_y-gold_h,gold_w,gold_h);
        gold_arr[0]=0;
        return 1;
    }
    return 0;
}

const end=(ctx)=>{
    ctx.clearRect(0,0,2000,800);
    var max_score = localStorage.getItem('maxScore');
    if (max_score==null){
        max_score=0;
    }
    if(score>max_score){
        max_score=score;
        ctx.strokeStyle = 'white';
        ctx.font = '40px sans-serif';
        ctx.strokeText('New record!',900,300);
        ctx.strokeText(String(max_score),1000,350);
    }
    else{
        ctx.strokeText('Score:'+String(score),950,300);
        ctx.strokeText('Max score:'+String(max_score),900,350);
    }
    ctx.strokeText('Click anywhere to restart...',800,400);
    localStorage.setItem('maxScore', max_score);
    setTimeout(function(){
        document.onclick=function(){
            location.reload();
        }
    }, 1000);
}