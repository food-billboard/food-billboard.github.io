!(function() {
  class LazyIframe extends HTMLElement {
    constructor() {
      super();
    }

    button 
    show = false 

    render() {

      const template = document.createElement('template')
      template.innerHTML = `
        <button>点击查看示例</button>
      `
      const content = template.content.cloneNode(true);
      this.button = content.querySelector('button').addEventListener('click', this.loadIframe.bind(this))
      this.appendChild(content);
    }

    loadIframe() {
      if(this.show) return 
      this.show = true 
      const iframe = document.createElement('iframe')
      iframe.style.cssText = `width: 100%; height: 800px; border: 0px; border-radius: 4px; overflow: hidden;`
      iframe.sandbox = 'allow-modals allow-forms allow-popups allow-scripts allow-same-origin'
      iframe.src = this.getAttribute('src')
      this.appendChild(iframe)
    }

  }
  // window.customElements.define('lazy-iframe', LazyIframe);

  const indexLoaded = {

  }

  function loadIframe(index, e) {
    if(indexLoaded[index]) return 
    const target = e.target 
    if(!target) return 
    const src = target.getAttribute('src')
    if(!src) return 
    indexLoaded[index] = true 
    const iframe = document.createElement('iframe')
    iframe.style.cssText = `width: 100%; height: 800px; border: 0px; border-radius: 4px; overflow: hidden;`
    iframe.sandbox = 'allow-modals allow-forms allow-popups allow-scripts allow-same-origin'
    iframe.src = src 
    const parent = target.parentNode
    if(parent.lastChild === target) {
      parent.appendChild(iframe)
    }else {
      parent.insertBefore(iframe, target)
    }
  }

  const buttons = document.querySelectorAll(".iframe-viewer-button")

  buttons.forEach((button, index) => {
    button.style.cssText = `text-align:center;font-weight:bold;cursor:pointer;`
    button.addEventListener('click', loadIframe.bind(null, index))
  })

})();