module.exports.formatForApi = (data, handlerCallback, apiCallback) => {
    // return formatResponseForApi(null, handlerCallback(data), apiCallback);
    return handlerCallback(data)
        .then(data => {
            formatResponseForApi(null, data, apiCallback);
        })
        .catch(err => {
            const error = new Error(err);
            formatResponseForApi(error, null, apiCallback);
        });
}

function formatResponseForApi(error, message, callback) {
    const response = {
        "statusCode": 200,
        "body": JSON.stringify(message),
        "isBase64Encoded": false
    };

    if (error) {
        response.statusCode = 500;
    }

    callback(error, response);
}