import Foundation

/// Where the license tables live: the website's Supabase project, with its service role key.
public struct Credentials: Codable, Equatable, Sendable {
    public var url: URL
    public var serviceKey: String

    public init(url: URL, serviceKey: String) {
        self.url = url
        self.serviceKey = serviceKey
    }

    /// From the website's .env.local (NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY), read like scripts/license/lib.mjs.
    public static func fromEnvFile(_ contents: String) -> Credentials? {
        var env: [String: String] = [:]
        for line in contents.split(separator: "\n", omittingEmptySubsequences: false) {
            guard let eq = line.firstIndex(of: "="),
                  line[..<eq].allSatisfy({ $0.isUppercase || $0.isNumber || $0 == "_" }), eq != line.startIndex
            else { continue }
            env[String(line[..<eq])] = line[line.index(after: eq)...].trimmingCharacters(in: .whitespacesAndNewlines)
        }
        guard let url = env["NEXT_PUBLIC_SUPABASE_URL"].flatMap(URL.init(string:)),
              let key = env["SUPABASE_SERVICE_ROLE_KEY"], !key.isEmpty
        else { return nil }
        return Credentials(url: url, serviceKey: key)
    }
}

/// One row of koja_licenses, with the number of devices it is activated on.
public struct License: Identifiable, Equatable, Sendable {
    public let id: UUID
    public let keyHash: String
    public let keyHint: String
    public let email: String?
    public let note: String?
    public let maxDevices: Int
    public let createdAt: Date
    public let revokedAt: Date?
    /// Set when the key was bought in the shop (Stripe checkout).
    public let stripeSessionId: String?
    public let devices: Int

    public var isRevoked: Bool { revokedAt != nil }
    public var fromShop: Bool { stripeSessionId != nil }
}

extension License: Decodable {
    private enum CodingKeys: String, CodingKey {
        case id, email, note
        case keyHash = "key_hash", keyHint = "key_hint", maxDevices = "max_devices"
        case createdAt = "created_at", revokedAt = "revoked_at", stripeSessionId = "stripe_session_id"
        case activations = "koja_activations"
    }

    private struct Count: Decodable { let count: Int }

    public init(from decoder: Decoder) throws {
        let c = try decoder.container(keyedBy: CodingKeys.self)
        id = try c.decode(UUID.self, forKey: .id)
        keyHash = try c.decode(String.self, forKey: .keyHash)
        keyHint = try c.decode(String.self, forKey: .keyHint)
        email = try c.decodeIfPresent(String.self, forKey: .email)
        note = try c.decodeIfPresent(String.self, forKey: .note)
        maxDevices = try c.decode(Int.self, forKey: .maxDevices)
        createdAt = try Self.date(c.decode(String.self, forKey: .createdAt), c, .createdAt)
        revokedAt = try c.decodeIfPresent(String.self, forKey: .revokedAt).map { try Self.date($0, c, .revokedAt) }
        stripeSessionId = try c.decodeIfPresent(String.self, forKey: .stripeSessionId)
        devices = try c.decodeIfPresent([Count].self, forKey: .activations)?.first?.count ?? 0
    }

    /// Postgres sends "2026-11-10T16:59:25.123456+00:00"; whole seconds are enough here.
    private static func date(_ s: String, _ c: KeyedDecodingContainer<CodingKeys>, _ key: CodingKeys) throws -> Date {
        let trimmed = s.replacingOccurrences(of: #"\.\d+"#, with: "", options: .regularExpression)
        guard let date = ISO8601DateFormatter().date(from: trimmed) else {
            throw DecodingError.dataCorruptedError(forKey: key, in: c, debugDescription: "Unbekanntes Datum: \(s)")
        }
        return date
    }
}

public struct LicenseAPIError: LocalizedError {
    public let errorDescription: String?
}

/// The license tables through Supabase's REST API (PostgREST), with the service role key.
public struct LicenseAPI: Sendable {
    /// The row that holds the free trials (see scripts/license/setup-trial-pool.mjs). Never listed or changed here.
    public static let trialPoolNote = "koja-trial-pool"
    static let pageSize = 1000

    let credentials: Credentials

    public init(_ credentials: Credentials) {
        self.credentials = credentials
    }

    /// Every license key except the trial pool, newest first.
    public func list() async throws -> [License] {
        var all: [License] = []
        while true {
            let data = try await request("koja_licenses", query: [
                URLQueryItem(name: "select", value: "id,key_hash,key_hint,email,note,max_devices,created_at,revoked_at,stripe_session_id,koja_activations(count)"),
                URLQueryItem(name: "order", value: "created_at.desc,id"),
                URLQueryItem(name: "limit", value: String(Self.pageSize)),
                URLQueryItem(name: "offset", value: String(all.count)),
            ])
            let page = try JSONDecoder().decode([License].self, from: data)
            all += page
            if page.count < Self.pageSize { break }
        }
        return all.filter { $0.note != Self.trialPoolNote }
    }

    /// Creates `count` new keys, valid at once. Returns them formatted ("KOJA-XXXXX-…"): the database keeps only their hashes.
    public func create(count: Int, devices: Int, email: String?, note: String?) async throws -> [String] {
        let bodies = (0..<count).map { _ in KeyFormat.generateBody() }
        let rows: [[String: Any]] = bodies.map { body in
            ["key_hash": KeyFormat.hash(body), "key_hint": KeyFormat.hint(body), "email": email ?? NSNull(),
             "note": note ?? NSNull(), "max_devices": devices]
        }
        _ = try await request("koja_licenses", method: "POST", body: JSONSerialization.data(withJSONObject: rows), prefer: "return=minimal")
        return bodies.map(KeyFormat.format)
    }

    /// Deactivates a key (no further activations) or makes it valid again.
    public func setRevoked(_ id: UUID, _ revoked: Bool) async throws {
        let value: Any = revoked ? ISO8601DateFormatter().string(from: Date()) : NSNull()
        let data = try await request(
            "koja_licenses", query: [URLQueryItem(name: "id", value: "eq.\(id.uuidString.lowercased())")], method: "PATCH",
            body: JSONSerialization.data(withJSONObject: ["revoked_at": value]), prefer: "return=representation")
        let rows = (try? JSONSerialization.jsonObject(with: data)) as? [Any]
        if rows?.isEmpty != false {
            throw LicenseAPIError(errorDescription: "Diesen Schlüssel gibt es nicht mehr in der Datenbank.")
        }
    }

    func request(_ table: String, query: [URLQueryItem] = [], method: String = "GET", body: Data? = nil, prefer: String? = nil) async throws -> Data {
        var components = URLComponents(url: credentials.url.appendingPathComponent("rest/v1/\(table)"), resolvingAgainstBaseURL: false)!
        if !query.isEmpty { components.queryItems = query }
        var request = URLRequest(url: components.url!, timeoutInterval: 30)
        request.httpMethod = method
        request.httpBody = body
        request.setValue(credentials.serviceKey, forHTTPHeaderField: "apikey")
        // Legacy keys are JWTs and go in Authorization too; the newer sb_secret_ keys only in apikey.
        if credentials.serviceKey.hasPrefix("eyJ") {
            request.setValue("Bearer \(credentials.serviceKey)", forHTTPHeaderField: "Authorization")
        }
        if body != nil { request.setValue("application/json", forHTTPHeaderField: "Content-Type") }
        if let prefer { request.setValue(prefer, forHTTPHeaderField: "Prefer") }

        let data: Data, response: URLResponse
        do {
            (data, response) = try await URLSession.shared.data(for: request)
        } catch {
            throw LicenseAPIError(errorDescription: "Keine Verbindung zur Datenbank: \(error.localizedDescription)")
        }
        let status = (response as? HTTPURLResponse)?.statusCode ?? 0
        guard (200..<300).contains(status) else {
            let message = ((try? JSONSerialization.jsonObject(with: data)) as? [String: Any])?["message"] as? String
                ?? String(decoding: data, as: UTF8.self)
            switch status {
            case 401, 403:
                throw LicenseAPIError(errorDescription: "Die Datenbank lehnt den Zugang ab (\(status)). Prüfe URL und Service-Role-Key.")
            case 409:
                throw LicenseAPIError(errorDescription: "Diesen Schlüssel gibt es schon. Bitte noch einmal versuchen.")
            default:
                throw LicenseAPIError(errorDescription: "Datenbankfehler \(status): \(message)")
            }
        }
        return data
    }
}
