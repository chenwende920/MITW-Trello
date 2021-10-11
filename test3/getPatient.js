

//清單查看詳細病患內容
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
            <label class="col-sm-4 col-form-label">姓氏：</label>
            <div class="col-sm-8">
                <input type="text" class="form-control" id="namefamily" value="${(json.name)?(json.name[0].family):""}" >
            </div>
        </div>
        <div class="form-group row p-2">
            <label class="col-sm-4 col-form-label">名字：</label>
            <div class="col-sm-8">
                <input type="text" class="form-control" id="namegiven" value="${(json.name)?(json.name[0].given[0]):""}" >
            </div>
        </div>
        <div class="form-group row p-2">
        <label class="col-sm-4 col-form-label">身分證字號：</label>
        <div class="col-sm-8">
            <input type="text" class="form-control" id="identifier" value="${(json.identifier)?(json.identifier[0].value):""}" >
        </div>
        </div>
        <div class="form-group row p-2">
            <label class="col-sm-4 col-form-label">電話：</label>
            <div class="col-sm-8">
                <input type="text" class="form-control" id="telecom" value="${(json.telecom)?(json.telecom[0].value):""}" >
            </div>
        </div>
        <div class="form-group row p-2">
            <label class="col-sm-4 col-form-label">性別：</label>
            <div class="col-sm-8">
                <input type="text" id="gender" class="form-control" value="${json.gender}" >
            </div>
        </div>
        <div class="form-group row p-2">
            <label class="col-sm-4 col-form-label">出生年月日：</label>
            <div class="col-sm-8">
                <input type="date" class="form-control" id="birthDate" value="${(json.birthDate) || ""}" >
            </div>
        </div>
        <div class="form-group row p-2">
            <label class="col-sm-4 col-form-label">地址：</label>
            <div class="col-sm-8">
                <input type="text" class="form-control" id="address" value="${(json.address)?(json.address[0].text):""}" >
            </div>
        </div>
        <a onclick="listPatientWithEdit(${json.id})" class="btn btn-primary">更新內容</a>
        `);

    })
}

//搜尋查看詳細病患內容
function searchPatient() {

    let searchId = document.getElementById('searchId').value;
    let detailContent = $('#detailContent');

    detailContent.html("");

    if( searchId == ""){
        alert("Please enter");
    };

    fetch(`${baseUrl}/Patient/${searchId}`,{
        method: 'GET',
        headers: baseheader
    })
    .then(res => res.json())
    .then(json => {

        detailContent.append(`
        <h4>病患資料</h4>
        <div class="form-group row p-2">
            <label class="col-sm-4 col-form-label">姓氏：</label>
            <div class="col-sm-8">
                <input type="text" class="form-control" id="namefamily" value="${(json.name)?(json.name[0].family):""}" >
            </div>
        </div>
        <div class="form-group row p-2">
            <label class="col-sm-4 col-form-label">名字：</label>
            <div class="col-sm-8">
                <input type="text" class="form-control" id="namegiven" value="${(json.name)?(json.name[0].given[0]):""}" >
            </div>
        </div>
        <div class="form-group row p-2">
        <label class="col-sm-4 col-form-label">身分證字號：</label>
        <div class="col-sm-8">
            <input type="text" class="form-control" id="identifier" value="${(json.identifier)?(json.identifier[0].value):""}" >
        </div>
        </div>
        <div class="form-group row p-2">
            <label class="col-sm-4 col-form-label">電話：</label>
            <div class="col-sm-8">
                <input type="text" class="form-control" id="telecom" value="${(json.telecom)?(json.telecom[0].value):""}" >
            </div>
        </div>
        <div class="form-group row p-2">
            <label class="col-sm-4 col-form-label">性別：</label>
            <div class="col-sm-8">
                <input type="text" id="gender" class="form-control" value="${json.gender}" >
            </div>
        </div>
        <div class="form-group row p-2">
            <label class="col-sm-4 col-form-label">出生年月日：</label>
            <div class="col-sm-8">
                <input type="date" class="form-control" id="birthDate" value="${(json.birthDate) || ""}" >
            </div>
        </div>
        <div class="form-group row p-2">
            <label class="col-sm-4 col-form-label">地址：</label>
            <div class="col-sm-8">
                <input type="text" class="form-control" id="address" value="${(json.address)?(json.address[0].text):""}" >
            </div>
        </div>
        <a onclick="listPatientWithEdit(${json.id})" class="btn btn-primary">更新內容</a>
        `);


    })
    .catch(err => console.log(err));

}


