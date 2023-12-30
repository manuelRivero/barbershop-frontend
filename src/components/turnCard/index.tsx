import {
  AvatarGroup,
  AvatarImage,
  Box,
  HStack,
  Icon,
  Text,
  Avatar,
} from '@gluestack-ui/themed';
import React, {useEffect, useState} from 'react';
import {Event} from '../../types/turns';
import moment from 'moment';
import {Briefcase, CircleDollarSign, Clock2, User} from 'lucide-react-native';
import {useAppDispatch} from '../../store';
import {setCompleteTurn} from '../../store/features/turnsSlice';
interface Props {
  event: Event;
}
export default function TurnCard({event}: Props) {
  const dispatch = useAppDispatch();
  const [time, setTime] = useState<number | undefined>();
  const [status, setStatus] = useState<string>();

  useEffect(() => {
    const interval = setInterval(() => {
      setTime(
        moment()
          .utc()
          .utcOffset(3, true)
          .diff(moment(event.endDate), 'minutes'),
      );
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (time) {
      if (time >= 0) {
        setStatus('COMPLETE');
        dispatch(setCompleteTurn(event));
      } else {
      }
    }
  }, [time]);

  return (
    <Box
      padding={'$4'}
      mb={'$4'}
      hardShadow="3"
      bg={status === 'COMPLETE' ? '$green500' : '$white'}
      borderRadius={'$md'}>
      <HStack mb="$1" space="sm" alignItems="center">
        <HStack space="xs" alignItems="center">
          <Icon
            as={Clock2}
            color={status === 'COMPLETE' ? '$white' : '$textDark500'}
          />
          <Text
            fontWeight="bold"
            color={
              status === 'COMPLETE' ? '$white' : '$textDark500'
            }>{`${moment(event.startDate).utc().format('hh:mm A')} - ${moment(
            event.endDate,
          )
            .utc()
            .format('hh:mm A')}`}</Text>
        </HStack>
       
      </HStack>
      <HStack space="xs">
      <Icon
          as={User}
          color={status === 'COMPLETE' ? '$white' : '$textDark500'}
        />
        <Text color={status === 'COMPLETE' ? '$white' : '$textDark500'}>
          Agendado por:{' '}
        </Text>
        <Text
          fontWeight="bold"
          color={status === 'COMPLETE' ? '$white' : '$textDark500'}>
          Nombre del usuario
        </Text>
      </HStack>
      <HStack space="xs">
      <Icon
          as={Briefcase}
          color={status === 'COMPLETE' ? '$white' : '$textDark500'}
        />
        <Text color={status === 'COMPLETE' ? '$white' : '$textDark500'}>
          Servicio:{' '}
        </Text>
        <Text
          fontWeight="bold"
          color={
            status === 'COMPLETE' ? '$white' : '$textDark500'
          }>{`${event.name}`}</Text>
      </HStack>
      <HStack space="xs" alignItems="center">
          <Icon
            as={CircleDollarSign}
            color={status === 'COMPLETE' ? '$white' : '$textDark500'}
          />
          <Text
            fontWeight="bold"
            color={status === 'COMPLETE' ? '$white' : '$textDark500'}>
            {event.price}
          </Text>
        </HStack>
    </Box>
  );
}
