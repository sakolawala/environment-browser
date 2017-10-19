var csvEnvData = [];
var idx;
var maxResult = 50;

$(document).ready(function() {
	templateLoader.LoadTemplate();
	LoadCSVData();

	$("#searchBox").on("keyup", function (e) {
		if (e.keyCode == 13) {
			var searchtext = $("#searchBox").val();
			if (searchtext == "") {
				//Load all the URLs
				showResult(csvEnvData);
			}
			else {
				var results = idx.search(searchtext);
				showLunrSearchResult(results);	
			}			
		}	
	});
});

function LoadCSVData() {
	Papa.parse("./js/data/Data.csv", {
		download : true,
		header: true,
		complete: function(results) {
			csvEnvData = results.data;
			var i = 0; 
			csvEnvData.forEach(function (item) {				
				item.id = i;
				i++;
			});
			configureSearch(csvEnvData);
			showResult(csvEnvData);
		}
	});
};

function configureSearch(list) {

	idx = lunr(function() {
		this.ref('id')
		this.field('Environment')
		this.field('EndpointInfo')
		this.field('Service')
		this.field('OS')
		this.field('SQL')	

		list.forEach(function (doc) {
			this.add(doc)
		}, this);
	});
}

function translateToViewModel(csvEnvData) {
	var envVMData = [];
	var i = 0;
	csvEnvData.forEach(function(item) {
		if (item.Environment && i < maxResult) {
			var envVMItem = {};
			envVMItem.Environment = item.Environment;
			envVMItem.Service = item.Service;
			envVMItem.OS = item.OS;
			envVMItem.SQL = item.SQL;
			envVMItem.EndpointInfo = item.EndpointInfo;
			envVMItem.URL = item.URL;
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
			
			envVMData.push(envVMItem)
			i++;
		}
	});
	return envVMData
}

function showResult(csvEnvData) {
	var ViewModel = translateToViewModel(csvEnvData);
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
		item = csvEnvData[searchresultitem.ref];
		searchResults.push(item)
	});
	showResult(searchResults);
}
