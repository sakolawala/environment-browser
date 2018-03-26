var templateLoader = function() {

    var itemrowTemplate;

    var loadTemplale = new Promise(function (resolve, reject) {

        $.ajax({            
            url: "./templates/itemrow.handlebars",
            cache: true,
            success: function(data) {
                source = data;
                itemrowTemplate = Handlebars.compile(source);
                resolve(itemrowTemplate);
            },
            error: function (xhr,status,error) {
                 reject(error);
            }
        });
    });

    var renderTemplate = function (items) {
        if (itemrowTemplate) {
            var html = itemrowTemplate(items)
            return html;            
        }
    }

    return {
        LoadTemplate : loadTemplale,
        RenderSearch : renderTemplate        
    }
}();
