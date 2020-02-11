Date.prototype.format = function(f) {
    if (!this.valueOf()) return " ";

    var weekName = ["일요일", "월요일", "화요일", "수요일", "목요일", "금요일", "토요일"];
    var weekNameShort = ["일", "월", "화", "수", "목", "금", "토"];
    var weekNameEng = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"];
    var d = this;

    return f.replace(/(yyyy|yy|MM|dd|EE|E|e|hh|mm|ss|mi|a\/p)/gi, function($1) {
        switch ($1) {
            case "yyyy": return d.getFullYear();
            case "yy": return (d.getFullYear() % 1000).zf(2);
            case "MM": return (d.getMonth() + 1).zf(2);
            case "dd": return d.getDate().zf(2);
            case "E": return weekNameShort[d.getDay()];
            case "EE": return weekName[d.getDay()];
            case "e": return weekNameEng[d.getDay()];
            case "HH": return d.getHours().zf(2);
            case "hh": return ((h = d.getHours() % 12) ? h : 12).zf(2);
            case "mm": return d.getMinutes().zf(2);
            case "ss": return d.getSeconds().zf(2);
            case "mi": return d.getMilliseconds().zf(3);
            case "a/p": return d.getHours() < 12 ? "오전" : "오후";
            default: return $1;
        }
    });
};

String.prototype.string = function(len){var s = '', i = 0; while (i++ < len) { s += this; } return s;};
String.prototype.zf = function(len){return "0".string(len - this.length) + this;};
Number.prototype.zf = function(len){return this.toString().zf(len);};

/**
 * 달력 초기화 함수
 * 입력받은 일자 목록을 달력으로 만들어준다.
 */
function initCalenar(option){
    var el = document.getElementById(option.elId);
    var type = "M";
    var date = new Date().format("yyyy-MM-dd");
    if(option.type) type = option.type;
    if(option.date) date = option.date;

    var dateList;

    if(type == "D"){
        dateList = getDate(date);
    }else if(type == "W"){
        dateList = getWeek(date);
    }else if(type == "M"){
        dateList = getMonth(date);
        setCalendarElForMonth(el,type,dateList);
    }else if(type == "Y"){
        dateList = getYear(date);
    }
    
}

function setCalendarElForMonth(el,type,dateList){
    
    var startDate = dateList[0]; //시작일의일자
    var endDate = dateList[dateList.length-1] //마지막일자
    var stDay = startDate.getDay();
    var endDay = endDate.getDay();
    var endDiff = 6-endDay;
    var endIdx = endDate.getDate()+endDiff+stDay;
    var weekCnt = 0;

    var ul = document.createElement("ul");
    ul.setAttribute("id","cal");
    el.appendChild(ul);
    for(var i=0; i<endIdx; i++){
        if(i%7 == 0 || i==0){
            weekCnt++;
            var ul = document.getElementById("cal");
            var li = document.createElement("li");
            li.setAttribute("id","week"+weekCnt);
            ul.appendChild(li);     
        }
        var li = document.getElementById("week"+weekCnt);
        var cel = document.createElement("div");
        cel.setAttribute("class","cel");
        cel.setAttribute("cel-idx",i);
        cel.setAttribute("week-cnt",weekCnt);
        cel.setAttribute("day",i%7);

        if(stDay <= i && i < endDate.getDate() ){
            var realIdx = i-stDay;
            var txt = document.createTextNode(dateList[realIdx].format("dd일"));
            cel.appendChild(txt);
        }
        li.appendChild(cel);
    }

    

    // return ul;
}

//일자 조회함수
function getDate(dateStr){
    return [new Date(dateStr)];
}

//주 조회 함수
function getWeek(dateStr){
    var trgDate = new Date(dateStr);
    var dateList = [];

    var startDate = trgDate.getDate()-trgDate.getDay();
    var weekStartDate = new Date(trgDate.getFullYear(),trgDate.getMonth(),startDate);

    for(var i=0; i<7; i++){
        var date = weekStartDate.getDate()+i
        rtnDate = new Date(weekStartDate.getFullYear(),weekStartDate.getMonth(),date);
        console.log(rtnDate.format("yyyy-MM-dd"));
        dateList.push(rtnDate);
    }
    return dateList;
}

//월 조회 함수
function getMonth(dateStr){
    var trgDate = new Date(dateStr);
    var dateList = [];
    var tempDate = new Date(trgDate.getFullYear(),trgDate.getMonth()+1,0);
    for(var i=1; i<=tempDate.getDate(); i++){
        var rtnDate = new Date(trgDate.getFullYear(),trgDate.getMonth(),i);
        dateList.push(rtnDate);
    }
    return dateList;
}

//연도 조회 함수
function getYear(dateStr){
    var trgDate = new Date(dateStr);
    var dateList = [];
    for(var i=1; i<=12; i++){
        var tempDate = new Date(trgDate.getFullYear(),i,0);
        for(var j=1; j<=tempDate.getDate(); j++){
            var rtnDate = new Date(trgDate.getFullYear(),i-1,j);
            dateList.push(rtnDate);
        }
    }
    return dateList;
}