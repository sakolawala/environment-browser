var WholeData = [];
var idx;
var maxResult = 50;

$(document).ready(function() {
  templateLoader.LoadTemplate
      .then(function() {
        return extractTransformLoader.ProcessData
      })
      .then(function(pdata) {
        console.log("Configuring search and result..");
        WholeData = pdata;
        configureSearch(pdata);
        showResult(pdata);
        console.log("Configuring search and result completed");
      })
      .catch(function(err) { 
        console.log("Failed main method")
        console.log(err)
      });

	$("#searchBox").on("keyup", function (e) {
		if (e.keyCode == 13) {
			var searchtext = $("#searchBox").val();
			if (searchtext == "") {
				//Load all the URLs
				showResult(pdata);
			}
			else {
				var results = idx.search(searchtext);
				showLunrSearchResult(results);	
			}			
		}	
	});
});

function configureSearch(list) {

	idx = lunr(function() {
		this.ref('id')
		this.field('Environment')
		this.field('EndpointInfo')
		this.field('Service')
		this.field('OS')
    this.field('SQL')	
    this.field('ServerType')	

		list.forEach(function (doc) {
			this.add(doc)
		}, this);
	});
}

function translateToViewModel(pdata) {
	var envVMData = [];
	var i = 0;
	pdata.forEach(function(item) {
		if (item.Environment && i < maxResult) {
			var envVMItem = {};
			envVMItem.Environment = item.Environment;
			envVMItem.Service = item.Service;
			envVMItem.OS = item.OS;
			envVMItem.SQL = item.SQL;
			envVMItem.EndpointInfo = item.EndpointInfo;
      envVMItem.URL = item.URL;
      envVMItem.ServerType = item.ServerType;
      
			if  (envVMItem.Environment == "DEV")
				envVMItem.EnvCSSClass = "btn-DEV";
			else if (envVMItem.Environment == "UAT")
				envVMItem.EnvCSSClass = "btn-UAT";
			
			if (envVMItem.OS == "Windows")
				envVMItem.OSCSSClass = "btn-windows";
			else if (envVMItem.OS == "Linux")
				envVMItem.OSCSSClass = "btn-linux";
	
			if (envVMItem.SQL == "MSSQL")
				envVMItem.SQLCSSClass = "btn-mssql";
			else if (envVMItem.SQL == "MySQL")
        envVMItem.SQLCSSClass = "btn-mysql";
        
      if (envVMItem.ServerType == "Store")
				envVMItem.SRVTYPEClass = "btn-store";
			else if (envVMItem.ServerType == "National")
				envVMItem.SRVTYPEClass = "btn-national";
			
			envVMData.push(envVMItem)
			i++;
		}
	});
	return envVMData
}

function showResult(pdata) {
	var ViewModel = translateToViewModel(pdata);
	if (ViewModel.length == maxResult)
		$("#results").html("Results - More than 50 search result, truncated to show only 50")
	else if (ViewModel.length < maxResult)
		$("#results").html("Results")
	var strhtml = templateLoader.RenderSearch(ViewModel);
	$("#searchResults").html(strhtml);
}

function showLunrSearchResult(results) {
	searchResults = [];

	results.forEach(function (searchresultitem) {	
		item = WholeData[searchresultitem.ref];
		searchResults.push(item)
	});
	showResult(searchResults);
}
