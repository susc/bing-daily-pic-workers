addEventListener('fetch', event => {
    event.respondWith(handleRequest(event.request))
})

async function startRequest() {
    let data = await (() => {
        return new Promise((resolve, reject) => {
            fetch('https://cn.bing.com/').then(res => {
                res.text().then(text => {
                    resolve(text);
                });
            }).catch(err => {
                reject({
                    "err": true,
                    detail: err
                });
            });
        });
    })();
    return data;
}

/**
 * Respond to the request
 * @param {Request} request
 */
async function handleRequest(request) {
    let data = await startRequest();
    if (typeof data !== 'string') {
        return new Response(data.detail, {
            status: 502
        });
    }
    let matchResult = data.match(/<div[\s\S]+?bgImgProgLoad[\s\S]+?src="(.+?)"\s/);
    if (!matchResult) {
        return new Response('Error in matchResult.', {
            status: 502
        });
    }
    let finalURL = 'https://cn.bing.com' + matchResult[1];
    return new Response(null, {
        status: 302,
        headers: {
            Location: finalURL
        }
    });
}