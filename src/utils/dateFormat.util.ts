import moment from 'moment'

export const formatDate = (date: string) => {
  if (moment(date, moment.ISO_8601, true).isValid()) {
    return moment(date).format('DD-MM-YYYY')
  } else {
    return 'N/A'
  }
}
