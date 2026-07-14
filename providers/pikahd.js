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

    let mirrorUrl = mirrors[0];
    for (let mirror of mirrors) {
        const testUrl = `\( {mirror}?s= \){tmdbId}`;
        if (fetch(testUrl, { headers }).then(r => r.ok).catch(() => false)) {
            mirrorUrl = mirror;
            break;
        }
    }

    const searchUrl = `\( {mirrorUrl}?s= \){tmdbId}`;

    return fetch(searchUrl, { headers })
        .then(r => r.text())
        .then(html => {
            const streams = [];

            const regex = /<iframe[^>]+src=["']([^"']+)["']|data-src=["']([^"']+)["']/gi;
            let match;
            while ((match = regex.exec(html)) !== null) {
                let url = match[1] || match[2];
                if (!url) continue;
                url = url.replace(/&amp;/g, '&');

                if (url.includes('player') || url.includes('embed') || url.includes('.mp4')) {
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

module.exports = { getStreams };                url = url.replace(/&amp;/g, '&');

                if (url.includes('player') || url.includes('embed') || url.includes('.mp4')) {
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

module.exports = { getStreams };
