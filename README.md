# Bhairavi puja session

To preview locally on Windows with Python installed, run `py -m http.server 8000 --bind 127.0.0.1` in this folder and open <http://127.0.0.1:8000>.

Tap a track to play or pause it; the main player also lets you seek. All Auto-play switches start off. To play a sequence, enable the switches for the later tracks you want, then tap Play on the first track. Its own switch need not be on. Playback skips unselected tracks and stops after the last selection without looping.

## Playing with the screen locked

Start a recording in your phone's browser before locking. The player requests a playback audio session and supplies lock-screen play/pause controls where supported; the phone still decides whether to suspend the browser. For sessions where the browser stops mid-track or between tracks, select the first recording, set Auto-play for the later recordings, and use **Playing with your phone locked? > Download session playlist**. Open the downloaded M3U8 in a background-capable music app such as VLC. It streams from the site, starts the current recording from the beginning, and does not need the browser to advance tracks. Download a new playlist if you change the selection.

## Publish on GitHub Pages

1. Push the site files and the [assets](assets/) folder to the root of your GitHub repository. Only publish recordings you have permission to share.
2. Under **Settings > Pages > Build and deployment**, choose **Deploy from a branch**.
3. Select your branch and **/ (root)**, then save. Open the Pages URL after deployment completes.

No build or dependencies are needed. To change the playlist, update the ordered filenames in [player.js](player.js) to match the MP3s exactly, including capitalization.
