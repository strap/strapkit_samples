var StrapKit = require('strapkit');

var parseFeed = function(data, quantity) {
    var items = [];
    for (var i = 0; i < quantity; i++) {
        // console.log(data[i]);
        // Always upper case the description string
        var title = data.items[i].title;
        var score = data.items[i].score;
        var numComments = data.items[i].num_comments;

        // Add to menu items array
        items.push({
            title: title,
            subtitle: 'S: '+score+' C: '+numComments,
            data: ""
        });
    }

    // Finally return whole array
    return items;
};

var strap_params = {
   // *** change the app id! *** //
   app_id: "SY5RTouTvcCjBrygG",
   resolution: "144x168",
   useragent: "PEBBLE/2.0"
};

StrapKit.Metrics.Init(strap_params);

// Show splash screen while waiting for data
var splashPage = StrapKit.UI.Page();

// Text element to inform user
var card = StrapKit.UI.TextView({
    position: 'center',
    text: 'Loading data now...'
});

// Add to splashPage and show
splashPage.addView(card);
splashPage.show();

StrapKit.Metrics.logEvent("/show/splashPage");

// Make request to recent popular stories
StrapKit.HttpClient({
        url: 'http://hnapp.com/json?q=score%3E250',
        type: 'json'
    },
    function(data) {

        var menuItems = parseFeed(data, 10);

        console.log("parsed feed");

        // StrapKit.Metrics.logEvent("/httpClient/gotStories", menuItems);

        var resultsPage = StrapKit.UI.Page();
        // Construct Menu to show to user
        var resultsMenu = StrapKit.UI.ListView({
            items: menuItems
        });


        console.log("constructed menu");

        // // Add an action for SELECT
        resultsMenu.setOnItemClick(function(e) {


            var detailPage = StrapKit.UI.Page();
            // Create the Card for detailed view
            var detailCard = StrapKit.UI.Card({
                title: e.item.title,
                body: e.item.subtitle
            });
            detailPage.addView(detailCard);
            detailPage.show();

            // StrapKit.Metrics.logEvent("show/detailPage", e.item.data);
        });

        // Show the Menu, hide the splash
        resultsPage.addView(resultsMenu);
        resultsPage.show();

        console.log("showed results page");

        StrapKit.Metrics.logEvent("show/resultsPage");

    },
    function(error) {
        console.log(error);
    }
);
