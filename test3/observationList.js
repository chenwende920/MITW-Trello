

function listObservations() {
    let content = $('#content');

    content.html(''); //清空

    fetch(`${baseUrl}/Observation`,{
        method: 'GET',
        headers: baseheader
    })
    .then(response => response.json())
    .then(function(json){
        console.log(json);
        let observationsBody = json.entry;

        content.append(`
            <table class="table table-striped">
            <thead class="thead">
            <tr class="table-dark">
                <th scope="col">ID</th>
                <th scope="col">檢驗項目</th>
                <th scope="col">填寫狀態</th>
                <th scope="col">查詢</th>
            </tr>
            </thead>
            <tbody id="Observations"> </tbody>
            </table>
        `);

        
        observationsBody.map( entry => {
            $('#Observations').append(`
            <tr>
            <td>${entry.resource.id}</td>
            <td>${entry.resource.code.coding[0].display}</td>
            <td>${entry.resource.status}</td>
            <td><button class="btn btn-secondary rounded-pill btn-sm" onclick="getObservation(${entry.resource.id})">查看</button></td>
            </tr>
            `)
        });

        console.log(json.link);

        try{
            //顯示下一頁資料
            if(json.link.length > 0 && json.link[1].relation === 'next') {
                content.append(`<a onclick="listObservationWithUrl('${json.link[1].url}')" class="btn btn-primary">下一頁</a>`);
            }
        }
        catch{
            console.log("沒有下一頁");
        }

    })
    .catch(err => console.log(err));
}


function searchObservationItem(){

    let content = $('#content');

    content.html(''); //清空


    let codeDisplay = document.getElementById('codeDisplay');
    let codeDisplayValue = codeDisplay.options[codeDisplay.selectedIndex].value;

    let code = "";
    switch(codeDisplayValue){
        case "Body temperature":
            code = "8310-5";
            break;
        case "Blood pressure":
            code = "85354-9";
            break;
        case "Heart rate":
            code = "8867-4";
            break;
        case "Respiratory rate":
            code = "9279-1";
            break;
        case "SpO2":
            code = "2708-6";
            break;
        case "Blood Glucose":
            code = "15074-8";
            break;
    }

    if( codeDisplayValue == ""){
        alert("Please enter");
    };



    fetch(`${baseUrl}/Observation?combo-code=${code}`,{
        method: 'GET',
        headers: baseheader
    })
    .then(response => response.json())
    .then(function(json) {
        
       console.log(json);
        let observationsBody = json.entry;

        content.append(`
            <table class="table table-striped">
            <thead class="thead">
            <tr class="table-dark">
                <th scope="col">ID</th>
                <th scope="col">檢驗項目</th>
                <th scope="col">填寫狀態</th>
                <th scope="col">查詢</th>
            </tr>
            </thead>
            <tbody id="Observations"> </tbody>
            </table>
        `);

        
        observationsBody.map( entry => {
            $('#Observations').append(`
            <tr>
            <td>${entry.resource.id}</td>
            <td>${entry.resource.code.coding[0].display}</td>
            <td>${entry.resource.status}</td>
            <td><button class="btn btn-secondary rounded-pill btn-sm" onclick="getObservation(${entry.resource.id})">查看</button></td>
            </tr>
            `)
        });

        console.log(json.link);

        try{
            //顯示下一頁資料
            if(json.link.length > 0 && json.link[1].relation === 'next') {
                content.append(`<a onclick="listObservationWithUrl('${json.link[1].url}')" class="btn btn-primary">下一頁</a>`);
            }
        }
        catch{
            console.log("沒有下一頁");
        }

    })
    .catch(err => console.log(err));

}






//顯示下一頁派遣單內容
function listObservationWithUrl(url) {
    let content = $('#content');

    content.html("");

    fetch(`${url}`)
    .then(response => response.json())
    .then(function(json) {
        
        let observationsBody = json.entry;

        console.log("資料數量為: "+json.total); //顯示資料數量
        console.log(json.link); //顯示資料search的方法


        content.append(`
            <table class="table table-striped">
            <thead class="thead">
            <tr class="table-dark">
                <th scope="col">ID</th>
                <th scope="col">檢驗項目</th>
                <th scope="col">填寫狀態</th>
                <th scope="col">查詢</th>
            </tr>
            </thead>
            <tbody id="Observations"> </tbody>
            </table>
        `);


        observationsBody.map( entry => {
            $('#Observations').append(`
            <tr>
            <td>${entry.resource.id}</td>
            <td>${entry.resource.code.coding[0].display}</td>
            <td>${entry.resource.status}</td>
            <td><button class="btn btn-secondary rounded-pill btn-sm" onclick="getObservation(${entry.resource.id})">查看</button></td>
            </tr>
            `)
        });


        // 顯示上一頁資料
        if(json.link.length === 2 && json.link[1].relation === 'previous'){ // 最末頁
            content.append(`<a onclick="listObservationWithUrl('${json.link[1].url}')" class="btn btn-primary">上一頁</a>`);
        } else if (json.link.length === 3 && json.link[2].relation === 'previous'){
            content.append(`<a onclick="listObservationWithUrl('${json.link[2].url}')" class="btn btn-primary">上一頁</a>`);
        }

        // 顯示下一頁資料
        if(json.link.length > 1 && json.link[1].relation === 'next'){
            content.append(`<a onclick="listObservationWithUrl('${json.link[1].url}')" class="btn btn-primary">下一頁</a>`);
        }

    })
}