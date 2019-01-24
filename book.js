//--------------------------------------------- CONSTANTS ---------------------------------------------//
var topWindow = null;
var numCol = 0;
var checkUpdateflag = false;
var checkDataInsert = true;

//form control ids
var INPUT_ID_BOOK_ID = "txtBookId";
var INPUT_ID_BOOK_NAME = "txtBookName";
var SELECT_OPTION_BOOK_TYPE = "cboBookType";
var SELECT_OPTION_ID_AUTHOR = "cboAuthor";
var INPUT_ID_PUBLISH_DATE = "txtPublishDate";
var INPUT_ID_ORIGIN_PRICE = "txtOriginPrice";
var INPUT_ID_SELL_PRICE = "txtSellPrice";
var INPUT_ID_LANGUAGE = "txtLanguage";
var INPUT_ID_PUBLISER = "txtPublisher";
var INPUT_ID_WIKI_SOURCE = "txtWikiSource";
var INPUT_ID_PAGE_NUMBER = "txtPageNumber";

//button id
var BUTTON_ID_SEARCH = "btnSearch";
var BUTTON_ID_CLEAR = "btnClear";
var BUTTON_ID_REGISTER = "btnRegister";
var BUTTON_ID_UPDATE = "btnUpdate";

//table id
var TABLE_ID_BOOK = "tblBook"

//BOOK DTO properties

var BOOK_DTO_BOOK_ID = "bookId";
var BOOK_DTO_BOOK_NAME = "bookName";
var BOOK_DTO_BOOK_TYPE_ID = "bookTypeId";
var BOOK_DTO_BOOK_TYPE_NAME = "bookTypeName";
var BOOK_DTO_AUTHOR_ID = "authorId";
var BOOK_DTO_AUTHOR_NAME = "authorName";
var BOOK_DTO_PUBLISH_DATE = "publishDate";
var BOOK_DTO_ORIGIN_PRICE = "originPrice";
var BOOK_DTO_SELL_PRICE = "sellPrice";
var BOOK_DTO_LANGUAGE = "languge";
var BOOK_DTO_PUBLISER = "publisher";
var BOOK_DTO_WIKI_SOURCE = "wikiSource";
var BOOK_DTO_PAGE_NUMBER = "pageNumber";

//AuthorDTO properties
var AUTHOR_DTO_AUTHOR_ID = "authorId";
var AUTHOR_DTO_AUTHOR_NAME = "authorName";

//BookTypeDTO properties
var BOOK_TYPE_DTO_BOOK_TYPE_ID = "bookTypeId";
var BOOK_TYPE_DTO_BOOK_TYPE_NAME = "bookTypeName";

//Values
var BLANK = "";

//Action packages
var ACTION_PACKAGE_NAME = {
	BOOK: "com.toyota_cs.exdb_ee.sysif.employees.action",
	AUTHOR: "com.toyota_cs.exdb_ee.sysif.authors.action",
	BOOK_TYPE: "com.toyota_cs.exdb_ee.sysif.booktypes.action",
}

//Action class
var ACTION_CLASS_NAME = {
	//book action class name
	SEARCH_BOOK: ACTION_PACKAGE_NAME.BOOK + "." + "SearchBooksAction",
	INSERT_BOOK: ACTION_PACKAGE_NAME.BOOK + "." + "InsertBooksAction",
	UPDATE_BOOK: ACTION_PACKAGE_NAME.BOOK + "." + "UpdateBooksAction",
	//author action class name
	SEARCH_AUTHOR: ACTION_PACKAGE_NAME.AUTHOR + "." + "SearchAuthorsAction",
	//book type action class name
	SEARCH_BOOK_TYPE: ACTION_PACKAGE_NAME.BOOK_TYPE + "." + "SearchBookTypesAction"
}

var ACTION_PATH = {
	//book action path
	SEARCH_BOOK: "Books.SearchBooks",
	INSERT_BOOK: "Books.InsertBook",
	UPDATE_BOOK: "Books.UpdateBook",
	//author action path
	SEARCH_AUTHOR: "Authors.SearchAuthors",
	//book type action path
	SEARCH_BOOK_TYPE: "BookTypes.SearchBookTypes",
}

//Request Constants
var PROCESS = "process";
var TRUE = "true";

//DTO names
var DTO_NAME_BOOK = "bookinput"
var DTO_NAME_AUTHOR = "author"
var DTO_NAME_BOOK_TYPES = "booktype"

// Flag messages
var SEARCH_SUCCESS = "SEARCH_SUCCESS";
var UPDATE_SUCCESS = "UPDATE_SUCCESS";
var REGISTER_SUCCESS = "REGISTER_SUCCESS";

//--------------------------------------------- END CONSTANTS ---------------------------------------------//

//--------------------------------------------- FORM UTILS ---------------------------------------------//

// create input control reference by id
function getInputRef(id) {
	return $("input[id=" + id + "]");
}

function getSelectOptionRef(id) {
	return $("select[id=" + id + "]");
}

function getButtonRef(id) {
	return $("button[id=" + id + "]");
}

// focus to input with specify id
function focusInput(inputId) {
	getInputRef(inputId).focus();
}

function clearForm() {
	inputSetter.setBookName(BLANK);
	inputSetter.setBookTypeId(0);
	inputSetter.setAuthorId(0);
	inputSetter.setPublishDate(BLANK);
	inputSetter.setOriginPrice(BLANK);
	inputSetter.setLanguage(BLANK);
	inputSetter.setSellPrice(BLANK);
	inputSetter.setPublisher(BLANK);
	inputSetter.setWikiSource(BLANK);
	inputSetter.setPageNumber(BLANK);
}

//validate form data in search.html
function searchDataValidate() {

	if (inputGetter.getBookName == BLANK) {
		alert('Chưa nhập tên sách');
		return false;
	}

	if (inputGetter.getBookTypeId == '0') {
		alert('Chưa nhập chủng loại sách');
		return false;
	}

	return true;
}

//validate form data in form.html
function formDataValidate() {

	var date_format_regex = /^\d{4}\/\d{2}\/\d{2}$/;

	if (inputGetter.getBookName == BLANK) {
		alert('Chưa nhập tên sách');
		return false;
	}

	if (inputGetter.getBookTypeId == '0') {
		alert('Chưa chọn chủng loại sách');
		return false;
	}

	if (inputGetter.getAuthorId == '0') {
		alert('Chưa chọn tác giả');
		return false;
	}


	// check date in format yyyy/MM/dd
	if (!inputGetter.getPublishDate.match(date_format_regex)) {
		alert('Ngày xuất bản không đúng định dạng năm-tháng-ngày (yyyy/MM/dd)');
		return false;
	} else {
		//check date valid
		var publishDate = new Date(inputGetter.getPublishDate);
		if (date.toString() == "Invalid Date") {
			alert('Ngày xuất bản không hợp lệ');
			return false;
		}
	}

	if (inputGetter.getOriginPrice > inputGetter.getSellPrice) {
		alert('Giá bán phải không được thấp hơn giá gốc');
		return false;
	}

	return true;
}

//  input Getter (return value of input control)
var inputGetter = {
	getBookId: function () { return getInputRef(INPUT_ID_BOOK_ID).val(); },
	getBookName: function () { return getInputRef(INPUT_ID_BOOK_NAME).val(); },
	getBookTypeId: function () { return getSelectOptionRef(SELECT_OPTION_BOOK_TYPE).val(); },
	getAuthorId: function () { return getSelectOptionRef(SELECT_OPTION_ID_AUTHOR).val(); },
	getPublishDate: function () { return getInputRef(INPUT_ID_PUBLISH_DATE).val(); },
	getOriginPrice: function () { return getInputRef(INPUT_ID_ORIGIN_PRICE).val(); },
	getLanguage: function () { return getInputRef(INPUT_ID_LANGUAGE).val(); },
	getSellPrice: function () { return getInputRef(INPUT_ID_SELL_PRICE).val(); },
	getPublisher: function () { return getInputRef(INPUT_ID_PUBLISER).val(); },
	getWikiSource: function () { return getInputRef(INPUT_ID_WIKI_SOURCE).val(); },
	getPageNumber: function () { return getInputRef(INPUT_ID_PAGE_NUMBER).val(); },
};

//  input Setter (set value to input control)
var inputSetter = {
	setBookId: function (bookId) { getInputRef(INPUT_ID_BOOK_ID).val(bookId); },
	setBookName: function (bookName) { getInputRef(INPUT_ID_BOOK_NAME).val(bookName); },
	setBookTypeId: function (bookTypeId) { getSelectOptionRef(SELECT_OPTION_BOOK_TYPE).val(bookTypeId); },
	setAuthorId: function (authorId) { getSelectOptionRef(SELECT_OPTION_ID_AUTHOR).val(authorId); },
	setPublishDate: function (publishDate) { getInputRef(INPUT_ID_PUBLISH_DATE).val(publishDate); },
	setOriginPrice: function (originPrice) { getInputRef(INPUT_ID_ORIGIN_PRICE).val(originPrice); },
	setLanguage: function (language) { getInputRef(INPUT_ID_LANGUAGE).val(language); },
	setSellPrice: function (sellPrice) { getInputRef(INPUT_ID_SELL_PRICE).val(sellPrice); },
	setPublisher: function (publisher) { getInputRef(INPUT_ID_PUBLISER).val(publisher); },
	setWikiSource: function (wikiSource) { getInputRef(INPUT_ID_WIKI_SOURCE).val(wikiSource); },
	setPageNumber: function (pageNumber) { getInputRef(INPUT_ID_PAGE_NUMBER).val(pageNumber); },
}


//--------------------------------------------- FORM UTILS END ---------------------------------------------//

//--------------------------------------------- GET DATA FORM FROM ---------------------------------------------//

//search
function getSearchFormData() {
	var searchFormData;
	alert(inputGetter.getBookName);
	searchFormData[BOOK_DTO_BOOK_NAME] = inputGetter.getBookName;
	searchFormData[BOOK_DTO_AUTHOR_ID] = inputGetter.getAuthorId;
	searchFormData[BOOK_DTO_PUBLISH_DATE] = inputGetter.getPublishDate;

	return searchFormData;
}

//book
function getBookFormData() {
	var bookFormData;

	bookFormData[BOOK_DTO_BOOK_ID] = inputGetter.getBookId();
	bookFormData[BOOK_DTO_BOOK_NAME] = inputGetter.getBookName();
	bookFormData[BOOK_DTO_BOOK_TYPE_ID] = inputGetter.getBookTypeId();
	bookFormData[BOOK_DTO_AUTHOR_ID] = inputGetter.getAuthorId();
	bookFormData[BOOK_DTO_PUBLISH_DATE] = inputGetter.getPublishDate();
	bookFormData[BOOK_DTO_ORIGIN_PRICE] = inputGetter.getOriginPrice();
	bookFormData[BOOK_DTO_SELL_PRICE] = inputGetter.getSellPrice();
	bookFormData[BOOK_DTO_LANGUAGE] = inputGetter.getLanguage();
	bookFormData[BOOK_DTO_PUBLISER] = inputGetter.getPublisher();
	bookFormData[BOOK_DTO_WIKI_SOURCE] = inputGetter.getWikiSource();
	bookFormData[BOOK_DTO_PAGE_NUMBER] = inputGetter.getPageNumber();

	return bookFormData;
}

//author & booktype do not have input dto

//--------------------------------------------- END INPUT DTO ---------------------------------------------//

//--------------------------------------------- SEARCH ---------------------------------------------//


function search(bookId) {
	//create request
	var request = libDataMainte.getRequest(
		ACTION_CLASS_NAME.SEARCH_BOOK
		, PROCESS
		, TRUE);
	var input = libDataMainte.getInputElement(request);

	//get dto data from form
	var searchFormData = getSearchFormData();

	// add data to request
	// search book by id for update
	if (bookId > 0) {
		input.appendChild(new libDataMainte.Element(DTO_NAME_BOOK, {
			[BOOK_DTO_BOOK_ID]: bookId
		}));
	} else {
		// search book
		input.appendChild(new libDataMainte.Element(DTO_NAME_BOOK, {
			[BOOK_DTO_BOOK_NAME]: getSearchFormData.BOOK_DTO_BOOK_NAME
		}));

		input.appendChild(new libDataMainte.Element(DTO_NAME_BOOK, {
			[BOOK_DTO_BOOK_TYPE_ID]: getSearchFormData.BOOK_DTO_BOOK_TYPE_ID
		}));
		// add publish date condition when publish date inputed
		if (bookFormData.BOOK_DTO_PUBLISH_DATE) {
			input.appendChild(new libDataMainte.Element(DTO_NAME_BOOK, {
				[BOOK_DTO_PUBLISH_DATE]: getSearchFormData.BOOK_DTO_PUBLISH_DATE
			}));
		}
	}

	//send request
	libDataMainte.callAction(
		ACTION_PATH.SEARCH_BOOK
		, request.toXml()
		, searchRequestSuccess
		, searchRequestError
		, true
	);
}

function searchRequestSuccess(result) {
	console.log
}

function searchRequestError(result) {
	console.log("request thất bại");
}

//--------------------------------------------- END SEARCH ---------------------------------------------//


//--------------------------------------------- EVENTS ---------------------------------------------//

$(function(){
	getButtonRef(BUTTON_ID_SEARCH).click(function(){
		alert(inputGetter.getBookName);
		search();
	})
})

//--------------------------------------------- END EVENTS ---------------------------------------------//




