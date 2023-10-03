import React from 'react'
import ProfileCard from '../../components/profile/profileCard'
import { barber } from '../../dummy-data/barbers'
import { Box } from '@gluestack-ui/themed'

export default function Profile() {
  return (
    <Box flex={1} bg={"$primary100"}>
        <ProfileCard data={barber} />

    </Box>
  )
}
