var started = new Date().getTime();

var count = 0;


function timedCount() {
    count = count += 1;
    postMessage({current: new Date().getTime(), started: started});
    setTimeout("timedCount()",1000);
}
timedCount();

