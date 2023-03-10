//<!--plotting maps in website using google map api-->
// function initMap() {
//   map = new google.maps.Map(document.getElementById("map"), {
//     center: { lat: 22.7240, lng: 75.8843 },
//     zoom: 8,
//   });
// }


// window.initMap = initMap;
function initMap(){

    var s = new google.maps.LatLng(1.3521, 103.8198);

    map = new google.maps.Map(document.getElementById("map"),{center: s, zoom: 15})
    $(document).ready(function() {
        debugger;
        console.log("hi")
        readCSVFile("http://localhost/clientsheet.csv");
    });
    // const marker = new google.maps.Marker({
    // position:{ lat: 22.7240, lng: 75.8843 },
    // map:map
    // });
    var markers=[];

    function addMarker(property){
        const marker = new google.maps.Marker({
            position:property.location,
            map:map,

        })
        markers.push(marker)
        if(property.content){
            const detailWindow = new google.maps.InfoWindow({
                content: property.content
            });
            marker.addListener("mouseover",() =>{
                detailWindow.open(map,marker);
            })
            var closeInfoWindowWithTimeout;
            marker.addListener('mouseout', function() {
                closeInfoWindowWithTimeout = setTimeout(() => detailWindow.close(map, marker), 1000);
            }, false);
        }
    }

    function plotmap(results){
        debugger;
        console.log("data")
        console.log(results.data)
        var i=0;
        for(var a=0;a<(results.data.length)-1;a++){ 
            if (selectOpt.value == "All"){
                if(results.data[a]['Latitude'].indexOf('.')!=-1 && results.data[a]['Longitude'].indexOf('.')!=-1){
                    let lt = parseFloat(results.data[a]['Latitude']);
                    let lg= parseFloat(results.data[a]['Longitude']);
                    let CompanyName=results.data[a]['Customer Name'];
                    let address=results.data[a]['Address'];
                    let b_name=results.data[a]['Status']
                    i+=1;
                    addMarker({location:{lat:lt , lng:lg},content:'<h2>'+CompanyName+'</h2>'+'<p>'+address+'<p>'+'<p>'+b_name+'<p>'})
                }
            }  
            else{
                if(results.data[a]['Latitude'].indexOf('.')!=-1 && results.data[a]['Longitude'].indexOf('.')!=-1){
                    if (results.data[a]['Status'].toLowerCase() == selectOpt.value){
                        let lt = parseFloat(results.data[a]['Latitude']);
                        let lg= parseFloat(results.data[a]['Longitude']);
                        let CompanyName=results.data[a]['Customer Name'];
                        let address=results.data[a]['Address'];
                        let b_name=results.data[a]['Status']
                        i+=1;
                        addMarker({location:{lat:lt , lng:lg},content:'<h2>'+CompanyName+'</h2>'+'<p>'+address+'<p>'+'<p>'+b_name+'<p>'})
                    }
                }
            }
        }
        console.log(i)
    }

    function reloadMarkers() {

        // Loop through markers and set map to null for each
        for (var i=0; i<markers.length; i++) {
    
            markers[i].setMap(null);
        }
    
        // Reset the markers array
        markers = [];
    
        // Call set markers to re-add markers
    }

    
    var selectOpt = document.getElementById("select-option");
   
    function readCSVFile(filePath) {
        debugger;
        var xhr = new XMLHttpRequest();
        xhr.onreadystatechange = function() {
          if (xhr.readyState === 4 && xhr.status === 200) {
            debugger;
            var csvData = xhr.responseText;
            var lines = csvData.split('\n');
            var result = [];
            var headers = lines[0].split(',');
            for (var i = 1; i < lines.length; i++) {
              var obj = {};
              var currentLine = lines[i].split(',');
              for (var j = 0; j < headers.length; j++) {
                obj[headers[j]] = currentLine[j];
              }
              result.push(obj);
            }
            console.log(result); // or do something else with the parsed CSV data
            reloadMarkers();
            plotmap(result);  
          }
        };
        xhr.open('GET', filePath, true);
        xhr.send();
      }

    selectOpt.addEventListener("change", function() {
        debugger;
        readCSVFile("http://localhost/clientsheet.csv");
        reloadMarkers();
        plotmap(result);  
    });
}