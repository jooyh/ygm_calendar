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
Date.prototype.secOfDay = 86400000;

class ygmCalendar{
    /**
     * @name 캘린더
     * @param {Object} option 
     * @description 캘린더 js
     */
    constructor(option){
        this.el = document.getElementById(option.elId);
        this.type = "M";
        this.date = new Date().format("yyyy-MM-dd");;
        this.selectAble = true;
        this.isShift = false;

        this.weekNameShort = ["일", "월", "화", "수", "목", "금", "토"];

        if(option.type) this.type = option.type;
        if(option.date) this.date = option.date;
        if(option.frDate) this.frDate = option.frDate;
        if(option.toDate) this.toDate = option.toDate;
        if(option.dateClick) this.dateClick = option.dateClick;
        if(option.selectAble === false) this.selectAble = false;
        this.initCalenar();
        return this;
    }

    /**
     * @name setDate
     * @param {String} dateStr
     */
    setDate = function(dateStr){
        this.date = dateStr;
        this.initCalenar();
    }

    getSelectedDate = function(){
        var cels = this.el.getElementsByClassName("cel");
        var selected = [];
        for(var i=0; i<cels.length; i++){
            if(cels[i].classList.contains("select-date")){
                selected.push(cels[i]);
            }
        }
        return selected;
    }

    /**
     * @name initCalenar
     * @description 캘린더 초기화 함수
     */
    initCalenar = function(){
        var dateList;
        var date = this.date;
        var type = this.type;
        var el = this.el;
        
        var frDate = this.frDate;
        var toDate = this.toDate;
        if(frDate && toDate && !date && type == "T"){
            dateList = this.getTerm(frDate,toDate);
        }else if(type == "D"){
            dateList = this.getDate(date);
        }else if(type == "W"){
            dateList = this.getWeek(date);
        }else if(type == "M"){
            dateList = this.getMonth(date);
            this.setCalendarElForMonth(date,dateList,el);
        }else if(type == "Y"){
            dateList = this.getYear(date);
        }
    }

    /**
     * @param {Date} date 
     * @param {Array<Date>} dateList 
     * @param {Element} el
     * @description 캘린더 요소 생성 함수
     */
    setCalendarElForMonth(date,dateList,el){
        el.innerHTML = "";
        var startDate = dateList[0]; //시작일의일자
        var endDate = dateList[dateList.length-1] //마지막일자
        var stDay = startDate.getDay();
        var endDay = endDate.getDay();
        var endDiff = 6-endDay;
        var endIdx = endDate.getDate()+endDiff+stDay;
        var weekCnt = 0;

        //컨테이너 생성
        var container = document.createElement("div");
        container.setAttribute("class","ygm-cal-container");
        el.appendChild(container); 

        //타이틀 생성
        var title = document.createElement("div");
        title.setAttribute("class","ygm-cal-title");
        var txt = document.createTextNode(date);
        title.appendChild(txt);
        container.appendChild(title);

        //table 생성
        var table = document.createElement("table");
        table.setAttribute("class","ygm-cal-tbl");
        container.appendChild(table);

        //요알 셋팅
        var days = document.createElement("tr");
        for(var i=0; i<7; i++){
            var cel = document.createElement("td");
            var txt = document.createTextNode(this.weekNameShort[i]);
            cel.classList.add("cel" , "day-nm");
            cel.appendChild(txt);
            days.appendChild(cel);
        }
        table.appendChild(days);     

        for(var i=0; i<endIdx; i++){
            if(i%7 == 0 || i==0){
                weekCnt++;
                var table = document.getElementsByClassName("ygm-cal-tbl")[0];
                var tr = document.createElement("tr");
                tr.setAttribute("id","week"+weekCnt);
                table.appendChild(tr); 
            }
            var tr = document.getElementById("week"+weekCnt);
            var cel = document.createElement("td");
            cel.setAttribute("class","cel");
            cel.setAttribute("cel-idx",i);
            cel.setAttribute("week-cnt",weekCnt);
            cel.setAttribute("day",i%7);
            cel.setAttribute("date",i%7);

            var realIdx = i-stDay;
            if(dateList[realIdx]){
                var txt = document.createTextNode(dateList[realIdx].getDate());
                cel.setAttribute("date",dateList[realIdx].format("yyyy-MM-dd"));
                cel.addEventListener("click",this.celClick.bind(this));
                if(dateList[realIdx].getDay() == 0){
                    cel.classList.add("sun-color");
                }else if(dateList[realIdx].getDay() == 6){
                    cel.classList.add("sat-color");
                }
                cel.appendChild(txt);
            }
            tr.appendChild(cel);
        }   
    }

    /**
     * @name getDate
     * @param {String} dateStr
     * @returns {Array<Date>} dateList
     * @description 일자조회
     */
    getDate = function(dateStr){
        return [new Date(dateStr)];
    }

    /**
     * @name getWeek
     * @param {String} dateStr
     * @returns {Array<Date>} dateList
     * @description 주 조회
     */
    getWeek = function(dateStr) {
        var trgDate = new Date(dateStr);
        var dateList = [];

        var startDate = trgDate.getDate()-trgDate.getDay()-1;
        // var weekStartDate = new Date(trgDate.getFullYear(),trgDate.getMonth(),startDate);
        // console.log(weekStartDate.format("yyyy-MM-dd"));
        console.log(startDate);
        for(var i=0; i<7; i++){
        //     // var date = weekStartDate.getDate()+i
            var rtnDate = new Date(trgDate.getFullYear(),trgDate.getMonth(),startDate+i);
            console.log(rtnDate.format("yyyy-MM-dd"));
            dateList.push(rtnDate); 
        }
        return dateList;
    }

    /**
     * @name getMonth
     * @param {String} dateStr
     * @returns {Array<Date>} dateList
     * @description 월 조회
     */
    getMonth = function(dateStr){
        var trgDate = new Date(dateStr);
        var dateList = [];
        var tempDate = new Date(trgDate.getFullYear(),trgDate.getMonth()+1,0);
        for(var i=1; i<=tempDate.getDate(); i++){
            var rtnDate = new Date(trgDate.getFullYear(),trgDate.getMonth(),i);
            dateList.push(rtnDate);
        }
        return dateList;
    }

    /**
     * @name getYear
     * @param {String} dateStr
     * @returns {Array<Date>} dateList
     * @description 연 조회
     */
    getYear = function(dateStr) {
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

    /**
     * @name getTerm
     * @param {String} frDateStr
     * @param {String} toDateStr
     * @returns {Array<Date>} dateList
     * @description 기간조회
     */
    getTerm = function(frDateStr,toDateStr){
        var frDate = new Date(frDateStr);
        var toDate = new Date(toDateStr);
        var diffDate = (toDate-frDate) / new Date().secOfDay;
        var dateList = [];
        for(var i=0; i<=diffDate; i++){
            var rtnDate = new Date(frDate.getFullYear(),frDate.getMonth(),frDate.getDate()+i);
            dateList.push(rtnDate);
        }
        return dateList;
    }

    /**
     * @name celClick
     * @param {Event} e
     * @description 일자클릭이벤트
     */
    celClick = function(e){
        if(this.dateClick){
            this.dateClick(e.target);
        }
        if(this.selectAble){
            if(e.target.classList.contains("select-date")){
                e.target.classList.remove("select-date")
            }else{
                e.target.classList.add("select-date")
            }
        }
    }

    addEvent = function(title,desc,time){
        var cels = this.getSelectedDate();
        for(var i=0; i<cels.length; i++){
            var celDate = cels[i].getAttribute("date");

            var evntWrap = document.createElement("div");
            evntWrap.classList.add("ygm-evnt-wrap");
            evntWrap.setAttribute("data-ygm-evnt",JSON.stringify({title,desc,time}));
            cels[i].appendChild(evntWrap);
            cels[i].classList.remove("select-date")
        }
    }

    setEvent = function(evnt){
        var cels = this.el.getElementsByClassName("cel");
        for(var i=0; i<cels.length; i++){
            if(evnt.date == cels[i].getAttribute("date")){
                cels[i].classList.add("select-date");
                this.addEvent(evnt.title,evnt.desc,evnt.time);
            }
        }
    }

    getAllEventByDate = function(){
        var cels = this.el.getElementsByClassName("cel");
        var dateList = [];
        for(var i=0; i<cels.length; i++){
            var evnts = cels[i].getElementsByClassName("ygm-evnt-wrap");
            if(evnts.length){
                var dateObj = {date : cels[i].getAttribute("date")};
                var evntArr = [];
                for(var j=0; j<evnts.length; j++){
                    var evntObj = JSON.parse(evnts[j].getAttribute("data-ygm-evnt"));
                    evntArr.push(evntObj);
                }          
                dateObj.evntArr = evntArr;
                dateList.push(dateObj);
            }
        };
        return dateList;
    }

    getAllEvent = function(){
        var cels = this.el.getElementsByClassName("cel");
        var eventList = [];
        for(var i=0; i<cels.length; i++){
            var evnts = cels[i].getElementsByClassName("ygm-evnt-wrap");
            if(evnts.length){
                for(var j=0; j<evnts.length; j++){
                    var evntObj = JSON.parse(evnts[j].getAttribute("data-ygm-evnt"));
                    evntObj.date = cels[i].getAttribute("date");
                    eventList.push(evntObj);
                }
            }
        };
        return eventList;
    }

}