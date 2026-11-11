import Foundation
import Security

/// The database access, kept in the login keychain of this Mac.
public enum CredentialStore {
    static let service = "com.kojalytics.koja-keys"
    static let account = "supabase"

    private static var query: [String: Any] {
        [kSecClass as String: kSecClassGenericPassword, kSecAttrService as String: service, kSecAttrAccount as String: account]
    }

    public static func load() -> Credentials? {
        var q = query
        q[kSecReturnData as String] = true
        var item: CFTypeRef?
        guard SecItemCopyMatching(q as CFDictionary, &item) == errSecSuccess, let data = item as? Data else { return nil }
        return try? JSONDecoder().decode(Credentials.self, from: data)
    }

    public static func save(_ credentials: Credentials) throws {
        let data = try JSONEncoder().encode(credentials)
        SecItemDelete(query as CFDictionary)
        var q = query
        q[kSecValueData as String] = data
        q[kSecAttrLabel as String] = "Koja Keys: Lizenz-Datenbank"
        let status = SecItemAdd(q as CFDictionary, nil)
        guard status == errSecSuccess else {
            throw LicenseAPIError(errorDescription: "Der Zugang ließ sich nicht im Schlüsselbund speichern (\(status)).")
        }
    }

    public static func delete() {
        SecItemDelete(query as CFDictionary)
    }
}

/// Full keys made on this Mac, by hash. The database keeps only hashes, so this is the only place to read such a key again.
public struct KeyArchive {
    public let file: URL

    public init(file: URL) {
        self.file = file
    }

    public static let standard = KeyArchive(
        file: FileManager.default.urls(for: .applicationSupportDirectory, in: .userDomainMask)[0]
            .appendingPathComponent("Koja Keys", isDirectory: true).appendingPathComponent("keys.json"))

    public func load() -> [String: String] {
        guard let data = try? Data(contentsOf: file) else { return [:] }
        return (try? JSONDecoder().decode([String: String].self, from: data)) ?? [:]
    }

    /// Adds formatted keys ("KOJA-…") and returns the whole archive.
    @discardableResult
    public func add(_ keys: [String]) throws -> [String: String] {
        var archive = load()
        for key in keys {
            if let body = KeyFormat.normalize(key) { archive[KeyFormat.hash(body)] = key }
        }
        let dir = file.deletingLastPathComponent()
        try FileManager.default.createDirectory(at: dir, withIntermediateDirectories: true, attributes: [.posixPermissions: 0o700])
        let encoder = JSONEncoder()
        encoder.outputFormatting = [.prettyPrinted, .sortedKeys]
        try encoder.encode(archive).write(to: file, options: .atomic)
        try FileManager.default.setAttributes([.posixPermissions: 0o600], ofItemAtPath: file.path)
        return archive
    }
}
