Soccer Player Career

This repository contains a simple browser-based soccer player career simulator that runs in Microsoft Edge (and other modern browsers).

How to play locally in Microsoft Edge

- Recommended (quick): open index.html from GitHub Pages. To enable GitHub Pages, go to the repository Settings → Pages and set the source to the `main` branch root. Then visit the provided Pages URL in Edge.

- Run locally (works in Edge):
  1. Clone the repo.
  2. Run a tiny local HTTP server from the repository root (this avoids browser file:// restrictions):
     - Python 3: `python -m http.server 8000`
     - Node (http-server): `npx http-server . -p 8000`
  3. Open Microsoft Edge and go to `http://localhost:8000`.

Controls

- Edit Profile: change name/nation/team/position/age/attributes.
- Load profile from file: load a previously downloaded `player_profile.json`.
- Simulate Seasons: run 1–10 seasons in the browser; attributes will grow and the career log will be appended.
- Download player_profile.json: save the updated profile to your machine.
- Download career_log.md: save the season-by-season log.

Notes

- The simulator is intentionally simple and client-side only — it does not write back to GitHub automatically. Use the download buttons to save your progress.
- For persistent hosting, enable GitHub Pages for the repo so the game can be played directly in Edge without running a local server.

Contributing

PRs welcome. If you want a more advanced simulation, GUI, or publishing to the Microsoft Store / Xbox, open an issue describing the feature.
