import IconDownload from '../Icon/IconDownload'
import IconEye from '../Icon/IconEye'
import IconFile from '../Icon/IconFile'
import IconPencil from '../Icon/IconPencil'
import IconPhone from '../Icon/IconPhone'
import IconPlus from '../Icon/IconPlus'
import IconRefresh from '../Icon/IconRefresh'
import IconSave from '../Icon/IconSave'
import IconSearch from '../Icon/IconSearch'
import IconTrashLines from '../Icon/IconTrashLines'
import IconX from '../Icon/IconX'
import IconCircleCheck from '../Icon/IconCircleCheck'
import IconMenuAuthentication from '../Icon/Menu/IconMenuAuthentication'
import IconMenuCalendar from '../Icon/Menu/IconMenuCalendar'
import IconMenuCharts from '../Icon/Menu/IconMenuCharts'
import IconMenuChat from '../Icon/Menu/IconMenuChat'
import IconMenuComponents from '../Icon/Menu/IconMenuComponents'
import IconMenuContacts from '../Icon/Menu/IconMenuContacts'
import IconMenuDashboard from '../Icon/Menu/IconMenuDashboard'
import IconMenuDatatables from '../Icon/Menu/IconMenuDatatables'
import IconMenuDocumentation from '../Icon/Menu/IconMenuDocumentation'
import IconMenuDragAndDrop from '../Icon/Menu/IconMenuDragAndDrop'
import IconMenuElements from '../Icon/Menu/IconMenuElements'
import IconMenuFontIcons from '../Icon/Menu/IconMenuFontIcons'
import IconMenuForms from '../Icon/Menu/IconMenuForms'
import IconMenuInvoice from '../Icon/Menu/IconMenuInvoice'
import IconMenuMailbox from '../Icon/Menu/IconMenuMailbox'
import IconMenuNotes from '../Icon/Menu/IconMenuNotes'
import IconMenuPages from '../Icon/Menu/IconMenuPages'
import IconMenuTables from '../Icon/Menu/IconMenuTables'
import IconMenuTodo from '../Icon/Menu/IconMenuTodo'
import IconMenuUsers from '../Icon/Menu/IconMenuUsers'
import IconMenuWidgets from '../Icon/Menu/IconMenuWidgets'

export const menuIconMap: Record<string, any> = {
  /* ================= DASHBOARD ================= */
  home: IconMenuDashboard,
  dashboard: IconMenuDashboard,
  analytics: IconMenuDashboard,
  monitor: IconMenuDashboard,

  /* ================= ACTIONS ================= */
  create: IconMenuDashboard,
  plus: IconMenuDashboard,
  new: IconMenuDashboard,

  edit: IconPencil,
  update: IconPencil,

  delete: IconTrashLines,
  delete_outline: IconTrashLines,
  remove: IconTrashLines,
  trash: IconTrashLines,

  view: IconEye,
  visibility: IconEye,
  preview: IconEye,

  search: IconSearch,
  find: IconSearch,

  refresh: IconRefresh,
  reload: IconRefresh,
  add: IconPlus,

  cancel: IconX,
  close: IconX,
  gavel: IconMenuTodo,
  check: IconCircleCheck,
  done: IconCircleCheck,

  save: IconSave,
  download: IconDownload,
  upload: IconMenuElements, // si no existe IconUpload

  /* ================= USERS ================= */
  person: IconMenuUsers,
  people: IconMenuUsers,
  group: IconMenuUsers,
  manage_accounts: IconMenuUsers,
  admin_panel_settings: IconMenuUsers,
  account_circle: IconMenuUsers,
  supervisor_account: IconMenuUsers,
  profile: IconMenuUsers,
  user: IconMenuUsers,

  /* ================= CONFIG / PARAMS ================= */
  tune: IconMenuForms,
  settings: IconMenuForms,
  build: IconMenuForms,
  construction: IconMenuForms,
  engineering: IconMenuForms,

  /* ================= MODULES ================= */
  widgets: IconMenuComponents,
  extension: IconMenuComponents,
  view_module: IconMenuComponents,
  apps: IconMenuComponents,
  category: IconMenuComponents,

  /* ================= SECURITY ================= */
  verified_user: IconMenuAuthentication,
  security: IconMenuAuthentication,
  lock: IconMenuAuthentication,
  vpn_key: IconMenuAuthentication,
  shield: IconMenuAuthentication,
  password: IconMenuAuthentication,
  login: IconMenuAuthentication,
  logout: IconMenuAuthentication,

  /* ================= TABLES ================= */
  table_chart: IconMenuTables,
  table_rows: IconMenuTables,
  view_list: IconMenuTables,

  /* ================= DATA TABLES ================= */
  grid_on: IconMenuDatatables,
  dataset: IconMenuDatatables,
  storage: IconMenuDatatables,

  /* ================= FORMS ================= */
  description: IconMenuForms,
  assignment: IconMenuForms,
  feed: IconMenuForms,
  request_page: IconMenuForms,
  form: IconMenuForms,
  badge: IconFile,

  /* ================= CHAT ================= */
  chat: IconMenuChat,
  forum: IconMenuChat,
  message: IconMenuChat,

  /* ================= MAIL ================= */
  mail: IconMenuMailbox,
  email: IconMenuMailbox,
  draft: IconMenuMailbox,
  send: IconMenuMailbox,

  /* ================= TASKS ================= */
  checklist: IconMenuTodo,
  task: IconMenuTodo,
  rule: IconMenuTodo,

  /* ================= NOTES ================= */
  note: IconMenuNotes,
  notes: IconMenuNotes,
  sticky_note_2: IconMenuNotes,

  /* ================= CONTACTS ================= */
  contacts: IconMenuContacts,
  contact_page: IconMenuContacts,
  call: IconMenuContacts,
  phone: IconPhone,
  mobile: IconMenuContacts,

  /* ================= CALENDAR ================= */
  calendar_today: IconMenuCalendar,
  event: IconMenuCalendar,
  schedule: IconMenuCalendar,

  /* ================= INVOICE ================= */
  receipt: IconMenuInvoice,
  request_quote: IconMenuInvoice,
  invoice: IconMenuInvoice,
  payments: IconMenuInvoice,

  /* ================= CHARTS ================= */
  bar_chart: IconMenuCharts,
  pie_chart: IconMenuCharts,
  show_chart: IconMenuCharts,
  timeline: IconMenuCharts,

  /* ================= PAGES ================= */
  pages: IconMenuPages,
  article: IconMenuPages,
  feed_page: IconMenuPages,

  /* ================= DOCS ================= */
  help: IconMenuDocumentation,
  description_outlined: IconMenuDocumentation,
  support: IconMenuDocumentation,

  /* ================= ICONS ================= */
  emoji_symbols: IconMenuFontIcons,
  insert_emoticon: IconMenuFontIcons,

  /* ================= DRAG & DROP ================= */
  drag_indicator: IconMenuDragAndDrop,
  open_with: IconMenuDragAndDrop,

  /* ================= WIDGETS ================= */
  dashboard_customize: IconMenuWidgets,
  view_quilt: IconMenuWidgets,

  /* ================= MEDIA ================= */
  image: IconMenuElements,
  photo: IconMenuElements,
  camera: IconMenuElements,
  upload_file: IconMenuElements,
  download_file: IconMenuElements,

  /* ================= FALLBACK ================= */
  default: IconMenuElements,
}
