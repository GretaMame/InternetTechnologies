var article;
var workdayCheck=false;
var weekendCheck=false;
var txtFldCheck = false;
var intFldCheck = false;
var pattern = /^([0-9]|0[0-9]|1[0-9]|2[0-3]):[0-5][0-9]$/;
var table = $("#timetable");
var hideFormTxt = "Išsaugoti";
var showFormTxt = "Pridėti naują maršrutą";
var weekendFld = $("#weekendTimeInput");
var workdayFld = $("#workDaysTimeInput");
var dateFld = $("#dateInput");
var intFld = $("#gateInput");
var txtFld = $("#routeInput");

$(document).ready(function() {
	txtFld.oninput = validateTextInput;
	intFld.oninput = validatePositiveIntegerInput;
	dateFld.oninput = validateDateInput;
	$("#displayBtn").html(showFormTxt);
	$("#timetableForm").hide();
	disableSubmit();
	$("#editArticleSection").hide();
	$(".editRow").hide();
});

var tableRow;
var data;
var rowUri;
var rowObj;

$("#submitBtn").click(function () {
	tableRow = {
		"gate": $("#gateInput").val(),
		"route": $("#routeInput").val(),
		"workdaysTime" : $("#workDaysTimeInput").val(),
		"weekendTime" : $("#weekendDaysTimeInput").val()
		
	};
	data = JSON.stringify(tableRow)
    $.ajax({
        url: "https://api.myjson.com/bins",
        type: "POST",
        data: data,
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function (data, textStatus, jqXHR) {
            var json = JSON.stringify(data);
			rowUri = data;
			console.log(rowUri);
			loadRow(rowUri)
        }
    });
	$(".editRow").hide();
	hideTimetableForm();
});

function loadRow(uri){
		$.get(rowUri.uri, function (data, textStatus, jqXHR) {
                var json = JSON.stringify(data);
                console.log(json);
				rowObj = data;
				console.log(rowObj.gate);
				addTableRow(rowObj.gate, rowObj.route, rowObj.workdaysTime, rowObj.weekendTime)
            });
}

function printUriArray(){
	for(var i =0; i< rowsUriArray.length; i++){
		console.log(rowsUriArray[i]);
	}
}

function changeTitleColor(color){
	var colorStr = "color:"+color+";";
	$("h2").first().attr("style", colorStr);
}

function hideTimetableForm(){
	$("#timetableForm").hide();
	$("#displayBtn").show();
	$(".editRow").hide();
}

function hideEditArticleSection(){
	$("#editArticleSection").hide();
	$(".editBtn").prop("disabled", false);
	$(".deleteBtn").prop("disabled", false);
}

function deleteArticle(node){
	$(node).parent().remove();
	hideEditArticleSection();
}

function editArticle(node){
	article = $(node).parent();
	$("#editArticleSection").show();
	console.log(node);
	console.log($(node).parent());
	console.log($(node).prev().prev().text());
	$("#newsTitle").val($(node).prev().prev().prev().text()); //set title
	var dateSpan = $(node).parent().children().eq(1).children().first();
	console.log($(dateSpan).text());
	$("#dateInput").val($(dateSpan).text()); //set date
	console.log($(node).prev().text());
	$("#newsTxtArea").val($(node).prev().text()); //set txt area
	//sufokusuojam pavadinima
	$("#newsTitle").focus();
	console.log($(".editBtn"));
	$(".editBtn").prop("disabled", true);
	$(".deleteBtn").prop("disabled", true);
} 

function saveNewsArticleChanges(){
	console.log($(article).children().first().text());
	console.log($(article).children().eq(1).text());
	console.log($(article).children().eq(2).text());
	$(article).children().first().text($("#newsTitle").val());
	$(article).children().eq(1).children().first().text($("#dateInput").val());
	$(article).children().eq(2).text($("#newsTxtArea").val());
	$("#editArticleSection").hide();
	$(".editBtn").prop("disabled", false);
	$(".deleteBtn").prop("disabled", false);
}

function addTableRow(gate, route, workdayT, weekendT){
	var gateStr = "<td>" + gate +"</td>";
	console.log(gateStr);
	var routeStr = "<td>" + route +"</td>";
	console.log(routeStr);
	var wdTimeStr = "<td>" + workdayT +"</td>";
	console.log(wdTimeStr);
	var wkndTimeStr = "<td>" + weekendT +"</td>";
	console.log(wkndTimeStr);
	var tr = "<tr>"+gateStr+routeStr+wdTimeStr+wkndTimeStr+"</tr>";
	console.log(tr);
	$(tr).insertBefore(".editRow");
	clearFieldValues();
}

function clearFieldValues(){
	$("#gateInput").val("");
	$("#routeInput").val("");
	$("#workDaysTimeInput").val("");
	$("#weekendDaysTimeInput").val("");
	$("#gateInput").attr("style", "background-color:none");
	$("#routeInput").attr("style", "background-color:none");
	$("#workDaysTimeInput").attr("style", "background-color:none");	
	$("#weekendDaysTimeInput").attr("style", "background-color:none");
	
}

function displayButtonControl(){
	$("form").show();
	$(".editRow").show();
	$("#displayBtn").hide();
	$("#gateInput").focus();
}

function validateWorkday(fld){
	var value = $(fld).val();
	console.log("Time input: " + value);
	if(validateTimeStr(value)){
		workdayCheck = true;
		console.log("Time valid: "+ value);
		validateNewRouteForm();
		console.log($(fld));
		$(fld).attr("style", "background-color : green");
	}
	else {
		workdayCheck = false;
		console.log("Time invalid: "+ value);
		console.log($(fld));
		$(fld).attr("style", "background-color : salmon");
	}
}

function validateWeekend(fld){
	var value = $(fld).val();
	console.log("Time input: " + value);
	if(validateTimeStr(value)){
		weekendCheck = true;
		console.log("Time valid: "+ value);
		validateNewRouteForm();
		console.log($(fld));
		$(fld).attr("style", "background-color : green");
	}
	else {
		weekendCheck = false;
		console.log("Time invalid: "+ value);
		console.log($(fld));
		$(fld).attr("style", "background-color : salmon");
	}
}

function validateTimeStr(str){
	var array = str.split(" ");
	var returnValue = false;
	for(var i = 0; i < array.length; i++){
		returnValue = pattern.test(array[i]);
	}
	return returnValue;
}

function validateNewRouteForm(){
	console.log("Txt: "+txtFldCheck+" Int: "+intFldCheck + " Workday:" + workdayCheck + " Weekend: "+ weekendCheck );
	if (txtFldCheck && intFldCheck && workdayCheck && weekendCheck) enableSubmit();
	else disableSubmit();
}

function validateTextInput(fld){
	var value = $(fld).val();
	console.log(value);
	if (isNotBlankText(value)){
		txtFldCheck = true;
		console.log("Text valid: "+ value);
		validateNewRouteForm();
		console.log($(fld));
		$(fld).attr("style", "background-color : green");
	}
	else {
		txtFldCheck = false;
		console.log("Text invalid: "+ value);
		console.log($(fld));
		$(fld).attr("style", "background-color : salmon");
	}
}

function validatePositiveIntegerInput(fld){
	var value = $(fld).val();
	console.log($(fld));
	console.log(value);
	if (isPositiveInteger(value)){
		console.log("Integer valid: "+ value);
		intFldCheck = true;
		validateNewRouteForm();
		console.log($(fld));
		$(fld).attr("style", "background-color : green");
	}
	else {
		console.log("Integer invalid: "+ value);
		intFldCheck = false;
		console.log($(fld));
		$(fld).attr("style", "background-color : salmon");
	}
}

function validateDateInput(value){
	console.log(value.toString());
	array = value.toString().split(/-|\//);
	if (array.length == 3){
		if (isValidDate(array[0], array[1], array[2])){
			console.log("Date valid: "+ value);
			$("#editNewsArticle").prop("disabled", false);
		} 
		else {
			$("#editNewsArticle").prop("disabled", true);
			console.log("Date invalid: "+ value);
		}
	}
	else {
	$("#editNewsArticle").prop("disabled", true);
	console.log("Date invalid: "+ value);
	}
}

function isNotBlankText(value){
	if ( !(value.toString().replace(/^\s+/g, '').length)) return false;
	else return true;
}

function isPositiveInteger(value) {
	if (!isInteger(value) || value <= 0) return false;
	else return true;
}

function isInteger(value){
	return (!isNaN(value)) && (value%1 === 0)
}

function isValidDate(yearStr, monthStr, dayStr){
    if (yearStr != parseInt(yearStr)) {
        return false;
    }
    if (monthStr != parseInt(monthStr)) {
        return false;
    }
	if (dayStr != parseInt(dayStr)) {
        return false;
    }

    year = parseInt(yearStr);
    month = parseInt(monthStr)-1; // Sausis - 0
    day = parseInt(dayStr);
    if (month < 0 || month > 11) {
        return false;
    }
	if (day < 1 || day > 31) {
        return false;
    }
	if (year < 1800 || year > 2500) {
        return false;
    }
    var date = new Date(year, month, day);
    if (date.getDate() != day) {
        alert("Neteisinga data");
        return false;
    } 
	else return true;
}

function disableSubmit(){
	$("#submitBtn").prop("disabled",true);
}

function enableSubmit() {
	$("#submitBtn").prop("disabled",false);
}