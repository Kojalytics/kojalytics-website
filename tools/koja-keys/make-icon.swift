// Draws the Koja Keys app icon (1024 px PNG): the website's white with its one blue accent and crosshair ticks.
//   swift make-icon.swift out.png
import AppKit

let px = 1024
let rep = NSBitmapImageRep(bitmapDataPlanes: nil, pixelsWide: px, pixelsHigh: px, bitsPerSample: 8, samplesPerPixel: 4,
                           hasAlpha: true, isPlanar: false, colorSpaceName: .deviceRGB, bytesPerRow: 0, bitsPerPixel: 0)!
NSGraphicsContext.current = NSGraphicsContext(bitmapImageRep: rep)
let blue = NSColor(srgbRed: 42 / 255, green: 102 / 255, blue: 216 / 255, alpha: 1)
let ink = NSColor(srgbRed: 0.09, green: 0.09, blue: 0.1, alpha: 1)

// macOS icon grid: an 824 px tile with a soft shadow.
let tile = NSRect(x: 100, y: 100, width: 824, height: 824)
let path = NSBezierPath(roundedRect: tile, xRadius: 185, yRadius: 185)
NSGraphicsContext.saveGraphicsState()
let shadow = NSShadow()
shadow.shadowColor = NSColor.black.withAlphaComponent(0.28)
shadow.shadowBlurRadius = 28
shadow.shadowOffset = NSSize(width: 0, height: -12)
shadow.set()
NSColor(srgbRed: 0.985, green: 0.985, blue: 0.98, alpha: 1).setFill()
path.fill()
NSGraphicsContext.restoreGraphicsState()
NSColor.black.withAlphaComponent(0.08).setStroke()
path.lineWidth = 3
path.stroke()

// Crosshair ticks in the corners, as on kojalytics.com.
ink.withAlphaComponent(0.55).setStroke()
for (x, y, dx, dy) in [(232.0, 792.0, 1.0, -1.0), (792.0, 792.0, -1.0, -1.0), (232.0, 232.0, 1.0, 1.0), (792.0, 232.0, -1.0, 1.0)] {
    let tick = NSBezierPath()
    tick.lineWidth = 10
    tick.move(to: NSPoint(x: x, y: y + dy * 56))
    tick.line(to: NSPoint(x: x, y: y))
    tick.line(to: NSPoint(x: x + dx * 56, y: y))
    tick.stroke()
}

// The key, in the accent blue.
let config = NSImage.SymbolConfiguration(pointSize: 400, weight: .semibold).applying(.init(paletteColors: [blue]))
let symbol = (NSImage(systemSymbolName: "key.horizontal.fill", accessibilityDescription: nil)
    ?? NSImage(systemSymbolName: "key.fill", accessibilityDescription: nil)!).withSymbolConfiguration(config)!
let size = symbol.size
symbol.draw(in: NSRect(x: (Double(px) - size.width) / 2, y: (Double(px) - size.height) / 2, width: size.width, height: size.height))

NSGraphicsContext.current = nil
try! rep.representation(using: .png, properties: [:])!.write(to: URL(fileURLWithPath: CommandLine.arguments[1]))
