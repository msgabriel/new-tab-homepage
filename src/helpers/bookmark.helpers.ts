export function getFavicon(u: string, size: string = '32') {
  const regex = /^.+?[^\/:](?=[?\/]|$)/
  const baseUrl = u.match(regex)

  if (!chrome.runtime) {
    return `https://www.google.com/s2/favicons?domain=${baseUrl}&sz=${size}`
  }

  const url = new URL(chrome.runtime.getURL('/_favicon/'))
  url.searchParams.set('pageUrl', u)
  url.searchParams.set('size', size)
  return url.toString()
}

export function getFaviconBrightness(
  faviconUrl: string,
): Promise<'white' | 'black' | 'other'> {
  return new Promise(resolve => {
    const img = new Image()
    img.crossOrigin = 'anonymous'
    img.onload = () => {
      const canvas = document.createElement('canvas')
      const ctx = canvas.getContext('2d')
      if (!ctx) return resolve('other')

      canvas.width = img.width
      canvas.height = img.height
      ctx.drawImage(img, 0, 0)

      try {
        const data = ctx.getImageData(0, 0, canvas.width, canvas.height).data
        let whitePixels = 0
        let blackPixels = 0
        let transparentPixels = 0
        const totalPixels = data.length / 4

        for (let i = 0; i < data.length; i += 4) {
          const r = data[i],
            g = data[i + 1],
            b = data[i + 2],
            a = data[i + 3]
          if (a < 10) transparentPixels++
          else if (r === 255 && g === 255 && b === 255) whitePixels++
          else if (r === 0 && g === 0 && b === 0) blackPixels++
        }

        const nonTransparent = totalPixels - transparentPixels
        if (nonTransparent === 0) return resolve('other')

        if (whitePixels / nonTransparent === 1) return resolve('white')
        if (blackPixels / nonTransparent === 1) return resolve('black')
        return resolve('other')
      } catch {
        resolve('other')
      }
    }
    img.onerror = () => resolve('other')
    img.src = faviconUrl
  })
}
