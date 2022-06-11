const scrollSpeedToShowNavDown = 100
const hideFloatingNavDownTimeoutMs = 3000
let hideNavDownTimeout
let lastViewTop = window.visualViewport.pageTop
const gSettings = {
  navDownFloatingEnabled: undefined
}

function hideFloatingNavDown (nav) {
  nav.classList.remove('popup-visible')
  nav.classList.add('fadeout-hidden')
}

function initNavDown (navDownFloatingEnabled) {
  const navDown = document.getElementById('nav-down')
  const navDownFloating = document.getElementById('nav-down-floating')
  if (!navDown || !navDownFloating) {
    /* We need to render the navs when they are loaded, but even before the
     * whole document finished loading */
    setTimeout(() => initNavDown(navDownFloatingEnabled), 100)
    return
  }
  navDown.style = 'display:block'
  navDown.innerHTML =
    '[ <a href="javascript:window.scrollTo(0, document.body.scrollHeight)">' +
    navDown.attributes.text.value +
    '</a> ]'
  if (!navDownFloatingEnabled) return
  navDownFloating.classList.add('fadeout-hidden')
  navDownFloating.style = 'display:block'
  navDownFloating.innerHTML =
    '[ <a href="javascript:window.scrollTo(0, document.body.scrollHeight)">' +
    navDownFloating.attributes.text.value +
    '</a> ]'
  window.addEventListener('load', function () {
    window.addEventListener('scroll', navDownScrollHandler)
  })
}

function navDownScrollHandler () {
  const body = document.body
  const html = document.documentElement
  // Thanks to https://stackoverflow.com/a/1147768
  const pageHeight = Math.max(
    body.scrollHeight,
    body.offsetHeight,
    html.clientHeight,
    html.scrollHeight,
    html.offsetHeight)
  const viewTop = window.visualViewport.pageTop
  const viewHeight = window.visualViewport.height
  const viewBottom = viewTop + viewHeight
  const debug = false
  if (debug) {
    console.log(
      `viewTop=${viewTop}, viewBottom=${viewBottom}, ` +
      `viewHeight=${viewHeight}, pageHeight=${pageHeight}`)
  }
  const navDownFloating = document.getElementById('nav-down-floating')
  if (Math.min(viewTop, pageHeight - viewBottom) > viewHeight / 2) {
    if (Math.abs(lastViewTop - viewTop) >= scrollSpeedToShowNavDown) {
      navDownFloating.classList.remove('fadeout-hidden')
      navDownFloating.classList.add('popup-visible')
      clearTimeout(hideNavDownTimeout)
      hideNavDownTimeout = setTimeout(
        () => hideFloatingNavDown(navDownFloating),
        hideFloatingNavDownTimeoutMs)
    }
  } else {
    clearTimeout(hideNavDownTimeout)
    hideFloatingNavDown(navDownFloating)
  }
  lastViewTop = viewTop
}

function settingsEnableNavDownFloating () {
  gSettings.navDownFloatingEnabled = true
  localStorage.removeItem('floatingNavDownDisabled')
  renderNavDownFloatingControls(gSettings.navDownFloatingEnabled)
  console.log('floatingNavDownDisabled: true')
}

function settingsDisableNavDownFloating () {
  gSettings.navDownFloatingEnabled = false
  localStorage.setItem('floatingNavDownDisabled', true)
  renderNavDownFloatingControls(gSettings.navDownFloatingEnabled)
  console.log('floatingNavDownDisabled: false')
}

function renderNavDownFloatingControls (enabled) {
  const settingsTexts = document.getElementById('settings-texts').attributes
  const textEnable = settingsTexts.textenable.value
  const textEnabled = settingsTexts.textenabled.value
  const textDisable = settingsTexts.textdisable.value
  const textDisabled = settingsTexts.textdisabled.value
  const settingsNavDownFloating = document.getElementById('settings-section-nav-floating')
  const textTitle = settingsNavDownFloating.attributes.title.value
  settingsNavDownFloating.innerHTML = `<h2>${textTitle}</h2>`
  if (enabled) {
    settingsNavDownFloating.innerHTML +=
      `${textEnabled} | ` +
      // Using function.name to satisfy linter, because otherwise function will be unused
      `<a href="javascript:${settingsDisableNavDownFloating.name}()">${textDisable}</a>`
  } else {
    settingsNavDownFloating.innerHTML +=
      // Using function.name to satisfy linter, because otherwise function will be unused
      `<a href="javascript:${settingsEnableNavDownFloating.name}()">${textEnable}</a> | ` +
      `${textDisabled}`
  }
}

function renderSettings (gSettings) {
  renderNavDownFloatingControls(gSettings.navDownFloatingEnabled)
}

const floatingNavDownDisabled = localStorage.getItem('floatingNavDownDisabled')
console.log(`floatingNavDownDisabled: ${floatingNavDownDisabled}`)
gSettings.navDownFloatingEnabled = floatingNavDownDisabled !== 'true'
initNavDown(gSettings.navDownFloatingEnabled)
if (window.location.pathname === '/settings') {
  window.addEventListener('load', () => renderSettings(gSettings))
}
