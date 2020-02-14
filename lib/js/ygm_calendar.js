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
    var dateList  = getMonth(option);
    var monthTxt = String(getDate(option)).split("-")[1]; 
    var toolbar = ``;
    var table = ``;
    var s = dateList[0].getDay(); // 첫째주 공백
    var length = dateList.length-1; 
    var end = 6 - (dateList[length].getDay()); // 마지막주 공백
    var endIdx  = s + end + length; // 그 달 총 td 갯수 (공백포함)

    toolbar += `<div class='ygm-c-toolbar'><h2 class=''>${monthTxt}월</h2></div>`;
    table += `  <table class='ygm-c-content'>
                    <thead class='ygm-c-head'>
                        <tr><td>일</td><td>월</td><td>화</td><td>수</td><td>목</td><td>금</td><td>토</td></tr>
                    </thead>
                    <tbody class='ygm-c-body'>
    `;
    // tr td 반복문 
    for(var i = 0; i <= endIdx; i++) {
        var calcIdx = i - s; // i 를 첫째주 공백만큼 - 한 변수
        // i 가 0 이거나 7의 배수(주 시작점)인 경우
        if (i == 0 || i % 7 == 0) {
            // dateList[calcIdx] 가 비어있지않으면 tr열고 데이터 뿌려주고 아니면 tr열고 빈td
            table += dateList[calcIdx] ? `<tr><td>${dateList[calcIdx].getDate()}</td>` : `<tr><td></td>`;
        // i 가 0이 아니고 7의배수가 아닌 경우 
    } else {
            // dateList[calcIdx] 가 비어있지않으면 데이터 뿌려주고 아니면 빈 td
            table += dateList[calcIdx] ? `<td>${dateList[calcIdx].getDate()}</td>` : `<td></td>`;
        }
        // 6의 배수 (마지막td그려지고 난후) 고 0이 아닌경우 
        if (i % 7 == 6 && i != 0) {
            // tr 닫음
            table += `</tr>`;
        }
    }
    table += `</tbody></table>`;

    $("#ygm-calendar").append("<div class='ygm-calendar-wrapper'></div>"); // html 마크업된 id에 'ygm-calendar-wrapper 추가
    $(".ygm-calendar-wrapper").append("<div class='ygm-calendar-wrap'></div>");
    $(".ygm-calendar-wrap").append(toolbar);
    $(".ygm-calendar-wrap").append("<div class='ygm-c-view-container'><div>");
    $(".ygm-c-view-container").append("<div class='ygm-c-view-box'><div>");
    $(".ygm-c-view-box").append(table);

}

/**
 * 일자 목록을 가져오는 함수
 * 받은일자 기준으로 
 * type : D > 일
 *      : W > 주
 *      : M > 월
 *      : Y > 년
 */

// 해당 일
function getDate (date){
    var dateArr  = [];
    dateList = date.format("yyyy-MM-dd");
    dateArr.push(dateList);
    return dateArr;
}

 //해당 일이 함 된 주 조회 함수
function getWeek (date) {
    var weekArr  = [];
    var y = date.getFullYear();
    var m = date.getMonth();
    var d = date.getDate(); 
    var day = date.getDay();
    var weekD = d - day;
    for (var i = 0; i < 7; i++) {
        var wDate = new Date(y,m,weekD+i)
        dateList = wDate.format("yyyy-MM-dd");
        weekArr.push(dateList);
    }
    return weekArr;
 }

 //해당 일이 함 된 월 조회 함수
function getMonth (date) {
    var monthArr  = [];
    var y = date.getFullYear();
    var m = date.getMonth();
    var monthLastDay =  new Date(y,m+1,0).format("dd");  
    for (var i = 1; i <= monthLastDay; i++) { 
        var mDate = new Date(y,m,i)
        dateList = mDate;
        monthArr.push(dateList);
    }
    return monthArr;
}

//해당 일이 포함된 연도 조회 함수
function getYear (date) {
    var yearArr  = [];
    var y = date.getFullYear();
    for (var i = 0; i < 12; i++) {
        var monthLastDay =  new Date(y,i+1,0).format("dd");  
        for (var j = 1; j <= monthLastDay; j++) { 
            var mDate = new Date(y,i,j);
            dateList = mDate.format("yyyy-MM-dd");
            yearArr.push(dateList);
        }
    }
    return yearArr;
}