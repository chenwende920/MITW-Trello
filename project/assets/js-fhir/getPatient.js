function getPatient(id){
    console.log(id);

    let extraData = $('#extraData');
    extraData.html("");

    fetch(`${baseUrl}/Patient/${id}`,{
        method: 'GET',
        headers: baseheader
    })
    .then(response => response.json())
    .then(function (json) {
        console.log(json);

        extraData.append(`
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
        <button onclick="putPatient(${id})" class="btn btn-primary">更新內容</button>
        `);
        

        
    })
    .catch(err => console.log(err));

}


function putPatient(id){
    let namefamily = document.getElementById('namefamily').value;

    let namegiven = document.getElementById('namegiven').value;
    let identifier = document.getElementById('identifier').value;
    let telecom = document.getElementById('telecom').value;
    let gender = document.getElementById('gender').value;
    let birthDate = document.getElementById('birthDate').value;
    let address = document.getElementById('address').value;

    let tagid = "001c936a-17b0-4fc6-927d-fb33a6865542";
    

    let fhirUpdateData = {
        resourceType: "Patient",
        id: id.toString(),
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
            text: namefamily+namegiven,
            family: namefamily,
            given: [
                namegiven
            ]
        }],
        gender: gender,
        birthDate: birthDate,
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


    alert(JSON.stringify(fhirUpdateData));

    fetch(`${baseUrl}/Patient/${id}`,{
        method: 'PUT',
        headers: baseheader,
        body: JSON.stringify(fhirUpdateData),
    })
    .then(resource => resource.json())
    .then(function(json) {

        console.log(json);
        alert("更改成功");
        console.log(JSON.stringify(fhirUpdateData));
    })
    .catch(err => console.log(err))
}