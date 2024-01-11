import { Pressable, Text } from '@gluestack-ui/themed'
import { Box, HStack, Icon } from '@gluestack-ui/themed'
import { ArrowRight } from 'lucide-react-native'
import { ArrowLeft } from 'lucide-react-native'
import moment from 'moment'
import { useEffect, useState } from 'react'

interface Props {
    handlePrevWeek: () => void;
    handleNextWeek: () => void;
    startOfWeek:moment.Moment;
    endOfWeek:moment.Moment;
}


export default function WeekPicker({ handlePrevWeek, handleNextWeek, startOfWeek, endOfWeek }: Props) {
    
    const [showNextArrow, setShowNextArrow] = useState<boolean>(false)



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
