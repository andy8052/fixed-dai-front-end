import React from 'react'
import Typography from '@material-ui/core/Typography'

import { useMatcher } from '../hooks'

export default function Home() {
  const matcher = useMatcher()

  return <Typography color={'primary'}>Welcome to home page!</Typography>
}
