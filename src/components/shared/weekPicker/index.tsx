import { Pressable, Text } from '@gluestack-ui/themed'
import { Box, HStack, Icon } from '@gluestack-ui/themed'
import { ArrowRight } from 'lucide-react-native'
import { ArrowLeft } from 'lucide-react-native'
import moment from 'moment'
import { useEffect, useState } from 'react'


export default function WeekPicker() {

    const [startOfWeek, setStartOfWeek] = useState<moment.Moment>(moment().startOf('isoWeek'))
    const [endOfWeek, setEndOfWeek] = useState<moment.Moment>(moment().endOf('week'))
    const [showNextArrow, setShowNextArrow] = useState<boolean>(false)


    const handlePrevWeek = () => {
        setStartOfWeek(startOfWeek.clone().subtract(7, "days"))
        setEndOfWeek(endOfWeek.clone().subtract(7, "days"))

    }
    const handleNextWeek = () => {
        setStartOfWeek(startOfWeek.clone().add(7, "days"))

        setEndOfWeek(endOfWeek.clone().add(7, "days"))
    }
    useEffect(() => {

        if (moment().utc().utcOffset(3, true).isAfter(endOfWeek.clone())) {
            setShowNextArrow(true);

        } else {
            setShowNextArrow(false);

        }
    }, [
        endOfWeek
    ])
    return (
        <Box>
            <HStack justifyContent='space-around'>
                <Box>
                    <Pressable onPress={handlePrevWeek}>
                        <Icon color='$textDark500' as={ArrowLeft} />

                    </Pressable>
                </Box>
                <Box>
                    <Text color='$textDark500'> {startOfWeek.format("DD/MM/yyyy")} - {endOfWeek.format("DD/MM/yyyy")}</Text>
                </Box>
                <Box>
                    {showNextArrow && <Pressable onPress={handleNextWeek}>
                        <Icon color='$textDark500' as={ArrowRight} />

                    </Pressable>}
                </Box>
            </HStack>
        </Box>
    )
}
