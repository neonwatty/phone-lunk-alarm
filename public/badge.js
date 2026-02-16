;(function () {
  var s = document.currentScript
  var gym = s.getAttribute('data-gym') || ''
  var theme = s.getAttribute('data-theme') || 'dark'
  var style = s.getAttribute('data-style') || 'horizontal'
  var f = document.createElement('iframe')
  f.src = 'https://phone-lunk.app/badge/' + gym + '?theme=' + theme + '&style=' + style
  f.style.border = 'none'
  f.style.overflow = 'hidden'
  f.width = style === 'vertical' ? '120' : '240'
  f.height = style === 'vertical' ? '140' : '60'
  s.parentNode.insertBefore(f, s)
})()
