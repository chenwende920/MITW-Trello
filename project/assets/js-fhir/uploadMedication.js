
function uploadMedication(){

    let content = $('#content');
    let detailContent = $('#detailContent');
    detailContent.show();
    content.html("");

    content.append(`
    <form>
        <h3>新增藥物</h3>
        <div class="form-group row">
            <label class="col-sm-2 col-form-label">med_name</label>
            <div class="col-sm-10">
                <input type="text" class="form-control" id="identifier"> 
            </div>
        </div>
        <div class="form-group row">
            <label class="col-sm-2 col-form-label">code</label>
            <div class="col-sm-10">
                <input type="text" class="form-control" id="code"> 
            </div>
        </div>
        <div class="form-group row">
            <label class="col-sm-2 col-form-label">status</label>
            <div class="col-sm-10">
              <select class="form-control" id="status">
                <option value="active" selected>Active</option>
                <option value="inactive">Inactive</option>
                <option value="entered-in-error">Entered in Error</option>
              </select>
            </div>
        </div>
        <div class="form-group row">
            <label class="col-sm-2 col-form-label">manufacturer</label>
            <div class="col-sm-10">
                <input type="text" class="form-control" id="manufacturer"> 
            </div>
        </div>

        <a onclick="uploadMedicationForm()" class="btn btn-primary">送出</button>
    </form>
    `);
}



const uploadMedicationForm = () => {
    
      let content = $('#content');
  
      // 資料檢查完畢，開始寫入
      const fhirData = {
          resourceType: 'Bundle',
          meta: {
          tag : [{
            system: "https://api.dev.sita.tech/api/",
            code: "001c936a-17b0-4fc6-927d-fb33a6865542"
            }]
          },
          type: "collection",
          entry: [
            {
              fullUrl: "https://api.dev.sita.tech/api/Medication/100290",
              resource: {
                resourceType: "Medication",
                id: $('#identifier').val(),
                contained: [ {
                  resourceType: "Organization",
                  id: $('#manufacturer').val(),
                  name: $('#manufacturer').val()
                }],
                code: {
                  coding: [
                    {
                      system: "http://snomed.info/sct",
                      code: $('#code').val(),
                      display: $('#identifier').val()
                    }
                  ],
                  text: $('#code').val()
                },
                status: $('#status').val(),
                manufacturer: {
                  reference: "#" + $('#manufacturer').val()
                }
              }
            }
          ]
      };
      const fhirData2 = {
        resourceType: 'Bundle',
        meta: {
        tag : [{
          system: "https://api.dev.sita.tech/api/",
          code: "001c936a-17b0-4fc6-927d-fb33a6865542"
          }]
        },
        type: "collection",
        entry: [
          {
            fullUrl: "https://api.dev.sita.tech/api/Medication/100290",
            resource: {
              resourceType: "Medication",
              id: "Medexample9",
              code: {
                coding: [
                  {
                    system: "http://snomed.info/sct",
                    code: "116602009",
                    display: "Medexample"
                  }
                ]
              },
              status: "active",
              contained: [ {
                resourceType: "Organization",
                id: "Gene Inc",
                name: "Gene Inc"
              }],
              manufacturer: {
                reference: "#Gene Inc"
              }
            }
          }
        ]
    };
    
  
      // 送出至伺服器
      fetch(`${baseUrl}/Bundle`, {
          method: 'POST',
          body: JSON.stringify(fhirData),
          headers: baseheader
      })
      .then(response => response.json())
      .then(function(json){
            const resultData = document.getElementById("resultData");
            resultData.textContent = JSON.stringify(json);

    })
  }