# Alarm recording credits

The two recordings below replace the initial synthesized effects. Retrieved
October 18, 2026 from Freesound's publicly served high-quality MP3 previews.
Both source pages identify the sounds as CC0 1.0:
https://creativecommons.org/publicdomain/zero/1.0/

## Submarine — submarine.wav

- Original: **Klaxon on axis short.wav** by **jameswrowles**.
- Source: https://freesound.org/people/jameswrowles/sounds/514980/
- Recording of a Klaxon HEK E/75 mechanical hooter. “Submarine” is the app's
  sound label; the source does not claim it was recorded aboard a submarine.
- Adaptation: repeat the recording twice, normalize, apply short fades, convert
  to mono 44.1 kHz PCM WAV, up to four seconds.
- Default for new users. Previously saved sound choices remain unchanged.

## Fire Alert — fire-alert.wav

- Original: **Fire alarm** by **pushkin**.
- Source: https://freesound.org/people/pushkin/sounds/319413/
- Recording of the fire alarm in the contributor's building.
- Adaptation: four-second excerpt starting one second into the source,
  normalized with short fades, converted to mono 44.1 kHz PCM WAV.

Reproduce the edits with `python3 scripts/prepare-alarm-sounds.py` (requires
ffmpeg). The script verifies each downloaded source's SHA-256 before editing.
No model/build step downloads these sounds; the app serves the bundled WAVs.
