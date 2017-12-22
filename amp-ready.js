module.exports = function ampReady (next) {
  (window.AMP = window.AMP || []).push(next)
}
