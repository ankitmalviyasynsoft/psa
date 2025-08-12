import { IconType } from 'react-icons'
import { Roles } from './Roles.type'

// prettier-ignore
export type TMenuOption = {
  label: string,
  Icon?: IconType,
  roles?: Roles[],
  exludedRoles?: Roles[]
  onClick?: () => void
} & (
    | { link?: never, subMenu: Omit<TMenuOption, 'Icon'>[], target?: never }
    | { link: string, subMenu?: never, target?: '_blank' | '_self' }
  ) & (
    | { roles?: Roles[], exludedRoles?: never }
    | { roles?: never, exludedRoles?: Roles[] }
  )
