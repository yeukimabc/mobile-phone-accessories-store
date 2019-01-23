////////////////////////////////////////////////////////////////////
// オブジェクトをxml形式に変換
// append 20160129  ogis-yishikawa
(function(window){
    var lib = {} ;
    // xmlのエレメント(これをnewする)
    lib.Element = function( name, attributes )
    {
        this._name = ( name != null ) ? name : "unknown";
        this._attr = ( attributes != null ) ? attributes : {};
        this._innerElem = [];
    }
    lib.Element.xml_header = "<?xml version=\"1.0\" encoding=\"UTF-8\"?>";
    lib.Element.prototype = {
        appendChild:	function( child )
                        {
                            this._innerElem.push( child );
                        },
        toXml:			function()
                        {
                            return lib.Element.xml_header + "\n" + this._writeEelemXml( this );
                        },
        _writeEelemXml:	function( elem )
                        {
                            var element = "<"+elem._name;
                            $.each( elem._attr,
                                    function( key, value ){
                                        element += ( " " + key + " = \"" + value + "\"  " );
                                    });
                            if( elem._innerElem.length == 0 ){
                                return element + "/>\n";
                            }
                            element += ">\n";

                            for( var i = 0 ; i < elem._innerElem.length ; i ++  ){
                                element += this._writeEelemXml( elem._innerElem[i] );
                            }
                            return element + "</" + elem._name + ">\n";
                        },
        toString:		function()
                        {
                            return toXml();
                        },
        getChild:		function( name )
                        {
                            for( var i = 0 ; i < this._innerElem.length ; i ++  ){
                                if( this._innerElem[i]._name == name ){
                                    return this._innerElem[i];
                                }
                            }
                            return null;
                        }
    };

    lib.getRequest	=	function( className, methodName, webFlg )
                        {
                            var root	= new lib.Element( "request" );
                            var common	= new lib.Element( "common"  );
                            common.appendChild( new lib.Element(	"service",
                                                                    {
                                                                        "className" : className,
                                                                        "methodName" : methodName,
                                                                        "webFlg" : webFlg
                                                                    } ));
                            root.appendChild(common);

                            var message = new lib.Element( "message" );
                            message.appendChild(new lib.Element( "input" ));
                            root.appendChild(message);
                            return root;
                        };
    lib.getInputElement  =  function( root )
                            {
                                var message = root.getChild( "message" );
                                if( message != null ){
                                    return message.getChild( "input" );
                                }
                                return null;
                            };
    lib.appendInputChild = 	function( root, elemAdd )
                            {
                                var input = lib.getInputElement( root );
                                if( input != null ){
                                    input.appendChild( elemAdd );
                                }
                            };



    lib.response	=	function( response )
                        {
                            this._response = ( response == null ) ? null : response.response ;
                            this._messages = "";

                            if( this._response.error != null ){
                                var errors = [];
                                if( this._response.error instanceof Array ){
                                    errors = this._response.error;
                                }
                                else{
                                    errors.push( this._response.error );
                                }
                                for( var i = 0 ; i < errors.length ; i ++ ){
                                    this._messages += ( errors[i]._code +" : " +
                                                          errors[i]._errorMessage +"\n");
                                }
                            }
//                            if( this._messages.length == 0 && this.getOutput() == null ){
//                                this._messages = "System Error : Illegal Format" ;
//                            }
                        }
    lib.response.prototype	=
    {
       getOutput : 		function()
                            {
                                return ( this._response == null ) ? null : ( this._response.message == null ) ? null : this._response.message.output ;
                            },
        getErrorMessage : 	function()
                            {
                                return this._messages;
                            },
        isError : 			function()
                            {
                                return ( this._messages.length != 0 );
                            },
        getErrorCode :      function()
        					{
        						return ( this._response == null ) ? null : ( this._response.error == null ) ? null : this._response.error._code ;
        					}
                        };
    lib.context = {
            URL_EXDB_SHUTSUZU : "http://localhost:8080/exdb",
            ACTION_SUFFIX : ".action",
            HTTP_METHOD_POST : "POST"
    }


    lib._callAction =	function( action, input, fxSuccess, fxError, isAsync )
    {
        var url = lib.context.URL_EXDB_SHUTSUZU + "/" + action + lib.context.ACTION_SUFFIX;
//        var url = "http://localhost:8080/StubDias/dias";
        var params = { "input" : input };

        var args = {
                        type: lib.context.HTTP_METHOD_POST,
                        url: url,
                        data: params,
                        dataType: 'text',
                        error : 	fxError,
                        success :	function(response){
                                        console.log("received response");
                                        var result = (new X2JS()).xml_str2json(response);
                                        fxSuccess(result);
                                    }
                    };
        if( isAsync ){
            args.async = true;
        }

        $.ajax( args );
    };

    /**
     * 非同期通信
     * @param action	アクション名
     * @param input		URLパラメータの、inputの値
     * @param fxSuccess	成功時のハンドラ
     * @param fxError	失敗時のハンドラ（必須ではない）
     */
    lib.callAction =	function( action, input, fxSuccess, fxError )
                        {
                            var handleError = ( fxError != null ) ? fxError : lib.defaultAjaxError ;
                            return lib._callAction(action, input, fxSuccess, handleError, true );
                        };

    /**
     * 同期通信
     * @param action	アクション名
     * @param input		URLパラメータの、inputの値
     * @param fxSuccess	成功時のハンドラ
     * @param fxError	失敗時のハンドラ（必須ではない）
     */
    lib.callActionSync  =	function( action, input, fxSuccess, fxError )
                        {
                            var handleError = ( fxError != null ) ? fxError : lib.defaultAjaxError ;
                            return lib._callAction(action, input, fxSuccess, handleError, false );
                        };

    lib.defaultAjaxError =	function( request, status, error )
                            {
                                alert(" システム例外が発生しました。システム管理者に連絡してください。 ");
                            }



    /**
     * ファイルの送信（form内の引数をすべてPOSTする）
     * @param action		POST先アクション名
     * @param input			inputパラメータ
     * @param formElement	送信するフォーム
     * @param fxSuccess		通信成功時のハンドラ
     * @param fxError		通信失敗時のハンドラ（必須ではない）
     */
    lib.sendFileAjax	=	function( action, input, formElement, fxSuccess, fxError )
    {
        var fd = new FormData( formElement );
        fd.append( "input", input );

        var url = lib.context.URL_EXDB_SHUTSUZU + "/" + action + lib.context.ACTION_SUFFIX;

        var handleError = ( fxError != null ) ? fxError : lib.defaultAjaxError ;

        var args =	{
                        url: url,
                        type: lib.context.HTTP_METHOD_POST,
                        contentType: false,
                        processData: false,
                        data: fd,
                        dataType: 'text',
                        enctype : 'multipart/form-data',
                        error : handleError,
                        success :	function(response){
                            var result = (new X2JS()).xml_str2json(response);
                            fxSuccess(result);
                        },
                        async: true
                    };
        $.ajax( args );
    };

    lib.toArray	= 	function( src )
    				{
    					var rst = [];
    					if( src != null ){
    						if( src instanceof Array ){
    							return src;
    						}
    						rst.push( src );
    					}
    					return rst;
    				};


    //データメンテ用のライブラリとして設定
    window.libDataMainte = lib;

})(window);
///////////////////////////////////////////////////







//カレンダーの設定値を返す
function getDataPickerOption(lang_flg)
{
    var op = {
            closeText: '閉じる',
            currentText: '現在日時',
            timeOnlyTitle: '日時を選択',
            timeText: '時間',
            hourText: '時',
            minuteText: '分',
            secondText: '秒',
            millisecText: 'ミリ秒',
            microsecText: 'マイクロ秒',
            timezoneText: 'タイムゾーン',
            prevText: '&#x3c;前',
            nextText: '次&#x3e;',
            monthNames: ['1月','2月','3月','4月','5月','6月','7月','8月','9月','10月','11月','12月'],
            monthNamesShort: ['1月','2月','3月','4月','5月','6月','7月','8月','9月','10月','11月','12月'],
            dayNames: ['日曜日','月曜日','火曜日','水曜日','木曜日','金曜日','土曜日'],
            dayNamesShort: ['日','月','火','水','木','金','土'],
            dayNamesMin: ['日','月','火','水','木','金','土'],
            weekHeader: '週',
            yearSuffix: '年',
            firstDay: 0,
            isRTL: false,
            showMonthAfterYear: true,
            showOn: "button",
            dateFormat: "yy/mm/dd",
            beforeShow: beforeShowFunc
            //buttonImage: "image/aaa.tif"
        };
    return op;

}

//言語切替時のカレンダー適用
function pickerLangChange(ctrlId, lang_flg)
{
    if(lang_flg == "0")
    {
        ctrlId.datepicker("option", {"closeText" : '閉じる',
                                     "prevText" : '&#x3c;前',
                                     "nextText" : '次&#x3e;',
                                     "monthNames" : ['1月','2月','3月','4月','5月','6月','7月','8月','9月','10月','11月','12月'],
                                     "monthNamesShort" : ['1月','2月','3月','4月','5月','6月','7月','8月','9月','10月','11月','12月'],
                                     "dayNames" : ['日曜日','月曜日','火曜日','水曜日','木曜日','金曜日','土曜日'],
                                     "dayNamesShort" : ['日','月','火','水','木','金','土'],
                                     "dayNamesMin" : ['日','月','火','水','木','金','土'],
                                     "showMonthAfterYear" : true,
                                     "weekHeader" : '週',
                                     "yearSuffix" : '年'
                                    }
                          );
    }
    else
    {
        ctrlId.datepicker("option", {"closeText" : 'CLOSE',
                                     "prevText" : 'Prev',
                                     "nextText" : 'Next',
                                     "monthNames" : ['January','February','March','April','May','June','July','August','September','October','November','December'],
                                     "monthNamesShort" : ['January','February','March','April','May','June','July','August','September','October','November','December'],
                                     "dayNames" : ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'],
                                     "dayNamesShort" : ['Su','Mo','Tu','We','Th','Fr','Sa'],
                                     "dayNamesMin" : ['Su','Mo','Tu','We','Th','Fr','Sa'],
                                     "showMonthAfterYear" : false,
                                     "weekHeader" : 'WEEK',
                                     "yearSuffix" : ''
                                    }
                          );
    }

}

function beforeShowFunc( input, inst ) {
    var date = $(this).parent().find('#hinbanDate').val();
    if(date == null){
        return;
    }
    var splitData = $.map(date.split('/'), $.trim);

    if(splitData.length != 3){
        return;
    }
    date = splitData[0] + "/" + splitData[1] + "/" + splitData[2];

    $(this).datepicker("setDate", date);
}

//システム日付を返す
function getSystemDate()
{
    var date = new Date();
    var strDate = date.toLocaleDateString();

    var localMonth = date.getMonth();
    localMonth++;
    if(localMonth.toString().length == 1)
    {
        localMonth = "0" + localMonth;
    }

    var localDate = date.getDate();
    if(localDate.toString().length == 1)
    {
        localDate = "0" + localDate;
    }

    var textDate = date.getFullYear() + "/" + localMonth + "/" + localDate;
    return textDate
}

//システム時刻を返す
function getSystemTime()
{
    var date = new Date();
    var strTime = date.toLocaleTimeString();
    var textHour = date.getHours();
    var textMinu = date.getMinutes();
    if(textHour.toString().length == 1)
    {
        textHour = "0" + textHour;
    }
    if(textMinu.toString().length == 1)
    {
        textMinu = "0" + textMinu;
    }
    var textTime = textHour + ":" + textMinu;
    return textTime;
}

//システム時刻を返す(指定時間を加算)
function getSystemTimeAddHour(addHour)
{
    var date = new Date();
    date.setHours(date.getHours() + addHour);
    var strTime = date.toLocaleTimeString();
    var textHour = date.getHours();
    var textMinu = date.getMinutes();
    if(textHour.toString().length == 1)
    {
        textHour = "0" + textHour;
    }
    if(textMinu.toString().length == 1)
    {
        textMinu = "0" + textMinu;
    }
    var textTime = textHour + ":" + textMinu;
    return textTime;
}

//クラス名によるチェックの全選択・全解除
function checkAllOnOff(className, boolVal)
{
    $("." + className).prop("checked", boolVal);
}

//クラス名によるチェックの全選択・全解除（非表示レコードはOFF）
function checkVisibleAllOnOff(className, boolVal)
{
    $("." + className + ":visible").prop("checked", boolVal);
    $("." + className + ":not(:visible)").prop("checked", false);
}

//種別コードから和名を取得
//使用箇所にてこの後言語設定を実行すること
function getClassificationName(class_code)
{
    var result = "";
    switch(class_code){
        case "01":
            result = "図面";
            break;
        case "02":
            result = "設変依頼書(図面)";
            break;
        case "03":
            result = "特管表(図面)";
            break;
        case "04":
            result = "製品規格";
            break;
        case "05":
            result = "技術指示書";
            break;
        case "06":
            result = "設変依頼書(製品規格類)";
            break;
        case "07":
            result = "特管表(製品規格類)";
            break;
        case "08":
            result = "ソフトウェア";
            break;
        case "09":
            result = "その他";
            break;
        default:
            result = "";
            break;
    }
    return result;
}

//URLより値を取得（GET)
function getUrlArg(url)
{
    var result = new Array();
    result["SEL_VAL"] = "";
    result["LANG_VAL"] = "";
    result["NOW_TIME"] = "";
    result["TIMEZONE"] = "";
    result["USER_ID"] = "";

    var url_sp = url.split('?');
    if(url_sp.length <= 1)
    {
        return result;
    }

    var url_sp2 = url_sp[1].split('&');
    if(url_sp2.length < 1)
    {
        return result;
    }

    for(var i = 0; i < url_sp2.length; i++)
    {
        var url_sp3 = url_sp2[i].split('=');
        if(url_sp3.length == 2)
        {
            if(url_sp3[0] == "pagetojump")
            {
                result["SEL_VAL"] = url_sp3[1];
            }
            if(url_sp3[0] == "langCd")
            {
                result["LANG_VAL"] = url_sp3[1];
            }
            if(url_sp3[0] == "nowTime")
            {
                result["NOW_TIME"] = url_sp3[1];
            }
            if(url_sp3[0] == "timeZone")
            {
                result["TIMEZONE"] = url_sp3[1];
            }
            if(url_sp3[0] == "userId")
            {
                result["USER_ID"] = url_sp3[1];
            }
        }
    }
    return result;
}

function ajaxNormalPost(requestObj, url, callbackFunc, optionArg)
{
    var req = {request : requestObj};
    var x2js = new X2JS();
    var requestXml = x2js.json2xml_str(req);

    if(requestXml == "<request/>")
    {
        // kuri
        requestXml = "<request>"+x2js.json2xml_str(requestObj)+"</request>";
    }

    if(url != "")
    {
        url = "http://localhost:8080/exdb/" + url + ".action";

        if(optionArg["async"] == true)
        {
            $.ajax({
                type: "POST",
                url: url,
                async: true,
                data: {input : requestXml},
                dataType: 'text',
                error : ErrorHttpRequest,
                success : function(response){
                    var result = x2js.xml_str2json(response);
                    callbackFunc(result);
                }
            });
        }
        else
        {
            $.ajax({
                type: "POST",
                url: url,
                data: {input : requestXml},
                dataType: 'text',
                error : ErrorHttpRequest,
                success : function(response){
                    var result = x2js.xml_str2json(response);
                    callbackFunc(result);
                }
            });
        }
    }

}

function ajaxFormDataPost(formid, requestObj, url, callbackFunc, optionArg,input)
{
    var fd = new FormData($("#" + formid).get(0));
    fd.append( "input", input );
    if(url != "")
    {
        $.ajax({
            url: url,
            type: "POST",
            contentType: false,
            processData: false,
            data: fd,
            dataType: 'text',
            enctype : 'multipart/form-data',
            error : ErrorHttpRequest,
            success : function(response){
                var x2js = new X2JS();
                var result = x2js.xml_str2json(response);
                callbackFunc(result);
            }
        });
    }
}

function ErrorHttpRequest(XMLHttpRequest, textStatus, errorThrown)
{
    alert("SYSTEM ERROR：" + textStatus + "：\n" + errorThrown);
}

//日付チェック
function chkDate(strval)
{
    if(!strval.match(/^\d{4}\/\d{2}\/\d{2}/))
    {
        return false;
    }
    var stryear = strval.substr(0, 4) -0;
    var strmonth = strval.substr(5, 2) -1;
    var strday = strval.substr(8, 2) -0;

    if(stryear < 1900 || stryear > 2099 || strmonth < 0 || strmonth > 11 || strday < 1 || strday > 31)
    {
        return false;
    }

    var objdate = new Date(stryear, strmonth, strday);
    if(isNaN(objdate))
    {
        return false;
    }

    if(objdate.getFullYear() != stryear || objdate.getMonth() != strmonth || objdate.getDate() != strday)
    {
        return false;
    }

    return true;
};

//時間チェック
function chkTime(strval)
{
    if(!strval.match(/^\d{2}\:\d{2}/))
    {
        return false;
    }

    var strary = strval.split(':');

    if(!chkNumeric(strary[0]) || !chkNumeric(strary[1]))
    {
        return false;
    }

    if(Number(strary[0]) < 0 || Number(strary[0]) > 23 || Number(strary[1]) < 0 || Number(strary[1]) > 59)
    {
        return false;
    }

    return true;
};

//数値チェック
function chkNumeric(num)
{
    if(isNaN(Number(num)))
    {
        return false;
    }
    return true;
}

function chkEisujiKigo(strval)
{

	return true;
}

//英数字記号チェック
function chkSysmbolEisuji(strval)
{
	var strrep = strval.replace(/[!"#$%&'()\*\+\-\.,\/:;<=>?@\[\\\]^_` {|}~]/g, '').replace(/[0-9A-Za-z]+/, '');
	if(strrep != "")
	{
		return false;
	}
	return true;
}

//記号チェック
function chkSysmbol(strval)
{
	if(strval.match(/[^!"#$%&'()\*\+\-\.,\/:;<=>?@\[\\\]^_` {|}~]/g) != null)
	{
		return false;
	}
	return true;
}

//英数字チェック
function chkEisuji(strval)
{
    if(strval.match(/[^0-9A-Za-z]+/) != null)
    {
        return false;
    }
    return true;
}

//英字チェック
function chkEiji(strval)
{
    if(strval.match(/[^A-Za-z]+/) != null)
    {
        return false;
    }
    return true;
}

//ファイル名称禁則文字チェック
function chkNotInFileName(strval)
{
    if(!(strval.match(/[\\\/:*?"<>|]/) == null))
    {
        return false;
    }
    return true;
}

function getTableName(class_code)
{
    var result = "";
    switch(class_code){
        case "ATTR_NAME":
            result = "名前";
            break;
        case "PRJ_NO":
            result = "プロジェクト№";
            break;
        case "PRODUCT":
            result = "製品";
            break;
        case "DEPT":
            result = "部署";
            break;
        case "GROUP":
            result = "ｸﾞﾙｰﾌﾟ";
            break;
        case "MODEL":
            result = "車種";
            break;
        case "PHASE":
            result = "フェーズ";
            break;
        case "PRODUCT_NAME":
            result = "品名";
            break;
        case "DRAW_SIZE":
            result = "ｻｲｽﾞ";
            break;
		case "KEEP_LIMIT":
            result = "保管期限";
            break;
		case "REMARKS":
            result = "備考";
            break;
        default:
            result = "";
            break;
    }
    return result;
}
