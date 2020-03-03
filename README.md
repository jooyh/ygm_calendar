# ygm_calendar
## calendar js


``` javascript
//Example...
let calendar = new Calendar({
   dateStr = "2020-05-20" // 기준일
  ,type = "M" // 달력 타입 (M : 월 달력 , W : 주 달력)
  ,selectAble = true // 달력 선택 가능 여부
  ,eventAble = true // 달력 이벤트 추가 가능여부
});

/*FUNCTIONS...*/
//선택한 일자 모두 가져오기 return type Date
calendar.getSelectedDate();
//이벤트 등록 return type void
calendar.setEvent({date:"2019-05-20" , desc:"생일"});
//모든 이벤트 조회 return type Array<Date>
calendar.getAllEvent();
//지정 일자 이벤트 조회 return type eventObject
calendar.getEvent("2019-05-20");

/*EVENTS*/
//일자를 선택 할 때 콜백
calendar.onSelected(function(date){
  console.log(date)
});
//일자를 선택 해제 할 때 콜백
calendar.onUnselected(function(date){
  console.log(date)
});
```
