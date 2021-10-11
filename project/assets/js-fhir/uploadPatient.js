
function uploadPatient(){

    let content = $('#content');
    let detailContent = $('#detailContent');
    detailContent.show();
    content.html("");

    content.append(`
        <h4>病患資料</h4>
        <div class="form-group row p-2">
            <label class="col-sm-4 col-form-label">姓氏：</label>
            <div class="col-sm-8">
                <input type="text" class="form-control" id="family">
            </div>
        </div>
        <div class="form-group row p-2">
            <label class="col-sm-4 col-form-label">名字：</label>
            <div class="col-sm-8">
                <input type="text" class="form-control" id="given">
            </div>
        </div>
        <div class="form-group row p-2">
            <label class="col-sm-4 col-form-label">身分證字號：</label>
            <div class="col-sm-8">
                <input type="text" class="form-control" id="identifier">
            </div>
        </div>
        <div class="form-group row p-2">
            <label class="col-sm-4 col-form-label">電話：</label>
            <div class="col-sm-8">
                <input type="text" class="form-control" id="telecom">
            </div>
        </div>
        <div class="form-group row p-2">
            <label class="col-sm-4 col-form-label">性別：</label>
            <div class="col-sm-8">
                <div class="custom-control custom-radio custom-control-inline">
                    <input type="radio" id="gender-male" name="gender" class="custom-control-input" value="male">
                    <label class="custom-control-label" for="gender-male">男性</label>
                </div>
                <div class="custom-control custom-radio custom-control-inline">
                    <input type="radio" id="gender-female" name="gender" class="custom-control-input" value="female">
                    <label class="custom-control-label" for="gender-female">女性</label>
                </div>
            </div>
        </div>
        <div class="form-group row p-2">
            <label class="col-sm-4 col-form-label">出生年月日：</label>
            <div class="col-sm-8">
                <input type="date" class="form-control" id="birthDate">
            </div>
        </div>
        <div class="form-group row p-2">
            <label class="col-sm-4 col-form-label">住址：</label>
            <div class="col-sm-8">
                <input type="text" class="form-control" id="address">
            </div>
        </div>
        <button type="button" class="btn btn-secondary btn-block" onclick="postPatient()">上傳</button>

    `);
}

function postPatient(){

    //Patient
    let getfamily = document.getElementById('family').value;
    let getgiven = document.getElementById('given').value
    
    let identifier = document.getElementById('identifier').value;
    let telecom = document.getElementById('telecom').value;
    //取得性別資訊
    let items = document.getElementsByName("gender");
    let get_gender = "";
    for(let i = 0; i < items.length;i++){
        if(items[i].checked){
            get_gender = items[i].value;
        }
    }
    let birth = document.getElementById('birthDate').value;
    let address = document.getElementById('address').value;


    

    let tagid = "001c936a-17b0-4fc6-927d-fb33a6865542";


    let fhirData = {
        resourceType: "Patient",
        meta: {
        tag : [{
            system: "http://loinc.org",
            code: tagid
            }]
        },
         
        identifier: [{
            use: "usual",
            value: identifier,
            type: {
                "text": "身份證字號"
            }
        }],
        name: [{
            use: "official",
            text: getfamily+getgiven,
            family: getfamily,
            given: [
                getgiven
            ]
        }],
        gender: get_gender,
        birthDate: birth,
        address: [{
            use: "home",
            text: address,
            country: "TW"
        }],
        telecom: [{
            system: "phone",
            value: telecom,
            use: "mobile"
        }],
        active: true
        
        
    }


    alert(JSON.stringify(fhirData));
    fetch(`${baseUrl}/Patient`,{
        method: "POST",
        body: JSON.stringify(fhirData),
        headers: baseheader
    })
    .then(response => response.json())
    .then(function(json){
        const resultData = document.getElementById("resultData");
        resultData.textContent = JSON.stringify(json);

    })

}


//https://hapi.fhir.tw/fhir/Patient/100900