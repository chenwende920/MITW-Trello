// const baseUrl1 = "https://hapi.fhir.tw/fhir"; //https://hapi.fhir.tw/fhir //http://hapi.fhir.org/baseR4 //https://api.dev.sita.tech/api/
// const token = "001c936a-17b0-4fc6-927d-fb33a6865542";

// const baseheader = new Headers({
//     "Accept": "application/json",
//     'Content-Type': 'application/fhir+json;charset=utf-8',
//     // 'Authorization': `Bearer ${token}`
    
// });


function getPatient(id) {

    let detailContent = $('#detailContent');

    detailContent.html("");

    fetch(`${baseUrl}/Patient/${id}`,{
        method: 'GET',
        headers: baseheader
    })
    .then(resource => resource.json())
    .then(function(json) {

        console.log("--------");
        console.log(json);
        detailContent.append(`
        <h4>病患資料</h4>
        <div class="form-group row p-2">
            <label class="col-sm-4 col-form-label">名字：</label>
            <div class="col-sm-8">
                <input type="text" class="form-control" id="family" value="${(json.name)?(json.name[0].text):""}" readonly>
            </div>
        </div>
        <div class="form-group row p-2">
        <label class="col-sm-4 col-form-label">身分證字號：</label>
        <div class="col-sm-8">
            <input type="text" class="form-control" id="identifier" value="${(json.identifier)?(json.identifier[0].value):""}" readonly>
        </div>
        </div>
        <div class="form-group row p-2">
            <label class="col-sm-4 col-form-label">電話：</label>
            <div class="col-sm-8">
                <input type="text" class="form-control" id="telecom" value="${(json.telecom)?(json.telecom[0].value):""}" readonly>
            </div>
        </div>
        <div class="form-group row p-2">
            <label class="col-sm-4 col-form-label">性別：</label>
            <div class="col-sm-8">
                <input type="text" id="gender-male" name="gender" class="form-control" value="${json.gender}" readonly>
            </div>
        </div>
        <div class="form-group row p-2">
            <label class="col-sm-4 col-form-label">出生年月日：</label>
            <div class="col-sm-8">
                <input type="date" class="form-control" id="birthDate" value="${(json.birthDate) || ""}" readonly>
            </div>
        </div>
        <div class="form-group row p-2">
            <label class="col-sm-4 col-form-label">地址：</label>
            <div class="col-sm-8">
                <input type="text" class="form-control" id="birthDate" value="${(json.address)?(json.address[0].text):""}" readonly>
            </div>
        </div>
        <a onclick="listPatientWithEdit()" class="btn btn-primary">編輯內容</a>
        `);

    })
}