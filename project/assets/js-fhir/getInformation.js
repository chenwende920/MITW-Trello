const getInformation = (id) => {
    let content = $('#content');
    
    // 清空畫面並顯示 Loading 訊息
    content.empty();
    content.append("<p> Loading... </p>");

    // 抓資料
    fetch(`${baseUrl}/Bundle/${id}`)
    .then(res => res.json())
    .then(json => {
        let list=["active", "inactive", "entered-in-error"];
        console.log(list[0])
        content.empty();

        content.append(`
        <form>
            <h3>新增藥物</h3>
            <div class="form-group row">
                <label class="col-sm-2 col-form-label">med_name</label>
                <div class="col-sm-10">
                    <input type="text" class="form-control" id="identifier" value="${(json.entry[0].resource.code.coding)?(json.entry[0].resource.code.coding[0].display):""}"> 
                </div>
            </div>
            <div class="form-group row">
                <label class="col-sm-2 col-form-label">code</label>
                <div class="col-sm-10">
                    <input type="text" class="form-control" id="code" value="${(json.entry[0].resource.code)?(json.entry[0].resource.code.coding[0].code):""}"> 
                </div>
            </div>
            `);
            switch(`${(json.entry[0].resource.status)}`){
                case list[0]:
                    content.append(`
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
                    `);
                    break;
                case list[1]:
                    content.append(`
                    <div class="form-group row">
                        <label class="col-sm-2 col-form-label">status</label>
                        <div class="col-sm-10">
                            <select class="form-control" id="status">
                                <option value="active">Active</option>
                                <option value="inactive" selected>Inactive</option>
                                <option value="entered-in-error">Entered in Error</option>
                            </select>
                        </div>
                    </div>
                    `);
                    break;
                case list[2]:
                    content.append(`
                    <div class="form-group row">
                        <label class="col-sm-2 col-form-label">status</label>
                        <div class="col-sm-10">
                            <select class="form-control" id="status">
                                <option value="active">Active</option>
                                <option value="inactive">Inactive</option>
                                <option value="entered-in-error" selected>Entered in Error</option>
                            </select>
                        </div>
                    </div>
                    `);
                    break;
            }
            content.append(`
            <div class="form-group row">
                <label class="col-sm-2 col-form-label">manufacturer</label>
                <div class="col-sm-10">
                    <input type="text" class="form-control" id="manufacturer" value="${(json.entry[0].resource.contained)?(json.entry[0].resource.contained[0].name):""}"> 
                </div>
            </div>

            <a onclick="updateMedicationForm(${json.id})" class="btn btn-primary">送出</button>
            <a  onclick="deleteMedicationForm(${json.id})"
                class="btn btn-danger"
                style="position: relative;left: 10px;">
            刪除</button>
        </form>
        `);
    });
};

const updateMedicationForm = (id) => {
    const baseheader = new Headers({
        "Accept": "application/json",
        'Content-Type': 'application/fhir+json;charset=utf-8',
        'Authorization': `Bearer 001c936a-17b0-4fc6-927d-fb33a6865542`
    });
    let content = $('#content');

    const fhirData = {
        resourceType: 'Bundle',
        id: `${id}`,
        meta: {
        tag : [{
          system: "https://api.dev.sita.tech/api/",
          code: "001c936a-17b0-4fc6-927d-fb33a6865542"
          }]
        },
        type: "collection",
        entry: [
          {
            fullUrl: "https://hapi.fhir.tw/fhir/Medication/100290",
            resource: {
              resourceType: "Medication",
              id: $('#identifier').val(),
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
              status: $('#status').val()
            }
          }
        ]
    };

    fetch(`${baseUrl}/Bundle/${id}`, {
        method: 'PUT',
        body: JSON.stringify(fhirData),
        headers: baseheader
    })
    .then(res => res.json())
    .then(response => {
        content.empty();
        content.append(`
            <div class="col-md-12">
                <h4>請求資料</h4>
                <textarea class="form-control" rows="15">${JSON.stringify(fhirData, null, 4)}"></textarea>
                <h4>回應資料</h4>
                <textarea class="form-control" rows="15">${JSON.stringify(response, null, 4)}</textarea>
            </div>
        `);
        console.log(response)
    });
}

const deleteMedicationForm = (id) => {
    const baseheader = new Headers({
        "Accept": "application/json",
        'Content-Type': 'application/fhir+json;charset=utf-8',
        'Authorization': `Bearer 001c936a-17b0-4fc6-927d-fb33a6865542`
    });
    let content = $('#content');

    Swal.fire({
        title: '確定要刪除紀錄?',
        text: "你將無法返回此操作!",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: '確認, 刪除!',
        cancelButtonText: '取消'
    })
    .then(async(result) => {
        if (result.isConfirmed) {
            fetch(`${baseUrl}/Bundle/${id}`, {
                method: 'DELETE',
                headers: baseheader
            })
            .then(res => res.json())
            .then(response => {
                content.empty();
                content.append(`
                    <div class="col-md-12">
                        <h4>回應資料</h4>
                        <textarea class="form-control" rows="15">${JSON.stringify(response, null, 4)}</textarea>
                    </div>
                `);
                console.log(response)
            });
            const text = await res.json();
            console.log(text);
            Swal.fire(
                '刪除成功!',
                '你的紀錄已被刪除.',
                'success'
            )
        }
    })
}