Papa.parse("./js/data/Data.csv", {
    download : true,
    header: true,
	complete: function(results) {
		console.log(results);
	}
});
