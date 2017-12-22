module.exports = function fetchDocument (url) {
  return window.fetch(url, {
    'mode': 'no-cors'
  })
    .then(res => res.text())
    .then(str => (new window.DOMParser()).parseFromString(str, 'text/html'))
}
