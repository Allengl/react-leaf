import * as React from 'react'
declare module 'react' {
  interface HTMLAttributes<T> extends AriaAttributes, DOMAttributes<T> {
    left?: string
    flex?: boolean
    truncate?: boolean
    absolute?: boolean
    relative?: boolean
    text?: string
    top?: string
    grid?: boolean
    before?: string
    after?: string
    shadow?: boolean
    w?: string
    h?: string
    bg?: string
    rounded?: string
    fixed?: boolean
    b?: string
    z?: string
    block?: boolean
    'focus:shadow'?: boolean
  }

  interface SVGProps<T> extends SVGAttributes<T>, ClassAttributes<T> {
    w?: string
    h?: string
  }
}
