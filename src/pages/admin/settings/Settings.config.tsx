import { TTab } from './Settings.type'
import GeneralSettings from './components/GeneralSettings/GeneralSettings.component'
import PSASettings from './components/PSASettings/PSASettings.component'
import ShippingSettings from './components/ShippingSettings/ShippingSettings.component'
import PaymentSettings from './components/PaymentSettings/PaymentSettings.component'
import StoreSettings from './components/StoreSettings/StoreSetting.component'

export const TABS: TTab[] = [
  { id: 'general-settings', label: 'General Setting', content: <GeneralSettings /> },
  { id: 'psa-settings', label: 'PSA Setting', content: <PSASettings /> },
  { id: 'shipping-settings', label: 'Shipping Setting', content: <ShippingSettings /> },
  { id: 'payment-settings', label: 'Payment Setting', content: <PaymentSettings /> },
  { id: 'store-settings', label: 'Store Setting', content: <StoreSettings /> },
]
