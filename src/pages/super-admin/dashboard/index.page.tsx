import Grid from '@mui/material/Grid2'
import React, { useEffect, useState } from 'react'

import PageHeader from '@/components/_ui/pageHeader/PageHeader.component'
import { Page } from '@/types/page.type'
import { Card, CardContent, Typography, Stack, MenuItem, TextField, Box, Skeleton } from '@mui/material'
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, LineChart, Line, Legend } from 'recharts'
import { useGetAverageSubmissionTimesQuery, useLazyGetCardSubmissionAnalyticsQuery } from '@/redux/api/superAdmin.api'

const dummyRevenueData = {
  weekly: [
    { date: 'Jul 1 - Jul 7', grading: 400, cleaning: 100 },
    { date: 'Jul 8 - Jul 14', grading: 600, cleaning: 200 },
    { date: 'Jul 15 - Jul 21', grading: 350, cleaning: 100 },
    { date: 'Jul 22 - Jul 28', grading: 800, cleaning: 250 },
  ],
  monthly: [
    { date: 'Jan 2025', grading: 1200, cleaning: 300 },
    { date: 'Feb 2025', grading: 1000, cleaning: 200 },
    { date: 'Mar 2025', grading: 1350, cleaning: 350 },
  ],
}

const Analytics: Page = () => {
  const [cardTimeRange, setCardTimeRange] = useState<'weekly' | 'monthly'>('weekly')
  const [revenueTimeRange, setRevenueTimeRange] = useState<'weekly' | 'monthly'>('weekly')

  const revenueData = dummyRevenueData[revenueTimeRange]

  const { data, isLoading } = useGetAverageSubmissionTimesQuery()
  const [triggerCardAnalytics, { data: cardData, isLoading: cardDataLoading }] = useLazyGetCardSubmissionAnalyticsQuery()

  useEffect(() => {
    triggerCardAnalytics({
      unit: cardTimeRange === 'weekly' ? 'week' : 'month',
      duration: 6,
    })
  }, [cardTimeRange, triggerCardAnalytics])

  return (
    <>
      <PageHeader title="PSA Submission Analytics" />

      <Stack spacing={4}>
        <Grid container spacing={2}>
          {isLoading
            ? [...Array(4)].map((_, idx) => (
                <Grid key={idx} size={{ xs: 12, md: 3 }}>
                  <Card>
                    <CardContent>
                      <Skeleton variant="text" width="60%" height={30} />
                      <Skeleton variant="text" width="40%" height={45} />
                    </CardContent>
                  </Card>
                </Grid>
              ))
            : data?.result?.map((item) => (
                <Grid size={{ xs: 12, md: 3 }} key={item.key}>
                  <Card sx={{ height: '100%' }}>
                    <CardContent>
                      <Typography variant="h6">{item.label}</Typography>
                      <Typography variant="h3">
                        {item.value}
                        {item.suffix && (
                          <>
                            &nbsp;
                            {item.suffix}
                          </>
                        )}
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
        </Grid>

        {/* 3 & 4: Cards Submitted + Revenue side by side */}
        <Grid container spacing={2}>
          <Grid size={{ xs: 12, md: 12 }}>
            <Card>
              <CardContent>
                <Stack direction="row" justifyContent="space-between" alignItems="center">
                  <Typography variant="h6">Total Cards Submitted : {cardData?.totalCardsSubmittedToPSA}</Typography>
                  <TextField select size="small" value={cardTimeRange} onChange={(e) => setCardTimeRange(e.target.value as 'weekly' | 'monthly')}>
                    <MenuItem value="weekly">Weekly</MenuItem>
                    <MenuItem value="monthly">Monthly</MenuItem>
                  </TextField>
                </Stack>
                {cardDataLoading ? (
                  <Box sx={{ mt: 3 }}>
                    <Skeleton variant="text" width={150} height={30} />
                    <Skeleton variant="rectangular" width="100%" height={300} />
                  </Box>
                ) : (
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={cardData?.result}>
                      <XAxis dataKey="date" />
                      <YAxis />
                      <Tooltip />
                      <Bar dataKey="total" fill="#1976d2" name="Total Cards" />
                    </BarChart>
                  </ResponsiveContainer>
                )}
              </CardContent>
            </Card>
          </Grid>

          {/* <Grid size={{ xs: 12, md: 6 }}>
            <Card>
              <CardContent>
                <Stack direction="row" justifyContent="space-between" alignItems="center">
                  <Typography variant="h6">Revenue Metrics</Typography>
                  <TextField select size="small" value={revenueTimeRange} onChange={(e) => setRevenueTimeRange(e.target.value as 'weekly' | 'monthly')}>
                    <MenuItem value="weekly">Weekly</MenuItem>
                    <MenuItem value="monthly">Monthly</MenuItem>
                  </TextField>
                </Stack>
                <Box sx={{ mt: 2, mb: 2 }}>
                  <Typography>Total Grading Revenue: ${revenueData.reduce((sum, d) => sum + d.grading, 0)}</Typography>
                  <Typography>Total Cleaning Revenue: ${revenueData.reduce((sum, d) => sum + d.cleaning, 0)}</Typography>
                </Box>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={revenueData}>
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line type="monotone" dataKey="grading" stroke="#4caf50" name="Grading Revenue" />
                    <Line type="monotone" dataKey="cleaning" stroke="#f44336" name="Cleaning Revenue" />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </Grid> */}
        </Grid>
      </Stack>
    </>
  )
}

Analytics.layoutProps = {
  title: 'Analytics',
  pageType: 'protected',
  roles: 'superAdmin',
}

export default Analytics
