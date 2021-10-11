

function ListEncounter(){

    let content = $('#content');
    let detailContent = $('#detailContent');

    content.html("");
    detailContent.hide();

    fetch(`${baseUrl}/Encounter`,{
        method: 'GET',
        headers: baseheader
    })
    .then(response => response.json())
    .then(function (json) {
        console.log(json); //顯示整個資料
        console.log(json.entry.length); //顯示資料數量

        let encountersBody = json.entry;


        content.append(`
                    <div class="input-group mb-3">
                        <input type="text" class="form-control" placeholder="請輸入派遣ID"  aria-describedby="button-addon2" id="searchId">
                        <div class="input-group-append">
                            <button class="btn btn-outline-secondary" type="button"  onclick="searchEncounter()">送出</button>
                        </div>
                    </div>

                    <div class="input-group mb-3">
                        <input type="text" class="form-control" placeholder="請輸入病患ID"  aria-describedby="button-addon2" id="searchPatientId">
                        <div class="input-group-append">
                            <button class="btn btn-outline-secondary" type="button"  onclick="searchEncounterabout()">送出</button>
                        </div>
                    </div>
                    
                    <table class="table table-striped">
                    <thead class="thead">
                    <tr class="table-dark">
                        <th scope="col">ID</th>
                        <th scope="col">建立時間</th>
                        <th scope="col">派遣單狀態</th>
                        <th scope="col">查詢</th>
                    </tr>
                    </thead>
                    <tbody id="Encounters"> </tbody>
                    </table>
                </div>


        `);

        encountersBody.map( entry => {
            $('#Encounters').append(
                `<tr>
                <td>${entry.resource.id}</td>
                <td>${(entry.resource.period)?entry.resource.period.start:""}</td>
                <td>${entry.resource.status}</td>
                <td><button class="btn btn-secondary rounded-pill btn-sm" onclick="getEncounter(${entry.resource.id})">查看</button></td>
           </tr>`
            )
        });


        console.log(json.link);
        try{
            // 顯示下一頁資料
            if(json.link.length > 0 && json.link[1].relation === 'next'){
                content.append(`<a onclick="listEncounterWithUrl('${json.link[1].url}')" class="btn btn-primary">下一頁</a>`);
            }
        }
        catch{
            console.log("沒有下一頁");
        }


    })
    .catch(err => console.error(err));
}


//顯示下一頁派遣單內容
function listEncounterWithUrl(url) {
    let content = $('#content');

    content.html("");

    fetch(`${url}`)
    .then(response => response.json())
    .then(function(json) {
        
        let patinetsBody = json.entry;

        console.log("資料數量為: "+json.total); //顯示資料數量
        console.log(json.link); //顯示資料search的方法


        content.append(`<table class="table table-striped">
        <thead class="thead">
        <tr class="table-dark">
            <th scope="col">ID</th>
            <th scope="col">建立時間</th>
            <th scope="col">派遣單狀態</th>
            <th scope="col">查詢</th>
        </tr>
        </thead>
        <tbody id="Encounters"> </tbody>
    </table>`);


        patinetsBody.map(entry => {
            $('#Encounters').append(
                `<tr>
                <td>${entry.resource.id}</td>
                <td>${(entry.resource.period)?entry.resource.period.start:""}</td>
                <td>${entry.resource.status}</td>
                <td><button class="btn btn-secondary rounded-pill btn-sm" onclick="getEncounter(${entry.resource.id})">查看</button></td>
           </tr>`
            )
        });


        // 顯示上一頁資料
        if(json.link.length === 2 && json.link[1].relation === 'previous'){ // 最末頁
            content.append(`<a onclick="listEncounterWithUrl('${json.link[1].url}')" class="btn btn-primary">上一頁</a>`);
        } else if (json.link.length === 3 && json.link[2].relation === 'previous'){
            content.append(`<a onclick="listEncounterWithUrl('${json.link[2].url}')" class="btn btn-primary">上一頁</a>`);
        }

        // 顯示下一頁資料
        if(json.link.length > 1 && json.link[1].relation === 'next'){
            content.append(`<a onclick="listEncounterWithUrl('${json.link[1].url}')" class="btn btn-primary">下一頁</a>`);
        }

    })
}


function searchEncounterabout(){
    

    let content = $('#content');
    let detailContent = $('#detailContent');
    let searchresult = $('#Encounters');
    searchresult.empty();
    detailContent.hide();

    let searchPatientId = document.getElementById('searchPatientId').value;
    if( searchId == ""){
        alert("Please enter");
    };

    fetch(`${baseUrl}/Encounter?patient=${searchPatientId}`,{
        method: 'GET',
        headers: baseheader
    })
    .then(response => response.json())
    .then(function (json) {
        console.log(json); //顯示整個資料
        console.log(json.entry.length); //顯示資料數量



        let encountersBody = json.entry;
        encountersBody.map( entry => {
            $('#Encounters').append(
                `<tr>
                <td>${entry.resource.id}</td>
                <td>${(entry.resource.period)?entry.resource.period.start:""}</td>
                <td>${entry.resource.status}</td>
                <td><button class="btn btn-secondary rounded-pill btn-sm" onclick="getEncounter(${entry.resource.id})">查看</button></td>
                </tr>`
            )
        });

    })
}