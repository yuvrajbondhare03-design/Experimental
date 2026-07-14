function getStreams(tmdbId, mediaType, season, episode) {
    const baseUrl = 'https://pikahd.co';
    const searchUrl = baseUrl + '/?s=' + tmdbId;
    
    const requestHeaders = {
        'User-Agent': 'Mozilla/5.0 (Linux; Android 10; Mobile) AppleWebKit/537.36'
    };

    return fetch(searchUrl, { headers: requestHeaders })
        .then(function(searchResponse) {
            return searchResponse.text();
        })
        .then(function(searchText) {
            // Find the link to the media page using simple text positioning
            const matchIndex = searchText.indexOf('class="result-item"');
            if (matchIndex === -1) return [];

            const hrefIndex = searchText.indexOf('href="', matchIndex);
            if (hrefIndex === -1) return [];

            const startUrl = hrefIndex + 6;
            const endUrl = searchText.indexOf('"', startUrl);
            return searchText.substring(startUrl, endUrl);
        })
        .then(function(pageLink) {
            if (!pageLink || pageLink === '') return [];
            return fetch(pageLink, { headers: requestHeaders })
                .then(function(pageResponse) {
                    return pageResponse.text();
                });
        })
        .then(function(pageHtml) {
            if (!pageHtml) return [];
            
            const discoveredStreams = [];
            let position = 0;

            // Search through the page text to look for video link indicators
            while (true) {
                let iframeIndex = pageHtml.indexOf('src="', position);
                if (iframeIndex === -1) {
                    iframeIndex = pageHtml.indexOf('data-src="', position);
                }
                if (iframeIndex === -1) break;

                const startSrc = iframeIndex + (pageHtml.charAt(iframeIndex) === 'd' ? 10 : 5);
                const endSrc = pageHtml.indexOf('"', startSrc);
                const videoUrl = pageHtml.substring(startSrc, endSrc);

                if (videoUrl.includes('player') || videoUrl.includes('embed')) {
                    discoveredStreams.push({
                        name: "PikaHD Provider",
                        title: "Mirror Link " + (discoveredStreams.length + 1),
                        url: videoUrl
                    });
                }
                position = endSrc;
            }

            return discoveredStreams;
        })
        .catch(function(error) {
            return [];
        });
}

module.exports = { getStreams };

