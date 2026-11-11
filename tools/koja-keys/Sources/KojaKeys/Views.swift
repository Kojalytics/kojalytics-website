import AppKit
import KojaKeysCore
import SwiftUI
import UniformTypeIdentifiers

// MARK: - All keys

struct KeysView: View {
    @EnvironmentObject private var model: Model
    @State private var search = ""
    @State private var filter = Filter.all
    @State private var selection = Set<License.ID>()
    @State private var toRevoke: License?

    enum Filter: String, CaseIterable, Identifiable {
        case all = "Alle", active = "Aktiv", revoked = "Deaktiviert"
        var id: Self { self }
    }

    private var rows: [License] {
        // A whole key pasted into the search finds its row by hash, also for keys made elsewhere (shop, scripts).
        let byKey = KeyFormat.normalize(search).map(KeyFormat.hash)
        let needle = search.trimmingCharacters(in: .whitespaces).lowercased()
        return model.licenses.filter { license in
            switch filter {
            case .all: break
            case .active: if license.isRevoked { return false }
            case .revoked: if !license.isRevoked { return false }
            }
            if let byKey { return license.keyHash == byKey }
            if needle.isEmpty { return true }
            return [license.email, license.note, license.keyHint, model.fullKey(license)]
                .compactMap { $0?.lowercased() }
                .contains { $0.contains(needle) }
        }
    }

    var body: some View {
        Table(rows, selection: $selection) {
            TableColumn("Schlüssel") { license in
                Text(model.fullKey(license) ?? "KOJA-•••••-•••••-•••••-\(license.keyHint)")
                    .font(.system(.body, design: .monospaced))
                    .foregroundStyle(license.isRevoked ? .secondary : .primary)
                    .textSelection(.enabled)
                    .help(model.fullKey(license) == nil ? "Den ganzen Schlüssel kennt nur, wer ihn bekommen hat: die Datenbank speichert ihn nicht." : "")
            }
            .width(min: 230, ideal: 240)
            TableColumn("Kunde") { license in
                Text(license.email ?? "–").foregroundStyle(license.email == nil ? .tertiary : .primary)
            }
            .width(min: 120, ideal: 190)
            TableColumn("Herkunft") { license in
                Text(license.fromShop ? "Shop" : "Manuell").foregroundStyle(.secondary)
            }
            .width(70)
            TableColumn("Notiz") { license in
                Text(license.fromShop ? "" : license.note ?? "")
            }
            .width(min: 80, ideal: 120)
            TableColumn("Geräte") { license in
                Text("\(license.devices) / \(license.maxDevices)").monospacedDigit()
            }
            .width(56)
            TableColumn("Erstellt") { license in
                Text(license.createdAt, format: .dateTime.day().month(.twoDigits).year())
                    .monospacedDigit()
                    .foregroundStyle(.secondary)
            }
            .width(84)
            TableColumn("Status") { license in
                StatusBadge(revoked: license.isRevoked)
            }
            .width(90)
            TableColumn("") { license in
                Group {
                    if license.isRevoked {
                        Button("Wieder aktivieren") { Task { await model.setRevoked(license, false) } }
                    } else {
                        Button("Deaktivieren …") { toRevoke = license }
                    }
                }
                .buttonStyle(.link)
                .disabled(model.loading)
            }
            .width(min: 120, ideal: 124)
        }
        .contextMenu(forSelectionType: License.ID.self) { ids in
            if ids.count == 1, let license = model.licenses.first(where: { $0.id == ids.first }) {
                if let key = model.fullKey(license) {
                    Button("Schlüssel kopieren") { copyToPasteboard(key) }
                    Button("Text für den Kunden kopieren") { copyToPasteboard(CustomerText.message(key: key, devices: license.maxDevices)) }
                    Divider()
                }
                if license.isRevoked {
                    Button("Wieder aktivieren") { Task { await model.setRevoked(license, false) } }
                } else {
                    Button("Deaktivieren …") { toRevoke = license }
                }
            }
        }
        .overlay {
            if model.licenses.isEmpty && model.loadedAt != nil {
                ContentUnavailableView {
                    Label("Noch keine Schlüssel", systemImage: "key.horizontal")
                } description: {
                    Text("Erzeuge deine ersten Lizenzschlüssel für die Koja-Apps.")
                } actions: {
                    Button("Neue Schlüssel …") { model.showingCreate = true }.buttonStyle(.borderedProminent)
                }
            } else if rows.isEmpty && !model.licenses.isEmpty {
                ContentUnavailableView.search(text: search)
            }
        }
        .safeAreaInset(edge: .bottom, spacing: 0) { footer }
        .searchable(text: $search, placement: .toolbar, prompt: "Schlüssel, E-Mail oder Notiz")
        .navigationTitle("Koja Keys")
        .toolbar {
            ToolbarItem(placement: .navigation) {
                Picker("Anzeigen", selection: $filter) {
                    ForEach(Filter.allCases) { Text($0.rawValue).tag($0) }
                }
                .pickerStyle(.segmented)
                .labelsHidden()
            }
            ToolbarItem {
                Button { Task { await model.reload() } } label: {
                    Label("Aktualisieren", systemImage: "arrow.clockwise")
                }
                .disabled(model.loading)
                .help("Liste neu laden")
            }
            ToolbarItem(placement: .primaryAction) {
                Button { model.showingCreate = true } label: {
                    Label("Neue Schlüssel", systemImage: "plus")
                }
                .help("Neue Lizenzschlüssel erzeugen (⌘N)")
            }
        }
        .alert(
            "Schlüssel …\(toRevoke?.keyHint ?? "") deaktivieren?",
            isPresented: Binding(get: { toRevoke != nil }, set: { if !$0 { toRevoke = nil } }),
            presenting: toRevoke
        ) { license in
            Button("Deaktivieren", role: .destructive) { Task { await model.setRevoked(license, true) } }
            Button("Abbrechen", role: .cancel) {}
        } message: { license in
            Text(license.devices == 0
                ? "Er ist noch auf keinem Gerät aktiviert und lässt sich danach nicht mehr aktivieren. Du kannst ihn später wieder aktivieren."
                : "Er lässt sich danach auf keinem weiteren Gerät aktivieren. Auf den \(license.devices) \(license.devices == 1 ? "Gerät" : "Geräten"), auf denen er schon aktiviert ist, laufen die Koja-Apps weiter. Du kannst ihn später wieder aktivieren.")
        }
        .task { await model.reload() }
    }

    private var footer: some View {
        let active = model.licenses.filter { !$0.isRevoked }.count
        return HStack(spacing: 10) {
            if model.loading { ProgressView().controlSize(.small) }
            Text("\(model.licenses.count) Schlüssel · \(active) aktiv · \(model.licenses.count - active) deaktiviert · \(model.licenses.filter(\.fromShop).count) aus dem Shop")
            Spacer()
            if let loadedAt = model.loadedAt {
                Text("Stand \(loadedAt.formatted(date: .omitted, time: .shortened)) Uhr").foregroundStyle(.tertiary)
            }
        }
        .font(.callout)
        .foregroundStyle(.secondary)
        .padding(.horizontal, 14)
        .padding(.vertical, 7)
        .background(.bar)
    }
}

struct StatusBadge: View {
    let revoked: Bool

    var body: some View {
        let color: Color = revoked ? .red : .green
        Text(revoked ? "Deaktiviert" : "Aktiv")
            .font(.caption.weight(.semibold))
            .foregroundStyle(color)
            .padding(.horizontal, 7)
            .padding(.vertical, 2)
            .background(color.opacity(0.12), in: RoundedRectangle(cornerRadius: 3))
    }
}

// MARK: - New keys

struct CreateSheet: View {
    @EnvironmentObject private var model: Model
    @Environment(\.dismiss) private var dismiss
    @State private var count = 1
    @State private var devices = 3
    @State private var email = ""
    @State private var note = ""
    @State private var working = false
    @State private var error: String?
    @State private var created: [String]?

    var body: some View {
        Group {
            if let created {
                CreatedView(keys: created, devices: devices) { dismiss() }
            } else {
                form
            }
        }
        .frame(width: 540)
    }

    private var form: some View {
        VStack(alignment: .leading, spacing: 0) {
            VStack(alignment: .leading, spacing: 4) {
                Text("Neue Schlüssel").font(.title2.weight(.semibold))
                Text("Jeder Schlüssel gilt sofort für alle Koja-Apps auf Mac und Windows.").foregroundStyle(.secondary)
            }
            .padding([.horizontal, .top], 20)

            Grid(alignment: .leading, horizontalSpacing: 14, verticalSpacing: 14) {
                GridRow {
                    Text("Anzahl Schlüssel").gridColumnAlignment(.trailing)
                    HStack(spacing: 6) {
                        TextField("Anzahl", value: $count, format: .number)
                            .labelsHidden()
                            .multilineTextAlignment(.trailing)
                            .frame(width: 64)
                        Stepper("Anzahl", value: $count, in: 1...500).labelsHidden()
                    }
                }
                GridRow {
                    Text("Geräte pro Schlüssel")
                    HStack(spacing: 6) {
                        Text("\(devices)").monospacedDigit().frame(width: 64, alignment: .trailing)
                        Stepper("Geräte", value: $devices, in: 1...20).labelsHidden()
                        Text("Im Shop: 3").foregroundStyle(.tertiary)
                    }
                }
                GridRow {
                    Text("Kunde (E-Mail)")
                    TextField("Kunde (E-Mail)", text: $email, prompt: Text("optional")).labelsHidden()
                }
                GridRow {
                    Text("Notiz")
                    TextField("Notiz", text: $note, prompt: Text("optional, z. B. Rechnung 1042")).labelsHidden()
                }
            }
            .padding(20)

            if !(1...500).contains(count) {
                Text("Bitte 1 bis 500 Schlüssel auf einmal.").foregroundStyle(.red).padding(.horizontal, 20)
            }
            if let error {
                Text(error).foregroundStyle(.red).padding(.horizontal, 20)
            }

            Divider()
            HStack {
                Spacer()
                Button("Abbrechen", role: .cancel) { dismiss() }
                    .keyboardShortcut(.cancelAction)
                Button(action: create) {
                    Text(count == 1 ? "Schlüssel erzeugen" : "\(count) Schlüssel erzeugen").frame(minWidth: 150)
                }
                .buttonStyle(.borderedProminent)
                .keyboardShortcut(.defaultAction)
                .disabled(working || !(1...500).contains(count))
            }
            .padding(20)
        }
    }

    private func create() {
        working = true
        error = nil
        let email = email.trimmingCharacters(in: .whitespaces)
        let note = note.trimmingCharacters(in: .whitespaces)
        Task {
            do {
                created = try await model.create(count: count, devices: devices, email: email.isEmpty ? nil : email, note: note.isEmpty ? nil : note)
            } catch {
                self.error = error.localizedDescription
            }
            working = false
        }
    }
}

struct CreatedView: View {
    let keys: [String]
    let devices: Int
    let done: () -> Void
    @State private var copied: String?

    var body: some View {
        VStack(alignment: .leading, spacing: 14) {
            VStack(alignment: .leading, spacing: 4) {
                Label(keys.count == 1 ? "1 neuer Schlüssel" : "\(keys.count) neue Schlüssel", systemImage: "checkmark.seal.fill")
                    .font(.title2.weight(.semibold))
                Text("Ab sofort gültig. Du findest sie auch später in der Liste.").foregroundStyle(.secondary)
            }

            List(keys, id: \.self) { key in
                HStack {
                    Text(key).font(.system(.body, design: .monospaced)).textSelection(.enabled)
                    Spacer()
                    Button { copy(key, mark: key) } label: {
                        Image(systemName: copied == key ? "checkmark" : "doc.on.doc")
                    }
                    .help("Schlüssel kopieren")
                    .accessibilityLabel("Schlüssel kopieren")
                    Button { copy(CustomerText.message(key: key, devices: devices), mark: "text " + key) } label: {
                        Image(systemName: copied == "text " + key ? "checkmark" : "envelope")
                    }
                    .help("Text für den Kunden kopieren (mit Anleitung)")
                    .accessibilityLabel("Text für den Kunden kopieren")
                }
                .buttonStyle(.borderless)
                .padding(.vertical, 2)
            }
            .listStyle(.bordered(alternatesRowBackgrounds: true))
            .frame(height: min(CGFloat(keys.count) * 30 + 14, 320))

            HStack {
                Button(keys.count == 1 ? "Kopieren" : "Alle kopieren") { copy(keys.joined(separator: "\n"), mark: "all") }
                Button("Als Datei sichern …", action: save)
                if copied != nil {
                    Text("Kopiert").foregroundStyle(.secondary).transition(.opacity)
                }
                Spacer()
                Button("Fertig", action: done)
                    .buttonStyle(.borderedProminent)
                    .keyboardShortcut(.defaultAction)
            }
        }
        .padding(20)
    }

    private func copy(_ text: String, mark: String) {
        copyToPasteboard(text)
        withAnimation { copied = mark }
    }

    private func save() {
        let panel = NSSavePanel()
        panel.allowedContentTypes = [.plainText]
        panel.nameFieldStringValue = "Koja-Schluessel-\(Date().formatted(.iso8601.year().month().day())).txt"
        guard panel.runModal() == .OK, let url = panel.url else { return }
        try? (keys.joined(separator: "\n") + "\n").write(to: url, atomically: true, encoding: .utf8)
    }
}

// MARK: - Database access

struct SetupView: View {
    /// Set when shown as a sheet to change the access; nil on first launch.
    let cancel: (() -> Void)?
    @EnvironmentObject private var model: Model
    @State private var url = "https://uvgybvtmstfawpirtlsg.supabase.co"
    @State private var key = ""
    @State private var working = false
    @State private var error: String?

    var body: some View {
        VStack(spacing: 16) {
            Image(systemName: "key.horizontal.fill")
                .font(.system(size: 40, weight: .semibold))
                .foregroundStyle(.tint)
            Text("Mit der Lizenz-Datenbank verbinden").font(.title2.weight(.semibold))
            Text("Koja Keys braucht einmalig den Zugang zur Supabase-Datenbank der Website.\nEr bleibt im Schlüsselbund dieses Macs.")
                .multilineTextAlignment(.center)
                .foregroundStyle(.secondary)
            Grid(alignment: .leading, horizontalSpacing: 12, verticalSpacing: 12) {
                GridRow {
                    Text("Supabase-URL").gridColumnAlignment(.trailing)
                    TextField("Supabase-URL", text: $url).labelsHidden()
                }
                GridRow {
                    Text("Service-Role-Key")
                    SecureField("Service-Role-Key", text: $key).labelsHidden()
                }
            }
            .frame(width: 480)
            .padding(.vertical, 6)
            Text("Den Service-Role-Key findest du in Supabase unter Project Settings › API Keys › service_role.")
                .font(.callout)
                .foregroundStyle(.secondary)
            if let error {
                Text(error).foregroundStyle(.red).multilineTextAlignment(.center).frame(maxWidth: 480)
            }
            HStack {
                if let cancel {
                    Button("Abbrechen", role: .cancel, action: cancel).keyboardShortcut(.cancelAction)
                }
                Button(action: connect) {
                    Text(working ? "Verbinde …" : "Verbinden").frame(minWidth: 120)
                }
                .buttonStyle(.borderedProminent)
                .controlSize(.large)
                .keyboardShortcut(.defaultAction)
                .disabled(working || key.trimmingCharacters(in: .whitespaces).isEmpty || URL(string: url)?.host == nil)
            }
        }
        .padding(36)
        .frame(maxWidth: .infinity, maxHeight: .infinity)
    }

    private func connect() {
        guard let url = URL(string: url.trimmingCharacters(in: .whitespaces)) else { return }
        working = true
        error = nil
        Task {
            error = await model.connect(Credentials(url: url, serviceKey: key.trimmingCharacters(in: .whitespacesAndNewlines)))
            working = false
        }
    }
}
