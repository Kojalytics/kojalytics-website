import AppKit
import KojaKeysCore
import SwiftUI

@main
enum Entry {
    static func main() {
        let args = CommandLine.arguments
        if let i = args.firstIndex(of: "--import-env"), i + 1 < args.count {
            importEnv(args[i + 1])
        }
        KojaKeysApp.main()
    }

    /// `KojaKeys --import-env <website>/.env.local` keeps the website's database access in the keychain, without printing it.
    static func importEnv(_ path: String) -> Never {
        guard let contents = try? String(contentsOfFile: path, encoding: .utf8),
              let credentials = Credentials.fromEnvFile(contents)
        else {
            FileHandle.standardError.write(Data("No NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY in \(path)\n".utf8))
            exit(1)
        }
        do {
            try CredentialStore.save(credentials)
            print("Saved the database access for \(credentials.url.host ?? "?") in the keychain.")
            exit(0)
        } catch {
            FileHandle.standardError.write(Data("\(error.localizedDescription)\n".utf8))
            exit(1)
        }
    }
}

struct KojaKeysApp: App {
    @StateObject private var model = Model()

    var body: some Scene {
        Window("Koja Keys", id: "main") {
            Group {
                if model.credentials == nil { SetupView(cancel: nil) } else { KeysView() }
            }
            .environmentObject(model)
            .tint(Color.kojaBlue)
            .frame(minWidth: 940, minHeight: 540)
            .alert("Das hat nicht geklappt", isPresented: Binding(get: { model.error != nil }, set: { if !$0 { model.error = nil } })) {
                Button("OK") {}
            } message: {
                Text(model.error ?? "")
            }
            .sheet(isPresented: $model.showingCreate) {
                CreateSheet().environmentObject(model).tint(Color.kojaBlue)
            }
            .sheet(isPresented: $model.showingSetup) {
                SetupView(cancel: { model.showingSetup = false }).environmentObject(model).tint(Color.kojaBlue)
            }
        }
        .defaultSize(width: 1220, height: 700)
        .commands {
            CommandGroup(replacing: .newItem) {
                Button("Neue Schlüssel …") { model.showingCreate = true }
                    .keyboardShortcut("n")
                    .disabled(model.credentials == nil)
            }
            CommandGroup(after: .appSettings) {
                Button("Datenbank-Zugang ändern …") { model.showingSetup = true }
                    .disabled(model.credentials == nil)
            }
        }
    }
}

extension Color {
    /// The one accent of kojalytics.com (DESIGN.md).
    static let kojaBlue = Color(red: 42 / 255, green: 102 / 255, blue: 216 / 255)
}

@MainActor
final class Model: ObservableObject {
    @Published private(set) var credentials = CredentialStore.load()
    @Published private(set) var licenses: [License] = []
    @Published private(set) var archive = KeyArchive.standard.load()
    @Published private(set) var loading = false
    @Published private(set) var loadedAt: Date?
    @Published var error: String?
    @Published var showingCreate = false
    @Published var showingSetup = false

    func reload() async {
        guard let credentials else { return }
        loading = true
        defer { loading = false }
        do {
            licenses = try await LicenseAPI(credentials).list()
            loadedAt = Date()
        } catch {
            self.error = error.localizedDescription
        }
    }

    /// New keys, valid at once. Throws when the database refuses them.
    func create(count: Int, devices: Int, email: String?, note: String?) async throws -> [String] {
        guard let credentials else { return [] }
        let keys = try await LicenseAPI(credentials).create(count: count, devices: devices, email: email, note: note)
        do {
            archive = try KeyArchive.standard.add(keys)
        } catch {
            self.error = "Die Schlüssel sind gültig, ließen sich aber nicht auf diesem Mac speichern. Kopiere sie jetzt. (\(error.localizedDescription))"
        }
        await reload()
        return keys
    }

    func setRevoked(_ license: License, _ revoked: Bool) async {
        guard let credentials else { return }
        do {
            try await LicenseAPI(credentials).setRevoked(license.id, revoked)
        } catch {
            self.error = error.localizedDescription
        }
        await reload()
    }

    /// Reads the keys once with the new access and keeps it only when that works. Returns the error text otherwise.
    func connect(_ new: Credentials) async -> String? {
        do {
            licenses = try await LicenseAPI(new).list()
            loadedAt = Date()
            try CredentialStore.save(new)
            credentials = new
            showingSetup = false
            return nil
        } catch {
            return error.localizedDescription
        }
    }

    func fullKey(_ license: License) -> String? {
        archive[license.keyHash]
    }
}

func copyToPasteboard(_ text: String) {
    NSPasteboard.general.clearContents()
    NSPasteboard.general.setString(text, forType: .string)
}

/// The message for a customer, like the email the shop sends (src/lib/license-sales.ts).
enum CustomerText {
    static func message(key: String, devices: Int) -> String {
        """
        Hallo,

        vielen Dank für deinen Kauf! Hier ist dein Kojalytics-Lizenzschlüssel:

        \(key)

        So aktivierst du ihn:
        1. Lade den Kojalytics Launcher:
           Mac: https://www.kojalytics.com/download/mac
           Windows: https://www.kojalytics.com/download/windows
        2. Mac: Öffne die Datei und ziehe den Launcher in den Ordner „Programme“. Windows: Öffne die Datei und folge dem Installations-Assistenten.
        3. Starte den Launcher und gehe zu Einstellungen › Lizenz.
        4. Füge den Schlüssel ein und klicke auf „Aktivieren“.
        5. Installiere deine Koja-Apps direkt im Launcher.

        Deine Lizenz gilt für alle Koja-Apps auf bis zu \(devices) \(devices == 1 ? "Gerät" : "Geräten") (Mac oder Windows-PC).

        Fragen? Antworte einfach auf diese E-Mail.
        Kojalytics · https://www.kojalytics.com
        """
    }
}
