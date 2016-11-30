/* eslint-env browser */

export default function elementDatasetPolyfill () {
  if (!document.documentElement.dataset &&
    (
      !Object.getOwnPropertyDescriptor(Element.prototype, 'dataset') ||
      !Object.getOwnPropertyDescriptor(Element.prototype, 'dataset').get
    )
  ) {
    const descriptor = {}

    descriptor.enumerable = true

    descriptor.get = function get () {
      const element = this
      const map = {}
      const attributes = this.attributes

      function toUpperCase (n0) {
        return n0.charAt(1).toUpperCase()
      }

      function getter () {
        return this.value
      }

      function setter (name, value) {
        if (typeof value !== 'undefined') {
          this.setAttribute(name, value)
        } else {
          this.removeAttribute(name)
        }
      }

      for (let i = 0; i < attributes.length; i += 1) {
        const attribute = attributes[i]

        // This test really should allow any XML Name without
        // colons (and non-uppercase for XHTML)

        if (attribute && attribute.name && (/^data-\w[\w-]*$/).test(attribute.name)) {
          const name = attribute.name
          const value = attribute.value

          // Change to CamelCase

          const propName = name.substr(5).replace(/-./g, toUpperCase)

          Object.defineProperty(map, propName, {
            enumerable: this.enumerable,
            get: getter.bind({ value: value || '' }),
            set: setter.bind(element, name)
          })
        }
      }
      return map
    }

    Object.defineProperty(Element.prototype, 'dataset', descriptor)
  }
}
