/*
* 工具函数代码
*/
/*ubound-随机数上界，lbound-随机数下界，count-需要的随机数个数 */
const myrandom = (ubound,lbound,count) => {
    var random = new Array();
    for(var i=0;i<count;++i){
        random[i]=Math.floor(Math.random()*ubound);
        if(random[i]+lbound<=ubound)
            random[i]+=lbound;
    }
    return random;
}

/*防抖函数 fn-回调函数,threshold-两次调用最小间隔的时间 */
function throttle(fn, threshold){
    let lastCallTime;
     let isInvoked = false;
     return function throttled(...args) {
       const thisCallTime = Date.now();
       if(!isInvoked) {
         fn.apply(this, args);
         lastCallTime = Date.now();
         isInvoked = true;
       }
       if(thisCallTime - lastCallTime >= threshold) {
         fn.apply(this, args);
         lastCallTime = Date.now();
       }
     }
   }

/*碰撞检测函数，输入第一个物体左下角坐标、宽、高和第二个物体左下角坐标、宽、高 */
function is_collision(x1,y1,w1,h1,x2,y2,w2,h2){
    if(x1<(x2+w2)&&(x1+w1)>x2&&y1>(y2-h2)&&(y1-h1)<y2)
        return true;
    else
        return false;
}