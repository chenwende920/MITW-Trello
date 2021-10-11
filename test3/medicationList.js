

function listMedications(){
    let content = $('#content');

    content.html(''); //清空

    fetch(`${baseUrl}/MedicationRequest`,{
        method: 'GET',
        headers: baseheader
    })
    .then(response => response.json())
    .then(function(json){
        console.log(json);
        let medicationsBody = json.entry;

        content.append(`
            <table class="table table-striped">
            <thead class="thead">
            <tr class="table-dark">
                <th scope="col">ID</th>
                <th scope="col">紀錄時間</th>
                <th scope="col">藥品項目</th>
                <th scope="col">查詢</th>
            </tr>
            </thead>
            <tbody id="Medications"> </tbody>
            </table>
        `);

        
        medicationsBody.map( entry => {
            $('#Medications').append(`
            <tr>
            <td>${entry.resource.id}</td>
            <td>${entry.resource.authoredOn}</td>
            <td>${entry.resource.medicationReference.reference}</td>
            <td><button class="btn btn-secondary rounded-pill btn-sm" onclick="getMedication(${entry.resource.id})">查看</button></td>
            </tr>
            `)
        });

        console.log(json.link);

        try{
            //顯示下一頁資料
            if(json.link.length > 0 && json.link[1].relation === 'next') {
                content.append(`<a onclick="listMedicationWithUrl('${json.link[1].url}')" class="btn btn-primary">下一頁</a>`);
            }
        }
        catch{
            console.log("沒有下一頁");
        }

    })
    .catch(err => console.log(err));
}


//顯示下一頁派遣單內容
function listMedicationWithUrl(url) {
    let content = $('#content');

    content.html("");

    fetch(`${url}`)
    .then(response => response.json())
    .then(function(json) {
        
        let medicationsBody = json.entry;

        console.log("資料數量為: "+json.total); //顯示資料數量
        console.log(json.link); //顯示資料search的方法


        content.append(`
            <table class="table table-striped">
            <thead class="thead">
            <tr class="table-dark">
                <th scope="col">ID</th>
                <th scope="col">紀錄時間</th>
                <th scope="col">藥品項目</th>
                <th scope="col">查詢</th>
            </tr>
            </thead>
            <tbody id="Medications"> </tbody>
            </table>
        `);


        medicationsBody.map( entry => {
            $('#Medications').append(`
            <tr>
            <td>${entry.resource.id}</td>
            <td>${entry.resource.authoredOn}</td>
            <td>${(entry.resource.medicationReference)?entry.resource.medicationReference.reference.value:""}</td>
            <td><button class="btn btn-secondary rounded-pill btn-sm" onclick="getMedication(${entry.resource.id})">查看</button></td>
            </tr>
            `)
        });


        // 顯示上一頁資料
        if(json.link.length === 2 && json.link[1].relation === 'previous'){ // 最末頁
            content.append(`<a onclick="listMedicationWithUrl('${json.link[1].url}')" class="btn btn-primary">上一頁</a>`);
        } else if (json.link.length === 3 && json.link[2].relation === 'previous'){
            content.append(`<a onclick="listMedicationWithUrl('${json.link[2].url}')" class="btn btn-primary">上一頁</a>`);
        }

        // 顯示下一頁資料
        if(json.link.length > 1 && json.link[1].relation === 'next'){
            content.append(`<a onclick="listMedicationWithUrl('${json.link[1].url}')" class="btn btn-primary">下一頁</a>`);
        }

    })
}