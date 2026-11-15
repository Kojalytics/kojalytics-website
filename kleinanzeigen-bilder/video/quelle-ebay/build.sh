#!/bin/bash
set -e
E=/tmp/claude-0/-home-user-kojalytics-website/fe6ba28e-c723-50a1-8f23-7edc7500d270/scratchpad/ebayvid
DM=/tmp/claude-0/-home-user-kojalytics-website/fe6ba28e-c723-50a1-8f23-7edc7500d270/scratchpad/demos
mkdir -p "$E/seg"
clip() { # name src ss dur cap fadein fadeout
  local fo; fo=$(python3 -c "print(max(0,$4-0.25))")
  local f="[1:v]fps=30,pad=1282:802:1:1:color=0xd9d9d6[v];[0:v][v]overlay=319:199[a];[a][2:v]overlay=0:0,format=yuv420p"
  [ "$6" = 1 ] && f="$f,fade=t=in:st=0:d=0.25:color=white"
  [ "$7" = 1 ] && f="$f,fade=t=out:st=$fo:d=0.25:color=white"
  ffmpeg -v error -y -f lavfi -i "color=c=white:s=1920x1080:r=30:d=$4" -ss "$3" -t "$4" -i "$DM/$2.mp4" -i "$E/$5" \
    -filter_complex "$f" -t "$4" -c:v libx264 -preset medium -crf 17 -r 30 "$E/seg/$1.mp4"
}
still() {
  local fo; fo=$(python3 -c "print($3-0.3)")
  ffmpeg -v error -y -loop 1 -framerate 30 -t "$3" -i "$E/$2" -vf "format=yuv420p,fade=t=in:st=0:d=0.4:color=white,fade=t=out:st=$fo:d=0.3:color=white" -c:v libx264 -crf 17 -r 30 "$E/seg/$1.mp4"
}
still 00 intro.png 3
clip 01 pdf-koja 0.6 9 cap_pdf.png 1 1
clip 02 word-koja 0.6 7 cap_word.png 1 1
clip 03 grid-koja 0.6 7 cap_grid.png 1 1
clip 04 deck-koja 0.6 6 cap_deck.png 1 1
clip 05 photo-koja 0.6 6 cap_photo.png 1 1
i=0
for s in light-koja vector-koja design-koja fig-koja film-koja effect-koja sound-koja cad-koja; do
  fi=0; fo=0; [ $i = 0 ] && fi=1; [ $i = 7 ] && fo=1
  clip "06_$i" "$s" 6.5 1 "cap_more$i.png" $fi $fo
  i=$((i+1))
done
still 07 end.png 6
: > "$E/list.txt"
for f in "$E"/seg/*.mp4; do echo "file '$f'" >> "$E/list.txt"; done
ffmpeg -v error -y -f concat -safe 0 -i "$E/list.txt" -c copy "$E/silent.mp4"
ffprobe -v error -show_entries format=duration -of csv=p=0 "$E/silent.mp4"
