#!/bin/bash
# Builds "Koja Keys.app" into dist/. With --install it replaces /Applications/Koja Keys.app.
#   bash tools/koja-keys/build.sh --install
set -euo pipefail
cd "$(dirname "$0")"

swift build -c release
bin="$(swift build -c release --show-bin-path)/KojaKeys"

app="dist/Koja Keys.app"
rm -rf "$app"
mkdir -p "$app/Contents/MacOS" "$app/Contents/Resources"
cp "$bin" "$app/Contents/MacOS/KojaKeys"
cp Info.plist "$app/Contents/Info.plist"

icons="$(mktemp -d)/AppIcon.iconset"
mkdir -p "$icons"
swift make-icon.swift "$icons/icon_512x512@2x.png"
for size in 16 32 128 256 512; do
  sips -z $size $size "$icons/icon_512x512@2x.png" --out "$icons/icon_${size}x${size}.png" >/dev/null
  sips -z $((size * 2)) $((size * 2)) "$icons/icon_512x512@2x.png" --out "$icons/icon_${size}x${size}@2x.png" >/dev/null
done
iconutil -c icns "$icons" -o "$app/Contents/Resources/AppIcon.icns"

# A Developer ID signature stays the same across builds, so the keychain keeps trusting new builds.
# Without one it is signed ad hoc, and the keychain asks once after each build.
identity=$(security find-identity -v -p codesigning | awk -F'"' '/Developer ID Application/ { print $2; exit }')
codesign --force --timestamp=none --sign "${identity:--}" "$app"
echo "built $app"

if [ "${1:-}" = --install ]; then
  rm -rf "/Applications/Koja Keys.app"
  cp -R "$app" /Applications/
  echo "installed /Applications/Koja Keys.app"
fi
