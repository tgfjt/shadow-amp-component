var Nanocomponent = require('nanocomponent')
var html = require('bel')

var fetchDocument = require('./fetch-document')
var ampReady = require('./amp-ready')

class ShadowAMPComponent extends Nanocomponent {
  constructor (opts) {
    super()
    if (!window.AMP_SHADOW) {
      window.AMP_SHADOW = true
      this.install('https://cdn.ampproject.org/shadow-v0.js')
    }

    this.src = ''
    this.host = null
    this.ampedDoc = null
  }

  install (src) {
    var el = document.createElement('script')
    el.setAttribute('src', src)
    document.head.appendChild(el)
  }

  createElement (src) {
    this.src = src
    this.clear()

    // to remove shadow root
    this.host = html`<div></div>`

    return html`<div>${this.host}</div>`
  }

  update (src) {
    return this.src !== src
  }

  load (el) {
    this.loadAMPDocument(el)
  }

  afterupdate (el) {
    this.loadAMPDocument(el)
  }

  afterreorder (el) {
    this.loadAMPDocument(el)
  }

  unload () {
    this.ampedDoc.close()
  }

  setDoc (ampedDoc) {
    this.ampedDoc = ampedDoc
  }

  clear () {
    if (this.ampedDoc) {
      this.ampedDoc.close()
      this.ampedDoc = null
    }
    if (this.host) {
      this.host.parentNode.removeChild(this.host)
      this.host = null
    }
  }

  loadAMPDocument (el) {
    var src = this.src
    var host = this.host
    var setDoc = this.setDoc.bind(this)

    fetchDocument(src).then(function (doc) {
      ampReady(function (AMP) {
        setDoc(AMP.attachShadowDoc(host, doc, src))
      })
    })
  }
}

module.exports = ShadowAMPComponent
