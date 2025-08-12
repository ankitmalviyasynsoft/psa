import { Style } from '@/types'

export const style: Style = {
  root: {},
  title: {
    mb: 3,
  },
  cardStyle: {
    p: 1,
    boxShadow: 3,
    borderRadius: 2,
    minHeight: 350,
  },
  paperStyle: {
    border: '2px dashed #ccc',
    borderRadius: 2,
    minHeight: 300,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    p: 4,
    textAlign: 'center',
    cursor: 'pointer',
  },
}
