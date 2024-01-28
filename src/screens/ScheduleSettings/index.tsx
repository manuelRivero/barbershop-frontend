import { Heading, Text } from '@gluestack-ui/themed';
import { Box, HStack, Icon } from '@gluestack-ui/themed';
import { ChevronLeftIcon } from 'lucide-react-native';
import React from 'react'
import { Dimensions, Pressable } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useNavigation } from '@react-navigation/native';
const { width } = Dimensions.get('window');

export default function ScheduleSettings() {
    const navigation = useNavigation<NativeStackNavigationProp<any>>();

    return (
        <LinearGradient
            style={{ flex: 1 }}
            colors={['#fff', '#f1e2ca']}
            start={{ x: 0, y: 0.6 }}
            end={{ x: 0, y: 1 }}>
            <Box flex={1} position='relative'>
                <Box
                    borderRadius={9999}
                    w={width * 3}
                    h={width * 3}
                    position="absolute"
                    bg="#f1e2ca"
                    overflow="hidden"
                    top={-width * 2.75}
                    left={-width}
                    opacity={0.5}
                />
                <HStack justifyContent="space-between" alignItems="center" p={'$4'}>
                    <Pressable onPress={() => navigation.goBack()} p={'$4'}>
                        <Icon as={ChevronLeftIcon} size={24} color="$textDark500" />
                    </Pressable>
                    <Heading textAlign="center" color="$textDark500">
                        Configuración de horario
                    </Heading>
                    <Box p="$6"></Box>
                </HStack>
                <Box mt="$10" p="$4">
                    <Text color="$textDark500">La configuración de horario se hara efectiva para el inicio del día de mañana.</Text>
                </Box>
                <Box mt={"$4"}>
                    
                </Box>
            </Box>
        </LinearGradient>
    )
}
