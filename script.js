const spotifyToken = 'BQDkk_YpeLgc1NZaTAbYjCoEmOEHI7mHclfKDoI1JT8kO-K0LkGnhva4Ft_V0-3m83F4I1CC4P0PI4V30hqmm1xESC7l0HahJZqLfHobtNHWfjx_xhDTMOwOJsY9kIMtQqSfuEKLwLG8Zihcl6LRkRKmB-14QpCYurBxYSWv61N6S-acZMPS1RLXnjwjhHVYWl7hz-q20oVyqvphee8lBpSNVYT3t_6U3X6viotIfWqSTbgzY2_Hk68UiDF4gc66T3LgeeUSUUJTeFQePwEOHbxxKRJRS5tR'; // Replace with your Spotify access token

document.getElementById('searchButton').addEventListener('click', searchSpotifyTracks);
document.getElementById('searchInput').addEventListener('keypress', function(e) {
    if (e.key === 'Enter') {
        searchSpotifyTracks();
    }
});

function searchSpotifyTracks() {
    const searchInput = document.getElementById('searchInput').value;
    if (!searchInput) return;

    showLoading();
    clearResults();
    hideError();

    const url = `https://api.spotify.com/v1/search?q=${encodeURIComponent(searchInput)}&type=track&limit=10`;

    fetch(url, {
        headers: {
            'Authorization': `Bearer ${spotifyToken}`
        }
    })
    .then(response => response.json())
    .then(data => {
        hideLoading();
        if (data.tracks && data.tracks.items) {
            displayResults(data.tracks.items);
        } else {
            showError('No results found');
        }
    })
    .catch(error => {
        hideLoading();
        showError('An error occurred while fetching data');
        console.error('Error:', error);
    });
}

function displayResults(tracks) {
    const resultsContainer = document.getElementById('results');
    
    tracks.forEach(track => {
        const trackCard = document.createElement('div');
        trackCard.className = 'track-card';

        const trackName = document.createElement('h2');
        trackName.textContent = track.name;

        const artistName = document.createElement('p');
        artistName.textContent = `Artist: ${track.artists[0].name}`;

        const playButton = document.createElement('button');
        playButton.textContent = 'Play';
        playButton.addEventListener('click', () => {
            playTrack(track.preview_url);
        });

        trackCard.appendChild(trackName);
        trackCard.appendChild(artistName);
        trackCard.appendChild(playButton);
        resultsContainer.appendChild(trackCard);
    });
}

function playTrack(previewUrl) {
    if (previewUrl) {
        const audioPlayer = document.getElementById('audioPlayer');
        audioPlayer.src = previewUrl;
        audioPlayer.play();
    } else {
        alert('Preview not available for this track');
    }
}

function showLoading() {
    document.getElementById('loading').classList.remove('hidden');
}

function hideLoading() {
    document.getElementById('loading').classList.add('hidden');
}

function showError(message) {
    const errorElement = document.getElementById('error');
    errorElement.textContent = message;
    errorElement.classList.remove('hidden');
}

function hideError() {
    document.getElementById('error').classList.add('hidden');
}

function clearResults() {
    document.getElementById('results').innerHTML = '';
}
