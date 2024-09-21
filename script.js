const clientID = '173467fb'; // Replace with your Jamendo client ID

document.getElementById('searchButton').addEventListener('click', searchTracks);
document.getElementById('searchInput').addEventListener('keypress', function(e) {
    if (e.key === 'Enter') {
        searchTracks();
    }
});

function searchTracks() {
    const searchInput = document.getElementById('searchInput').value;
    if (!searchInput) return;

    showLoading();
    clearResults();
    hideError();

    const url = `https://api.jamendo.com/v3.0/tracks/?client_id=${clientID}&format=json&limit=10&search=${encodeURIComponent(searchInput)}`;

    fetch(url)
        .then(response => response.json())
        .then(data => {
            hideLoading();
            if (data.results && data.results.length > 0) {
                displayResults(data.results);
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
        const musicCard = document.createElement('div');
        musicCard.className = 'music-card';

        const trackTitle = document.createElement('h2');
        trackTitle.textContent = track.name;

        const artistName = document.createElement('p');
        artistName.textContent = `Artist: ${track.artist_name}`;

        const albumCover = document.createElement('img');
        albumCover.src = track.album_image || 'https://via.placeholder.com/150';
        albumCover.alt = track.album_name;

        const audioPlayer = document.createElement('audio');
        audioPlayer.controls = true;
        audioPlayer.src = track.audio;

        musicCard.appendChild(albumCover);
        musicCard.appendChild(trackTitle);
        musicCard.appendChild(artistName);
        musicCard.appendChild(audioPlayer);
        resultsContainer.appendChild(musicCard);
    });
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
