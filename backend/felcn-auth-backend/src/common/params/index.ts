// Parámetros de configuración
export const Configurations = {
  SCORE_PASSWORD: 3, // NIVEL MÍNIMO DE CALIFICACIÓN PASSWORD
  SALT_ROUNDS: 15, // NUMERO DE SALTOS PARA GENERACIÓN DE HASH
  WRONG_LOGIN_LIMIT: 3, // NUMERO MÁXIMO DE INTENTOS DE INICIO DE SESIÓN ERRONEOS. EL BLOQUEO ES INDEFINIDO HASTA DESBLOQUEO MANUAL (CORREO O ADMINISTRADOR)
  PASSWORD_HISTORY_SIZE: 5, // CANTIDAD DE CONTRASEÑAS ANTERIORES QUE NO SE PUEDEN REUTILIZAR
  // OTP / 2FA
  OTP_LONGITUD: 6,            // Dígitos del código OTP
  OTP_EXPIRACION_MIN: 5,      // Minutos de vigencia del OTP
  OTP_MAX_INTENTOS: 3,        // Intentos fallidos antes de invalidar la sesión OTP
  OTP_RATE_LIMIT_SEGUNDOS: 60, // Segundos de espera mínima entre solicitudes de OTP
  OTP_CANAL_DEFAULT: 'EMAIL' as string, // Canal por defecto cuando el usuario no tiene uno configurado
  // Costo bcrypt para el hash del código OTP — deliberadamente bajo (~ms en
  // vez de ~1.3s con SALT_ROUNDS=15). El código ya está protegido por su
  // corta vigencia (OTP_EXPIRACION_MIN) y el límite de intentos (OTP_MAX_INTENTOS).
  OTP_SALT_ROUNDS: 6,
  // Dispositivo de confianza: tras un OTP verificado, ese navegador no vuelve
  // a pedir OTP hasta que pase esta ventana (o hasta que se revoquen sesiones).
  OTP_CONFIANZA_COOKIE: 'otp_confianza',
  OTP_CONFIANZA_HORAS: 24,
  // LISTA DE DOMINIOS DE EMAIL NO PERMITIDOS
  BLACK_LIST_EMAILS: [
    '10minutemail.com',
    'fremont.nodebalancer.linode.com',
    'yopmail.com',
    'cool.fr.nf',
    'jetable.fr.nf',
    'nospam.ze.tc',
    'nomail.xl.cx',
    'mega.zik.dj',
    'speed.1s.fr',
    'courriel.fr.nf',
    'moncourrier.fr.nf',
    'monemail.fr.nf',
    'monmail.fr.nf',
    'mailinator',
    'binkmail.com',
    'bobmail.info',
    'chammy.info',
    'devnullmail.com',
    'letthemeatspam.com',
    'mailinator.com',
    'mailinater.com',
    'mailinator.net',
    'mailinator2.com',
    'notmailinator.com',
    'reallymymail.com',
    'reconmail.com',
    'safetymail.info',
    'sendspamhere.com',
    'sogetthis.com',
    'spambooger.com',
    'spamherelots.com',
    'spamhereplease.com',
    'spamthisplease.com',
    'streetwisemail.com',
    'suremail.info',
    'thisisnotmyrealemail.com',
    'tradermail.info',
    'veryrealemail.com',
    'zippymail.info',
    'guerrillamail',
    'maildrop',
    'mailnesia',
    'worldmagic.ink',
    'gufum.com',
    'mail.com',
    'theeyeoftruth.com',
    'bmomento.com',
    'bixolabs.com',
    'evildrako654.online',
    'mailtemporal.net',
  ],
}
