/**
 * @author USOL-V hbui7
 */

var topWindow = null;
var numCol = 0;
var checkUpdateflag = false;
var checkDataInsert = true;

var FORM_ID_EMPLOYEE_ID = "txtEmployeesId";
var FORM_ID_EMPLOYEE_NAME = "txtEmployeesName";
var FORM_ID_EMPLOYEE_ADDRESS = "txtEmployeesAddress";
var FORM_ID_EMPLOYEE_ADDRESS_NOW = "txtEmployeesAddressNow";
var FORM_ID_EMPLOYEE_PHONE = "txtEmployeesPhone";
var FORM_ID_EMPLOYEE_EMAIL = "txtEmployeesEmail";
var FORM_ID_EMPLOYEE_DOB = "dateEmployeeDOB";
var FORM_ID_EMPLOYEE_DATE_UPDATE = "dateEmployeeDateUpdate";
var FORM_ID_EMPLOYEE_GENDER = "radEmployeesGender";

var DTO_KEY_EMPLOYEE_ID = "employeeId";
var DTO_KEY_EMPLOYEE_NAME = "employeeName";
var DTO_KEY_EMPLOYEE_ADDRESS = "employeeAddress";
var DTO_KEY_EMPLOYEE_ADDRESS_NOW = "employeeAddressNow";
var DTO_KEY_EMPLOYEE_PHONE = "employeePhone";
var DTO_KEY_EMPLOYEE_EMAIL = "employeeEmail";
var DTO_KEY_EMPLOYEE_GENDER = "employeeGender";
var DTO_KEY_EMPLOYEE_DOB = "employeeDOB";
var DTO_KEY_EMPLOYEE_DATE_UPDATE = "employeeDateUpdate";
var DTO_KEY_UPDATE_FLG = "updateFlg";

var BUTTON_SEARCH_ID = "btnSearch";
var BUTTON_CLEAR_ID = "btnClear";
var BUTTON_UPDATE_ID = "btnUpdate";

var BLANK = "";
var CHECKED = "checked";
var MALE = "Nam";
var FEMALE = "Nu";

var ACTION_PACKAGE = "com.toyota_cs.exdb_ee.sysif.employees.action.";
var PROCESS = "process";
var TRUE = "true";
var EMPLOYEE_INFO = "employeeinfo"

var RESULT_TABLE_HEAD_ID = "resultHeadTable";
var RESULT_TABLE_BODY_ID = "resultListTable";
var RESULT_COUNT_DIV_ID = "divResultSelect";

var SUCCESS = "SUCCESS";
var UPDATE_SUCCESS = "UPDATE_SUCCESS";
var REGISTER_SUCCESS = "REGISTER_SUCCESS";

var FormUtil = {
	getEmployeeId: function () { return $(createInputRef(FORM_ID_EMPLOYEE_ID)).val().toUpperCase(); },
	getEmployeeName: function () { return $(createInputRef(FORM_ID_EMPLOYEE_NAME)).val(); },
	getEmployeeAddress: function () { return $(createInputRef(FORM_ID_EMPLOYEE_ADDRESS)).val(); },
	getEmployeeAddressNow: function () { return $(createInputRef(FORM_ID_EMPLOYEE_ADDRESS_NOW)).val(); },
	getEmployeePhone: function () { return $(createInputRef(FORM_ID_EMPLOYEE_PHONE)).val(); },
	getEmployeeEmail: function () { return $(createInputRef(FORM_ID_EMPLOYEE_EMAIL)).val(); },
	getEmployeeGender: function () { var gender = getCheckedGenderRef().val(); return gender ? gender : BLANK },
	getEmployeeDOB: function () { return $(createInputRef(FORM_ID_EMPLOYEE_DOB)).val(); },
	getEmployeeDateUpdate: function () { return $(createInputRef(FORM_ID_EMPLOYEE_DATE_UPDATE)).val(); },
	setEmployeeId: function (id) { $(createInputRef(FORM_ID_EMPLOYEE_ID)).val(id) },
	setEmployeeName: function (name) { $(createInputRef(FORM_ID_EMPLOYEE_NAME)).val(name) },
	setEmployeeAddress: function (address) { $(createInputRef(FORM_ID_EMPLOYEE_ADDRESS)).val(address) },
	setEmployeeAddressNow: function (address) { $(createInputRef(FORM_ID_EMPLOYEE_ADDRESS_NOW)).val(address) },
	setEmployeePhone: function (phone) { $(createInputRef(FORM_ID_EMPLOYEE_PHONE)).val(phone) },
	setEmployeeEmail: function (email) { $(createInputRef(FORM_ID_EMPLOYEE_EMAIL)).val(email) },
	setEmployeeGender: function (gender) { getCheckedGenderRef().val(gender) },
	setEmployeeDOB: function (dob) { $(createInputRef(FORM_ID_EMPLOYEE_DOB)).val(dob) },
	setEmployeeDateUpdate: function (date) { $(createInputRef(FORM_ID_EMPLOYEE_DATE_UPDATE)).val(date) },
	focus: function (inputId) { $(createInputRef(inputId)).focus() }
};

var ActionConstant = {
	EMPLOYEE_UPDATE_ACTION_CLASS: ACTION_PACKAGE + "EmployeesUpdateAction",
	EMPLOYEE_UPDATE_ACTION_PATH: "Employees.EmployeesUpdate",
	EMPLOYEE_SELECT_ACTION_CLASS: ACTION_PACKAGE + "EmployeesSelectAction",
	EMPLOYEE_SELECT_ACTION_PATH: "Employees.EmployeesSelect",
	EMPLOYEE_SELECT_BY_ID_ACTION_CLASS: ACTION_PACKAGE + "EmployeesSelectByIdAction",
	EMPLOYEE_SELECT_BY_ID_ACTION_PATH: "Employees.EmployeesSelectById"
};

function createInputRef(id) {
	return "input[id=" + id + "]";
}

function getCheckedGenderRef() {
	return $("input[id=" + FORM_ID_EMPLOYEE_GENDER + "]:" + CHECKED);
}

function setCheckGenderRadio(gender, isChecked) {
	$("input[id=" + FORM_ID_EMPLOYEE_GENDER + "][value=" + gender + "]").prop(CHECKED, isChecked);
}


$(function () {
	init();

	$("#" + BUTTON_CLEAR_ID).click(function () {
		confirmClearData();
	});

	$("#" + BUTTON_SEARCH_ID).click(function () {
		select();
	});

	$("#" + BUTTON_UPDATE_ID).click(function () {
		if (checkInput()) {
			update();
		}
	});

	$("#divResultTable").scroll(function () {
		$("#divResultHeadTable").scrollLeft($("#divResultTable").scrollLeft());
	});
});

function init() {
	topWindow = $(window)[0].top;
}

/**
 * getParameter Start 
 * get Value items Input
 */
function getParameter() {
	var result = new Array();

	result[DTO_KEY_EMPLOYEE_ID] = FormUtil.getEmployeeId();
	result[DTO_KEY_EMPLOYEE_NAME] = FormUtil.getEmployeeName();
	result[DTO_KEY_EMPLOYEE_ADDRESS] = FormUtil.getEmployeeAddress();
	result[DTO_KEY_EMPLOYEE_ADDRESS_NOW] = FormUtil.getEmployeeAddressNow();
	result[DTO_KEY_EMPLOYEE_PHONE] = FormUtil.getEmployeePhone();
	result[DTO_KEY_EMPLOYEE_EMAIL] = FormUtil.getEmployeeEmail();
	result[DTO_KEY_EMPLOYEE_GENDER] = FormUtil.getEmployeeGender();
	result[DTO_KEY_EMPLOYEE_DOB] = FormUtil.getEmployeeDOB();
	result[DTO_KEY_EMPLOYEE_DATE_UPDATE] = FormUtil.getEmployeeDateUpdate();

	return result;
}
/**
 * getParameter End
 * 
 */

/**
 * clear Start 
 * Clear Value items Input
 */
function clear() {
	document.getElementById(FORM_ID_EMPLOYEE_ID).readOnly = false;
	document.getElementById(BUTTON_SEARCH_ID).disabled = false;

	FormUtil.setEmployeeId(BLANK);
	FormUtil.setEmployeeName(BLANK);
	FormUtil.setEmployeeAddress(BLANK);
	FormUtil.setEmployeeAddressNow(BLANK);
	FormUtil.setEmployeeDOB(BLANK);
	FormUtil.setEmployeePhone(BLANK);
	FormUtil.setEmployeeEmail(BLANK);
	FormUtil.setEmployeeDateUpdate(BLANK);

	setCheckGenderRadio(MALE, false);
	setCheckGenderRadio(FEMALE, false);
	FormUtil.focus(FORM_ID_EMPLOYEE_ID);

	checkUpdateflag = false;

}
/**
 * clear End
 * 
 */

/**
 * confirmClearData 
 * Start Xac nhan viec clear data
 */
function confirmClearData() {

	if (FormUtil.getEmployeeId() == BLANK && FormUtil.getEmployeeName() == BLANK
		&& FormUtil.getEmployeeAddress() == BLANK && FormUtil.getEmployeeDOB() == BLANK
		&& FormUtil.getEmployeeAddressNow() == BLANK && FormUtil.getEmployeePhone() == BLANK) {
		clear();
	} else {
		if (confirm("Đang tồn tại item input, bạn có muốn clear hay không?")) {
			clear();
		}
	}
}
/**
 * confirmClearData End
 */

/**
 * checkInput Start 
 * Kiem tra input nhap vao truoc khi submit
 */
function checkInput() {
	var gender = FormUtil.getEmployeeGender();

	var filter = /^([a-zA-Z0-9_\.\-])+\@+\usol+\-v+\.com+\.vn/;

	if (FormUtil.getEmployeeId() == BLANK || FormUtil.getEmployeeName() == BLANK
		|| FormUtil.getEmployeeDOB() == BLANK || !gender) {
		alert(" Thông tin đăng ký chưa được input ! ");
		return false;
	}

	var date = new Date(FormUtil.getEmployeeDOB());

	if (date.toString() == "Invalid Date") {
		alert("Hãy input ngày sinh theo định dạng ngày (yyyy/MM/dd , ...) !");
		return false;
	}

	if (FormUtil.getEmployeeId().length > 6) {
		alert(" Mã số nhân viên không được quá 6 ký tự");
		FormUtil.focus(FORM_ID_EMPLOYEE_ID);
		return false;

	} else if (FormUtil.getEmployeeName().length > 64) {
		alert(" Tên nhân viên không được quá 64 ký tự");
		FormUtil.focus(FORM_ID_EMPLOYEE_NAME);
		return false;

	} else if (FormUtil.getEmployeeAddress().length > 128) {
		alert(" Địa chỉ không được quá 128 ký tự");
		FormUtil.focus(FORM_ID_EMPLOYEE_ADDRESS);
		return false;

	} else if (FormUtil.getEmployeeAddressNow().length > 128) {
		alert(" Địa chỉ hiện tại không được quá 128 ký tự");
		FormUtil.focus(FORM_ID_EMPLOYEE_ADDRESS_NOW);
		return false;

	} else if (FormUtil.getEmployeePhone().length > 15) {
		alert(" Số điện thoại không được quá 15 ký tự");
		FormUtil.focus(FORM_ID_EMPLOYEE_PHONE);
		return false;

	} else if (FormUtil.getEmployeeEmail().length > 32) {
		alert(" Email không được quá 32 ký tự");
		FormUtil.focus(FORM_ID_EMPLOYEE_EMAIL);
		return false;

	} else if (!filter.test(FormUtil.getEmployeeEmail())) {
		alert(" Email phải có định dạng [Ten nhan vien]@usol-v.com.vn");
		FormUtil.focus(FORM_ID_EMPLOYEE_EMAIL);
		return false;

	}

	return true;
}
/**
 * checkInput end
 */

/**
 * update Start	
 * Gửi request tới EmployeesUpdateAction
 */
function update() {


	if (checkInput()) {
		var updateflag = "register";
		if (checkUpdateflag) {
			updateflag = "update"
		}

		var para = getParameter();
		var request = libDataMainte
			.getRequest(ActionConstant.EMPLOYEE_UPDATE_ACTION_CLASS,
			PROCESS, TRUE);
		var input = libDataMainte.getInputElement(request);

		input.appendChild(new libDataMainte.Element(EMPLOYEE_INFO, {
			[DTO_KEY_EMPLOYEE_ID]: para[DTO_KEY_EMPLOYEE_ID],
			[DTO_KEY_EMPLOYEE_NAME]: para[DTO_KEY_EMPLOYEE_NAME],
			[DTO_KEY_EMPLOYEE_DOB]: para[DTO_KEY_EMPLOYEE_DOB],
			[DTO_KEY_EMPLOYEE_ADDRESS]: para[DTO_KEY_EMPLOYEE_ADDRESS],
			[DTO_KEY_EMPLOYEE_ADDRESS_NOW]: para[DTO_KEY_EMPLOYEE_ADDRESS_NOW],
			[DTO_KEY_EMPLOYEE_PHONE]: para[DTO_KEY_EMPLOYEE_PHONE],
			[DTO_KEY_EMPLOYEE_EMAIL]: para[DTO_KEY_EMPLOYEE_EMAIL],
			[DTO_KEY_EMPLOYEE_GENDER]: para[DTO_KEY_EMPLOYEE_GENDER],
			[DTO_KEY_EMPLOYEE_DATE_UPDATE]: para[DTO_KEY_EMPLOYEE_DATE_UPDATE],
			[DTO_KEY_UPDATE_FLG]: updateflag
		}));
		;
		libDataMainte.callAction(ActionConstant.EMPLOYEE_UPDATE_ACTION_PATH, request.toXml(),
			updateCallback, function () {
				console.log("got error!");
			});
	}
}
/**
 * update end	
 */

/**
 * select Start	
 * Gửi request tới EmployeesSelectAction
 */
function select() {
	$("#" + RESULT_TABLE_HEAD_ID + " tr").remove();
	$("#" + RESULT_TABLE_BODY_ID + " tr").remove();
	$("#" + RESULT_COUNT_DIV_ID + " p").remove();

	var para = getParameter();

	var request = libDataMainte.getRequest(ActionConstant.EMPLOYEE_SELECT_BY_ID_ACTION_CLASS, PROCESS, TRUE);
	var input = libDataMainte.getInputElement(request);

	input.appendChild(new libDataMainte.Element(EMPLOYEE_INFO, {
		[DTO_KEY_EMPLOYEE_ID]: para[DTO_KEY_EMPLOYEE_ID],
		[DTO_KEY_EMPLOYEE_NAME]: para[DTO_KEY_EMPLOYEE_NAME],
		[DTO_KEY_EMPLOYEE_DOB]: para[DTO_KEY_EMPLOYEE_DOB],
		[DTO_KEY_EMPLOYEE_ADDRESS]: para[DTO_KEY_EMPLOYEE_ADDRESS],
		[DTO_KEY_EMPLOYEE_ADDRESS_NOW]: para[DTO_KEY_EMPLOYEE_ADDRESS_NOW],
		[DTO_KEY_EMPLOYEE_PHONE]: para[DTO_KEY_EMPLOYEE_PHONE],
		[DTO_KEY_EMPLOYEE_EMAIL]: para[DTO_KEY_EMPLOYEE_EMAIL],
		[DTO_KEY_EMPLOYEE_GENDER]: para[DTO_KEY_EMPLOYEE_GENDER]
	}));
	libDataMainte.callAction(ActionConstant.EMPLOYEE_SELECT_ACTION_PATH, request.toXml(),
		selectCallback, function () {
			console.log("got error!");
		});
}
/**
 * select End	
 */

/**
 * updateCallBack Start
 * @param Responce	
 * Gửi request tới EmployeesSelectAction
 */
function updateCallback(responce) {
	var res = new libDataMainte.response(responce);

	var resItemMsg = res._response;

	if (resItemMsg.status._code == BLANK) {
		var resItemMsg = res._response.message.outputMessage;

		if (resItemMsg._resultMsg == UPDATE_SUCCESS) {
			alert("Update thanh cong");
		} else if (resItemMsg._resultMsg == REGISTER_SUCCESS) {
			alert("Dang ky thanh cong");
		}
		selectAll();
		clear();
	} else {
		var errorMessage = resItemMsg.error._errorMessage;
		alert(errorMessage);
		clear();
		selectAll();
	}

}
/**
 * updateCallBack End
 */


/**
 * selectAll Start
 */
function selectAll() {
	$("#" + RESULT_TABLE_HEAD_ID + " tr").remove();
	$("#" + RESULT_TABLE_BODY_ID + " tr").remove();
	$("#" + RESULT_COUNT_DIV_ID + " p").remove();

	var para = getParameter();
	var request = libDataMainte
		.getRequest(ActionConstant.EMPLOYEE_SELECT_ACTION_CLASS, PROCESS, TRUE);
	var input = libDataMainte.getInputElement(request);

	input.appendChild(new libDataMainte.Element(EMPLOYEE_INFO, {}));
	libDataMainte.callAction(ActionConstant.EMPLOYEE_SELECT_ACTION_PATH, request.toXml(),
		selectCallback, function () {
			console.log("got error!");
		});
}/**
  * selectAll End
  */


/**
 * selectForUpdate Start
 * @param 	employeesId
 * Gửi request tới EmployeesSelectByIdAction
 */
function selectForUpdate(id) {
	var request = libDataMainte
		.getRequest(ActionConstant.EMPLOYEE_SELECT_BY_ID_ACTION_CLASS, PROCESS, TRUE);
	var input = libDataMainte.getInputElement(request);

	input.appendChild(new libDataMainte.Element(EMPLOYEE_INFO, {
		[DTO_KEY_EMPLOYEE_ID]: id.toUpperCase()
	}));
	libDataMainte.callAction(ActionConstant.EMPLOYEE_SELECT_BY_ID_ACTION_PATH, request.toXml(),
		selectForUpdateCallBack, function () {
			console.log("got error!");
		});
}
/**
 * selectForUpdate End
 */

/**
 * selectForUpdateCallBack Start
 * @param 	responce
 * Xử lý trả về sau khi update
 */
function selectForUpdateCallBack(responce) {
	var res = new libDataMainte.response(responce);
	var resItemMsg = res._response.message.output;
	var dateStr = resItemMsg._employeeDOB.substr(0, 10);


	if (resItemMsg._resultMsg == SUCCESS) {
		// Set value
		FormUtil.setEmployeeId(resItemMsg._employeeId);
		FormUtil.setEmployeeName(BLANK + resItemMsg._employeeName + BLANK);
		FormUtil.setEmployeeDOB(BLANK + dateStr + BLANK);
		FormUtil.setEmployeeAddress(BLANK + resItemMsg._employeeAddress + BLANK)
		FormUtil.setEmployeeAddressNow(BLANK + resItemMsg._employeeAddressNow + BLANK);
		FormUtil.setEmployeePhone(BLANK + resItemMsg._employeePhone + BLANK);
		FormUtil.setEmployeeEmail(BLANK + resItemMsg._employeeEmail + BLANK);
		FormUtil.setEmployeeDateUpdate(BLANK + resItemMsg._employeeDateUpdate + BLANK);

		if (resItemMsg._employeeGender == MALE) {
			setCheckGenderRadio(MALE, true);
		} else if (resItemMsg._employeeGender == FEMALE) {
			setCheckGenderRadio(FEMALE, true);
		}
		document.getElementById(FORM_ID_EMPLOYEE_ID).readOnly = true;
		document.getElementById(BUTTON_SEARCH_ID).disabled = true;
		checkUpdateflag = true;

	} else {
		alert("Khong tim thay thong tin trong he thong ! ");
	}

}
/**
 * selectForUpdateCallBack End
 */

/**
 * selectCallback Start
 * @param 	responce
 * Xử lý trả về sau khi select
 */
function selectCallback(responce) {

	var res = new libDataMainte.response(responce);
	var resItem = res._response.message.output;
	reloadList(resItem);

}
/**
 * selectCallback End
 */

/**
 * reloadList Start
 * @param 	List<Object>
 * Tạo bảng và fill data vào bảng
 */
function reloadList(datalist) {
	var setTarget = BLANK;

	$("#" + RESULT_TABLE_BODY_ID + "").append(setTarget);

	// Get column names from json and attributes matching with response
	$
		.getJSON(
		"json/010_defineColumn.json",
		function (col) {

			/*
			 * Build columns
			 */
			setTarget += "<tr>";
			setTarget += "<th height='30px' style='text-align: left;'>STT</th>";
			setTarget += "<th height='30px' style='display:none; text-align: left;'></th>";

			var preColumn = "_COLUMN";
			var index = BLANK;
			var flag = BLANK;

			numCol = col["NUMBER_COLUMN"];
			for (var i = 1; i < numCol + 1; i++) {
				index = i.toString();
				setTarget += "<th height='30px' style='text-align: left;'>"
					+ col[preColumn + index][0] + "</th>";
			}
			setTarget += "<th height='30px' style='text-align: left;'>Action</th>";
			setTarget += "<th height='30px' style='display:none; text-align: left;'></th>";
			setTarget += "</tr>";
			$("#" + RESULT_TABLE_HEAD_ID + "").append(setTarget);
			setTarget = BLANK;

			/*
			 * Build data rows
			 */
			if (datalist._resultMsg == 1) {
				var resultCount = datalist._resultMsg;
				$("#" + RESULT_COUNT_DIV_ID + "").append(
					" <p>Kết quả tìm kiếm : " + resultCount + "record</p>");

				setTarget += "<tr>";
				setTarget += "<td height='30px' style='text-align: left;'>"
					+ resultCount + "</td>";
				setTarget += "<td height='30px' style='display:none; text-align: left;'>"
					+ resultCount + "</td>";

				var responseTag = BLANK;
				for (var iColumn = 0; iColumn < numCol; iColumn++) {

					index = preColumn + (iColumn + 1).toString();
					responseTag = col[index][1];
					setTarget += "<td height='30px' style='text-align: left;'>"
						+ datalist[responseTag] + "</td>";

				}
				setTarget += "<td><button id='btnEdit' onclick='selectForUpdate(&#39;"
					+ datalist._employeeId
					+ "&#39;)' type='button'>Edit</button></td>";
				setTarget += "</tr>";
				if (i % 300 == 0) {
					$("#" + RESULT_TABLE_BODY_ID + "").append(setTarget);
					setTarget = BLANK;
				}
				flag = "flag";

			} else if (datalist._resultMsg == "nullList") {
				alert("Khong ton tai du lieu nao thoa man du lieu tim kiem !");
				$("#" + RESULT_COUNT_DIV_ID + "").append(
					"<p>Kết quả tìm kiếm : 0 record</p>");
			} else {
				$("#" + RESULT_COUNT_DIV_ID + "").append(
					"<p>Kết quả tìm kiếm : "
					+ datalist[0]._resultMsg
					+ "  record</p>");
				for (var iRowData = 0; iRowData < datalist.length; iRowData++) {

					var index = iRowData + 1;
					setTarget += "<tr>";
					setTarget += "<td height='30px' style='text-align: left;'>"
						+ index + "</td>";
					setTarget += "<td height='30px' style='display:none; text-align: left;'>"
						+ "1" + "</td>";

					var responseTag = BLANK;
					for (var iColumn = 0; iColumn < numCol; iColumn++) {

						index = preColumn
							+ (iColumn + 1).toString();
						responseTag = col[index][1];
						setTarget += "<td height='30px' style='text-align: left;'>"
							+ datalist[iRowData][responseTag]
							+ "</td>";

					}
					setTarget += "<td><button id='btnEdit' onclick='selectForUpdate(&#39;"
						+ datalist[iRowData]._employeeId
						+ "&#39;)' type='button'>Edit</button></td>";
					setTarget += "</tr>";
					if (i % 300 == 0) {
						$("#" + RESULT_TABLE_BODY_ID + "").append(setTarget);
						setTarget = BLANK;
					}
					flag = "flag";
				}
			}

			if (setTarget != BLANK) {
				$("#" + RESULT_TABLE_BODY_ID + "").append(setTarget);
				setTarget = BLANK;
			}

		});

}/**
 * reloadList End
 */