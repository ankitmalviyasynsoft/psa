import { TMenuOption } from '@/types/MenuOption.type'

export type TTab = Omit<TMenuOption, 'children'> & {
  id: TTabId
  content: JSX.Element
}

export type TTabId = 'general-settings' | 'psa-settings' | 'shipping-settings' | 'payment-settings' | 'store-settings'
