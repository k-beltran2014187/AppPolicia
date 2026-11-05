import { useLang } from '../i18n'

const CONTACT = (import.meta.env.VITE_CONTACT_EMAIL as string | undefined) ?? ''

export default function Legal() {
  const { lang } = useLang()
  return lang === 'en' ? <En /> : <Es />
}

function Es() {
  return (
    <div className="stack legal">
      <h1>Política de privacidad</h1>
      <p className="small muted">Última actualización: noviembre de 2026. Borrador pendiente de revisión por un abogado.</p>
      <h2>Qué datos pedimos</h2>
      <ul>
        <li><strong>Para crear tu cuenta:</strong> primer y segundo nombre, primer y segundo apellido, celular, correo electrónico, DPI y contraseña.</li>
        <li><strong>Ajustes:</strong> idioma, tipo de usuario (conductor o agente) y, si lo escribes, el número de tu contacto de confianza.</li>
      </ul>
      <h2>Para qué los usamos</h2>
      <p>Para crear y proteger tu cuenta, permitirte entrar con tu correo o celular, y recuperar tus ajustes en otro teléfono. El DPI se usa solo para identificarte como titular de la cuenta. No vendemos tus datos, no hacemos publicidad con ellos y no los compartimos con terceros, salvo los proveedores técnicos indicados abajo.</p>
      <h2>Lo que se queda solo en tu teléfono</h2>
      <p>Tus fotos, videos, audios, el informe y el historial del chat se guardan únicamente en tu teléfono. No se suben a nuestros servidores.</p>
      <h2>Asesor virtual con IA</h2>
      <p>Cuando haces una pregunta, el texto se envía a un servicio de inteligencia artificial (Anthropic) para generar la respuesta. Esa pregunta no se asocia a tu cuenta. Por eso te pedimos no escribir tu nombre, DPI ni placas en el chat. Si dictas por voz, tu navegador puede enviar el audio al servicio de voz de Google o Apple.</p>
      <h2>Quiénes nos ayudan a operar la app</h2>
      <ul>
        <li><strong>Supabase:</strong> guarda las cuentas y la base de datos, con acceso restringido para que cada persona solo vea sus propios datos.</li>
        <li><strong>Vercel:</strong> aloja la aplicación.</li>
        <li><strong>Anthropic:</strong> genera las respuestas del asesor virtual.</li>
      </ul>
      <p>Estos proveedores pueden almacenar datos fuera de Guatemala.</p>
      <h2>Rostro y huella</h2>
      <p>Si activas la entrada con rostro o huella, la verificación la hace tu teléfono. SOSgt nunca recibe ni guarda tu rostro ni tu huella.</p>
      <h2>Cuánto tiempo guardamos tus datos</h2>
      <p>Mientras tu cuenta exista. Puedes eliminarla en cualquier momento desde <em>Mi cuenta</em>: se borran de inmediato tu perfil y tus ajustes.</p>
      <h2>Tus derechos</h2>
      <p>Puedes ver tus datos, pedir que se corrijan o eliminar tu cuenta. SOSgt es para personas mayores de 18 años.</p>
      {CONTACT && <p>Contacto: <a href={`mailto:${CONTACT}`}>{CONTACT}</a></p>}

      <h1>Términos de uso</h1>
      <ul>
        <li>SOSgt es informativa. No es un abogado ni da asesoría legal, y no sustituye a un profesional del derecho. Los artículos están tomados de textos oficiales y pendientes de revisión legal.</li>
        <li>No está afiliada a la Policía Nacional Civil, EMETRA ni a ninguna entidad del Estado.</li>
        <li>Úsala con respeto. No uses la app para huir, resistirte, agredir u ocultar evidencia.</li>
        <li>Eres responsable de la veracidad de tus datos y de cuidar tu contraseña.</li>
        <li>Podemos suspender cuentas que hagan un uso abusivo del servicio.</li>
        <li>Estos términos se rigen por las leyes de Guatemala.</li>
      </ul>
    </div>
  )
}

function En() {
  return (
    <div className="stack legal">
      <h1>Privacy policy</h1>
      <p className="small muted">Last updated: November 2026. Draft pending review by a lawyer.</p>
      <h2>What we ask for</h2>
      <ul>
        <li><strong>To create your account:</strong> first and second name, first and second surname, mobile phone, email, DPI (national ID) and password.</li>
        <li><strong>Settings:</strong> language, user type (driver or officer) and, if you enter it, your trusted contact's number.</li>
      </ul>
      <h2>What we use it for</h2>
      <p>To create and protect your account, let you sign in with your email or phone, and restore your settings on another phone. The DPI is used only to identify you as the account holder. We do not sell your data, use it for advertising, or share it with third parties other than the technical providers listed below.</p>
      <h2>What stays only on your phone</h2>
      <p>Your photos, videos, audio, report and chat history are stored only on your phone. They are not uploaded to our servers.</p>
      <h2>AI advisor</h2>
      <p>When you ask a question, the text is sent to an AI service (Anthropic) to generate the answer. That question is not linked to your account. Please do not type your name, DPI or license plates in the chat. If you dictate by voice, your browser may send the audio to Google's or Apple's speech service.</p>
      <h2>Providers that help us run the app</h2>
      <ul>
        <li><strong>Supabase:</strong> stores accounts and the database, with access rules so each person only sees their own data.</li>
        <li><strong>Vercel:</strong> hosts the app.</li>
        <li><strong>Anthropic:</strong> generates the advisor's answers.</li>
      </ul>
      <p>These providers may store data outside Guatemala.</p>
      <h2>Face and fingerprint</h2>
      <p>If you turn on face or fingerprint sign-in, your phone does the verification. SOSgt never receives or stores your face or fingerprint.</p>
      <h2>How long we keep your data</h2>
      <p>For as long as your account exists. You can delete it at any time from <em>My account</em>: your profile and settings are erased immediately.</p>
      <h2>Your rights</h2>
      <p>You can see your data, ask for corrections, or delete your account. SOSgt is for people aged 18 or over.</p>
      {CONTACT && <p>Contact: <a href={`mailto:${CONTACT}`}>{CONTACT}</a></p>}

      <h1>Terms of use</h1>
      <ul>
        <li>SOSgt is informational. It is not a lawyer, does not give legal advice and does not replace a legal professional. Articles come from official texts and are pending legal review.</li>
        <li>It is not affiliated with the National Civil Police, EMETRA or any government body.</li>
        <li>Use it respectfully. Do not use the app to flee, resist, assault or hide evidence.</li>
        <li>You are responsible for the accuracy of your data and for keeping your password safe.</li>
        <li>We may suspend accounts that abuse the service.</li>
        <li>These terms are governed by the laws of Guatemala.</li>
      </ul>
    </div>
  )
}