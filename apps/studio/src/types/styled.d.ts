import 'styled-components'
import { OurSynthTheme } from '@/styles/theme'

declare module 'styled-components' {
  export interface DefaultTheme extends OurSynthTheme {}
}
