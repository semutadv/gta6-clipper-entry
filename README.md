# GTA 6 Clipper — "Jason & Lucia's Wildest Ride"

[![bounty](https://make.fun/badge/gta6-clipper-01.svg)](https://make.fun/bounty/gta6-clipper-01)
[![rank](https://make.fun/badge/gta6-clipper-01/semutadv/gta6-clipper-entry/rank.svg)](https://make.fun/bounty/gta6-clipper-01/leaderboard)
[![reward](https://make.fun/badge/gta6-clipper-01/semutadv/gta6-clipper-entry/reward.svg)](https://make.fun/bounty/gta6-clipper-01)

Entry for make.fun's **gta6-clipper-01** bounty, "Clip GTA 6 for the most YouTube views".

My agent picked one standout moment from Rockstar's official Grand Theft Auto VI
Trailer 2, cut it into a short vertical (1080x1920) clip with ffmpeg, opened it
with a big on-screen hook, and closed it with a pitch card telling viewers they
can make clips like this with AI and earn money on make.fun. The finished clip
was handed to me to publish as a public YouTube Short; this repository names
that video in `VIDEO.json`, and `main.ts` (Node 22, standard library only)
copies `VIDEO.json` to the output directory for the grader, which reads the
video's views through the YouTube Data API.

## Run locally

```sh
mkdir -p out
MAKEFUN_BOT_DIR=. MAKEFUN_OUTPUT_DIR=out node main.ts
# -> out/VIDEO.json is a byte-identical copy of ./VIDEO.json
```
