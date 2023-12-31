import React, {useEffect, useState} from 'react';
import moment from 'moment-timezone';
import {
  ScrollView,
  AddIcon,
  Box,
  Heading,
  HStack,
  Image,
  Text,
  VStack,
} from '@gluestack-ui/themed';
import {Event, TurnSelectItem} from '../../types/turns';
import Clock from 'react-live-clock';
import SelectServiceModal from '../../components/selectServiceModal';
import {Service} from '../../types/services';
import SelectTurnModal from '../../components/selectTurnModal';
import TurnCard from '../../components/turnCard';
import BaseButton from '../../components/shared/baseButton';
import {RootState, useAppDispatch, useAppSelector} from '../../store';
import {
  addTurn,
  initTurns,
  resetAllturns,
} from '../../store/features/turnsSlice';
import {useAddTurnMutation, useGetTurnsQuery} from '../../api/turnsApi';
import {hideInfoModal, showInfoModal} from '../../store/features/layoutSlice';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {useNavigation} from '@react-navigation/native';
import LinearGradient from 'react-native-linear-gradient';
import PushNotification from 'react-native-push-notification';
import { Dimensions } from 'react-native';


const businessHoursStart = moment().set({hour: 9, minute: 0, second: 0});
const {width} = Dimensions.get("window")
export default function Schedule() {
  const businessHoursEnd = moment().set({ hour: 23, minute: 50, second: 0}).utc().utcOffset(3, true);
  
  console.log("businessHoursEnd", businessHoursEnd)
  const navigation = useNavigation<NativeStackNavigationProp<any>>();

  const dispatch = useAppDispatch();
  const {turns} = useAppSelector((state: RootState) => state.turns);
  const {user} = useAppSelector((state: RootState) => state.auth);
  const {socket} = useAppSelector((state: RootState) => state.layout);
  const [restartTime, setRestartTime] = useState<moment.Moment>(moment().utc().utcOffset(3, true).set({hour: 23, minutes: 0}))

  const {
    data: turnsData,
    refetch: refetchTurns,
    isLoading: isLoadingTurns,
    fulfilledTimeStamp,
  } = useGetTurnsQuery({id: user?._id ?? ''});

  const [addTurnRequest, {isLoading}] = useAddTurnMutation();

  const [showServiceModal, setShowServiceModal] = useState<boolean>(false);

  const [showTurnModal, setShowTurnModal] = useState<boolean>(false);

  const [turnList, setTurnList] = useState<TurnSelectItem[]>([]);
  const [selectedService, setSelectedService] = useState<Service | null>(null);


  const handleAddTurn = async (turn: TurnSelectItem) => {
    if (selectedService && user) {
      const handleRequest = async () => {
        return addTurnRequest({
          data: {
            name: selectedService.name,
            type: selectedService._id,
            barber: user?._id,
            user: null,
            status: 'INCOMPLETE',
            price: selectedService.price,
            startDate: moment(turn.startDate).toISOString(),
            endDate: moment(turn.startDate)
              .add(selectedService.duration, 'minutes')
              .toISOString(),
          },
        }).unwrap();
      };

      dispatch(
        showInfoModal({
          title: `¡Deseas agendar este turno ${moment(turn.startDate).utc().utcOffset(3, true).format(
            'hh:mm',
          )}?`,
          type: 'info',
          hasCancel: true,
          cancelCb: () => {},
          hasSubmit: true,
          submitCb: () => {
            handleRequest()
              .then(res => {
                dispatch(
                  showInfoModal({
                    title: '¡Turno agendado!',
                    type: 'success',
                    hasCancel: false,
                    cancelCb: null,
                    hasSubmit: false,
                    submitCb: null,
                    hideOnAnimationEnd: true,
                    submitData: null,
                    cancelData: null,
                  }),
                ),
                  dispatch(addTurn(res.turn));
                setSelectedService(null);
                setShowTurnModal(false);
              })
              .catch(err => {
                showInfoModal({
                  title: '¡No se ha podido agendar tu turno!',
                  type: 'error',
                  hasCancel: false,
                  cancelCb: null,
                  hasSubmit: true,
                  submitData: {
                    text: 'Intentar nuevamente',
                    background: '$primary500',
                  },
                  submitCb: () => {dispatch(hideInfoModal()); setShowTurnModal(false); refetchTurns()},
                  hideOnAnimationEnd: false,
                  cancelData: null,
                });
              });
          },
          hideOnAnimationEnd: false,
          submitData: {
            text: 'Agendar',
            background: '$green500',
            hasLoader: true
          },
          cancelData: {
            text: 'Cancelar',
            background: '$blueGray200',
          },
        }),
      );
    }

    // try {
    //   return
    //   if (response.data.ok === false) {
    //     throw new Error();
    //   } else {
    //
    //   }
    // } catch (error) {
    //   console.log('error al guardar el turno', error);
    // }
  };

  // useEffect(() => {
  //   const checkTurnForServiceTime = async () => {
  //     if (selectedService) {
  //       const slots = [];
  //       let currentTime = moment().utc().utcOffset(3, true);
  //       console.log("currentTime", currentTime)

  //       while (currentTime.isBefore(businessHoursEnd)) {
  //         const endTime = moment(currentTime).add(
  //           selectedService.duration,
  //           'minutes',
  //         );
  //         const isSlotAvailable = ![...turns].sort(function (left, right) {
  //           return moment(left.startDate).diff(moment(right.startDate));
  //         }).some((slot, slotIndex, slotArray) => {
  //           const hasNextSlot = slotIndex + 1 < slotArray.length;
  //           let nextSlotValidation = false;
  //           if(hasNextSlot){
  //             nextSlotValidation = endTime.clone().isBetween( moment(slotArray[slotIndex + 1].startDate),moment(slotArray[slotIndex + 1].endDate))
  //           }
  //           console.log("curren time", currentTime.clone().isSameOrAfter(slot.startDate))
  //           return (
  //             moment(slot.startDate, 'hh:mm A').isBetween(
  //               currentTime,
  //               endTime,
  //             ) ||
  //             moment(slot.endDate, 'hh:mm A').isBetween(currentTime, endTime) ||
  //             moment(currentTime).isBetween(slot.startDate, slot.endDate) ||
  //             nextSlotValidation 
  //           );
  //         });

  //         if (isSlotAvailable) {
  //           slots.push({
  //             startDate: currentTime.toDate(),
  //             endDate: endTime.toDate(),
  //           });
  //         }

  //         currentTime = endTime;
  //       }
  //       setTurnList(slots);
  //       setFirtsAvailableTurnTime(moment(slots[0].startDate))
  //       setShowTurnModal(true);
  //     }
  //   };

  //   if (selectedService) {
  //     checkTurnForServiceTime();
  //   }
  // }, [selectedService]);

  useEffect(() => {
    function removeElementAt(arr:any, index:number) {
      let frontPart = arr.slice(0, index);
      let lastPart  = arr.slice( index+1 ); // index to end of array
      return [...frontPart, ...lastPart];
   }
    const checkTurnForServiceTime = async () => {
      if (selectedService) {
        const slots = [];
        let turnsList = [...turns]
        let currentTime = moment().utc().utcOffset(3, true);
        if( currentTime.isBefore(businessHoursStart)){
          const diff = currentTime.diff( businessHoursStart, "minutes")
          currentTime = currentTime.add("minutes", diff)
        }
        
        while (currentTime.isBefore(businessHoursEnd)) {
          console.log("currentTime", currentTime)
          const endTime = currentTime.clone().add(
            selectedService.duration,
            'minutes',
          );
          const isSlotInavailable = [...turnsList].sort(function (left, right) {
            return moment(left.startDate).diff(moment(right.startDate));
          }).findIndex((slot, slotIndex, slotArray) => {
            const hasNextSlot = slotIndex + 1 < slotArray.length;
            let nextSlotValidation = false;
            if(hasNextSlot){
              nextSlotValidation = endTime.clone().isBetween( moment(slotArray[slotIndex + 1].startDate),moment(slotArray[slotIndex + 1].endDate)) || currentTime.clone().isBetween( moment(slotArray[slotIndex + 1].startDate),moment(slotArray[slotIndex + 1].endDate))
            }
            return (
              moment(slot.startDate).isBetween(
                currentTime,
                endTime,
              ) ||
              moment(slot.endDate).isBetween(currentTime, endTime) ||
              moment(currentTime).isBetween(slot.startDate, slot.endDate) ||
              nextSlotValidation || endTime.isBetween(slot.startDate, slot.endDate) 
            );
          });
          if (isSlotInavailable < 0) {
            console.log("available slot", currentTime, endTime)
            slots.push({
              startDate: currentTime.toDate(),
              endDate: endTime.toDate(),
            });
            currentTime = endTime;
          } else {
            if(moment(turnsList[isSlotInavailable].endDate).isAfter(currentTime)){
              console.log("diff", currentTime, turnsList[isSlotInavailable].endDate, moment(turnsList[isSlotInavailable].endDate).diff(currentTime, 'minutes') )
              currentTime = currentTime.clone().add(moment(turnsList[isSlotInavailable].endDate).diff(currentTime, 'minutes') + 1, "minutes")

            }

            turnsList = removeElementAt(turnsList,isSlotInavailable)
          }

        }
        
        setTurnList(slots);
        setShowTurnModal(true);
      }
    };

    if (selectedService) {
      checkTurnForServiceTime();
    }
  }, [selectedService]);
  const handleServiceSelect = (e: Service) => {
    setSelectedService(e);
    setShowServiceModal(false);
  };

  useEffect(() => {
    const interval = setInterval(() => {
      if (
        moment()
          .utc()
          .utcOffset(3, true)
          .isAfter(restartTime)
          
      ) {
        const day = moment().utc().utcOffset(3, true).get("date").toLocaleString()
        setRestartTime(moment().set({date: parseInt(day) + 1, hour: 0, minute: 0, second: 0}).utc().utcOffset(3, true))
        if (turns.length > 0) {
          dispatch(resetAllturns());
        }
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [restartTime]);

  React.useEffect(() => {
    if (turnsData) {
      console.log('turns data', turnsData.turns);
      dispatch(initTurns(turnsData.turns));
    }
  }, [fulfilledTimeStamp]);

  React.useEffect(() => {
    const unsubscribe = navigation.addListener('focus', async () => {
      console.log('focus');
      refetchTurns();
    });

    return unsubscribe;
  }, [navigation]);

  useEffect(() => {
    socket?.on('add-turn', ({data}) => {
      dispatch(addTurn(data));
      PushNotification.localNotification({
        /* Android Only Properties */
        channelId: 'channel-id', // (required) channelId, if the channel doesn't exist, notification will not trigger.
        bigText: `Turno agendado para ${moment(data.startDate).utc().utcOffset(3, true).format(
          'hh:mm A',
        )}`, // (optional) default: "message" prop
        vibrate: true, // (optional) default: true
        vibration: 300, // vibration length in milliseconds, ignored if vibrate=false, default: 1000
        groupSummary: false, // (optional) set this notification to be the group summary for a group of notifications, default: false
        ongoing: false, // (optional) set whether this is an "ongoing" notification
        priority: 'high', // (optional) set notification priority, default: high
        visibility: 'private', // (optional) set notification visibility, default: private
        ignoreInForeground: false, // (optional) if true, the notification will not be visible when the app is in the foreground (useful for parity with how iOS notifications appear). should be used in combine with `com.dieam.reactnativepushnotification.notification_foreground` setting
        title: '¡Nueva notificación!', // (optional)

        /* iOS only properties */

        message: 'Tienes un nuevo turno', // (required)
      });
    });

    return () => {
      socket?.off('add-turn');
    };
  }, []);

  return (
    <LinearGradient style={{flex:1}} colors={['#fff', '#f1e2ca']} start={{x: 0, y: .6}} end={{x: 0, y: 1}}>
      <Box  flex={1} position="relative">


        <Box borderRadius={9999}
        w={width * 3}
        h={width * 3}
        position='absolute' bg="#f1e2ca" overflow='hidden' top={- width * 2.75} left={- width} opacity={.5} />
        <HStack paddingHorizontal={'$3'}>
        <VStack
        alignItems="center"
        
        p={'$4'}
          width={'100%'}
          justifyContent="flex-end">
          <Clock
            format={'hh:mm:ss'}
            ticking={true}
            element={Text}
            style={{fontSize: 22, color: '#1f3d56'}}
          />
            <Heading textAlign="center" color="$textDark500">
            Turnos agendados
          </Heading>
         
            
        </VStack>

        </HStack>

        <ScrollView flex={1}>
        
          <Box padding={'$4'}>
          {turns.length > 0 && (
              <Text color="$textDark500" textAlign="center"  mt={'$10'} mb={'$4'}>
                Los turnos agendados para el día de hoy serán visibles en tu
                agenda hasta las 11pm.
              </Text>
            )}
            {[...turns]
              .sort(function (left, right) {
                return moment(left.startDate).diff(moment(right.startDate));
              })
              .map(e => {
                return (
                  <TurnCard key={moment(e.startDate).toString()} event={e} />
                );
              })}
            {turns.length === 0 && (
              <>
                <Text textAlign="center" mt={'$10'} color="$textDark500">
                  Aún no has agendado ningún turno para hoy.
                </Text>
                <HStack justifyContent="center">
                  <Image
                    mt={'$10'}
                    maxWidth={'$32'}
                    maxHeight={'$32'}
                    resizeMode="contain"
                    source={require('../../assets/images/schedule-placeholder.png')}
                    alt="agenda-vacia"
                  />
                </HStack>
              </>
            )}
           
          </Box>
        </ScrollView>
        <HStack
          position="absolute"
          bottom={10}
          width={'100%'}
          justifyContent="center">
          <BaseButton
            title="Agendar"
            background={'$primary500'}
            color={'$white'}
            onPress={() => setShowServiceModal(true)}
            isLoading={false}
            disabled={false}
            hasIcon={true}
            icon={AddIcon}
          />
        </HStack>
      </Box>
      <SelectServiceModal
        show={showServiceModal}
        onSelect={handleServiceSelect}
        onClose={() => setShowServiceModal(false)}
      />
      <SelectTurnModal
        onSelect={handleAddTurn}
        turns={turnList}
        show={showTurnModal}
        onClose={() => {
          setShowTurnModal(false);
          setSelectedService(null);
        }}
      />
    </LinearGradient>
  );
}
