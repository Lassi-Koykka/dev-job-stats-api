
//Determines appropriate 404 response type based on what the request accepts
function detResType(req, res, pathTo404) {
    // respond with html page
    if (req.accepts('html')) {
        res.sendFile(pathTo404);
        return;
    }

    // respond with json
    if (req.accepts('json')) {
        res.send({error: 'Not found'});
        return;
    }

    // default to plain-text. send()
    res.type('txt').send('Not found');
}

module.exports = {detResType}