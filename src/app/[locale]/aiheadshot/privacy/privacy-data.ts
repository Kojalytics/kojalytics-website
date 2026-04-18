import type { Locale } from '@/i18n/config';

export type PrivacySection = {
  title: string;
  content: string; // HTML-safe; uses simple <p>/<ul>/<li>/<strong>/<a>
};

export type PrivacyContent = {
  pageTitle: string;
  lastUpdated: string;
  productLabel: string;
  highlight: string;
  sections: PrivacySection[];
  footerQuestions: string;
  contactEmail: string;
};

const commonContact = 'support@kojalytics.com';

// Shared: section structure mirrors the existing English privacy page on kojalytics.com
// Content is deliberately concise but GDPR-complete (required for App Store).

const de: PrivacyContent = {
  pageTitle: 'Datenschutzerklärung',
  lastUpdated: 'Zuletzt aktualisiert: 18. April 2026',
  productLabel: 'AI HEADSHOT',
  highlight:
    'AI Headshot erfasst keine persönlichen Daten, erstellt keine Nutzerprofile und nutzt weder Tracking noch Analytics.',
  sections: [
    {
      title: '1. Verantwortlicher',
      content: `<p>Kojalytics<br/>Farzad Khojazada, Einzelunternehmen<br/>Am Diggen 40i, 21077 Hamburg, Deutschland<br/>E-Mail: <a href="mailto:${commonContact}">${commonContact}</a><br/>Website: <a href="https://kojalytics.com">kojalytics.com</a></p>`,
    },
    {
      title: '2. Welche Daten werden verarbeitet?',
      content: `<p>AI Headshot verarbeitet nur Daten, die zur Portrait-Generierung zwingend erforderlich sind:</p>
<ul>
  <li><strong>Referenzfotos:</strong> Die von dir ausgewählten Fotos (max. 10) werden an unseren Server übermittelt und zur Generierung an den Drittanbieter-KI-Dienst Google Gemini API weitergeleitet.</li>
  <li><strong>Portrait-Einstellungen:</strong> Deine gewählten Stil-Optionen (Stil, Ausschnitt, Hintergrund).</li>
  <li><strong>Kaufdaten:</strong> Transaktions-IDs für In-App-Käufe werden lokal auf deinem Gerät gespeichert. Die Zahlungsabwicklung erfolgt ausschließlich über Apple.</li>
</ul>
<p><strong>Wichtig:</strong> Vor der ersten Übermittlung deiner Fotos an den KI-Dienst fragt die App nach deiner ausdrücklichen Einwilligung. Ohne deine Zustimmung werden keine Fotos an Dritte gesendet.</p>`,
    },
    {
      title: '3. Was wird NICHT erhoben?',
      content: `<ul>
  <li>Keine Nutzerkonten oder Registrierung erforderlich</li>
  <li>Keine E-Mail-Adressen, Namen oder Telefonnummern</li>
  <li>Keine Standortdaten</li>
  <li>Kein Analytics oder Tracking (kein Google Analytics, Firebase etc.)</li>
  <li>Keine Werbung oder Werbenetzwerke</li>
  <li>Keine Weitergabe an Dritte für Marketing</li>
</ul>`,
    },
    {
      title: '4. Wie werden deine Fotos verarbeitet?',
      content: `<ul>
  <li>Übertragung via HTTPS/TLS auf unseren Server (Supabase, EU-Region).</li>
  <li><strong>Drittanbieter-KI-Dienst:</strong> Deine Referenzfotos werden zur Bildgenerierung an die Google Gemini API (Google Ireland Limited) übermittelt.</li>
  <li>Rechtsgrundlage: Art. 6 Abs. 1 lit. a und Art. 9 Abs. 2 lit. a DSGVO (ausdrückliche Einwilligung).</li>
  <li>Nach Abschluss der Generierung werden die Referenzfotos sowohl bei uns als auch bei Google gelöscht.</li>
  <li>Generierte Portraits werden über zeitlich begrenzte, signierte URLs bereitgestellt.</li>
</ul>`,
    },
    {
      title: '5. Datenspeicherung',
      content: `<p><strong>Auf deinem Gerät:</strong></p>
<ul>
  <li>Generierte Portraits und Vorschauen im App-Speicher</li>
  <li>Kaufbelege und Einstellungen im verschlüsselten iOS Keychain</li>
  <li>Tresor-Daten mit automatischem Ablauf (24 Stunden bis 30 Tage je nach Paket)</li>
</ul>
<p><strong>Auf unserem Server:</strong></p>
<ul>
  <li>Referenzfotos werden nach der Verarbeitung gelöscht</li>
  <li>Generierte Portraits temporär, zugänglich nur über zeitlich begrenzte URLs</li>
  <li>Job-Metadaten (Status, Zeitstempel) — ohne Personenbezug</li>
</ul>`,
    },
    {
      title: '6. Drittanbieter-Dienste',
      content: `<ul>
  <li><strong>Google Gemini API:</strong> KI-Bildgenerierung. Deine Fotos werden zur Generierung übermittelt, nur nach Einwilligung. Google verarbeitet Daten gemäß <a href="https://policies.google.com/privacy" target="_blank" rel="noopener noreferrer">Google Datenschutzerklärung</a>. Fotos werden nach Verarbeitung bei Google gelöscht.</li>
  <li><strong>Supabase:</strong> Backend-Infrastruktur für sichere Datenverarbeitung. Server in der EU (Frankfurt).</li>
  <li><strong>Apple StoreKit:</strong> Für In-App-Käufe. Apple verarbeitet Zahlungsdaten gemäß <a href="https://www.apple.com/legal/privacy/" target="_blank" rel="noopener noreferrer">Apple Datenschutzerklärung</a>.</li>
</ul>`,
    },
    {
      title: '7. Datensicherheit',
      content: `<ul>
  <li>Alle Datenübertragungen verschlüsselt via HTTPS</li>
  <li>Lokale Daten verschlüsselt im iOS Keychain</li>
  <li>Zugriff auf Portraits nur über zeitlich begrenzte, signierte URLs</li>
  <li>Schutz durch eindeutige, nicht erratbare Job-IDs</li>
</ul>`,
    },
    {
      title: '8. Deine Rechte (DSGVO)',
      content: `<p>Als Nutzer in der EU hast du folgende Rechte:</p>
<ul>
  <li><strong>Auskunft:</strong> Informationen über gespeicherte Daten</li>
  <li><strong>Löschung:</strong> Löschung deiner Daten</li>
  <li><strong>Widerspruch:</strong> Widerspruch gegen Verarbeitung</li>
  <li><strong>Datenübertragbarkeit:</strong> Herausgabe in gängigem Format</li>
</ul>
<p>Da AI Headshot keine Nutzerkonten verwendet, werden keine persönlichen Daten dauerhaft gespeichert. Für Anfragen kontaktiere: <a href="mailto:${commonContact}">${commonContact}</a></p>`,
    },
    {
      title: '9. Geräteberechtigungen',
      content: `<ul>
  <li><strong>Fotobibliothek (Lesen):</strong> Zum Auswählen von Referenzfotos</li>
  <li><strong>Fotobibliothek (Schreiben):</strong> Zum Speichern generierter Portraits</li>
</ul>
<p>Keine weiteren Berechtigungen erforderlich (keine Kamera, Mikrofon, Standort oder Kontakte).</p>`,
    },
    {
      title: '10. Kinder',
      content: `<p>AI Headshot richtet sich nicht an Kinder unter 16 Jahren. Wir erheben wissentlich keine Daten von Kindern.</p>`,
    },
    {
      title: '11. Änderungen dieser Datenschutzerklärung',
      content: `<p>Wir behalten uns Änderungen dieser Erklärung vor. Die aktuelle Version ist jederzeit unter dieser URL verfügbar.</p>`,
    },
    {
      title: '12. Kontakt',
      content: `<p>Bei datenschutzbezogenen Fragen: <a href="mailto:${commonContact}">${commonContact}</a></p>`,
    },
  ],
  footerQuestions: 'Fragen zum Datenschutz?',
  contactEmail: commonContact,
};

const en: PrivacyContent = {
  pageTitle: 'Privacy Policy',
  lastUpdated: 'Last updated: April 18, 2026',
  productLabel: 'AI HEADSHOT',
  highlight:
    'AI Headshot does not collect personal data, does not create user profiles, and does not use any tracking or analytics tools.',
  sections: [
    {
      title: '1. Data Controller',
      content: `<p>Kojalytics<br/>Farzad Khojazada, sole proprietorship<br/>Am Diggen 40i, 21077 Hamburg, Germany<br/>Email: <a href="mailto:${commonContact}">${commonContact}</a><br/>Website: <a href="https://kojalytics.com">kojalytics.com</a></p>`,
    },
    {
      title: '2. What Data Is Processed?',
      content: `<p>AI Headshot only processes data strictly necessary for generating AI portraits:</p>
<ul>
  <li><strong>Reference Photos:</strong> The photos you select (max 10) are transmitted to our server and forwarded to the third-party AI service Google Gemini API for generation.</li>
  <li><strong>Portrait Settings:</strong> Your chosen style options (style, framing, background).</li>
  <li><strong>Purchase Data:</strong> Transaction IDs for in-app purchases are stored locally on your device. Payment processing is handled exclusively by Apple.</li>
</ul>
<p><strong>Important:</strong> Before your photos are transmitted to the AI service for the first time, the app will ask for your explicit consent. Without your approval, no photos will be sent to third parties.</p>`,
    },
    {
      title: '3. What Is NOT Collected?',
      content: `<ul>
  <li>No user accounts or registration required</li>
  <li>No email addresses, names, or phone numbers</li>
  <li>No location data</li>
  <li>No analytics or tracking (no Google Analytics, Firebase, etc.)</li>
  <li>No advertising or ad networks</li>
  <li>No data sharing with third parties for marketing</li>
</ul>`,
    },
    {
      title: '4. How Are Your Photos Processed?',
      content: `<ul>
  <li>Encrypted HTTPS/TLS transmission to our server (Supabase, EU region).</li>
  <li><strong>Third-Party AI Service:</strong> Your reference photos are forwarded to the Google Gemini API (Google Ireland Limited) for image generation.</li>
  <li>Legal basis: Art. 6(1)(a) and Art. 9(2)(a) GDPR (explicit consent).</li>
  <li>After generation, reference photos are deleted from both our server and Google.</li>
  <li>Generated portraits are provided via time-limited, signed URLs.</li>
</ul>`,
    },
    {
      title: '5. Data Storage',
      content: `<p><strong>On Your Device:</strong></p>
<ul>
  <li>Generated portraits and previews in app storage</li>
  <li>Purchase receipts and settings in encrypted iOS Keychain</li>
  <li>Vault data with automatic expiration (24 hours to 30 days per package)</li>
</ul>
<p><strong>On Our Server:</strong></p>
<ul>
  <li>Reference photos are deleted after processing</li>
  <li>Generated portraits stored temporarily, accessible only via time-limited URLs</li>
  <li>Job metadata (status, timestamps) — without personal reference</li>
</ul>`,
    },
    {
      title: '6. Third-Party Services',
      content: `<ul>
  <li><strong>Google Gemini API:</strong> AI image generation. Your photos are transmitted for generation only after your consent. Google processes data per the <a href="https://policies.google.com/privacy" target="_blank" rel="noopener noreferrer">Google Privacy Policy</a>. Photos are deleted at Google after processing.</li>
  <li><strong>Supabase:</strong> Backend infrastructure for secure data processing. Servers in the EU (Frankfurt).</li>
  <li><strong>Apple StoreKit:</strong> For in-app purchases. Apple processes payment data per the <a href="https://www.apple.com/legal/privacy/" target="_blank" rel="noopener noreferrer">Apple Privacy Policy</a>.</li>
</ul>`,
    },
    {
      title: '7. Data Security',
      content: `<ul>
  <li>All data transfers encrypted via HTTPS</li>
  <li>Local data encrypted in iOS Keychain</li>
  <li>Access to portraits only via time-limited, signed URLs</li>
  <li>Protection through unique, non-guessable job IDs</li>
</ul>`,
    },
    {
      title: '8. Your Rights (GDPR)',
      content: `<p>As an EU user, you have the following rights:</p>
<ul>
  <li><strong>Access:</strong> Information about stored data</li>
  <li><strong>Deletion:</strong> Deletion of your data</li>
  <li><strong>Objection:</strong> Object to processing</li>
  <li><strong>Data Portability:</strong> Data in a common format</li>
</ul>
<p>Since AI Headshot doesn't use user accounts, no personal data is stored permanently. For inquiries, contact: <a href="mailto:${commonContact}">${commonContact}</a></p>`,
    },
    {
      title: '9. Device Permissions',
      content: `<ul>
  <li><strong>Photo Library (Read):</strong> To select reference photos</li>
  <li><strong>Photo Library (Write):</strong> To save generated portraits</li>
</ul>
<p>No additional permissions required (no camera, microphone, location, or contacts access).</p>`,
    },
    {
      title: '10. Children',
      content: `<p>AI Headshot is not directed at children under 16. We do not knowingly collect data from children.</p>`,
    },
    {
      title: '11. Changes to This Privacy Policy',
      content: `<p>We reserve the right to update this policy. The current version is always available at this URL.</p>`,
    },
    {
      title: '12. Contact',
      content: `<p>For privacy-related questions: <a href="mailto:${commonContact}">${commonContact}</a></p>`,
    },
  ],
  footerQuestions: 'Privacy questions?',
  contactEmail: commonContact,
};

const fr: PrivacyContent = {
  pageTitle: 'Politique de confidentialité',
  lastUpdated: 'Dernière mise à jour : 18 avril 2026',
  productLabel: 'AI HEADSHOT',
  highlight:
    "AI Headshot ne collecte aucune donnée personnelle, ne crée pas de profils utilisateur et n'utilise ni suivi ni outils d'analyse.",
  sections: [
    {
      title: '1. Responsable du traitement',
      content: `<p>Kojalytics<br/>Farzad Khojazada, entreprise individuelle<br/>Am Diggen 40i, 21077 Hambourg, Allemagne<br/>E-mail : <a href="mailto:${commonContact}">${commonContact}</a><br/>Site web : <a href="https://kojalytics.com">kojalytics.com</a></p>`,
    },
    {
      title: '2. Quelles données sont traitées ?',
      content: `<p>AI Headshot traite uniquement les données strictement nécessaires à la génération de portraits par IA :</p>
<ul>
  <li><strong>Photos de référence :</strong> Les photos que tu sélectionnes (max. 10) sont transmises à notre serveur puis au service IA tiers Google Gemini API pour la génération.</li>
  <li><strong>Paramètres du portrait :</strong> Tes options de style (style, cadrage, arrière-plan).</li>
  <li><strong>Données d'achat :</strong> Les identifiants de transaction pour les achats in-app sont stockés localement sur ton appareil. Le traitement des paiements est géré exclusivement par Apple.</li>
</ul>
<p><strong>Important :</strong> Avant le premier envoi de tes photos au service IA, l'application demande ton consentement explicite. Sans ton accord, aucune photo n'est transmise à des tiers.</p>`,
    },
    {
      title: "3. Ce qui N'EST PAS collecté",
      content: `<ul>
  <li>Aucun compte utilisateur ni inscription requis</li>
  <li>Aucune adresse e-mail, nom ou numéro de téléphone</li>
  <li>Aucune donnée de localisation</li>
  <li>Aucun analytics ni suivi (ni Google Analytics, Firebase, etc.)</li>
  <li>Aucune publicité ni réseau publicitaire</li>
  <li>Aucun partage de données à des fins marketing</li>
</ul>`,
    },
    {
      title: '4. Comment tes photos sont-elles traitées ?',
      content: `<ul>
  <li>Transmission chiffrée HTTPS/TLS vers notre serveur (Supabase, région UE).</li>
  <li><strong>Service IA tiers :</strong> Tes photos sont transmises à la Google Gemini API (Google Ireland Limited) pour la génération.</li>
  <li>Base juridique : art. 6 §1 a) et art. 9 §2 a) RGPD (consentement explicite).</li>
  <li>Après la génération, les photos de référence sont supprimées à la fois chez nous et chez Google.</li>
  <li>Les portraits générés sont fournis via des URL signées à durée limitée.</li>
</ul>`,
    },
    {
      title: '5. Stockage des données',
      content: `<p><strong>Sur ton appareil :</strong></p>
<ul>
  <li>Portraits générés et aperçus dans le stockage de l'app</li>
  <li>Reçus d'achat et paramètres dans le Keychain iOS chiffré</li>
  <li>Données du coffre-fort avec expiration automatique (24 h à 30 jours selon le forfait)</li>
</ul>
<p><strong>Sur notre serveur :</strong></p>
<ul>
  <li>Les photos de référence sont supprimées après traitement</li>
  <li>Les portraits générés stockés temporairement, accessibles uniquement via des URL à durée limitée</li>
  <li>Les métadonnées de tâche (statut, horodatage) — sans référence personnelle</li>
</ul>`,
    },
    {
      title: '6. Services tiers',
      content: `<ul>
  <li><strong>Google Gemini API :</strong> Génération d'images par IA. Tes photos sont transmises pour la génération uniquement après ton consentement. Google traite les données conformément à la <a href="https://policies.google.com/privacy" target="_blank" rel="noopener noreferrer">politique de confidentialité de Google</a>. Les photos sont supprimées chez Google après traitement.</li>
  <li><strong>Supabase :</strong> Infrastructure backend pour un traitement sécurisé des données. Serveurs dans l'UE (Francfort).</li>
  <li><strong>Apple StoreKit :</strong> Pour les achats in-app. Apple traite les données de paiement conformément à la <a href="https://www.apple.com/legal/privacy/" target="_blank" rel="noopener noreferrer">politique de confidentialité d'Apple</a>.</li>
</ul>`,
    },
    {
      title: '7. Sécurité des données',
      content: `<ul>
  <li>Tous les transferts de données chiffrés via HTTPS</li>
  <li>Données locales chiffrées dans le Keychain iOS</li>
  <li>Accès aux portraits uniquement via des URL signées à durée limitée</li>
  <li>Protection par identifiants de tâche uniques et non devinables</li>
</ul>`,
    },
    {
      title: '8. Tes droits (RGPD)',
      content: `<p>En tant qu'utilisateur dans l'UE, tu disposes des droits suivants :</p>
<ul>
  <li><strong>Accès :</strong> informations sur les données stockées</li>
  <li><strong>Suppression :</strong> suppression de tes données</li>
  <li><strong>Opposition :</strong> opposition au traitement</li>
  <li><strong>Portabilité des données :</strong> données dans un format courant</li>
</ul>
<p>Comme AI Headshot n'utilise pas de compte utilisateur, aucune donnée personnelle n'est stockée durablement. Pour toute demande : <a href="mailto:${commonContact}">${commonContact}</a></p>`,
    },
    {
      title: '9. Autorisations de l\'appareil',
      content: `<ul>
  <li><strong>Photothèque (lecture) :</strong> Pour sélectionner les photos de référence</li>
  <li><strong>Photothèque (écriture) :</strong> Pour enregistrer les portraits générés</li>
</ul>
<p>Aucune autre autorisation requise (ni caméra, microphone, localisation, ni contacts).</p>`,
    },
    {
      title: '10. Enfants',
      content: `<p>AI Headshot ne s'adresse pas aux enfants de moins de 16 ans. Nous ne collectons pas sciemment de données d'enfants.</p>`,
    },
    {
      title: '11. Modifications de cette politique',
      content: `<p>Nous nous réservons le droit de mettre à jour cette politique. La version en vigueur est toujours disponible à cette URL.</p>`,
    },
    {
      title: '12. Contact',
      content: `<p>Pour toute question relative à la confidentialité : <a href="mailto:${commonContact}">${commonContact}</a></p>`,
    },
  ],
  footerQuestions: 'Des questions sur la confidentialité ?',
  contactEmail: commonContact,
};

const es: PrivacyContent = {
  pageTitle: 'Política de privacidad',
  lastUpdated: 'Última actualización: 18 de abril de 2026',
  productLabel: 'AI HEADSHOT',
  highlight:
    'AI Headshot no recopila datos personales, no crea perfiles de usuario y no utiliza herramientas de seguimiento o analítica.',
  sections: [
    {
      title: '1. Responsable del tratamiento',
      content: `<p>Kojalytics<br/>Farzad Khojazada, empresa individual<br/>Am Diggen 40i, 21077 Hamburgo, Alemania<br/>Correo electrónico: <a href="mailto:${commonContact}">${commonContact}</a><br/>Sitio web: <a href="https://kojalytics.com">kojalytics.com</a></p>`,
    },
    {
      title: '2. ¿Qué datos se procesan?',
      content: `<p>AI Headshot solo procesa los datos estrictamente necesarios para generar retratos con IA:</p>
<ul>
  <li><strong>Fotos de referencia:</strong> Las fotos que selecciones (máx. 10) se transmiten a nuestro servidor y se reenvían al servicio de IA de terceros Google Gemini API para la generación.</li>
  <li><strong>Ajustes del retrato:</strong> Tus opciones de estilo (estilo, encuadre, fondo).</li>
  <li><strong>Datos de compra:</strong> Los identificadores de transacción para compras dentro de la app se almacenan localmente en tu dispositivo. El procesamiento de pagos lo realiza exclusivamente Apple.</li>
</ul>
<p><strong>Importante:</strong> Antes de la primera transmisión de tus fotos al servicio de IA, la app solicita tu consentimiento explícito. Sin tu aprobación, no se envían fotos a terceros.</p>`,
    },
    {
      title: '3. Lo que NO se recopila',
      content: `<ul>
  <li>No se requieren cuentas de usuario ni registro</li>
  <li>No se solicitan correos electrónicos, nombres ni teléfonos</li>
  <li>No se recopilan datos de ubicación</li>
  <li>No hay analíticas ni seguimiento (Google Analytics, Firebase, etc.)</li>
  <li>No hay publicidad ni redes publicitarias</li>
  <li>No se comparten datos con terceros con fines de marketing</li>
</ul>`,
    },
    {
      title: '4. ¿Cómo se procesan tus fotos?',
      content: `<ul>
  <li>Transmisión cifrada HTTPS/TLS a nuestro servidor (Supabase, región UE).</li>
  <li><strong>Servicio IA de terceros:</strong> Tus fotos se envían a la Google Gemini API (Google Ireland Limited) para la generación.</li>
  <li>Base legal: art. 6, apdo. 1, letra a) y art. 9, apdo. 2, letra a) del RGPD (consentimiento explícito).</li>
  <li>Tras la generación, las fotos de referencia se eliminan tanto en nuestro servidor como en Google.</li>
  <li>Los retratos generados se entregan a través de URLs firmadas con tiempo limitado.</li>
</ul>`,
    },
    {
      title: '5. Almacenamiento de datos',
      content: `<p><strong>En tu dispositivo:</strong></p>
<ul>
  <li>Retratos generados y vistas previas en el almacenamiento de la app</li>
  <li>Recibos de compra y ajustes en el Keychain de iOS cifrado</li>
  <li>Datos de la caja fuerte con caducidad automática (24 horas a 30 días según el paquete)</li>
</ul>
<p><strong>En nuestro servidor:</strong></p>
<ul>
  <li>Las fotos de referencia se eliminan tras el procesamiento</li>
  <li>Los retratos generados se almacenan temporalmente, accesibles solo mediante URLs con tiempo limitado</li>
  <li>Metadatos de trabajo (estado, marcas de tiempo) — sin referencia personal</li>
</ul>`,
    },
    {
      title: '6. Servicios de terceros',
      content: `<ul>
  <li><strong>Google Gemini API:</strong> Generación de imágenes con IA. Tus fotos se transmiten para la generación solo tras tu consentimiento. Google procesa los datos según la <a href="https://policies.google.com/privacy" target="_blank" rel="noopener noreferrer">Política de Privacidad de Google</a>. Las fotos se eliminan en Google tras el procesamiento.</li>
  <li><strong>Supabase:</strong> Infraestructura backend para procesamiento seguro de datos. Servidores en la UE (Fráncfort).</li>
  <li><strong>Apple StoreKit:</strong> Para compras dentro de la app. Apple procesa los datos de pago según la <a href="https://www.apple.com/legal/privacy/" target="_blank" rel="noopener noreferrer">Política de Privacidad de Apple</a>.</li>
</ul>`,
    },
    {
      title: '7. Seguridad de datos',
      content: `<ul>
  <li>Todas las transferencias cifradas mediante HTTPS</li>
  <li>Los datos locales cifrados en el Keychain de iOS</li>
  <li>Acceso a los retratos solo mediante URLs firmadas con tiempo limitado</li>
  <li>Protección mediante identificadores de trabajo únicos e inadivinables</li>
</ul>`,
    },
    {
      title: '8. Tus derechos (RGPD)',
      content: `<p>Como usuario en la UE, tienes los siguientes derechos:</p>
<ul>
  <li><strong>Acceso:</strong> información sobre los datos almacenados</li>
  <li><strong>Supresión:</strong> eliminación de tus datos</li>
  <li><strong>Oposición:</strong> oposición al tratamiento</li>
  <li><strong>Portabilidad de datos:</strong> datos en un formato común</li>
</ul>
<p>Dado que AI Headshot no usa cuentas de usuario, no se almacenan datos personales de forma permanente. Para consultas: <a href="mailto:${commonContact}">${commonContact}</a></p>`,
    },
    {
      title: '9. Permisos del dispositivo',
      content: `<ul>
  <li><strong>Biblioteca de fotos (lectura):</strong> Para seleccionar fotos de referencia</li>
  <li><strong>Biblioteca de fotos (escritura):</strong> Para guardar los retratos generados</li>
</ul>
<p>No se requieren permisos adicionales (ni cámara, micrófono, ubicación ni contactos).</p>`,
    },
    {
      title: '10. Menores',
      content: `<p>AI Headshot no está dirigida a menores de 16 años. No recopilamos datos de menores intencionadamente.</p>`,
    },
    {
      title: '11. Cambios en esta política',
      content: `<p>Nos reservamos el derecho a actualizar esta política. La versión actual está siempre disponible en esta URL.</p>`,
    },
    {
      title: '12. Contacto',
      content: `<p>Para cuestiones relacionadas con la privacidad: <a href="mailto:${commonContact}">${commonContact}</a></p>`,
    },
  ],
  footerQuestions: '¿Preguntas sobre privacidad?',
  contactEmail: commonContact,
};

const it: PrivacyContent = {
  pageTitle: 'Informativa sulla privacy',
  lastUpdated: 'Ultimo aggiornamento: 18 aprile 2026',
  productLabel: 'AI HEADSHOT',
  highlight:
    'AI Headshot non raccoglie dati personali, non crea profili utente e non utilizza strumenti di tracciamento o analisi.',
  sections: [
    {
      title: '1. Titolare del trattamento',
      content: `<p>Kojalytics<br/>Farzad Khojazada, impresa individuale<br/>Am Diggen 40i, 21077 Amburgo, Germania<br/>E-mail: <a href="mailto:${commonContact}">${commonContact}</a><br/>Sito web: <a href="https://kojalytics.com">kojalytics.com</a></p>`,
    },
    {
      title: '2. Quali dati vengono trattati?',
      content: `<p>AI Headshot tratta solo i dati strettamente necessari per generare ritratti con IA:</p>
<ul>
  <li><strong>Foto di riferimento:</strong> Le foto che selezioni (max 10) vengono trasmesse al nostro server e inoltrate al servizio IA di terze parti Google Gemini API per la generazione.</li>
  <li><strong>Impostazioni del ritratto:</strong> Le tue opzioni di stile (stile, inquadratura, sfondo).</li>
  <li><strong>Dati di acquisto:</strong> Gli ID di transazione per acquisti in-app sono memorizzati localmente sul tuo dispositivo. L'elaborazione dei pagamenti è gestita esclusivamente da Apple.</li>
</ul>
<p><strong>Importante:</strong> Prima della prima trasmissione delle tue foto al servizio IA, l'app richiede il tuo consenso esplicito. Senza la tua approvazione, nessuna foto viene inviata a terzi.</p>`,
    },
    {
      title: '3. Cosa NON viene raccolto',
      content: `<ul>
  <li>Non sono richiesti account utente o registrazione</li>
  <li>Nessun indirizzo e-mail, nome o numero di telefono</li>
  <li>Nessun dato di localizzazione</li>
  <li>Nessun analytics o tracciamento (niente Google Analytics, Firebase, ecc.)</li>
  <li>Nessuna pubblicità o rete pubblicitaria</li>
  <li>Nessuna condivisione di dati con terzi a fini di marketing</li>
</ul>`,
    },
    {
      title: '4. Come vengono trattate le tue foto?',
      content: `<ul>
  <li>Trasmissione crittografata HTTPS/TLS al nostro server (Supabase, regione UE).</li>
  <li><strong>Servizio IA di terze parti:</strong> Le tue foto vengono inoltrate alla Google Gemini API (Google Ireland Limited) per la generazione.</li>
  <li>Base giuridica: art. 6, par. 1, lett. a) e art. 9, par. 2, lett. a) GDPR (consenso esplicito).</li>
  <li>Al termine della generazione, le foto di riferimento vengono cancellate sia da noi sia da Google.</li>
  <li>I ritratti generati sono forniti tramite URL firmati a tempo limitato.</li>
</ul>`,
    },
    {
      title: '5. Conservazione dei dati',
      content: `<p><strong>Sul tuo dispositivo:</strong></p>
<ul>
  <li>Ritratti generati e anteprime nella memoria dell'app</li>
  <li>Ricevute d'acquisto e impostazioni nel Keychain iOS crittografato</li>
  <li>Dati della cassaforte con scadenza automatica (24 ore–30 giorni per pacchetto)</li>
</ul>
<p><strong>Sul nostro server:</strong></p>
<ul>
  <li>Le foto di riferimento vengono cancellate dopo l'elaborazione</li>
  <li>I ritratti generati sono conservati temporaneamente, accessibili solo tramite URL a tempo limitato</li>
  <li>Metadati della richiesta (stato, timestamp) — senza riferimenti personali</li>
</ul>`,
    },
    {
      title: '6. Servizi di terze parti',
      content: `<ul>
  <li><strong>Google Gemini API:</strong> Generazione di immagini con IA. Le tue foto vengono trasmesse per la generazione solo dopo il tuo consenso. Google elabora i dati secondo la <a href="https://policies.google.com/privacy" target="_blank" rel="noopener noreferrer">Privacy Policy di Google</a>. Le foto vengono eliminate presso Google dopo l'elaborazione.</li>
  <li><strong>Supabase:</strong> Infrastruttura backend per l'elaborazione sicura dei dati. Server nell'UE (Francoforte).</li>
  <li><strong>Apple StoreKit:</strong> Per gli acquisti in-app. Apple elabora i dati di pagamento secondo la <a href="https://www.apple.com/legal/privacy/" target="_blank" rel="noopener noreferrer">Privacy Policy di Apple</a>.</li>
</ul>`,
    },
    {
      title: '7. Sicurezza dei dati',
      content: `<ul>
  <li>Tutte le trasmissioni crittografate via HTTPS</li>
  <li>Dati locali crittografati nel Keychain iOS</li>
  <li>Accesso ai ritratti solo tramite URL firmati a tempo limitato</li>
  <li>Protezione tramite ID di richiesta univoci e non indovinabili</li>
</ul>`,
    },
    {
      title: '8. I tuoi diritti (GDPR)',
      content: `<p>Come utente nell'UE, hai i seguenti diritti:</p>
<ul>
  <li><strong>Accesso:</strong> informazioni sui dati archiviati</li>
  <li><strong>Cancellazione:</strong> cancellazione dei tuoi dati</li>
  <li><strong>Opposizione:</strong> opposizione al trattamento</li>
  <li><strong>Portabilità dei dati:</strong> dati in un formato comune</li>
</ul>
<p>Poiché AI Headshot non utilizza account utente, nessun dato personale viene conservato in modo permanente. Per richieste: <a href="mailto:${commonContact}">${commonContact}</a></p>`,
    },
    {
      title: '9. Autorizzazioni del dispositivo',
      content: `<ul>
  <li><strong>Libreria foto (lettura):</strong> Per selezionare le foto di riferimento</li>
  <li><strong>Libreria foto (scrittura):</strong> Per salvare i ritratti generati</li>
</ul>
<p>Non sono richieste ulteriori autorizzazioni (niente fotocamera, microfono, posizione o contatti).</p>`,
    },
    {
      title: '10. Minori',
      content: `<p>AI Headshot non è destinata a minori di 16 anni. Non raccogliamo consapevolmente dati di minori.</p>`,
    },
    {
      title: '11. Modifiche a questa informativa',
      content: `<p>Ci riserviamo il diritto di aggiornare questa informativa. La versione corrente è sempre disponibile a questo URL.</p>`,
    },
    {
      title: '12. Contatti',
      content: `<p>Per domande relative alla privacy: <a href="mailto:${commonContact}">${commonContact}</a></p>`,
    },
  ],
  footerQuestions: 'Domande sulla privacy?',
  contactEmail: commonContact,
};

// For locales not directly supported (da, nl, sv), fall back to English.
export const privacyContent: Record<Locale, PrivacyContent> = {
  de,
  en,
  fr,
  es,
  it,
  da: en,
  nl: en,
  sv: en,
};
