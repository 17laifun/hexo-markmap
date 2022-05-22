const mainTemplate = ({ pjaxEnable, katexEnable }) => `
<script src="https://cdn.jsdelivr.net/npm/d3@6"></script>
<script src="https://cdn.jsdelivr.net/npm/markmap-view@0.2.7"></script>
${katexEnable ? `<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/katex@0.12.0/dist/katex.min.css">
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/prismjs@1.25.0/themes/prism.css">`: ""}
<style>
.markmap-container{
  display:flex;
  justify-content:center;
  margin:0 auto;
  width:90%;
  height:500px
}
.markmap-container svg{
  width:100%;height:100%
}
@media(max-width:768px){
  .markmap-container{
    height:400px
  }
}</style>
<script>
function initMarkMap(){
  document.querySelectorAll('.markmap-container>svg').forEach(el =>{
    markmap.Markmap.create(el, null, JSON.parse(el.getAttribute('data')))
  })
};
initMarkMap();
${pjaxEnable ? 'document.addEventListener("pjax:complete",initMarkMap)' : ''}
</script>`

const containerTemplate = (svgData, { height }) => `
<div class="markmap-container" style="height:${height}">
  <svg data="${escapeData(JSON.stringify(svgData))}"></svg>
</div>
`

function escapeData(s) {
  return !s ? "" : s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/\'/g, "&#39;")
    .replace(/\"/g, "&quot;")
}

const afterRender = (content, html) => {
  // ref: https://blog.hvnobug.com/post/hexo-script#after_render
  if (!/<\/body>/gi.test(content) || !/<div class="[^"]*?markmap[^"]*?"/gi.test(content)) return content;
  const lastIndex = content.lastIndexOf('</body>');
  return content.substring(0, lastIndex) + html + content.substring(lastIndex, content.length);
}

module.exports = { mainTemplate, containerTemplate, afterRender }