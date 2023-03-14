function initMap(){

    var s = new google.maps.LatLng(1.3521, 103.8198);

    map = new google.maps.Map(document.getElementById("map"),{center: s, zoom: 15,gestureHandling: "cooperative",})

    $(document).ready(function() {
        //calling parse funtion for reading csv file.
        parse();
    });
   
    function parse() {
        CSVFile="http://localhost/clientsheet1.csv"
        Papa.parse(CSVFile,{
            download: true, //When linking an URL the download must be true
            header: true, //makes the header in front of every data in the array
            complete: function (results) { //Runs log function, with results from the conversion
                console.log(results);
                reloadMarkers();
                plotmap(results);  
            }
        });         
    } 
    var markers=[];
    
    // plotting marker , coloring ,formating is done in this function
    function addMarker(property){

        debugger;
        if (property.status=="active" || property.status=="could not be verified"){

            const marker = new google.maps.Marker({
                position:property.location,
                icon: {
                    url:"http://maps.google.com/mapfiles/ms/icons/green-dot.png"
                },
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
        
        if (property.status=="closed"){
            const marker = new google.maps.Marker({
                position:property.location,
                icon:{
                    url:"http://maps.google.com/mapfiles/ms/icons/blue-dot.png"
                },
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
       
        if (property.status=="new"){
            const marker = new google.maps.Marker({
                position:property.location,
                icon: {
                    url:"http://maps.google.com/mapfiles/ms/icons/yellow-dot.png"
                },
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
    }
    
    // extracting values from results that we got after reading csv file.
    function plotmap(results){
        debugger;
        var i=0;
        for(var a=0;a<(results.data.length)-1;a++){ 
          
            if (selectOpt.value == "All"){
                if(results.data[a]['Latitude'].indexOf('.')!=-1 && results.data[a]['Longitude'].indexOf('.')!=-1){
                    let lt = parseFloat(results.data[a]['Latitude']);
                    let lg= parseFloat(results.data[a]['Longitude']);
                    let CompanyName=results.data[a]['Customer: Customer Name'];
                    let address=results.data[a]['Address'];
                    let s=results.data[a]['Status']
                    i+=1;
                    debugger;
                    if(results.data[a]['Status']=="Could not be verified"){
                        addMarker({location:{lat:lt , lng:lg},content:'<h2>'+CompanyName+'</h2>'+'<p>'+address+'<p>',status:"could not be verified"})

                    }
                    else{
                        addMarker({location:{lat:lt , lng:lg},content:'<h2>'+CompanyName+'</h2>'+'<p>'+address+'<p>'+'<p>'+s+'<p>',status:s.toLowerCase()})

                    }
                }
            }  
            else{
                if(results.data[a]['Latitude'].indexOf('.')!=-1 && results.data[a]['Longitude'].indexOf('.')!=-1){
                    if (results.data[a]['Status'].toLowerCase() == selectOpt.value || results.data[a]['Status'].toLowerCase()=="could not be verified"){
                        let lt = parseFloat(results.data[a]['Latitude']);
                        let lg= parseFloat(results.data[a]['Longitude']);
                        let CompanyName=results.data[a]['Customer: Customer Name'];
                        let address=results.data[a]['Address'];
                        let s=results.data[a]['Status']
                        i+=1;
                    
                        if(results.data[a]['Status']=="Could not be verified"){
                            addMarker({location:{lat:lt , lng:lg},content:'<h2>'+CompanyName+'</h2>'+'<p>'+address+'<p>',status:"could not be verified"})
    
                        }
                        else{
                            addMarker({location:{lat:lt , lng:lg},content:'<h2>'+CompanyName+'</h2>'+'<p>'+address+'<p>'+'<p>'+s+'<p>',status:s.toLowerCase()})
    
                        }
                    }
                }
            }
        }

    }
    // setting map null for getting only selected status markers
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
    selectOpt.addEventListener("change", function() {
        debugger;
        // readCSVFile("http://localhost/clientsheet.csv");
        parse(); 
    });
}

