

function PostEncounter(){

    let content = $('#content');
    let detailContent = $('#detailContent');
    
    content.html("");
    detailContent.html("");
    detailContent.show();

    detailContent.append(`
        <h4>顯示上傳的資料</h4>
        <div class="form-group">
            <textarea class="form-control" name="" id="resultData" cols="30" rows="20"></textarea>
        </div>
    `);
    

    content.append(`
    <div class=row>
        <div class="col-md-6">
            <div class="row">
                <h4>派遣單位</h4>
                
                <div class="form-group row p-2">
                    <label class="col-sm-4 col-form-label">填寫時間：</label>
                    <div class="col-sm-8">
                        <input type="date" class="form-control" id="writeperiod">
                    </div>
                </div>
                
                <div class="form-group row p-2">
                    <label class="col-sm-4 col-form-label">發生地點：</label>
                    <div class="col-sm-8">
                        <input type="text" class="form-control" id="accidentLocation">
                    </div>
                </div>
                <div class="form-group row p-2">
                    <label class="col-sm-4 col-form-label">派遣單位ID：</label>
                    <div class="col-sm-8">
                        <input type="text" class="form-control" id="organizationID">
                    </div>
                </div>
                <div class="row p-4">
                    <button type="button" class="btn btn-secondary btn-block" onclick="PostData()">上傳</button>
                </div>

            </div>
            
        </div>

    </div>
    `);

}


function PostData(){

    //Encounter
    let writeperiod = document.getElementById('writeperiod').value
    let accidentLocation = document.getElementById('accidentLocation').value;
    let organizationID = document.getElementById('organizationID').value;

    let tagid = "001c936a-17b0-4fc6-927d-fb33a6865542";

    let fhirData = {
        resourceType: "Encounter",
        meta: {
        tag : [{
            system: "http://loinc.org",
            code: tagid
            }]
        },
        status: "in-progress",
        class: {
            code: "AMB",
            display: "ambulatory"
            }, 
        period: {
            start: writeperiod  
        },
        location: [
            {
                location: {
                    display: accidentLocation
                },
                status: "active"
            }
        ],
        serviceProvider: {
            reference: "Organization/"+organizationID
        }


    }


    alert(JSON.stringify(fhirData));
    fetch(`${baseUrl}/Encounter`,{
        method: "POST",
        body: JSON.stringify(fhirData),
        headers: baseheader
    })
    .then(response => response.json())
    .then(function(json){
        const resultData = document.getElementById("resultData");
        resultData.textContent = JSON.stringify(json);

    })
    .catch(err => console.log(err));

}


//https://hapi.fhir.tw/fhir/Encounter/100891