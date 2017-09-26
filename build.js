const https = require('http')
const fs = require('fs-extra')

fs.emptyDirSync('./gifts')

function htmlTemplate (item) {
  return `<!DOCTYPE html><html><head><title>${item.title.rendered}</title></head><body></body></html>`
}

function createFiles (data) {
  data.forEach((item, index, arra) => {
    let fileName = `gifts/${item.slug}.html`
    let stream = fs.createWriteStream(fileName)

    stream.once('open', (fd) => {
      let html = htmlTemplate(item)
      stream.end(html)
    })
  })
}

https.get('http://giftguides.dev/wp-json/wp/v2/holiday-2016?per_page=100', (res) => {
  const { statusCode } = res

  if (statusCode !== 200) {
    console.log(statusCode)
    console.log('failburger')
    return
  }

  res.setEncoding('utf8')
  let rawData = ''
  res.on('data', (chunk) => { rawData += chunk })
  res.on('end', () => {
    try {
      const parsedData = JSON.parse(rawData)
      createFiles(parsedData)
    } catch (e) {
      console.error(e.message)
    }
  })
})
