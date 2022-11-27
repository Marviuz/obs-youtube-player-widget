var playerContainer = document.querySelector('#player-container');
var tag = document.createElement('script');
tag.src = "https://www.youtube.com/iframe_api";
var firstScriptTag = document.getElementsByTagName('script')[0];
firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
var queue = [];

var urlParams = new URLSearchParams(window.location.search);
var limit = urlParams.get('limit');
var channel = urlParams.get('channel');

function getYoutubeId(url) {
  var rx = /^.*(?:(?:youtu\.be\/|v\/|vi\/|u\/\w\/|embed\/|shorts\/)|(?:(?:watch)?\?v(?:i)?=|\&v(?:i)?=))([^#\&\?]*).*/;
  var id = url.match(rx);
  return id[1];
}

function resetPlayer() {
  var newPlayer = document.createElement('div');
  newPlayer.id = 'player';
  playerContainer.innerHTML = '';
  playerContainer.append(newPlayer);
}

function playQueue() {
  var id = queue[0];

  new YT.Player('player', {
    width: '1280',
    height: '720',
    videoId: id,
    playerVars: {
      playsinline: 1,
      controls: 0,
      end: limit || 5,
    },
    events: {
      onReady(event) {
        event.target.playVideo();
      },
      onStateChange(event) {
        if (event.data === YT.PlayerState.ENDED) {
          queue.shift();
          resetPlayer();
          if (queue.length) playQueue();
        };
      },
      onError(event) {
        console.log(event);
        playerContainer.innerHTML = 'Video not found!'; // TODO: a better stuff here
        setTimeout(resetPlayer, 5000);
        if (queue.length) playQueue();
      }
    }
  });
}
