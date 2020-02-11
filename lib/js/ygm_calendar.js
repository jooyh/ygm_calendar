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

}

/**
 * 일자 목록을 가져오는 함수
 * 받은일자 기준으로 
 * type : D > 일
 *      : W > 주
 *      : M > 월
 *      : Y > 년
 */

function getDate (date){
    var dateArr  = [];
    dateList = date.format("yyyy-MM-dd");
    dateArr.push(dateList);
    // console.log('dateArr: ', dateArr);
    return dateArr;
}

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
    // console.log('weekArr: ', weekArr);
    return weekArr;
 }

function getMonth (date) {
    var monthArr  = [];
    var y = date.getFullYear();
    var m = date.getMonth();
    var monthLastDay =  new Date(y,m+1,0).format("dd");  /// 왜 여기서는 +1를 해야할까 .... 
    for (var i = 1; i <= monthLastDay; i++) { // 요기도
        var mDate = new Date(y,m,i);
        dateList = mDate;
        monthArr.push(dateList);
    }
    // console.log('monthArr: ', monthArr);
    return monthArr;
}

function getYear (date) {
    var yearArr  = [];
    var y = date.getFullYear();
    for (var i = 0; i < 12; i++) {
        var monthLastDay =  new Date(y,i+1,0).format("dd");  /// 왜 여기서는 +1를 해야할까 .... 
        for (var j = 1; j <= monthLastDay; j++) { // 요기도
            var mDate = new Date(y,i,j);
            dateList = mDate.format("yyyy-MM-dd");
            yearArr.push(dateList);
        }
    }
    // console.log('yearArr: ', yearArr);
    return yearArr;
}