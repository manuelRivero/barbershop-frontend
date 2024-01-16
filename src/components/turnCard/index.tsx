import {
  AvatarGroup,
  AvatarImage,
  Box,
  HStack,
  Icon,
  Text,
  Avatar,
} from '@gluestack-ui/themed';
import React, { useEffect, useState } from 'react';
import { Event } from '../../types/turns';
import moment from 'moment';
import { Briefcase, CircleDollarSign, Clock2, PercentCircle, UserCircle } from 'lucide-react-native';
import { useAppDispatch } from '../../store';
import { setCompleteTurn } from '../../store/features/turnsSlice';
import { User } from '../../types/user';
interface Props {
  event: Event;
  user: User | null
}
export default function TurnCard({ event, user }: Props) {
  const dispatch = useAppDispatch();
  const [status, setStatus] = useState<string>();

  useEffect(() => {
    const interval = setInterval(() => {
      if (
        moment()
          .utc()
          .utcOffset(3, true)
          .isAfter(moment(event.endDate), 'minutes')
      ) {
        setStatus('COMPLETE');
        clearInterval(interval)
      }
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (status === "COMPLETE") {
      dispatch(setCompleteTurn(event));
    }

  }, [status]);

  console.log("user", user)

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
      <HStack mb="$1" space="xs" alignItems="center">
        <Icon
          as={UserCircle}
          color={status === 'COMPLETE' ? '$white' : '$textDark500'}
        />
        <Text color={status === 'COMPLETE' ? '$white' : '$textDark500'}>
          Agendado por:{' '}
        </Text>
        <Text
          fontWeight="bold"
          color={status === 'COMPLETE' ? '$white' : '$textDark500'}>
          {event.user === null ? "Ti" : `${event.user}`}
        </Text>
      </HStack>
      <HStack mb="$1" space="xs" alignItems="center">
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
      <HStack  space="lg" alignItems="center">
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
        <HStack space="xs" alignItems="center">
          <Icon
            as={PercentCircle}
            color={status === 'COMPLETE' ? '$white' : '$textDark500'}
          />
          <Text
            fontWeight="bold"
            color={status === 'COMPLETE' ? '$white' : '$textDark500'}>

            {event.price * (user?.commission ? user.commission : 0) / 100}
          </Text>
        </HStack>
      </HStack>
    </Box>
  );
}
