const showObservationForm = () => {
    //清空畫面並顯示 Observation 表單
    let content = $('#content');

    content.empty();
    content.append(`
    <form>
        <h3>患者資料</h3>
        <div class="form-group row">
            <label class="col-sm-2 col-form-label">病人 ID</label>
            <div class="col-sm-10">
                <input type="text" class="form-control" id="subject"> 
            </div>
        </div>
        <div class="form-group row">
            <label class="col-sm-2 col-form-label">檢驗報告生效日期</label>
            <div class="col-sm-10">
                <input type="datetime-local" class="form-control" id="effectiveDateTime">
            </div>
        </div>
        <h3>檢驗資料</h3>
        <div class="form-group row">
            <label class="col-sm-2 col-form-label">檢驗項目</label>
            <div class="col-sm-10">
                <input type="text" class="form-control" id="code">
            </div>
        </div>
        <div class="form-group row">
            <label class="col-sm-2 col-form-label">檢驗值／單位</label>
            <div class="col-sm-8">
                <input type="text" class="form-control" id="value">
            </div>
            <div class="col-sm-2">
                <input type="text" class="form-control" id="unit" placeholder="mg/dl">
            </div>
        </div>
        <h3>參考值</h3>
        <div class="form-group row">
            <label class="col-sm-2 col-form-label">最大</label>
            <div class="col-sm-4">
                <input type="text" class="form-control" id="high">
            </div>
            <label class="col-sm-2 col-form-label">最小</label>
            <div class="col-sm-4">
                <input type="text" class="form-control" id="low">
            </div>
        </div>

        <a onclick="uploadObservationForm()" class="btn btn-primary">送出</button>
    </form>
    `);
};

const uploadObservationForm = () => {
    let content = $('#content');

    // 清除警告訊息
    $('.alert').remove();

    // 檢查資料
    if( $('#subject').val() === '') {
        content.prepend(`
        <div class="alert alert-danger">請填寫患者 ID！</div>
        `);
    }

    if( $('#code').val() === '') {
        content.prepend(`
        <div class="alert alert-danger">請填寫檢驗項目！</div>
        `);
    }

    if( $('#value').val() === '') {
        content.prepend(`
        <div class="alert alert-danger">請填寫檢驗值！</div>
        `);
    }

    if( $('#unit').val() === '') {
        content.prepend(`
        <div class="alert alert-danger">請填寫單位！</div>
        `);
    }

    if( $('#high').val() === '') {
        content.prepend(`
        <div class="alert alert-danger">請填寫參考值（最大）！</div>
        `);
    }

    if( $('#low').val() === '') {
        content.prepend(`
        <div class="alert alert-danger">請填寫參考值（最小）！</div>
        `);
    }

    if( $('#effectiveDateTime').val() === '') {
        content.prepend(`
        <div class="alert alert-danger">請填寫檢驗報告生效日期！</div>
        `);
    }

    // 計算檢驗值是過高還過低
    let interpretation = '';
    if( $('#value').val() > $('#high').val()){
        interpretation = 'H';
    } else if ($('#value').val() < $('#low').val()) {
        interpretation = 'L';
    } else {
        interpretation = 'N';
    }

    // 資料檢查完畢，開始寫入
    const fhirData = {
        resourceType: 'Observation',
        status: 'final',
        category: [{
            coding: [{
                system: "http://hl7.org/fhir/ValueSet/observation-category",
                code: "laboratory"
            }]
        }],
        code: {
            coding: [{
                system: "http://loinc.org",
                display: $('#code').val(),
            }]
        },
        subject: {
            reference: 'Patient/' + $('#subject').val(),
        },
        effectiveDateTime: $('#effectiveDateTime').val(),
        valueQuantity: {
            value: $('#value').val(),
            unit: $('#unit').val()
        },
        referenceRange: [{
            low: {
                value: $('#low').val(),
                unit: $('#unit').val()
            },
            high: {
                value: $('#high').val(),
                unit: $('#unit').val()
            }
        }],
        interpretation: [{
            coding: [{
                system: "http://hl7.org/fhir/v2/0078",
                code: interpretation
            }]
        }]
    };

    // 送出至伺服器
    fetch(`${baseUrl}/Observation`, {
        method: 'POST',
        body: JSON.stringify(fhirData),
        headers: {'Content-Type': 'application/fhir+json;charset=utf-8'}
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
    });
}