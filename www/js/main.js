var csvEnvData = [];
var fuse;

$(document).ready(function() {
	LoadCSVData();

	$("#searchBox").on("keyup", function (e) {
		if (e.keyCode == 13) {
			var searchtext = $("#searchBox").val();
			var results = fuse.search(searchtext);
			console.log(results);
		}	
	});
});

function LoadCSVData() {
	Papa.parse("./js/data/Data.csv", {
		download : true,
		header: true,
		complete: function(results) {
			csvEnvData = results.data;
			console.log(csvEnvData);
			configureSearch(csvEnvData);			
		}
	});
};

function configureSearch(list) {

	var options = {
		shouldSort: true,
		threshold: 0.6,
		location: 0,
		distance: 100,
		maxPatternLength: 32,
		minMatchCharLength: 1,
		keys: [
		  'Environment',
		  'OS',
		  'SQL',
		  'Service',
		  'EndpointInfo'
	  ]
	  };
	  fuse = new Fuse(list, options); // "list" is the item array	  
}

function translateToViewModel(csvEnvData) {
	var envVMData = [];
	csvEnvData.forEach(function(item) {
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
	});
	return envVMData
}

