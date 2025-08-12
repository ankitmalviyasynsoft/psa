import Image from 'next/image'
import { Button, Stack, Typography } from '@mui/material'

import { style } from './OrderStatus.style'
import { OrderStatusUIProps } from './OrderStatusUI.type'

const OrderStatusUI: React.FC<OrderStatusUIProps> = ({ imageSrc, title, description, orderDetails }) => {
  return (
    <Stack sx={style.cardStyle}>
      <Image src={imageSrc} alt={title} width={70} height={70} />
      <Typography variant="h5">{title}</Typography>
      {description && <Typography variant="body1">{description}</Typography>}
      {orderDetails && (
        <>
          <Typography variant="body1">Total Amount: {orderDetails.totalAmount}</Typography>
          <Typography variant="body1">Your Order Id: {orderDetails.orderId}</Typography>
        </>
      )}
      <Button variant="contained" href="/customer/dashboard">
        Continue to Dashboard
      </Button>
    </Stack>
  )
}

export default OrderStatusUI
