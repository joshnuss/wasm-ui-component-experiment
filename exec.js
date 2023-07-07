import fs from 'fs'
import { JSDOM } from 'jsdom'

const dom = new JSDOM(`<html><div id="target"/>`)
const document = dom.window.document
const target = document.querySelector('#target')
let nodes = []

const memory = new WebAssembly.Memory({ initial: 1 })

function readString(offset, length) {
  const bytes = new Uint8Array(memory.buffer, offset, length)
  
  return new TextDecoder("utf8").decode(bytes)
}

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

const bytes = await fs.promises.readFile('./example.wasm')
const module = await WebAssembly.instantiate(bytes, api)
const component = module.instance.exports

component.create()
//console.log({ nodes })

component.mount(target, 0)
console.log(dom.window.document.body.innerHTML)

//component.detach(target, 0)
//console.log(dom.window.document.body.innerHTML)
