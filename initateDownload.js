var https = require('https'),
    fs = require('fs');


var request = https.get("https://mindler-dashboard.s3.us-east-2.amazonaws.com/products.json", function(response) {
    if (response.statusCode === 200) {
        var file = fs.createWriteStream("productsDownload.json");
        response.pipe(file);
    }
    // keeping very high Add timeout as size is big
    request.setTimeout(12000, function () {
        request.abort();
    });
});