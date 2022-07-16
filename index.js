const http=require("http");
const fs=require("fs");
const requests=require("requests");

const homePage=fs.readFileSync("home.html","utf-8");

const replaceVal =(tempVal,orgVal)=>{
    
    let val=tempVal.replace("{%tempval%}",orgVal.main.temp);
    val=val.replace("{%tempmin%}",orgVal.main.temp_min);
    val=val.replace("{%tempmax%}",orgVal.main.temp_max);
    val=val.replace("{%location%}",orgVal.name);
    val=val.replace("{%country%}",orgVal.sys.country);
    val=val.replace("{%tempstatus%}",orgVal.weather[0].main);
    return val;
};

const server =http.createServer((req,res)=> {
    if(req.url == "/"){
     requests(
        "https://api.openweathermap.org/data/2.5/weather?q=Gorakhpur&units=metric&appid=825e537b5be11a4fa63676ed01cc715e"
        )
      .on("data", (chunk) => {
        const obj=[JSON.parse(chunk)];
        const realTimeData = obj.map((val) => replaceVal(homePage,val)).join("");
        res.write(realTimeData);

      })

     .on("end",(err) => {
        if(err) return console.log("connection closed due to errors",err);
        res.end();
      });
    } else{res.end("file not found");}
});

server.listen(8000,"127.0.0.1");
