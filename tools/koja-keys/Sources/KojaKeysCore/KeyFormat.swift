import CryptoKit
import Foundation
import Security

/// Koja license keys exactly as src/lib/license.ts makes and checks them:
/// "KOJA-" + 20 characters of Crockford base32 (no I, L, O or U); the database keeps a SHA-256 of the 20 characters.
public enum KeyFormat {
    static let alphabet = Array("0123456789ABCDEFGHJKMNPQRSTVWXYZ")
    static let bodyLength = 20

    /// "koja-abcde …" → "ABCDE…" (20 characters), or nil when it can't be a Koja key.
    public static func normalize(_ input: String) -> String? {
        var s = input.uppercased().filter { $0 != "-" && !$0.isWhitespace }
        if s.hasPrefix("KOJA") { s.removeFirst(4) }
        s = String(s.map { $0 == "O" ? "0" : ($0 == "I" || $0 == "L") ? "1" : $0 })
        guard s.count == bodyLength, s.allSatisfy({ alphabet.contains($0) }) else { return nil }
        return s
    }

    public static func format(_ body: String) -> String {
        let chars = Array(body)
        return "KOJA-" + stride(from: 0, to: chars.count, by: 5).map { String(chars[$0..<min($0 + 5, chars.count)]) }.joined(separator: "-")
    }

    public static func generateBody() -> String {
        var bytes = [UInt8](repeating: 0, count: bodyLength)
        precondition(SecRandomCopyBytes(kSecRandomDefault, bytes.count, &bytes) == errSecSuccess)
        return String(bytes.map { alphabet[Int($0 % 32)] })
    }

    public static func hash(_ body: String) -> String {
        SHA256.hash(data: Data(body.utf8)).map { String(format: "%02x", $0) }.joined()
    }

    /// The last group, which the database keeps to recognise a key in support requests.
    public static func hint(_ body: String) -> String {
        String(body.suffix(5))
    }
}
