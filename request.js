const request = require('request');
const fs = require('fs');

const send = (url, headers) => {
    const options = {
        url: url,
        headers: headers
    };
    return new Promise(function (resolve, reject) {
        request(options, function (error, res, body) {
            if (!error && res.statusCode == 200) {
                resolve(body);
            } else {
                reject(error);
            }
        });
    });
};

const page = (shortcode, url, headers) => {
    const options = {
        url: url,
        headers: headers
    };
    request(options, function (error, res, body) {
        if (!error && res.statusCode == 200) {
            body = JSON.parse(body);
            const msg = `shortcode: ${shortcode} like: ${body.data.shortcode_media.edge_media_preview_like.count} text: ${body.data.shortcode_media.edge_media_to_caption.edges[0].node.text}
                ===========================================================================
            `;
            fs.appendFile('log.txt', msg, function (err) {
                if (err) {
                    console.log(`[Append File Error]${err}`);
                    throw error;
                }
            });
        } else {
            console.log(`[Requert ERROR]Status Code:${res.statusCode}, Error:${error}`);
            throw error;
        }
    });
};

exports.send = send;
exports.page = page;