import Fastify from 'fastify'
import fs from 'fs'

const app = new Fastify()
const assembly = await fs.promises.readFile('./example.wasm')

app.get('/example.wasm', (req, res) => {
  res.type('application/wasm').send(assembly)
})

app.get('/', (req, res) => {
  res.type('text/html').send(`
    <html>
      <body>
        <div id="target"></div>

        <script type="module">
          function readString(offset, length) {
            const bytes = new Uint8Array(memory.buffer, offset, length)
            
            return new TextDecoder("utf8").decode(bytes)
          }
          const target = document.querySelector('#target')
          const nodes = []
          const memory = new WebAssembly.Memory({ initial: 1 })
          const api = {
            js: {
              mem: memory
            },
            nodes: {
              createElement(offset, length) {
                const name = readString(offset, length)

                nodes.push(document.createElement(name))
              },

              createTextNode(offset, length) {
                const text = readString(offset, length)

                nodes.push(document.createTextNode(text))
              },

              appendChild(rootIndex, index) {
                const child = nodes[index]
                let parent

                if (rootIndex == -1) {
                  parent = target
                } else {
                  parent = nodes[rootIndex]
                }

                parent.appendChild(child)
              },

              removeChild(rootIndex, index) {
                const child = nodes[index]
                let parent

                if (rootIndex == -1) {
                  parent = target
                } else {
                  parent = nodes[rootIndex]
                }

                parent.removeChild(child)
              },

              setAttribute(index, nameOffset, nameLength, valueOffset, valueLength) {
                const name = readString(nameOffset, nameLength)
                const value = readString(valueOffset, valueLength)
                const node = nodes[index]

                node.setAttribute(name, value)

                return node
              },

              addEventListener(offset, length, functionIndex) {
                const text = readString(offset, length)

                return { type: 'text', text}
              },
            }
          }
          const module = await WebAssembly.instantiateStreaming(fetch('/example.wasm'), api)
          console.log(module.instance.exports)
          const component = module.instance.exports

          component.create()
          console.log({ nodes })

          component.mount(target, 0)
          console.log(target.innerHTML)

          //component.detach(target, 0)
          //console.log(document.body.innerHTML)
        </script>
      </body>
    </html>
  `)
})

app.listen(3000)
