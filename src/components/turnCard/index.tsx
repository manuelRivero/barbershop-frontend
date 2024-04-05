import {
  AvatarGroup,
  AvatarImage,
  Box,
  HStack,
  Icon,
  Text,
  Avatar,
  Pressable,
} from '@gluestack-ui/themed';
import React, { useEffect, useState } from 'react';
import { Event } from '../../types/turns';
import moment, { Moment } from 'moment';
import { Briefcase, CircleDollarSign, Clock2, PercentCircle, Trash, UserCircle } from 'lucide-react-native';
import { RootState, useAppDispatch, useAppSelector } from '../../store';
import { deleteTurn, setCompleteTurn } from '../../store/features/turnsSlice';
import { User } from '../../types/user';
import { useCancelTurnMutation, useCompleteTurnMutation } from '../../api/turnsApi';
import { hideInfoModal, showInfoModal } from '../../store/features/layoutSlice';
import socket from '../../socket';
import CustomText from '../shared/text';
interface Props {
  event: Event;
}
export default function TurnCard({ event }: Props) {
  const dispatch = useAppDispatch();
  const { user } = useAppSelector((state: RootState) => state.auth);

  const [completeTurnRequest, { isLoading }] = useCompleteTurnMutation()
  const [cancelTurnRequest, { isLoading: isLoadingCancelTurn }] = useCancelTurnMutation()
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
            await cancelTurnRequest({ id: event._id }).unwrap()
            if (event.user !== null) {
              console.log("entro al if")
              socket?.emit('cancel-turn', { id: event.user?._id });
            }
            dispatch(deleteTurn(event._id))
            dispatch(hideInfoModal())
          } catch (error) {
            console.log("error al cancelar el turno", error)
          }
        },
        submitData: {
          text: 'Eliminar turno',
          background: '$red500',
          hasLoader: true
        },
        hasSubmit: true,
        hideOnAnimationEnd: false,
      }),
    );

  }
  useEffect(() => {
    
    const interval = setInterval(() => {
      if (
        moment()
          .utc()
          .utcOffset(3, true)
          .isAfter(moment(event.endDate))
      ) {
        setStatus('COMPLETE');
        clearInterval(interval)
      }
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const completeTurn = async () => {
      try {
        await completeTurnRequest({ id: event._id }).unwrap()

        dispatch(setCompleteTurn(event));

      } catch (error) {
        console.log("error al cambiar el estatus del turno")
      }
    }
    if (status === "COMPLETE") {
      completeTurn()
    }

  }, [status]);

  return (
    <Box
      padding={'$4'}
      mb={'$4'}
      hardShadow="3"
      bg={status === 'COMPLETE' ? '$green500' : '$white'}
      borderRadius={'$md'}>
      {status !== 'COMPLETE' &&
        (<HStack justifyContent='flex-end'>
          <Pressable onPress={handleCancel}>
            <Icon as={Trash} color="$red500" />
          </Pressable>
        </HStack>)}


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
            {event.user === null ? "Ti" : `${event.user.name} ${event.user.lastname}`}
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

            {event.price * (user?.commission ? user.commission : 0) / 100}
          </CustomText>
        </HStack>
      </HStack>
    </Box>
  );
}
