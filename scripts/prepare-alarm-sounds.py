"""Prepare the CC0 alarm recordings documented in public/sounds/CREDITS.md.

Run manually with Python 3 and ffmpeg; generated WAVs are committed assets.
"""
import hashlib
from pathlib import Path
import subprocess
import tempfile
from urllib.request import urlopen

OUTPUT = Path(__file__).resolve().parents[1] / 'public' / 'sounds'
SOURCES = [
    ('submarine', 'https://cdn.freesound.org/previews/514/514980_3874107-hq.mp3',
     'c570c878bfcd3695f967756a2c1fa1a88c5d615b3afaa962678cb47ccab78a47',
     ['-stream_loop', '1'], 3.7),
    ('fire-alert', 'https://cdn.freesound.org/previews/319/319413_336074-hq.mp3',
     '0a89258cb93066e9d12d58e44d85aac0c28a073b95a734a2daac4040ef66438e',
     ['-ss', '1'], 3.85),
]

if __name__ == '__main__':
    with tempfile.TemporaryDirectory(prefix='phone-lunk-audio-') as directory:
        for name, url, checksum, input_options, fade_start in SOURCES:
            with urlopen(url, timeout=30) as response:
                data = response.read()
            if hashlib.sha256(data).hexdigest() != checksum:
                raise RuntimeError(f'{name}: source checksum changed')
            source = Path(directory) / f'{name}.mp3'
            source.write_bytes(data)
            subprocess.run([
                'ffmpeg', '-hide_banner', '-loglevel', 'error', '-y',
                *input_options, '-i', str(source), '-t', '4', '-af',
                'loudnorm=I=-18:TP=-3:LRA=7,afade=t=in:d=0.01,'
                f'afade=t=out:st={fade_start}:d=0.15',
                '-ar', '44100', '-ac', '1', str(OUTPUT / f'{name}.wav'),
            ], check=True)
