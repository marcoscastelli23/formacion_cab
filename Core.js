/* ===============================================================
   CORE.JS — MOTOR CENTRAL PARA TODA LA APLICACIÓN
   Funciona con Firebase Auth y namespace por usuario
   Namespace: cab_<UID>_
================================================================ */

/* ===============================================================
   1) LOG CUANDO AUTH ESTÁ LISTO
================================================================ */
window.addEventListener("cab-auth-ready", () => {
  console.log("CORE.JS: Auth listo → Namespace activo:", window.CAB_NS);
});

/* ===============================================================
   2) NAMESPACE HELPERS
================================================================ */
function nsKey(k) {
  if (!window.CAB_NS) {
    console.warn("CORE.JS: CAB_NS aún no definido al pedir clave:", k);
    return k;
  }
  return window.CAB_NS + k;
}

function nsGet(k) {
  try { return localStorage.getItem(nsKey(k)); }
  catch { return null; }
}

function nsSet(k, v) {
  try { localStorage.setItem(nsKey(k), v); } catch {}
}

function nsDel(k) {
  try { localStorage.removeItem(nsKey(k)); } catch {}
}

/* ===============================================================
   3) KEYS
================================================================ */
const EVENT_KEY   = "eventInfo";
const PLAYERS_KEY = "players";
const REPORT_KEY  = "postpartido";
const HISTORY_KEY = "postpartido_hist";

/* ===============================================================
   4) EVENT INFO
================================================================ */
function getEmptyEventInfo() {
  return {
    categoria: "",
    nFecha:    "",
    fecha:     "",   // DD/MM/YYYY
    fechaISO:  "",   // YYYY-MM-DD
    hora:      "",
    rival:     "",
    condicion: "",
    predio:    "",
    formacion: ""
  };
}

function loadEventInfo() {
  try {
    const raw = nsGet(EVENT_KEY);
    if (!raw) return getEmptyEventInfo();
    const obj = JSON.parse(raw);

    if (obj.fecha && !obj.fechaISO) {
      const [d, m, y] = obj.fecha.split("/");
      obj.fechaISO = `${y}-${m}-${d}`;
    }
    if (obj.fechaISO && !obj.fecha) {
      const [y, m, d] = obj.fechaISO.split("-");
      obj.fecha = `${d}/${m}/${y}`;
    }

    return Object.assign(getEmptyEventInfo(), obj);
  } catch {
    return getEmptyEventInfo();
  }
}

function saveEventInfo(info) {
  try {
    nsSet(EVENT_KEY, JSON.stringify(info));
  } catch (e) {
    console.error("CORE.JS ERROR guardando evento:", e);
  }
}

/* ===============================================================
   5) PLAYERS
================================================================ */
function loadPlayers() {
  try {
    const raw = nsGet(PLAYERS_KEY);
    if (!raw) return [];
    const arr = JSON.parse(raw);
    return Array.isArray(arr) ? arr : [];
  } catch {
    return [];
  }
}

function savePlayers(arr) {
  try {
    nsSet(PLAYERS_KEY, JSON.stringify(arr || []));
  } catch (e) {
    console.error("CORE.JS ERROR guardando players:", e);
  }
}

/* ===============================================================
   6) REPORTE POST-PARTIDO
================================================================ */
function loadReporte() {
  try {
    const raw = nsGet(REPORT_KEY);
    if (!raw) return null;
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

function saveReporte(obj) {
  try {
    nsSet(REPORT_KEY, JSON.stringify(obj));
  } catch (e) {
    console.error("CORE.JS ERROR guardando reporte:", e);
  }
}

/* ===============================================================
   7) HISTORIAL DE REPORTES
================================================================ */
function loadHistorial() {
  try {
    const raw = nsGet(HISTORY_KEY);
    if (!raw) return [];
    const arr = JSON.parse(raw);
    return Array.isArray(arr) ? arr : [];
  } catch {
    return [];
  }
}

function saveHistorial(list) {
  try {
    nsSet(HISTORY_KEY, JSON.stringify(list || []));
  } catch (e) {
    console.error("CORE.JS ERROR guardando historial:", e);
  }
}

/* ===============================================================
   8) UTILIDADES
================================================================ */
function formatFechaISOtoDisplay(iso) {
  if (!iso) return "";
  const [y, m, d] = iso.split("-");
  return `${d}/${m}/${y}`;
}

function formatFechaDisplayToISO(disp) {
  if (!disp) return "";
  const [d, m, y] = disp.split("/");
  return `${y}-${m}-${d}`;
}

function uuid() {
  return crypto.randomUUID();
}

/* ===============================================================
   9) EXPOSE GLOBAL
================================================================ */
window.CAB_CORE = {
  EVENT_KEY, PLAYERS_KEY, REPORT_KEY, HISTORY_KEY,
  nsGet, nsSet, nsDel,
  loadEventInfo,  saveEventInfo,
  loadPlayers,    savePlayers,
  loadReporte,    saveReporte,
  loadHistorial,  saveHistorial,
  uuid,
  formatFechaISOtoDisplay,
  formatFechaDisplayToISO,
};

console.log("CORE.JS cargado correctamente.");