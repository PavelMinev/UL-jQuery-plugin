(function( $ ){
	$.fn.weatherLi = function(options) {
		var settings = $.extend({
			'city' : ["Saint-Petersburg","Moscow","London","Paris", "Tallin","Helsinki"],
			'direction' : 'up'
		}, options);
		var city = settings.city;
		var direction = settings.direction;
		var cityLength = city.length;
		var cityWeather = {};

		for (var k = 0; k < cityLength; k++) {
			if (typeof city[k] !== 'string') {
				$.error("City item should be the 'string' type!");
			};
		}
		if (direction !== 'up' && direction !== 'down') {
			$.error("Direction should be either 'up' or 'down' in this plagin!");
		};
		if (typeof city !== 'object') {
			$.error("Error type in 'city' parameter! Should be an object. If you want to know the weather in an only one city, type '{\"city\" : [\"YourCity\"]'");
		};

		return this.each(function(){
			
				var ul = $(this);
				var li = ul.children();			
				var item = 0;
				if (ul.attr("applied") !== "true") {
					ul.attr("applied","true");
					li.each(function(){
						var that = $(this);
						var k = 10000;
						var id = -1;
						for (var i = 0; i < cityLength; i++) {
							if (that.text().indexOf(city[i]) < k && that.text().indexOf(city[i]) >= 0) {
								k = that.text().indexOf(city[i]);
								id = i;
							};
						};
						if (id !== -1) {
							if (cityWeather.hasOwnProperty(city[id])) {
								cityWeather[city[id]][item] = "waiting";
							}else {
								cityWeather[city[id]] = {};
								$.ajax({
									url: 'http://api.openweathermap.org/data/2.5/weather?q=' + city[id] + '&units=metric&APPID=a4f2eeab71098e8006553f5df1d6f957',
									type: 'GET',
									cache: false,
									dataType: 'json',
									beforeSend: function() {
										cityWeather[city[id]][item] = "waiting";
									},
									success: function (data){
										temp = (data.main.temp >= 0) ? ("+" + Math.abs(data.main.temp)) : ("-" + Math.abs(data.main.temp));
										for (itemId in cityWeather[city[id]]) {
											cityWeather[city[id]][itemId] = temp;
											li.eq(itemId).append(" " + temp + " in " + city[id] + ", by the way.");
										};
									}
								});
							};				
						};
						item += 1;
					});
				};

				li.click(function(){
					var content = $(this).html();
					var dl = "";
					$(this).animate({"marginLeft" : "20px"},200).slideUp(200, function(){
						dl = $(this).detach();
						if (direction === 'up') {
							dl.prependTo(ul).slideDown(200).animate({"marginLeft" : "0"});
						}else if (direction === 'down') {
							dl.appendTo(ul).slideDown(200).animate({"marginLeft" : "0"});
						};
					});
				});

			});
	};
})(jQuery);