let fs=require("fs");
let request=require("request");
const cheerio=require("cheerio");
//node in built
let path=require("path");
//excel
let xlsx=require("xlsx");
function scrapAll(url){
    request(url,cb);
}
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
function processMatch(html){
    let $=cheerio.load(html);
    // let description=$($(".description")[6]);
    // console.log(description.text());
    let bothinnings=$('.card.content-block.match-scorecard-table .Collapsible');
    for(let i=0;i<bothinnings.length;i++){
        let teamNameEle=$(bothinnings[i]).find(".section-header.border-bottom.text-danger.cursor-pointer");
        let teamName=teamNameEle.text();
        let Name=teamName.split()[0];
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
                // console.log(batsman+"  "+run+"  "+ball+"  "+four+"  "+six+"  "+sr);
                processPlayer(Name,batsman,run,ball,four,six,sr);

            }
        }
            console.log("================================================");
    }
}
function excelReader(filePath,name){
    if(!fs.existsSync(filePath)){
        return null;
    }
    //workbook => excel
    let wt=xlsx.readFile(filePath);
    let excelData=wt.Sheets[name];
    //convert excel formet to json =>array of obj
    let ans=xlsx.utils.sheet_to_json(excelData);
    console.log(ans);
    return ans;

}
function excelWriter(filePath,json,name){
    var newWB=xlsx.utils.book_new();
    var newWS=xlsx.utils.json_to_sheet(json);
    xlsx.utils.book_append_sheet(newWB,newWS,name);
    xlsx.writeFile(newWB,filePath);

}
//add data to file system
function processPlayer(team,name,runs,balls,fours,sixes,sr){
    //directory exist
    let obj={
        runs,balls,fours,sixes,sr,team
    };
    let teamPath=team;
    //check if dir team name exist
    if(!fs.existsSync(teamPath)){
        fs.mkdirSync(teamPath);
    }
    //team  /RSharam.xlsx
    let playerFile=path.join(teamPath,name)+'.xlsx';
    //excel read
    let fileData=excelReader(playerFile,name);
    let json=fileData;
    if(fileData==null){
        json=[];
    }
    json.push(obj);
    //excel write
    excelWriter(playerFile,json,name);
}
module.exports.scrapAll=scrapAll
