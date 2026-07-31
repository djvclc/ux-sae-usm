import { Fragment, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'

/* ── Utilidades RUT chileno ── */
function formatRut(raw) {
  const clean = raw.replace(/[^0-9kK]/g, '').toUpperCase()
  if (clean.length < 2) return clean
  const body = clean.slice(0, -1)
  const dv = clean.slice(-1)
  return body.replace(/\B(?=(\d{3})+(?!\d))/g, '.') + '-' + dv
}

function validarRut(rut) {
  const clean = rut.replace(/[^0-9kK]/g, '').toUpperCase()
  if (clean.length < 2) return false
  const body = clean.slice(0, -1)
  const dv = clean.slice(-1)
  let suma = 0
  let mult = 2
  for (let i = body.length - 1; i >= 0; i--) {
    suma += parseInt(body[i]) * mult
    mult = mult < 7 ? mult + 1 : 2
  }
  const resto = 11 - (suma % 11)
  const dvEsp = resto === 11 ? '0' : resto === 10 ? 'K' : String(resto)
  return dv === dvEsp
}

function nivelContrasena(pwd) {
  if (!pwd) return null
  if (pwd.length < 6) return 'débil'
  const score = [
    pwd.length >= 8,
    /\d/.test(pwd),
    /[A-Z]/.test(pwd),
    /[^a-zA-Z0-9]/.test(pwd),
  ].filter(Boolean).length
  if (score <= 1) return 'débil'
  if (score === 2) return 'regular'
  return 'buena'
}

const PASOS = ['Datos de identidad', 'Contacto y seguridad']

export default function RegistroPage() {
  const navigate = useNavigate()
  const [paso, setPaso] = useState(1)
  const [registrado, setRegistrado] = useState(false)
  const [tocado, setTocado] = useState({})

  const touch = (campo) => setTocado((p) => ({ ...p, [campo]: true }))

  /* ── Paso 1 ── */
  const [rut, setRut] = useState('')
  const [fechaNac, setFechaNac] = useState('')
  const [serie, setSerie] = useState('')
  const [infoSerie, setInfoSerie] = useState(false)

  /* ── Paso 2 ── */
  const [email, setEmail] = useState('')
  const [emailConf, setEmailConf] = useState('')
  const [tel, setTel] = useState('')
  const [telConf, setTelConf] = useState('')
  const [pwd, setPwd] = useState('')
  const [pwdConf, setPwdConf] = useState('')
  const [verPwd, setVerPwd] = useState(false)
  const [verPwdConf, setVerPwdConf] = useState(false)
  const [aceptaTerminos, setAceptaTerminos] = useState(false)
  const [aceptaDatos, setAceptaDatos] = useState(false)

  const emailOk = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
  const telOk = /^\d{8}$/.test(tel)

  const errores = {
    rut: tocado.rut && !validarRut(rut)
      ? 'RUN inválido — verifica el dígito verificador' : null,
    fechaNac: tocado.fechaNac && !fechaNac
      ? 'Ingresa tu fecha de nacimiento' : null,
    email: tocado.email && !emailOk
      ? 'Correo electrónico inválido' : null,
    emailConf: tocado.emailConf && email !== emailConf
      ? 'Los correos no coinciden' : null,
    tel: tocado.tel && !telOk
      ? 'Ingresa 8 dígitos (sin el +56 9)' : null,
    telConf: tocado.telConf && tel !== telConf
      ? 'Los teléfonos no coinciden' : null,
    pwd: tocado.pwd && pwd.length < 6
      ? 'Mínimo 6 caracteres' : null,
    pwdConf: tocado.pwdConf && pwd !== pwdConf
      ? 'Las contraseñas no coinciden' : null,
  }

  const paso1Ok = validarRut(rut) && !!fechaNac
  const paso2Ok = emailOk && email === emailConf &&
    telOk && tel === telConf &&
    pwd.length >= 6 && pwd === pwdConf &&
    aceptaTerminos && aceptaDatos

  /* ── Éxito ── */
  if (registrado) {
    return (
      <main className="page page--registro">
        <div className="registro-ok">
          <span className="registro-ok__icono" aria-hidden="true">✅</span>
          <h1>¡Tu cuenta fue creada!</h1>
          <p className="registro-ok__desc">
            Ya puedes ingresar con tu RUN y contraseña para postular a los colegios del SAE.
          </p>
          <Link className="btn btn--primary btn--grande" to="/postulacion">
            Ir a postulación →
          </Link>
        </div>
      </main>
    )
  }

  return (
    <main className="page page--registro">

      {/* ── Volver ── */}
      <button
        type="button"
        className="registro-back"
        onClick={() => (paso === 1 ? navigate(-1) : setPaso(1))}
      >
        ← Volver
      </button>

      <h1 className="registro-titulo">Crea tu cuenta para postular</h1>
      <p className="registro-subtitulo">
        Si no tienes ClaveÚnica, regístrate aquí con tu RUN chileno.{' '}
        <a
          href="https://www.mineduc.cl"
          className="link-inline"
          target="_blank"
          rel="noopener noreferrer"
        >
          ¿No tienes RUN? Obtén tu IPA aquí
        </a>
      </p>

      {/* ── Stepper ── */}
      <nav className="stepper registro-stepper" aria-label={`Paso ${paso} de 2`}>
        {PASOS.map((label, i) => {
          const n = i + 1
          return (
            <Fragment key={n}>
              <div
                className={`stepper__step${paso > n ? ' stepper__step--done' : ''}${paso === n ? ' stepper__step--active' : ''}`}
                aria-current={paso === n ? 'step' : undefined}
              >
                <span className="stepper__num">{paso > n ? '✓' : n}</span>
                <span className="stepper__label">{label}</span>
              </div>
              {i < PASOS.length - 1 && <span className="stepper__linea" aria-hidden="true" />}
            </Fragment>
          )
        })}
      </nav>

      <form
        className="registro-form"
        onSubmit={(e) => { e.preventDefault(); if (paso2Ok) setRegistrado(true) }}
        noValidate
      >

        {/* ══ PASO 1: Datos de identidad ══ */}
        {paso === 1 && (
          <div className="registro-paso">

            <div className="rg-campo">
              <label className="form-label" htmlFor="rg-rut">RUN</label>
              <input
                id="rg-rut"
                type="text"
                inputMode="numeric"
                className={`form-input rg-input${errores.rut ? ' rg-input--error' : ''}`}
                value={rut}
                onChange={(e) => setRut(formatRut(e.target.value.replace(/[^0-9kK]/g, '')))}
                onBlur={() => touch('rut')}
                placeholder="Ej. 20.637.307-5"
                autoComplete="off"
                aria-describedby={errores.rut ? 'err-rut' : undefined}
              />
              {errores.rut && <span id="err-rut" className="rg-error" role="alert">{errores.rut}</span>}
            </div>

            <div className="rg-campo">
              <label className="form-label" htmlFor="rg-fecha">Fecha de nacimiento</label>
              <input
                id="rg-fecha"
                type="date"
                className={`form-input rg-input${errores.fechaNac ? ' rg-input--error' : ''}`}
                value={fechaNac}
                onChange={(e) => setFechaNac(e.target.value)}
                onBlur={() => touch('fechaNac')}
                max={new Date().toISOString().split('T')[0]}
                aria-describedby={errores.fechaNac ? 'err-fecha' : undefined}
              />
              {errores.fechaNac && <span id="err-fecha" className="rg-error" role="alert">{errores.fechaNac}</span>}
            </div>

            <div className="rg-campo">
              <label className="form-label" htmlFor="rg-serie">
                Número de serie del documento
                <span className="form-label__opt"> (opcional)</span>
              </label>
              <div className="rg-input-wrap">
                <input
                  id="rg-serie"
                  type="text"
                  className="form-input rg-input"
                  value={serie}
                  onChange={(e) => setSerie(e.target.value)}
                  placeholder="Ej. A012345678"
                  autoComplete="off"
                />
                <button
                  type="button"
                  className="rg-info-btn"
                  aria-expanded={infoSerie}
                  onClick={() => setInfoSerie((p) => !p)}
                  aria-label="¿Dónde está el número de serie?"
                >
                  ?
                </button>
              </div>
              {infoSerie && (
                <p className="rg-info-box">
                  Está impreso en el anverso de tu cédula de identidad, bajo la foto. Empieza con una letra (A, B, C…) seguida de números. Si no lo tienes a mano, puedes ingresarlo después desde «Mis datos».
                </p>
              )}
            </div>

            <button
              type="button"
              className="btn btn--primary btn--block"
              onClick={() => setPaso(2)}
              disabled={!paso1Ok}
            >
              Continuar →
            </button>

          </div>
        )}

        {/* ══ PASO 2: Contacto y seguridad ══ */}
        {paso === 2 && (
          <div className="registro-paso">

            <div className="rg-campo">
              <label className="form-label" htmlFor="rg-email">Correo electrónico</label>
              <p className="rg-campo__hint">
                Recibirás las notificaciones del proceso en este correo.
              </p>
              <input
                id="rg-email"
                type="email"
                className={`form-input rg-input${errores.email ? ' rg-input--error' : ''}`}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                onBlur={() => touch('email')}
                placeholder="ejemplo@correo.com"
                autoComplete="email"
              />
              {errores.email && <span className="rg-error" role="alert">{errores.email}</span>}
            </div>

            <div className="rg-campo">
              <label className="form-label" htmlFor="rg-email-conf">Confirma tu correo</label>
              <input
                id="rg-email-conf"
                type="email"
                className={`form-input rg-input${errores.emailConf ? ' rg-input--error' : ''}`}
                value={emailConf}
                onChange={(e) => setEmailConf(e.target.value)}
                onBlur={() => touch('emailConf')}
                placeholder="ejemplo@correo.com"
                autoComplete="off"
              />
              {errores.emailConf && <span className="rg-error" role="alert">{errores.emailConf}</span>}
            </div>

            <div className="rg-campo">
              <label className="form-label" htmlFor="rg-tel">Teléfono móvil</label>
              <p className="rg-campo__hint">
                Escribe solo los 8 dígitos finales (sin el +56 9).
              </p>
              <div className="rg-tel-wrap">
                <span className="rg-tel-prefix" aria-hidden="true">+56 9</span>
                <input
                  id="rg-tel"
                  type="tel"
                  inputMode="numeric"
                  className={`form-input rg-input rg-input--tel${errores.tel ? ' rg-input--error' : ''}`}
                  value={tel}
                  onChange={(e) => setTel(e.target.value.replace(/\D/g, '').slice(0, 8))}
                  onBlur={() => touch('tel')}
                  placeholder="1234 5678"
                  maxLength={8}
                />
              </div>
              {errores.tel && <span className="rg-error" role="alert">{errores.tel}</span>}
            </div>

            <div className="rg-campo">
              <label className="form-label" htmlFor="rg-tel-conf">Confirma tu teléfono</label>
              <div className="rg-tel-wrap">
                <span className="rg-tel-prefix" aria-hidden="true">+56 9</span>
                <input
                  id="rg-tel-conf"
                  type="tel"
                  inputMode="numeric"
                  className={`form-input rg-input rg-input--tel${errores.telConf ? ' rg-input--error' : ''}`}
                  value={telConf}
                  onChange={(e) => setTelConf(e.target.value.replace(/\D/g, '').slice(0, 8))}
                  onBlur={() => touch('telConf')}
                  placeholder="1234 5678"
                  maxLength={8}
                />
              </div>
              {errores.telConf && <span className="rg-error" role="alert">{errores.telConf}</span>}
            </div>

            <div className="rg-campo">
              <label className="form-label" htmlFor="rg-pwd">Contraseña</label>
              <div className="rg-pwd-wrap">
                <input
                  id="rg-pwd"
                  type={verPwd ? 'text' : 'password'}
                  className={`form-input rg-input${errores.pwd ? ' rg-input--error' : ''}`}
                  value={pwd}
                  onChange={(e) => setPwd(e.target.value)}
                  onBlur={() => touch('pwd')}
                  autoComplete="new-password"
                />
                <button
                  type="button"
                  className="rg-pwd-ojo"
                  onClick={() => setVerPwd((p) => !p)}
                  aria-label={verPwd ? 'Ocultar contraseña' : 'Mostrar contraseña'}
                >
                  {verPwd ? '🙈' : '👁'}
                </button>
              </div>
              {pwd && (
                <div className="rg-pwd-fuerza">
                  <span
                    className={`rg-pwd-barra rg-pwd-barra--${nivelContrasena(pwd)}`}
                    aria-hidden="true"
                  />
                  <span className="rg-pwd-nivel">
                    Seguridad: <strong>{nivelContrasena(pwd)}</strong>
                  </span>
                </div>
              )}
              {errores.pwd && <span className="rg-error" role="alert">{errores.pwd}</span>}
            </div>

            <div className="rg-campo">
              <label className="form-label" htmlFor="rg-pwd-conf">Confirma tu contraseña</label>
              <div className="rg-pwd-wrap">
                <input
                  id="rg-pwd-conf"
                  type={verPwdConf ? 'text' : 'password'}
                  className={`form-input rg-input${errores.pwdConf ? ' rg-input--error' : ''}`}
                  value={pwdConf}
                  onChange={(e) => setPwdConf(e.target.value)}
                  onBlur={() => touch('pwdConf')}
                  autoComplete="new-password"
                />
                <button
                  type="button"
                  className="rg-pwd-ojo"
                  onClick={() => setVerPwdConf((p) => !p)}
                  aria-label={verPwdConf ? 'Ocultar contraseña' : 'Mostrar contraseña'}
                >
                  {verPwdConf ? '🙈' : '👁'}
                </button>
              </div>
              {errores.pwdConf && <span className="rg-error" role="alert">{errores.pwdConf}</span>}
            </div>

            {/* Términos y condiciones */}
            <fieldset className="rg-checks">
              <legend className="sr-only">Aceptación de condiciones</legend>
              <label className="rg-check-label">
                <input
                  type="checkbox"
                  className="rg-check"
                  checked={aceptaTerminos}
                  onChange={(e) => setAceptaTerminos(e.target.checked)}
                />
                <span>
                  He leído y acepto los{' '}
                  <Link to="/cumplimiento" className="link-inline">
                    términos y condiciones
                  </Link>{' '}
                  del proceso de admisión
                </span>
              </label>
              <label className="rg-check-label">
                <input
                  type="checkbox"
                  className="rg-check"
                  checked={aceptaDatos}
                  onChange={(e) => setAceptaDatos(e.target.checked)}
                />
                <span>
                  He leído y acepto el protocolo de{' '}
                  <Link to="/cumplimiento" className="link-inline">
                    manejo de datos
                  </Link>
                </span>
              </label>
            </fieldset>

            <button
              type="submit"
              className="btn btn--primary btn--block btn--grande"
              disabled={!paso2Ok}
            >
              Registrarme
            </button>

          </div>
        )}
      </form>

    </main>
  )
}
