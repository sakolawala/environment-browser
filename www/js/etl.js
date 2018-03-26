/* This JS would load the data from csv and transform into usable data
*/
var extractTransformLoader = function() {

    var baseData = null;
    var kiwiServiceData = null;
    var commonEndPoints = null;
    var restServiceData = null;
    var TransformData = null;

    var loadBaseData = new Promise(
        function (resolve, reject) {
            Papa.parse("./js/data/basedata.csv", {
                download : true,
                header: true,
                skipEmptyLines: true,
                complete: function(results) {
                    baseData = results.data;
                    resolve(baseData)
                },
                error: function(err, file, inputElem, reason) {
                    console.log(err)
                    reject(err)
	            },

            });        
        }        
    );

    var loadKiwiServices = new Promise(
        function (resolve, reject) {
            Papa.parse("./js/data/kiwiservicedata.csv", {
                download : true,
                header: true,
                skipEmptyLines: true,
                complete: function(results) {
                    kiwiServiceData = results.data;
                    resolve(kiwiServiceData)
                },
                error: function(err, file, inputElem, reason) {
                    console.log(err)
                    reject(err)
	            },

            });        
        }        
    );

    var loadCommonEndpoints = new Promise(
        function (resolve, reject) {
            Papa.parse("./js/data/commonendpoints.csv", {
                download : true,
                header: true,
                skipEmptyLines: true,
                complete: function(results) {
                    commonEndPoints = results.data;
                    resolve(commonEndPoints)
                },
                error: function(err, file, inputElem, reason) {
                    console.log(err)
                    reject(err)
	            },

            });        
        }        
    );

    var loadRestServiceEndpoints = new Promise(
        function (resolve, reject) {
            Papa.parse("./js/data/restservicedata.csv", {
                download : true,
                header: true,
                skipEmptyLines: true,
                complete: function(results) {
                    restServiceData = results.data;
                    resolve(restServiceData)
                },
                error: function(err, file, inputElem, reason) {
                    console.log(err)
                    reject(err)
	            },

            });        
        }        
    );

    // Form data from Service, Endpoints and Base Data
    var transformData1 =  function () {
      console.log("All Data Loaded");
      console.log("Starting Data Transformation 1...");
      TransformData = []
      kiwiServiceData.forEach(service => {
        commonEndPoints.forEach(endpoint => {
          baseData.forEach(baseData => {
            //Service would be 'Store', 'Natioanal' or 'StoreAndNational'
            //BaseData would be 'Store', 'National'
            if ( service.ServiceType.includes(baseData.ServerType) ) {
                var tdrow = {};
                tdrow.EndpointInfo = endpoint.CommonEndPoints;
                tdrow.Environment = baseData.Environment;
                tdrow.Service = service.Name;
                tdrow.ServerType = baseData.ServerType;
                tdrow.OS = baseData.OS;
                tdrow.SQL = baseData.SQL;
                tdrow.EndPointInfo = endpoint.CommonEndPoints;
                tdrow.URL = baseData.BaseURL + "/" + service.WebSlag + "/" + endpoint.CommonEndPoints + "/";
                tdrow.ServiceType = service.ServiceType;
                TransformData.push(tdrow);
            }                                    
          });
        });
      });
      console.log("Completed Data Transformation 1");
      return TransformData;
    }

    // Add ServiceType from the Kiwi Service Data
    var transformData2 = function() {
      console.log("Starting Data Transformation 2...");
      restServiceData.forEach( function(rsd,index) {
        var serdetail = kiwiServiceData.find(function (service) {
           return (rsd.Service == service.Name)
        });
        if (serdetail) { rsd.ServiceType = serdetail.ServiceType; }
        else { rsd.ServiceType = 'NA' }
        restServiceData[index] = rsd;
      });
      console.log("Completed Data Transformation 2");
      return restServiceData;
    }

    // Merge Transform data
    var mergeTData  = function() {
      console.log("Starting Data Merging...");
      var TD2 = TransformData.concat(restServiceData);
      var i = 0; 
      TD2.forEach( function(item,index) {
        item.id = i;
				i++; 
      });
      console.log("Completed Data Merging");
      return TD2;
    }

    var processAllData  =  new Promise(function(resolve, reject) {
        Promise.all([loadBaseData, loadKiwiServices, loadCommonEndpoints, loadRestServiceEndpoints])              
                .then(transformData1)
                .then(transformData2)
                .then(mergeTData)
                .then(function (pdata) {
                    return resolve(pdata)
                })
                .catch(function(err) { 
                    console.log("Loading of data failed")
                    console.log(err)
                    return reject(err)
                })       
    });

    return {
        ProcessData : processAllData        
    }

}();