//requeust => to all match page
//loop command=>url pass
// let fs=require("fs");
let request=require("request");
let cheerio=require("cheerio")
//import match file
let match=require("./match");
let url='https://www.espncricinfo.com/ci/engine/match/index/series.html?series=12357';
request(url,cb);
function cb(err,header,body){
    if(err==null && header.statusCode==200){
        processMatch(body);
    }
    else if(header.statusCode==404){
        console.log("404 wrong url")
    }else{
        console.log(err);
        console.log(header.statusCode)
    }
}
//cheerio to parse 
//give command to match.js
function processMatch(html){
    let ch=cheerio.load(html);
    let allMatch=ch(".match-articles");
    for(let i=0;i<allMatch.length;i++){
        let scorecard=ch(allMatch[i]);
        let url=ch(ch(scorecard).find("a")[0]).attr("href");
        // console.log(i+" "+url);
        match.scrapAll(url);
    }
    // console.log(allMatch.length);
}
