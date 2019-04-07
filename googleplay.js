var gplay = require('google-play-scraper');
const createCsvWriter = require('csv-writer').createArrayCsvWriter;
const Logger = require('./logger');

var googlePlayAppId = 'com.mrplot.mundobitaandanativo.app';

gplay.app({appId: googlePlayAppId , lang : "pt", country: "br"}).then((data) => {

    let logger = new Logger('Google Play', data.title, data.scoreText, googlePlayAppId, data.appId);
    logger.log();

    const records = [];

    let reviewsCount = data.reviews;
    let itemsPerPage = 40
    let pages = Math.floor(reviewsCount / itemsPerPage);

    for(var i = 1; i < pages ;i++){
        gplay.reviews({
            appId: googlePlayAppId,
            sort: gplay.sort.NEWEST,
            pages : i,
            lang: "pt-br"
        }).then((data) => {
            data.forEach(function(review) {
                var reviewModel = [review.score, review.title, review.text];
                records.push(reviewModel);
            })

            const csvWriter = createCsvWriter({
                header: ['Nota', 'Título', 'Comentário'],
                path: 'googleplay.csv'
            });

            csvWriter.writeRecords(records)
            .then(() => {
                console.log('...Done');
            }); 
        });
    }
});