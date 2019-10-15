async function aiPrediction(data1, data2, data3, paraDonor, RS)
{
  const model = await tf.loadModel('https://ihzaa.com/model.json');
  var awaitResult = await model.predict(tf.tensor2d([[data1, data2, data3]])).dataSync();
  return awaitResult;
}

//untuk ngebuat CORS request
function createCORSRequest(method, url)
{
    var xhr = new XMLHttpRequest();
    if ("withCredentials" in xhr) {
      // XHR for Chrome/Firefox/Opera/Safari.
      xhr.open(method, url, true);
    } else if (typeof XDomainRequest != "undefined") {
      // XDomainRequest for IE.
      xhr = new XDomainRequest();
      xhr.open(method, url);
    } else {
      // CORS not supported.
      xhr = null;
    }
    return xhr;
}
//untuk request CORS
function makeCorsRequest() {
    var url = "https://ihzaa.com/model.json";//URL CORS ke AI
    var xhr = createCORSRequest('GET', url);
    xhr.send();
}
//Untuk integerasi ke database
var firebaseConfig = {
    apiKey: "AIzaSyCw3zHbhfPJvkxNvDvuRj1PT3g5ic0hnt8",
    authDomain: "test-55af1.firebaseapp.com",
    databaseURL: "https://test-55af1.firebaseio.com",
    projectId: "test-55af1",
    storageBucket: "test-55af1.appspot.com",
    messagingSenderId: "131257202002",
    appId: "1:131257202002:web:a5a374e6452d60eb30b68b",
    measurementId: "G-0S6Y21KB29"
  };
  // Initialize Firebase
  firebase.initializeApp(firebaseConfig);
  firebase.analytics();


  var ref = firebase.database().ref("User/");                           
  ref.once("value", function(snapParent){
    snapParent.forEach((snapUser) => {
        console.log(snapUser.key);
        var nama = snapUser.child("Nama").val();
        var goldar = snapUser.child("GolDar").val();
    });
});

//Filter berdasarkan golongan darah
function filterFirst(calonDonor, recipient, result)
{
  var counter = 0;
  var recipientId = recipient.child("ID").val();

  calonDonor.forEach((snapChild)=>{
    var userId = snapChild.key;
    var goldar = snapChild.child("GolDar").val();
    var rhesus = snapChild.child("Rhesus").val();
    //if eligible result.add snapChild
    if(recipient.child("GolDar").val() == goldar && recipientId != userId)
    {
      if(recipient.child("Rhesus").val() == rhesus || rhesus == "-" ) 
      {
          result[counter] = snapChild;
          counter++;
      }

    }
  });
  calonDonor.forEach((snapChild)=>{
    var userId = snapChild.key;
    var goldar = snapChild.child("GolDar").val();
    var rhesus = snapChild.child("Rhesus").val();
    //if eligible result.add snapChild
    if(recipient.child("GolDar").val() == "AB" && recipientId != userId)
    {
      if(goldar == "A" || goldar == "B" || goldar == "O")
      {
        if(recipient.child("Rhesus").val() == rhesus || rhesus == "-")
        {
            result[counter] = snapChild;
            counter++;
        }
      }
    }
  });
  calonDonor.forEach((snapChild)=>{
    var userId = snapChild.key;
    var goldar = snapChild.child("GolDar").val();
    var rhesus = snapChild.child("Rhesus").val();
    //if eligible result.add snapChild
    if(recipient.child("GolDar").val() == "A" || recipient.child("GolDar").val() == "B" && recipientId != userId)
    {
      if(goldar == "O")
      {
        if(recipient.child("Rhesus").val() == rhesus || rhesus == "-" )
        {
            result[counter] = snapChild;
            counter++;
        }
      }
    }
  });
 
}

function filterSecond(input, targetRS)
{
  var tableCalonDonor = document.getElementById("table-calon-donor");
  var row;
  var counter = 0;
  var i;
  var asyncCounter = 0;
  var cell1, cell2, cell3, cell4, cell5, cell6, cell7, cell8; 
  input.forEach((snapChild) => {
    var userId = snapChild.key;
    firebase.database().ref("Koordinat/"+userId).once("value", (koorSnap) => {

      var nama = snapChild.child("Nama").val();
      var gender = snapChild.child("Gender").val();
      var phone = snapChild.child("Phone").val();
      var jarak1 = koorSnap.child("RS001").val();
      var jarak2 = koorSnap.child("RS002").val();
      var jarak3 = koorSnap.child("RS003").val();
      aiPrediction(jarak1, jarak2, jarak3, snapChild, targetRS).then(result => {
      // console.log(asyncCounter);
      result[0] = parseFloat(result[0]);
      result[0] = Math.abs(1 - result[0]);
      result[1] = parseFloat(result[1]);
      result[1] = Math.abs(1 - result[1]);
      result[2] = parseFloat(result[2]);
      result[2] = Math.abs(1 - result[2]);
      console.log(result);
      switch(targetRS.child("RS").val()){
              case "RS001":
                if(result[0]==Math.min.apply(null, result)){
                  row = tableCalonDonor.insertRow(asyncCounter + 1);
                  cell1 = row.insertCell(0);
                  cell2 = row.insertCell(1);
                  cell3 = row.insertCell(2);
                  cell4 = row.insertCell(3);
                  cell5 = row.insertCell(4);
                  cell6 = row.insertCell(5);
                  cell7 = row.insertCell(6);
                  cell8 = row.insertCell(7);
                  cell1.innerHTML = asyncCounter + 1;
                  cell2.innerHTML = userId;
                  cell3.innerHTML = name;
                  cell4.innerHTML = gender;
                  cell5.innerHTML = phone;
                  cell6.innerHTML = "<button onClick = 'calonDonorOnClickAccept(" + asyncCounter + ")'>Accept</button>";
                  cell7.innerHTML = "<button onClick = 'calonDonorOnClickPending(" + asyncCounter + ")'>Pending</button>";
                  cell8.innerHTML = "<button onClick = 'calonDonorOnClickDeny(" + asyncCounter + ")'>Deny</button>";
                  asyncCounter++;
                }
              break;
              case "RS002":
                if(result[1]==Math.min.apply(null, result)){
                  row = tableCalonDonor.insertRow(asyncCounter + 1);
                  cell1 = row.insertCell(0);
                  cell2 = row.insertCell(1);
                  cell3 = row.insertCell(2);
                  cell4 = row.insertCell(3);
                  cell5 = row.insertCell(4);
                  cell6 = row.insertCell(5);
                  cell7 = row.insertCell(6);
                  cell8 = row.insertCell(7);
                  cell1.innerHTML = asyncCounter + 1;
                  cell2.innerHTML = userId;
                  cell3.innerHTML = name;
                  cell4.innerHTML = gender;
                  cell5.innerHTML = phone;
                  cell6.innerHTML = "<button onClick = 'calonDonorOnClickAccept(" + asyncCounter + ")'>Accept</button>";
                  cell7.innerHTML = "<button onClick = 'calonDonorOnClickPending(" + asyncCounter + ")'>Pending</button>";
                  cell8.innerHTML = "<button onClick = 'calonDonorOnClickDeny(" + asyncCounter + ")'>Deny</button>";
                  asyncCounter++;
                }
              break;
              case "RS003":
                if(result[2]==Math.min.apply(null, result)){
                  row = tableCalonDonor.insertRow(asyncCounter + 1);
                  cell1 = row.insertCell(0);
                  cell2 = row.insertCell(1);
                  cell3 = row.insertCell(2);
                  cell4 = row.insertCell(3);
                  cell5 = row.insertCell(4);
                  cell6 = row.insertCell(5);
                  cell7 = row.insertCell(6);
                  cell8 = row.insertCell(7);
                  cell1.innerHTML = asyncCounter + 1;
                  cell2.innerHTML = userId;
                  cell3.innerHTML = name;
                  cell4.innerHTML = gender;
                  cell5.innerHTML = phone;
                  cell6.innerHTML = "<button onClick = 'calonDonorOnClickAccept(" + asyncCounter + ", " + targetRS +")'>Accept</button>";
                  cell7.innerHTML = "<button id = 'pendingButton" + asyncCounter + "' onClick = 'calonDonorOnClickPending(" + asyncCounter + ")'>Pending</button>";
                  cell8.innerHTML = "<button onClick = 'calonDonorOnClickDeny(" + asyncCounter + ")'>Deny</button>";
                  asyncCounter++;
                }
              break;
              default:
              break;
            }
    });
  });

}
);

firebase.database().ref("Request/"+targetRS.key+"/Status").set("3");}


//Mulai filter
function startFilter(snapshotUser, snapshotRequest)
{
  var rsId = snapshotRequest.child("RS").val();
  localStorage.setItem("rs_id",rsId);
  filterFirst(snapshotUser, snapshotRequest, hasilFilter1);
  filterSecond(hasilFilter1, snapshotRequest);
  
}

function calonDonorOnClickAccept(index)
{
  var userId = (hasilFilter1[index]).key;
  var rsId = localStorage.getItem("rs_id");
  firebase.database().ref("User/"+userId+"/Accept").set(rsId);
}
function calonDonorOnClickPending(index)
{
  var stringPendingButton = "pendingButton" + index;
  console.log(stringPendingButton);
  document.getElementById(stringPendingButton).disabled;
}
function calonDonorOnClickDeny(index)
{
  alert(index);
}

let hasilFilter1 = [];//list hasil filter pertama



// FUNCTION UNTUK DONOR REQUEST
var requestIdFromPageReq;
function ambilDataRequest() {
  firebase.database().ref("Request").on("value", (snap) => {
    var counterSnap = 0;
    var row;
    var cel1, cel2, cel3, cel4, cel5, cel6, cel7, cel8, cel9, cel10;
    var tableRequest = document.getElementById("table-request");
    snap.forEach(snapParent => {
      console.log(snapParent.child("Status").val());
      if(snapParent.child("Status").val() == 0)
      {
        counterSnap++;
        var requestId = snapParent.key;
        var nama = snapParent.child("Nama").val();
        var gender = snapParent.child("Gender").val();
        var golDar = snapParent.child("GolDar").val();
        var rhesus = snapParent.child("Rhesus").val();
        var jumlah = snapParent.child("Jumlah").val();
        var rs = snapParent.child("RS").val();
        row = tableRequest.insertRow(counterSnap);
        cell1 = row.insertCell(0);
        cell2 = row.insertCell(1);
        cell3 = row.insertCell(2);
        cell4 = row.insertCell(3);
        cell5 = row.insertCell(4);
        cell6 = row.insertCell(5);
        cell7 = row.insertCell(6);
        cell8 = row.insertCell(7);
        cell9 = row.insertCell(8);
        cell10 = row.insertCell(9);
        cell1.innerHTML = counterSnap;
        cell2.innerHTML = requestId;
        cell3.innerHTML = nama;
        cell4.innerHTML = gender;
        cell5.innerHTML = golDar;
        cell6.innerHTML = rhesus;
        cell7.innerHTML = jumlah;
        cell8.innerHTML = rs;
        cell9.innerHTML = "<button onClick = 'acceptRequest(" + requestId + ")'>Accept</button>";
        cell10.innerHTML = "<button onClick = 'denyRequest(" + requestId + ")'>Deny</button>";  
      }
      else if(counterSnap != 0)
      {
        tableRequest.deleteRow(counterSnap + 1);
        counterSnap--;
      }
      
    });

  });
}

function denyRequest(requestId) {
  firebase.database().ref("Request/"+requestId+"/Status").set("2");
}
function acceptRequest(reqId) {
  firebase.database().ref("Request/"+reqId+"/Status").set("1");
  localStorage.setItem("req_id",reqId);
  window.open('donor.html');
}

// onLoad Donor
function onLoadDonor() {
  var req = localStorage.getItem("req_id");
  firebase.database().ref("User").on("value", (snapshotUser) => {
    firebase.database().ref("Request/"+req).once("value", (snapshotRequest) => {
      startFilter(snapshotUser, snapshotRequest);
    });
  });
}

function onLoadUserValidation() {
  var tableUserValidation = document.getElementById("table-user-validation");
  var row;
  var col1, col2, col3, col4, col5, col6, col7, col8;
  var counterSnap = 0;
  firebase.database().ref("User").once("value",(snapParent) => {
    snapParent.forEach(snapChild =>{
      console.log(snapChild.key);
      counterSnap++;
      row = tableUserValidation.insertRow(counterSnap);
      col1 = row.insertCell(0);
      col2 = row.insertCell(1);
      col3 = row.insertCell(2);
      col4 = row.insertCell(3);
      col5 = row.insertCell(4);
      col6 = row.insertCell(5);
      col7 = row.insertCell(6);
      col8 = row.insertCell(7);
      col1.innerHTML = counterSnap;
      col2.innerHTML = snapChild.key;
      col3.innerHTML = snapChild.child("Nama").val();
      col4.innerHTML = snapChild.child("Gender").val();
      col5.innerHTML = snapChild.child("GolDar").val();
      col6.innerHTML = snapChild.child("Rhesus").val();
      col7.innerHTML = "<button>Validate</button>";
      col8.innerHTML = "<button>Detail</button>";
    })   
  })
}

function onLoadBloodDonor()
{
  var tableBloodDonor = document.getElementById("table-blood-donor");
  var row;
  var col1, col2, col3, col4, col5, col6, col7, col8;
  var counterSnap = 0;
  firebase.database().ref("User").once("value",(snapParent) => {
    snapParent.forEach(snapChild =>{
      console.log(snapChild.key);
      counterSnap++;
      row = tableBloodDonor.insertRow(counterSnap);
      col1 = row.insertCell(0);
      col2 = row.insertCell(1);
      col3 = row.insertCell(2);
      col4 = row.insertCell(3);
      col5 = row.insertCell(4);
      col6 = row.insertCell(5);
      col1.innerHTML = counterSnap;
      col2.innerHTML = snapChild.key;
      col3.innerHTML = snapChild.child("Nama").val();
      col4.innerHTML = snapChild.child("GolDar").val();
      col5.innerHTML = snapChild.child("Rhesus").val();
      col6.innerHTML = 600;
    })   
  })
}