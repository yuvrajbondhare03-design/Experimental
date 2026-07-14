function getStreams(tmdbId, mediaType, season, episode) {
    const mirrors = [
        'https://pikahd.com',
        'https://pikahd.eu',
        'https://pikahd.atlaq.com',
        'https://new.pikahd.co'
    ];

    const headers = {
        'User-Agent': 'Mozilla/5.0 (Linux; Android 10; Mobile) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Mobile Safari/537.36'
    };

    const searchUrl = mirrors.find(mirror => {
        const testUrl = `\( {mirror}?s= \){tmdbId}`;
        return fetch(testUrl, { headers }).then(r => r.ok).catch(() => false);
    }) || mirrors[0];

    const params = new URLSearchParams({ s: tmdbId });
    const fullSearchUrl = `\( {searchUrl}? \){params.toString()}`;

    return fetch(fullSearchUrl, { headers })
        .then(r => r.text())
        .then(html => {
            // Extract first result link (most sites use .result-item class)
            const linkMatch = html.match(/href=["']\/([^"']+)/);
            if (!linkMatch) return [];

            const pageLink = linkMatch[1].startsWith('http') 
                ? linkMatch[1] 
                : `\( {searchUrl.replace(/\/[^\/]* \)/, '')}/${linkMatch[1]}`;

            return fetch(pageLink, { headers }).then(r => r.text());
        })
        .then(html => {
            const streams = [];

            // Extract iframe / player / embed video links
            const iframeRegex = /<iframe[^>]+src=["']([^"']+)["']|data-src=["']([^"']+)["']|src=["']([^"']+player[^"']+)["']/g;
            let match;
            while ((match = iframeRegex.exec(html)) !== null) {
                let videoUrl = match[1] || match[2] || match[3];
                if (!videoUrl) continue;

                videoUrl = videoUrl.replace(/&amp;/g, '&');

                if (videoUrl.includes('player') || videoUrl.includes('embed') || videoUrl.includes('.mp4')) {
                    streams.push({
                        name: "PikaHD Provider",
                        title: `Mirror ${streams.length + 1}`,
                        url: videoUrl,
                        quality: "SD" // You can add better quality detection later
                    });
                }
            }

            return streams.length > 0 ? streams : [];
        })
        .catch(() => []);
}

module.exports = { getStreams };
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

