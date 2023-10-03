import {Box, HStack, Icon, Text} from '@gluestack-ui/themed';
import React, {useEffect, useState} from 'react';
import {Event} from '../../types/turns';
import moment from 'moment';
import { Clock2 } from 'lucide-react-native';
interface Props {
  event: Event;
}
export default function TurnCard({event}: Props) {
  const [time, setTime] = useState<number | undefined>();
  const [status, setStatus] = useState<string>();

  useEffect(() => {
    const interval = setInterval(() => {
      setTime(moment().diff(moment(event.endDate), 'minutes'));
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (time) {
      if (time >= 0) {
        setStatus('COMPLETE');
      }
    }
  }, [time]);

  return (
    <Box
      padding={'$4'}
      mb={'$4'}
      softShadow="3"
      bg={status === 'COMPLETE' ? '$green500' : '$white'}
      borderRadius={'$md'}>
      <HStack mb="$1" space='sm' alignItems='center'>    
      <Icon as={Clock2} color={status === 'COMPLETE' ? '$white' : '$textDark500'}/>
        <Text
          fontWeight="bold"
          color={status === 'COMPLETE' ? '$white' : '$textDark500'}>{`${moment(
          event.startDate,
        ).format('hh:mm')} - ${moment(event.endDate).format('hh:mm')}`}</Text>
      </HStack>
      <HStack>
        <Text
          fontWeight="bold"
          color={
            status === 'COMPLETE' ? '$white' : '$textDark500'
          }>{`${event.title}`}</Text>
      </HStack>
    </Box>
  );
}
