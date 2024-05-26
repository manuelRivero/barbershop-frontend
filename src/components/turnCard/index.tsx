import {Box, Divider, HStack, Icon, Pressable} from '@gluestack-ui/themed';
import React, {useEffect, useState} from 'react';
import {Event} from '../../types/turns';
import moment, {Moment} from 'moment';
import {
  Briefcase,
  CircleDollarSign,
  Clock2,
  PercentCircle,
  Trash,
  UserCircle,
  MessageSquarePlus,
} from 'lucide-react-native';
import {RootState, useAppDispatch, useAppSelector} from '../../store';
import {deleteTurn, setCompleteTurn} from '../../store/features/turnsSlice';
import {
  useCancelTurnMutation,
  useCompleteTurnMutation,
} from '../../api/turnsApi';
import {hideInfoModal, showInfoModal} from '../../store/features/layoutSlice';
import CustomText from '../shared/text';
import {Alert, Linking, Platform} from 'react-native';
import { useSocket } from '../../context/socketContext';
interface Props {
  event: Event;
}
export default function TurnCard({event}: Props) {
  const dispatch = useAppDispatch();
  const {socket} = useSocket()
  const {user} = useAppSelector((state: RootState) => state.auth);

  const [completeTurnRequest, {isLoading}] = useCompleteTurnMutation();
  const [cancelTurnRequest, {isLoading: isLoadingCancelTurn}] =
    useCancelTurnMutation();
  const [status, setStatus] = useState<string>();

  const handleCancel = async () => {
    dispatch(
      showInfoModal({
        title: '¿Deseas eliminar este turno agendado?',
        type: 'info',
        hasCancel: true,
        cancelCb: () => {
          dispatch(hideInfoModal());
        },
        cancelData: {
          text: 'Cancelar',
          background: '$blueGray200',
        },
        submitCb: async () => {
          try {
            await cancelTurnRequest({id: event._id}).unwrap();
            if (event.user !== null) {
              console.log('entro al if');
              socket?.emit('canceled-turn', {id: event.user?._id});
            }
            dispatch(deleteTurn(event._id));
            dispatch(hideInfoModal());
          } catch (error) {
            console.log('error al cancelar el turno', error);
          }
        },
        submitData: {
          text: 'Eliminar turno',
          background: '$red500',
          hasLoader: true,
        },
        hasSubmit: true,
        hideOnAnimationEnd: false,
      }),
    );
  };

  const handlePhoneRequest = async () => {
    socket?.emit('phone-request', {id: event.user?._id});
    dispatch(
      showInfoModal({
        title: '¡Solicitud de numero enviada!',
        type: 'success',
        hasCancel: false,
        cancelCb: null,
        hasSubmit: false,
        submitCb: null,
        hideOnAnimationEnd: true,
      }),
    );
  };

  const sendWhatsApp = () => {
    let mobile =
      Platform.OS == 'ios' ? `54${event.user?.phone}` : `+54${event.user?.phone}`;
    if (mobile) {
      let url = 'whatsapp://send?phone=' + mobile;
      Linking.openURL(url).then(data => {
        console.log('WhatsApp Opened');
      });
    }
  };
  console.log("event", moment().utc().utcOffset(3, true).isAfter(moment(event.endDate)) )
  useEffect(() => {
    const interval = setInterval(() => {
      if (moment().utc().utcOffset(3, true).isAfter(moment(event.endDate))) {
        setStatus('COMPLETE');
        clearInterval(interval);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const completeTurn = async () => {
      try {
        await completeTurnRequest({id: event._id}).unwrap();

        dispatch(setCompleteTurn(event));
      } catch (error) {
        console.log('error al cambiar el estatus del turno');
      }
    };
    if (status === 'COMPLETE') {
      completeTurn();
    }
  }, [status]);

  return (
    <Box
      padding={'$4'}
      mb={'$4'}
      hardShadow="3"
      bg={status === 'COMPLETE' ? '$green500' : '$white'}
      borderRadius={'$md'}>
      {status !== 'COMPLETE' && (
        <HStack justifyContent="flex-end">
          <Pressable onPress={handleCancel}>
            <Icon as={Trash} color="$red500" />
          </Pressable>
        </HStack>
      )}

      <HStack mb="$1" space="sm" alignItems="center">
        <HStack space="xs" alignItems="center">
          <Icon
            as={Clock2}
            color={status === 'COMPLETE' ? '$white' : '$textDark500'}
          />
          <CustomText
            fontWeight="bold"
            color={
              status === 'COMPLETE' ? '$white' : '$textDark500'
            }>{`${moment(event.startDate).utc().format('hh:mm A')} - ${moment(
            event.endDate,
          )
            .utc()
            .format('hh:mm A')}`}</CustomText>
        </HStack>
      </HStack>
      <HStack mb="$1" space="xs" alignItems="center">
        <Icon
          as={UserCircle}
          color={status === 'COMPLETE' ? '$white' : '$textDark500'}
        />
        <CustomText color={status === 'COMPLETE' ? '$white' : '$textDark500'}>
          Agendado por:{' '}
          <CustomText
            fontWeight="bold"
            color={status === 'COMPLETE' ? '$white' : '$textDark500'}>
            {event.user === null || event.user === undefined
              ? 'Ti'
              : `${event.user.name} ${event.user.lastname}`}
          </CustomText>
        </CustomText>
      </HStack>
      <HStack mb="$1" space="xs" alignItems="center">
        <Icon
          as={Briefcase}
          color={status === 'COMPLETE' ? '$white' : '$textDark500'}
        />
        <CustomText color={status === 'COMPLETE' ? '$white' : '$textDark500'}>
          Servicio:{' '}
          <CustomText
            fontWeight="bold"
            color={
              status === 'COMPLETE' ? '$white' : '$textDark500'
            }>{`${event.name}`}</CustomText>
        </CustomText>
      </HStack>
      <HStack space="lg" alignItems="center">
        <HStack space="xs" alignItems="center">
          <Icon
            as={CircleDollarSign}
            color={status === 'COMPLETE' ? '$white' : '$textDark500'}
          />
          <CustomText
            fontWeight="bold"
            color={status === 'COMPLETE' ? '$white' : '$textDark500'}>
            {event.price}
          </CustomText>
        </HStack>
        <HStack space="xs" alignItems="center">
          <Icon
            as={PercentCircle}
            color={status === 'COMPLETE' ? '$white' : '$textDark500'}
          />
          <CustomText
            fontWeight="bold"
            color={status === 'COMPLETE' ? '$white' : '$textDark500'}>
            {(event.price * (user?.commission ? user.commission : 0)) / 100}
          </CustomText>
        </HStack>
      </HStack>
      {event.user && status !== 'COMPLETE' && (
        <>
          <Divider mt={'$4'} />
          <Pressable
            mt={'$2'}
            onPress={() =>
              event.user?.phone ? sendWhatsApp() : handlePhoneRequest()
            }>
            <HStack justifyContent="center" space="md">
              <Icon
                as={MessageSquarePlus}
                color={status === 'COMPLETE' ? '$white' : '$textDark500'}
              />
              {event.user?.phone ? (
                <CustomText
                  color={status === 'COMPLETE' ? '$white' : '$textDark500'}>
                  Enviar mensaje por Whatsapp
                </CustomText>
              ) : (
                <CustomText
                  color={status === 'COMPLETE' ? '$white' : '$textDark500'}>
                  Solicitar al cliente un numero de Whatsapp
                </CustomText>
              )}
            </HStack>
          </Pressable>
        </>
      )}
    </Box>
  );
}
