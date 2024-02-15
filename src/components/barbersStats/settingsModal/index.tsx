import React from 'react'
import { Box, Modal, ModalCloseButton, ModalHeader } from '@gluestack-ui/themed';
import { ModalContent } from '@gluestack-ui/themed';
import { CloseIcon } from '@gluestack-ui/themed';
import { Pressable } from '@gluestack-ui/themed';
import { Text } from '@gluestack-ui/themed';
import { Icon } from '@gluestack-ui/themed';
import { ModalBackdrop } from '@gluestack-ui/themed';
import { Heading } from '@gluestack-ui/themed';
import { ModalBody } from '@gluestack-ui/themed';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useNavigation } from '@react-navigation/native';

interface Props {
    show: boolean;
    barberId: string;
    onClose: () => void
}

export default function SettingsModal({ show, barberId, onClose }: Props) {
    const navigation = useNavigation<NativeStackNavigationProp<any>>();
    const handleScheduleSettings = () => {
        navigation.navigate("BarberScheduleSettings", { barberId: barberId })
        onClose()
    }
    return (
        <Modal
            isOpen={show}
            onClose={onClose}
        >
            <ModalBackdrop />
            <ModalContent >
                <ModalHeader>
                    <Heading size="lg" color="$textDark900">
                        Configuración
                    </Heading>
                    <ModalCloseButton>
                        <Icon as={CloseIcon} />
                    </ModalCloseButton>
                </ModalHeader>
                <ModalBody>

                    <Pressable onPress={handleScheduleSettings}>
                        <Box
                            softShadow={'2'}
                            mb="$3"
                            p="$4"
                            borderRadius="$lg"
                            bg="$white">
                            <Text color="$textDark900">Configurar estado</Text>
                        </Box>
                    </Pressable>
                </ModalBody>
            </ModalContent>
        </Modal>
    )
}
