// swift-tools-version:5.9
import PackageDescription

let package = Package(
    name: "KojaKeys",
    platforms: [.macOS(.v14)],
    targets: [
        .target(name: "KojaKeysCore"),
        .executableTarget(name: "KojaKeys", dependencies: ["KojaKeysCore"]),
        .testTarget(name: "KojaKeysCoreTests", dependencies: ["KojaKeysCore"]),
    ]
)
