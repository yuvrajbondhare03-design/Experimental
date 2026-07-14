function getStreams(tmdbId, mediaType, season, episode) {
    const mirrors = [
        'https://pikahd.com',
        'https://pikahd.eu',
        'https://pikahd.atlaq.com',
        'https://new.pikahd.co'
    ];

    const headers = {
        'User-Agent': 'Mozilla/5.0 (Linux; Android 10; Mobile) AppleWebKit/537.36'
    };

    let found = false;
    let mirrorUrl = '';

    for (let mirror of mirrors) {
        const testUrl = `\( {mirror}?s= \){tmdbId}`;
        if (fetch(testUrl, { headers }).then(r => r.ok).catch(() => false)) {
            found = true;
            mirrorUrl = mirror;
            break;
        }
    }

    if (!found) {
        mirrorUrl = mirrors[0];
    }

    const fullUrl = `\( {mirrorUrl}?s= \){tmdbId}`;

    return fetch(fullUrl, { headers })
        .then(r => r.text())
        .then(html => {
            const streams = [];

            // Improved extraction for player/iframe links
            const regex = /<iframe[^>]+src=["']([^"']+)["']|data-src=["']([^"']+)["']/g;
            let match;
            while ((match = regex.exec(html)) !== null) {
                let url = match[1] || match[2];
                if (url && (url.includes('player') || url.includes('embed') || url.includes('.mp4'))) {
                    streams.push({
                        name: "PikaHD Provider",
                        title: `Mirror ${streams.length + 1}`,
                        url: url
                    });
                }
            }

            return streams.length > 0 ? streams : [];
        })
        .catch(() => []);
}

module.exports = { getStreams };            // Extract iframe / player / embed video links
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

