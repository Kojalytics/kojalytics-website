import XCTest
@testable import KojaKeysCore

/// Runs against the live database and license server, only when asked:
///   KOJA_ENV_FILE=<website>/.env.local swift test --filter LiveTests
/// It creates one key with the note "koja-keys live test" and deletes it again at the end.
final class LiveTests: XCTestCase {
    func testCreateActivateDeactivateAndReactivate() async throws {
        guard let path = ProcessInfo.processInfo.environment["KOJA_ENV_FILE"] else {
            throw XCTSkip("KOJA_ENV_FILE is not set")
        }
        let api = LicenseAPI(try XCTUnwrap(Credentials.fromEnvFile(String(contentsOfFile: path, encoding: .utf8))))
        let key = try await api.create(count: 1, devices: 1, email: nil, note: "koja-keys live test")[0]
        let hash = KeyFormat.hash(try XCTUnwrap(KeyFormat.normalize(key)))
        func row() async throws -> License {
            let all = try await api.list()
            return try XCTUnwrap(all.first { $0.keyHash == hash })
        }

        let id = try await row().id
        do {
            var license = try await row()
            XCTAssertEqual(license.keyHint, String(key.suffix(5)))
            XCTAssertEqual(license.maxDevices, 1)
            XCTAssertEqual(license.devices, 0)
            XCTAssertFalse(license.isRevoked)

            let device = Self.randomDevice()
            var status = try await Self.activate(key, device: device)
            XCTAssertEqual(status, 200, "a new key activates")
            license = try await row()
            XCTAssertEqual(license.devices, 1)

            try await api.setRevoked(id, true)
            license = try await row()
            XCTAssertTrue(license.isRevoked)
            status = try await Self.activate(key, device: Self.randomDevice())
            XCTAssertEqual(status, 403, "a deactivated key does not activate")

            try await api.setRevoked(id, false)
            license = try await row()
            XCTAssertFalse(license.isRevoked)
            status = try await Self.activate(key, device: device)
            XCTAssertEqual(status, 200, "a reactivated key activates again")
        } catch {
            try? await delete(api, id)
            throw error
        }
        try await delete(api, id)
        let left = try await api.list().contains { $0.keyHash == hash }
        XCTAssertFalse(left, "the test key is deleted again")
    }

    private func delete(_ api: LicenseAPI, _ id: UUID) async throws {
        _ = try await api.request("koja_licenses", query: [URLQueryItem(name: "id", value: "eq.\(id.uuidString.lowercased())")], method: "DELETE")
    }

    static func randomDevice() -> String {
        (0..<32).map { _ in String(format: "%02x", UInt8.random(in: 0...255)) }.joined()
    }

    /// The status the website's activation endpoint answers with, as the launcher sees it.
    static func activate(_ key: String, device: String) async throws -> Int {
        var request = URLRequest(url: URL(string: "https://www.kojalytics.com/api/license/activate")!)
        request.httpMethod = "POST"
        request.setValue("application/json", forHTTPHeaderField: "Content-Type")
        request.httpBody = try JSONSerialization.data(withJSONObject: ["key": key, "device": device, "app": "koja-keys-test"])
        let (_, response) = try await URLSession.shared.data(for: request)
        return (response as? HTTPURLResponse)?.statusCode ?? 0
    }
}
