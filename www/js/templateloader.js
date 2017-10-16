var templateLoader = function() {

    var itemrowTemplate;

    var loadTemplale = function () {

        $.ajax({            
            url: "./templates/itemrow.handlebars",
            cache: true,
            success: function(data) {
                source = data;
                itemrowTemplate = Handlebars.compile(source);
            }               
        });
    }

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
