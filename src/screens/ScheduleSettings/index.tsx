import { CloseIcon, Heading, Modal, ModalBackdrop, ModalBody, ModalCloseButton, ModalFooter, ModalHeader, Text, VStack } from '@gluestack-ui/themed';
import { Box, HStack, Icon } from '@gluestack-ui/themed';
import { ChevronLeftIcon } from 'lucide-react-native';
import React, { useEffect, useState } from 'react'
import { Dimensions, Pressable } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useNavigation, useRoute } from '@react-navigation/native';
import DateTimePicker from '@react-native-community/datetimepicker';
import DatePicker from 'react-native-date-picker';
import moment from 'moment';
import { ModalContent } from '@gluestack-ui/themed';
import BaseButton from '../../components/shared/baseButton';
import LinkButton from '../../components/shared/linkButton';
import { useBarberDisableMutation, useGetBarberDetailQuery } from '../../api/barbersApi';
import { RootState, useAppDispatch, useAppSelector } from '../../store';
import { hideInfoModal, showInfoModal } from '../../store/features/layoutSlice';
import { Switch } from '@gluestack-ui/themed';
import Loader from '../../components/shared/loader';

const { width } = Dimensions.get('window');

export default function ScheduleSettings() {
    const navigation = useNavigation<NativeStackNavigationProp<any>>();
    const route = useRoute()
    const dispatch = useAppDispatch();
    const { barberId } = route.params
    console.log();
    const [barberDisable, { isLoading: isLoadingDisable }] =
        useBarberDisableMutation();
    const { data: barberDetail, isLoading: loadingBarberDetail, fulfilledTimeStamp, refetch } = useGetBarberDetailQuery({ id: barberId });
    const [startDate, setStartDate] = useState<Date>(moment().utc().utcOffset(3, true).add("day", 1).toDate())
    const [endDate, setEndDate] = useState<Date>(moment().utc().utcOffset(3, true).add("day", 2).toDate())
    const [showStartDateModal, setShowStartDateModal] = useState<boolean>(false)
    const [showEndDateModal, setShowEndDateModal] = useState<boolean>(false)
    const [isLoading, setisLoading] = useState<boolean>(false)
    const [isActive, setIsActive] = useState<boolean>(false)
    

    const handleSubmit = async () => {
        setisLoading(true)
        try {
            const response = await barberDisable({
                barber: barberId,
            }).unwrap

            dispatch(
                showInfoModal({
                    title: '¡Estado actualizado!',
                    type: 'success',
                    hasCancel: false,
                    cancelCb: null,
                    hasSubmit: false,
                    submitCb: null,
                    hideOnAnimationEnd: true,
                }),
            );

            navigation.navigate("BarberStatsSelection")
        } catch (error) {

            showInfoModal({
                title: '¡No se pudo actualizar el estado!',
                type: 'error',
                hasCancel: false,
                cancelCb: null,
                hasSubmit: true,
                submitCb: () => dispatch(hideInfoModal()),
                hideOnAnimationEnd: false,
            })
            console.log("Error en deshabilitacion", error);
        } finally {
            setisLoading(false)
        }
    }

    useEffect(()=>{
        if(barberDetail){
            setIsActive(barberDetail.barber[0].isActive)
        }
    },[fulfilledTimeStamp])
    useEffect(() => {
        const unsubscribe = navigation.addListener('focus', async () => {
          refetch();
        });
    
        return unsubscribe;
      }, [navigation]);

    return loadingBarberDetail ? (
        <Loader />
      ) : (
        <>
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
                    <VStack flex={1} justifyContent='space-between'>
                        <Box>
                            <HStack justifyContent="space-between" alignItems="center" p={'$4'}>
                                <Pressable onPress={() => navigation.goBack()}>
                                    <Icon as={ChevronLeftIcon} size={24} color="$textDark500" />
                                </Pressable>
                                <Heading textAlign="center" color="$textDark500">
                                    Estado del barbero
                                </Heading>
                                <Box p="$6"></Box>
                            </HStack>
                            <Box mt={"$10"} p={"$4"} >
                                <HStack space="md" justifyContent='space-between'>
                                    <Text color="$textDark500">Barbero habilitado</Text>
                                    <Switch disabled={isLoadingDisable} value={isActive} onChange={handleSubmit} />
                                </HStack>
                            </Box>
                        </Box>
                    </VStack>
                </Box>
            </LinearGradient>
        </>
    )
}

// interface DatePickerModalProps {
//     show: boolean;
//     onClose: () => void;
//     initialDate: Date;
//     setDateFromProps: (e: Date) => void
// }

// const DatePickerModal = ({ show, onClose, initialDate, setDateFromProps }: DatePickerModalProps) => {
//     const [date, setDate] = useState(initialDate)
//     return (
//         <Modal isOpen={show} onClose={onClose}>
//             <ModalBackdrop />
//             <ModalContent>
//                 <ModalHeader>
//                     <Heading size="lg" color="$textDark900">
//                         Seleccione una fecha
//                     </Heading>
//                     <ModalCloseButton>
//                         <Icon as={CloseIcon} />
//                     </ModalCloseButton>
//                 </ModalHeader>
//                 <ModalBody>
//                     <DatePicker locale="es-ES" minimumDate={initialDate} date={initialDate} mode='date' onDateChange={(e) => setDate(e)} />

//                 </ModalBody>
//                 <ModalFooter>
//                     <HStack space={"lg"}>
//                         <LinkButton color="$primary500" title={"Cancelar"} onPress={() => { }} isLoading={false} disabled={false} />
//                         <BaseButton background={"$primary500"} color="$white" title={"Aceptar"} onPress={() => {
//                             setDateFromProps(date)
//                             onClose()
//                         }} isLoading={false} disabled={false} />

//                     </HStack>
//                 </ModalFooter>
//             </ModalContent>
//         </Modal>
//     )
// }