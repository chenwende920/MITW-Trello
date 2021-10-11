
function putEncounter(id){

    let detailContent = $('#detailContent');

    let status = document.getElementById('status').value; //狀態
    let writeperiod = document.getElementById('writeperiod').value; //填寫時間

    let statusHistoryArrivedStart = document.getElementById('statusHistoryArrivedStart').value; //出勤時間
    let statusHistoryArrivedStartmoment = moment(statusHistoryArrivedStart).format();

    let statusHistoryArrivedEnd = document.getElementById('statusHistoryArrivedEnd').value; //到達現場時間
    let statusHistoryArrivedEndmoment = moment(statusHistoryArrivedEnd).format();


    let statusHistoryInprogressStart = document.getElementById('statusHistoryInprogressStart').value; //離開現場時間
    let statusHistoryInprogressStartmoment = moment(statusHistoryInprogressStart).format();


    let statusHistoryInprogressEnd = document.getElementById('statusHistoryInprogressEnd').value; //送達醫院時間
    let statusHistoryInprogressEndmoment = moment(statusHistoryInprogressEnd).format();


    let statusHistoryOnleaveStart = document.getElementById('statusHistoryOnleaveStart').value; //離開醫院時間
    let statusHistoryOnleaveStartmoment = moment(statusHistoryOnleaveStart).format();


    let statusHistoryOnleaveEnd = document.getElementById('statusHistoryOnleaveEnd').value; //返隊待命時間
    let statusHistoryOnleaveEndmoment = moment(statusHistoryOnleaveEnd).format();


    let accidentLocation = document.getElementById('accidentLocation').value; //發生地點
    let hospitalization = document.getElementById('hospitalization').value //送往醫院地點
    let patientID = document.getElementById('patientID').value; //病患ID
    let organizationID = document.getElementById('organizationID').value; //派遣單位ID

    let tagid = "001c936a-17b0-4fc6-927d-fb33a6865542";

    let fhirUpdateData = {
        resourceType: "Encounter",
        id: id.toString(),
        meta: {
        tag : [{
            system: "http://loinc.org",
            code: tagid
            }]
        },
        status: status,
        class: {
            code: "AMB",
            display: "ambulatory"
            }, 
        period: {
            start: writeperiod  
        },
        statusHistory: [
            {
                status: "arrived",
                period: {
                start: statusHistoryArrivedStartmoment,   
                end: statusHistoryArrivedEndmoment 
                }
            },
            {
                status: "in-progress",  
                period: {
                start: statusHistoryInprogressStartmoment,  
                end: statusHistoryInprogressEndmoment
                }
            },
            {
                status: "onleave",
                period: {
                start: statusHistoryOnleaveStartmoment,  
                end: statusHistoryOnleaveEndmoment
                }
            }
        ],
        location: [
            {
                location: {
                    display: accidentLocation
                },
                status: "active"
            }
        ],
        hospitalization: {
            admitSource: {
                coding: [
                {
                    code: "emd",
                    display: hospitalization
                }
                ]
            }
        },

        subject: {
            reference: "Patient/"+patientID
        },

        serviceProvider: {
            reference: organizationID
        }

        
    }



    fetch(`${baseUrl}/Encounter/${id}`,{
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