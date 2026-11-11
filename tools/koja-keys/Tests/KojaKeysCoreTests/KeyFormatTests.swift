import XCTest
@testable import KojaKeysCore

/// Expected values come from scripts/license/lib.mjs (the website's own key code).
final class KeyFormatTests: XCTestCase {
    func testNormalizesLikeTheWebsite() {
        XCTAssertEqual(KeyFormat.normalize("koja-01234-56789-abcde-fghjk"), "0123456789ABCDEFGHJK")
        XCTAssertEqual(KeyFormat.normalize(" KOJA 0I2L4-O6789-abcde-FGHJK "), "0121406789ABCDEFGHJK")
        XCTAssertNil(KeyFormat.normalize("KOJA-ABCDE-FGHJK-MNPQR-STVWU"))
        XCTAssertNil(KeyFormat.normalize("ABCDE"))
    }

    func testHashesAndFormatsLikeTheWebsite() {
        XCTAssertEqual(KeyFormat.hash("0123456789ABCDEFGHJK"), "a6b239e79989fa88083024f6fa3518b4f917667d90dc8408053fcf0cfc8cfb8a")
        XCTAssertEqual(KeyFormat.hash("0121406789ABCDEFGHJK"), "905bdd41d57bf109a562df08c490f3a6b85786766d5562e8ccf90f9a7729ffbf")
        XCTAssertEqual(KeyFormat.format("0121406789ABCDEFGHJK"), "KOJA-01214-06789-ABCDE-FGHJK")
        XCTAssertEqual(KeyFormat.hint("0121406789ABCDEFGHJK"), "FGHJK")
    }

    func testGeneratedKeysAreValidAndDistinct() {
        let bodies = (0..<2000).map { _ in KeyFormat.generateBody() }
        XCTAssertEqual(Set(bodies).count, bodies.count)
        for body in bodies {
            XCTAssertEqual(KeyFormat.normalize(KeyFormat.format(body)), body)
        }
    }

    func testReadsTheWebsiteEnvFile() throws {
        let env = """
        NEXT_PUBLIC_SUPABASE_URL=https://example.supabase.co
        # comment
        SUPABASE_SERVICE_ROLE_KEY=eyJsecret \nOTHER=1
        """
        let credentials = try XCTUnwrap(Credentials.fromEnvFile(env))
        XCTAssertEqual(credentials.url.absoluteString, "https://example.supabase.co")
        XCTAssertEqual(credentials.serviceKey, "eyJsecret")
        XCTAssertNil(Credentials.fromEnvFile("NEXT_PUBLIC_SUPABASE_URL=https://example.supabase.co\n"))
    }

    func testDecodesARowWithItsDeviceCount() throws {
        let json = """
        [{"id":"0f8fad5b-d9cb-469f-a165-70867728950e","key_hash":"ab","key_hint":"FGHJK","email":null,"note":"Rechnung 1",
          "max_devices":3,"created_at":"2026-11-10T16:59:25.123456+00:00","revoked_at":"2026-11-11T08:00:00+00:00",
          "stripe_session_id":null,"koja_activations":[{"count":2}]}]
        """
        let license = try XCTUnwrap(JSONDecoder().decode([License].self, from: Data(json.utf8)).first)
        XCTAssertEqual(license.devices, 2)
        XCTAssertTrue(license.isRevoked)
        XCTAssertFalse(license.fromShop)
        XCTAssertEqual(license.createdAt, ISO8601DateFormatter().date(from: "2026-11-10T16:59:25Z"))
    }

    func testArchiveKeepsKeysByHashForTheOwnerOnly() throws {
        let dir = FileManager.default.temporaryDirectory.appendingPathComponent(UUID().uuidString)
        let archive = KeyArchive(file: dir.appendingPathComponent("keys.json"))
        try archive.add(["KOJA-01234-56789-ABCDE-FGHJK"])
        try archive.add(["KOJA-01214-06789-ABCDE-FGHJK"])
        XCTAssertEqual(archive.load(), [
            "a6b239e79989fa88083024f6fa3518b4f917667d90dc8408053fcf0cfc8cfb8a": "KOJA-01234-56789-ABCDE-FGHJK",
            "905bdd41d57bf109a562df08c490f3a6b85786766d5562e8ccf90f9a7729ffbf": "KOJA-01214-06789-ABCDE-FGHJK",
        ])
        let mode = try FileManager.default.attributesOfItem(atPath: archive.file.path)[.posixPermissions] as? Int
        XCTAssertEqual(mode, 0o600)
        try FileManager.default.removeItem(at: dir)
    }
}
