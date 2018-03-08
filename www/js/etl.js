/* This JS would load the data from csv and transform into usable data
*/
var extractTransformLoader = function() {

    var baseData = null;
    var kiwiServiceData = null;
    var kiwiServiceData = null;
    var commonEndPoints = null;
    var restServiceData = null;
    var TransformData = null;

    var loadBaseData = new Promise(
        function (resolve, reject) {
            Papa.parse("./js/data/basedata.csv", {
                download : true,
                header: true,
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

    var transformData1 = function () {
        console.log("All Data Loaded");
        TransformData = []
        kiwiServiceData.forEach(service => {
            commonEndPoints.forEach(endpoint => {
                baseData.forEach(baseData => {     
                    var tdrow = {};               
                    tdrow.Environment = baseData.Environment;
                    tdrow.Service = service.Name;
                    tdrow.OS = baseData.OS;
                    tdrow.SQL = baseData.SQL;
                    tdrow.EndPointInfo = endpoint.CommonEndPoints;
                    tdrow.URL = baseData.BaseURL + "/" + service.WebSlag + "/" + endpoint.CommonEndPoints + "/";
                    TransformData.push(tdrow);                    
                });
            });
        });
        var TD2 = TransformData.concat(restServiceData);
        

        return Promise.resolve(TD2);
    }

    var processAllData  = function() {
        Promise.all([loadBaseData, loadKiwiServices, loadCommonEndpoints, loadRestServiceEndpoints])              
                .then(transformData1)
                
                .catch(function(err) { console.log("Loading of data failed")} )
    }

    return {
        ProcessData : processAllData        
    }

}();