"use strict";

const files = [
  "01 - Soundarya Lahari (Mahim Muladhare).mp3",
  "02 - Na Taato Na Maata.mp3",
  "03 - Ya Devi.mp3",
  "05 - Linga Bhairavi Arati - Sadhguru.mp3",
  "06 - Bhairavi Prarthana (by Sadhguru).mp3",
  "06 - Linga Bhairavi Stuthi (3 cycles).mp3",
  "07 - Achala Arpanam Daily Practice.mp3",
  "08 - Yantra Abhishekam Audio.mp3",
  "09 - Bhairavi Shatakam.mp3",
  "10 - Jaago Bhairavi.mp3",
  "11 - Bhairavi Shatakam (Vibrant).mp3",
  "12 - Bhairavi Jaya Bhairavi.mp3",
  "13 - Chandiran Oliyil Avalai Kanden.mp3",
  "14 - Bhairavi Vandana.mp3",
  "15 - Devi Dasa Shloka Stuti.mp3",
  "16 - Prata Stuve Para Shivam Bhairavi.mp3"
];
const audio = document.querySelector("#audio");
const statusText = document.querySelector("#status");
const error = document.querySelector("#error");
const list = document.querySelector("#tracks");
let current = 0;
let playlistURL;

if ("audioSession" in navigator) {
  navigator.audioSession.type = "playback";
}
if ("mediaSession" in navigator) {
  navigator.mediaSession.setActionHandler("play", () => play(current));
  navigator.mediaSession.setActionHandler("pause", () => audio.pause());
}

for (let i = 0; i < 12; i++) {
  const petal = document.createElementNS("http://www.w3.org/2000/svg", "use");
  petal.setAttribute("href", "#petal");
  petal.setAttribute("transform", `rotate(${30 * i})`);
  document.querySelector("#petals").append(petal);
}
document.querySelector("#count").textContent = `${files.length} tracks`;
const rows = files.map((file, i) => {
  const title = file.slice(5, -4);
  const row = document.createElement("li");
  row.innerHTML = `<button type="button" class="track"><span class="disc" aria-hidden="true"></span><span class="title"></span></button>
    <label class="switch"><input type="checkbox" role="switch"><span class="rail"></span></label>`;
  row.querySelector(".title").textContent = title;
  const button = row.querySelector("button");
  const toggle = row.querySelector("input");
  toggle.onchange = updatePlaylist;
  toggle.setAttribute("aria-label", `Auto-play ${title}`);
  button.onclick = () => {
    if (current === i && !audio.paused) audio.pause();
    else play(i);
  };
  list.append(row);
  return {row, button, toggle, title, disc:row.querySelector(".disc")};
});

function render() {
  rows.forEach(({row, button, disc, title}, i) => {
    const playing = i === current && !audio.paused;
    row.classList.toggle("active", i === current);
    button.setAttribute("aria-label", `${playing ? "Pause" : "Play"} ${title}`);
    disc.textContent = playing ? "\u2161" : "\u25b6";
  });
}
function queuedAfterCurrent() {
  return files.map((_, i) => i).filter(i => i > current && rows[i].toggle.checked);
}
function assetURL(i) {
  return new URL(`assets/${encodeURIComponent(files[i])}`, document.baseURI).href;
}
function updatePlaylist() {
  const entries = [current, ...queuedAfterCurrent()].map(i =>
    `#EXTINF:-1,${rows[i].title}\n${assetURL(i)}\n`);
  if (playlistURL) URL.revokeObjectURL(playlistURL);
  playlistURL = URL.createObjectURL(new Blob(["#EXTM3U\n", ...entries], {type:"application/vnd.apple.mpegurl"}));
  document.querySelector("#playlist").href = playlistURL;
}
function select(i) {
  current = i;
  audio.src = assetURL(i);
  updatePlaylist();
  if ("mediaSession" in navigator && "MediaMetadata" in window) {
    navigator.mediaSession.metadata = new MediaMetadata({title:rows[i].title, album:"Puja session"});
  }
  document.querySelector("#current").textContent = rows[i].title;
  error.textContent = "";
  statusText.textContent = "Ready to play";
  render();
}
async function play(i) {
  if (i !== current || audio.error) select(i);
  try {
    await audio.play();
  } catch (e) {
    if (i === current && e.name !== "AbortError") {
      error.textContent = "Playback could not start. Tap play to retry or choose another recording.";
    }
  }
}
audio.onplaying = () => {
  if ("mediaSession" in navigator) navigator.mediaSession.playbackState = "playing";
  statusText.textContent = "Now playing";
  error.textContent = "";
  render();
};
audio.onpause = () => {
  if ("mediaSession" in navigator && audio.paused) navigator.mediaSession.playbackState = "paused";
  if (!audio.ended && audio.paused) statusText.textContent = "Paused";
  render();
};
audio.onended = () => {
  const [next] = queuedAfterCurrent();
  if (next !== undefined) play(next);
  else {
    if ("mediaSession" in navigator) navigator.mediaSession.playbackState = "none";
    statusText.textContent = "Finished";
    render();
  }
};
audio.onerror = () => {
  statusText.textContent = "Unavailable";
  error.textContent = "This recording could not be loaded. Retry or select another track.";
  render();
};
select(0);
