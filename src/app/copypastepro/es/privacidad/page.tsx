import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Política de Privacidad — Copy Paste Pro",
  description:
    "Política de privacidad de la app iOS Copy Paste Pro de Kojalytics. Todos los datos permanecen en tu dispositivo — sin seguimiento, sin publicidad.",
  alternates: {
    canonical: "https://kojalytics.com/copypastepro/es/privacidad",
    languages: {
      de: "https://kojalytics.com/copypastepro/de/datenschutz",
      en: "https://kojalytics.com/copypastepro/en/privacy",
      fr: "https://kojalytics.com/copypastepro/fr/confidentialite",
      es: "https://kojalytics.com/copypastepro/es/privacidad",
      nl: "https://kojalytics.com/copypastepro/nl/privacy",
    },
  },
};

export default function CopyPasteProPrivacidadPage() {
  return (
    <>
      <Navigation />
      <main className="pt-32 pb-20 px-6">
        <div className="max-w-3xl mx-auto">
          <p className="text-accent-light text-sm font-medium tracking-wide uppercase mb-3">
            Copy Paste Pro
          </p>
          <h1 className="text-4xl font-bold tracking-tight mb-3">
            Política de Privacidad
          </h1>
          <p className="text-muted text-sm mb-10">
            Última actualización: 30 de mayo de 2026
          </p>

          <div className="glass-card rounded-2xl p-10 space-y-10">
            <div className="bg-accent/10 border border-accent/20 rounded-xl p-5">
              <p className="text-accent-light font-medium text-sm leading-relaxed">
                Copy Paste Pro almacena tus datos exclusivamente en tu
                dispositivo. Sin transmisión al servidor, sin analíticas, sin
                seguimiento, sin publicidad.
              </p>
            </div>

            <Section title="1. Responsable">
              <p className="text-muted leading-relaxed">
                Kojalytics
                <br />
                Correo:{" "}
                <a
                  href="mailto:support@kojalytics.com"
                  className="text-accent-light hover:underline"
                >
                  support@kojalytics.com
                </a>
                <br />
                Web:{" "}
                <a
                  href="https://kojalytics.com"
                  className="text-accent-light hover:underline"
                >
                  kojalytics.com
                </a>
              </p>
            </Section>

            <Section title="2. ¿Qué hace Copy Paste Pro?">
              <p className="text-muted leading-relaxed">
                Copy Paste Pro es un gestor de portapapeles con su propio
                teclado iOS en 12 idiomas, traducción integrada vía Apple
                Translation, integración de calendario y autocorrección con IA.
                Todo el procesamiento se ejecuta localmente.
              </p>
            </Section>

            <Section title="3. ¿Qué datos se procesan localmente?">
              <ul className="text-muted space-y-2 list-disc list-inside leading-relaxed">
                <li>
                  <strong className="text-foreground">
                    Historial del portapapeles:
                  </strong>{" "}
                  textos, URLs y direcciones que copias, almacenados localmente.
                </li>
                <li>
                  <strong className="text-foreground">
                    Diccionario personal:
                  </strong>{" "}
                  palabras frecuentes aprendidas en el dispositivo para mejorar
                  la autocorrección.
                </li>
                <li>
                  <strong className="text-foreground">
                    Ajustes de la app:
                  </strong>{" "}
                  idioma, estado de onboarding, plan seleccionado.
                </li>
              </ul>
              <div className="bg-accent/10 border border-accent/20 rounded-xl p-5 mt-4">
                <p className="text-accent-light font-medium text-sm leading-relaxed">
                  Importante: todos los datos permanecen exclusivamente en tu
                  iPhone. Sin transmisión a nuestros servidores ni a terceros.
                </p>
              </div>
            </Section>

            <Section title="4. ¿Qué NO se recopila?">
              <ul className="text-muted space-y-2 list-disc list-inside leading-relaxed">
                <li>Sin cuentas de usuario ni registro</li>
                <li>Sin correos, nombres ni teléfonos</li>
                <li>Sin datos de ubicación</li>
                <li>
                  Sin pulsaciones de teclas (no hay keylogging)
                </li>
                <li>
                  Sin herramientas de analítica (sin Google Analytics, Firebase,
                  Clarity)
                </li>
                <li>Sin publicidad ni redes publicitarias</li>
                <li>Sin compartir datos con terceros</li>
              </ul>
            </Section>

            <Section title="5. Extensión de teclado y acceso completo">
              <p className="text-muted leading-relaxed mb-3">
                El teclado es una extensión iOS Custom Keyboard. Para acceder al
                historial del portapapeles debes activar{" "}
                <strong className="text-foreground">
                  «Permitir acceso completo»
                </strong>{" "}
                en los ajustes de iOS.
              </p>
              <p className="text-muted leading-relaxed mb-3 font-medium text-foreground text-sm">
                ¿Para qué se necesita el acceso completo?
              </p>
              <ul className="text-muted space-y-2 list-disc list-inside leading-relaxed">
                <li>
                  Para compartir localmente el historial entre la app y el
                  teclado mediante iOS App Groups.
                </li>
                <li>
                  Para leer el portapapeles al tocar el icono de portapapeles en
                  el teclado.
                </li>
                <li>
                  Para el roundtrip de traducción a la app principal (el
                  framework Apple Translation solo se ejecuta allí).
                </li>
              </ul>
              <p className="text-muted leading-relaxed mt-3">
                El acceso completo se usa{" "}
                <strong className="text-foreground">
                  exclusivamente en local
                </strong>
                . El teclado no envía datos a servidores externos. Puedes
                revocarlo en cualquier momento en los ajustes de iOS.
              </p>
            </Section>

            <Section title="6. iCloud (CloudKit) — solo códigos promocionales">
              <p className="text-muted leading-relaxed mb-3">
                Si canjeas un código promocional, usamos CloudKit Public
                Database de Apple para la activación única. Almacenamos:
              </p>
              <ul className="text-muted space-y-2 list-disc list-inside leading-relaxed">
                <li>
                  Un identificador anónimo de dispositivo (UUID aleatorio — sin
                  Apple ID, sin nombre)
                </li>
                <li>
                  Un hash del código (SHA-256) para evitar canjes duplicados
                </li>
              </ul>
              <p className="text-muted leading-relaxed mt-3">
                Los datos residen en tu propio espacio iCloud bajo
                responsabilidad de Apple. Podemos solicitar su eliminación —
                contacto abajo.
              </p>
            </Section>

            <Section title="7. Apple Translation Framework">
              <p className="text-muted leading-relaxed">
                Las traducciones se realizan mediante el framework Apple
                Translation. Apple procesa el texto en el dispositivo o vía sus
                servidores — consulta la política de Apple. No enviamos texto a
                nuestros servidores ni a terceros.
              </p>
            </Section>

            <Section title="8. Calendario">
              <p className="text-muted leading-relaxed">
                Si concedes acceso al calendario, los eventos se muestran solo
                en la app. Sin transmisión.
              </p>
            </Section>

            <Section title="9. Compras dentro de la app">
              <p className="text-muted leading-relaxed">
                Las compras se gestionan a través de Apple StoreKit 2. No
                recibimos información de pago. Se aplica la política de Apple.
              </p>
            </Section>

            <Section title="10. Tus derechos (RGPD)">
              <ul className="text-muted space-y-2 list-disc list-inside leading-relaxed">
                <li>
                  <strong className="text-foreground">Acceso:</strong> como no
                  recopilamos datos personales, no tenemos acceso a tus datos.
                </li>
                <li>
                  <strong className="text-foreground">
                    Eliminación local:
                  </strong>{" "}
                  desinstala la app — iOS borrará todos los datos locales.
                </li>
                <li>
                  <strong className="text-foreground">
                    Eliminación CloudKit promo:
                  </strong>{" "}
                  escribe a support@kojalytics.com con el asunto «Eliminación
                  CloudKit Copy Paste Pro».
                </li>
              </ul>
            </Section>

            <Section title="11. Menores">
              <p className="text-muted leading-relaxed">
                Copy Paste Pro no está dirigido a menores de 16 años. Como no se
                recopilan datos personales, su uso es por lo demás seguro.
              </p>
            </Section>

            <Section title="12. Cambios">
              <p className="text-muted leading-relaxed">
                Podemos actualizar esta política cuando sea necesario. La
                versión actual siempre estará disponible en esta URL.
              </p>
            </Section>

            <Section title="13. Contacto">
              <p className="text-muted leading-relaxed">
                Consultas relacionadas con la privacidad:{" "}
                <a
                  href="mailto:support@kojalytics.com"
                  className="text-accent-light hover:underline"
                >
                  support@kojalytics.com
                </a>
              </p>
            </Section>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}

function Section({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section>
      <h2 className="text-xl font-semibold mb-3">{title}</h2>
      {children}
    </section>
  );
}
