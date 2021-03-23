let fs=require("fs");
let request=require("request");
const cheerio=require("cheerio")
let url='https://www.espncricinfo.com/series/england-tour-of-india-2020-21-1243364/india-vs-england-5th-t20i-1243392/full-scorecard';
request(url,cb);
function cb(err,header,body){
    if(err==null && header.statusCode==200){
        // console.log(body);
        fs.writeFileSync("file.html",body);
        processMatch(body);
    }
    else if(header.statusCode==404){
        console.log("404 wrong url")
    }else{
        console.log(err);
        console.log(header.statusCode)
    }
}
function processMatch(html){
    let $=cheerio.load(html);
    let bothinnings=$('.card.content-block.match-scorecard-table .Collapsible');
    for(let i=0;i<bothinnings.length;i++){
        let teamNameEle=$(bothinnings[i]).find(".section-header.border-bottom.text-danger.cursor-pointer");
        let teamName=teamNameEle.text();
        let Name=teamName.split("innings")[0].trim();
        console.log(Name);

        //batsman
        let teamTable=$(bothinnings[i]).find(".table.batsman tbody tr");
        for(let j=0;j<teamTable.length;j++){
            let valid=$($(teamTable[j]).find("td")[0]).hasClass("batsman-cell");
            if(valid){
                let batsman=$($(teamTable[j]).find("td")[0]).text();
                let run=$($(teamTable[j]).find("td")[2]).text();
                let ball=$($(teamTable[j]).find("td")[3]).text();
                let four=$($(teamTable[j]).find("td")[5]).text();
                let six=$($(teamTable[j]).find("td")[6]).text();
                let sr=$($(teamTable[j]).find("td")[7]).text();
                console.log(batsman+"  "+run+"  "+ball+"  "+four+"  "+six+"  "+sr);

            }
        }
            console.log("-----------------------");
    }
    // console.log(bothinnings.text());
    // let dt=detailsElement.text();
    fs.writeFileSync("score.html",bothinnings);
    // console.log(dt);
    //extract
    // let $ = cheerio.load('<h2 class="title">Hello world</h2>');
    // let dt=$('h2.title');
    // fs.writeFileSync("text.html",dt);
}
function processPlayer(details){

}