import React, {useEffect, useRef, useState} from 'react';
import {
  ScrollView,
  AddIcon,
  Box,
  Heading,
  HStack,
  Image,
  Text,
  FlatList,
  Pressable,
  VStack,
  Icon,
} from '@gluestack-ui/themed';
import Clock from 'react-live-clock';
import {RootState, useAppDispatch, useAppSelector} from '../../store';
import {Service} from '../../types/services';
import {Dimensions, ListRenderItemInfo} from 'react-native';
import {addAllServices} from '../../store/features/servicesSlice';
import {useGetBarberServicesQuery} from '../../api/servicesApi';
import Loader from '../../components/shared/loader';
import {useAddTurnMutation, useGetTurnsQuery} from '../../api/turnsApi';
import {Event, TurnSelectItem} from '../../types/turns';
import {
  addTurn,
  initTurns,
  resetAllturns,
  setUserTurn,
} from '../../store/features/turnsSlice';
import SelectTurnModal from '../../components/shared/selectTurnModal';
import {hideInfoModal, showInfoModal} from '../../store/features/layoutSlice';
import UserServiceCard from '../../components/userServiceCard';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {useNavigation} from '@react-navigation/native';

import moment, {Moment} from 'moment-timezone';
import {getDateByTimeZone} from '../../helpers';
import LinearGradient from 'react-native-linear-gradient';
import {ChevronLeftIcon} from 'lucide-react-native';
import socket from '../../socket';
import Header from '../../components/header';
import CalendarModal from '../../components/shared/calendarModal';
import BarberAvatar from '../../components/shared/barberAvatar';
import { useGetBarberDetailQuery } from '../../api/barbersApi';

const {width} = Dimensions.get('window');

export default function UserServiceSelection({route}: any) {
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  
  const navigation = useNavigation<NativeStackNavigationProp<any>>();
  const {id, service} = route.params;
  const timeRef = useRef<number | null>(null);
  
  const dispatch = useAppDispatch();
  const {services, showCreateServiceModal} = useAppSelector(
    (state: RootState) => state.services,
  );
  const {turns} = useAppSelector((state: RootState) => state.turns);
  const {user} = useAppSelector((state: RootState) => state.auth);

  const {data, isLoading, refetch, fulfilledTimeStamp} =
    useGetBarberServicesQuery({id});
    const {data:barberData, isLoading:isLoadingBarberData, refetch: refetchBarberData} = useGetBarberDetailQuery({id})

    const {
      data: turnsData,
      refetch: refetchTurns,
      isLoading: isLoadingTurns,
      fulfilledTimeStamp: turnsFulfilledTimeStamp,
    } = useGetTurnsQuery(
      {id, date:selectedDate!},{ skip: !selectedDate ? true : false },
    );
    const [addTurnRequest, {isLoading: isLoadingAddTurn}] = useAddTurnMutation();

  const [selectedService, setSelectedService] = useState<Service | null>(null);
  const [showTurnModal, setShowTurnModal] = useState<boolean>(false);
  const [showCalendarModal, setShowCalendarModal] = useState<boolean>(false);
  const [turnList, setTurnList] = useState<TurnSelectItem[]>([]);
  const [restartTime, setRestartTime] = useState<moment.Moment>(
    moment().set({hour: 23, minutes: 59, seconds: 59}).utc().utcOffset(3, true),
  );

  useEffect(() => {
    if (data) {
      dispatch(addAllServices(data.services));
    }
  }, [data]);

  useEffect(() => {
    function removeElementAt(arr: any, index: number) {
      let frontPart = arr.slice(0, index);
      let lastPart = arr.slice(index + 1); // index to end of array
      return [...frontPart, ...lastPart];
    }
    const checkTurnForServiceTime = async () => {
      if (selectedService && selectedDate && turns) {
        console.log("entró a la función", turns)
        const slots = [];
        let turnsList = [...turns];

        let currentTime: Moment;
        if (
          moment(selectedDate, 'YYYY-MM-DD')
            .set({hour: 0, minute: 0, second: 0, millisecond: 0})
            .utc()
            .utcOffset(3, true)
            .isSame(
              moment()
                .set({hour: 0, minute: 0, second: 0, millisecond: 0})
                .utc()
                .utcOffset(3, true),
            )
        ) {
          currentTime = moment().utc().utcOffset(3, true).add(1, 'hour');
          console.log('entro al if');
          // if (currentTime.isBefore(businessHoursStart)) {
          //   // const diff = currentTime.clone().diff(businessHoursStart, 'minutes');
          //   const diff = businessHoursStart
          //     .clone()
          //     .diff(currentTime, 'minutes');
          //   currentTime = currentTime.add(diff, 'minutes');
          // }
        } else {
          currentTime = moment(selectedDate).set('hours', 9).set('minutes', 0).utc()
          .utcOffset(3, true);
          console.log("entro al else")
        }
        console.log(
          'turns',
          currentTime,
          moment(selectedDate, 'YYYY-MM-DD')
            .set('hours', 20)
            .set('minutes', 0)
            .utc()
            .utcOffset(3, true),
        );
        while (
          currentTime
            .clone()
            .add(selectedService.duration, 'minutes')
            .isBefore(
              moment(selectedDate, 'YYYY-MM-DD')
                .set('hours', 20)
                .set('minutes', 0)
                .utc()
                .utcOffset(3, true),
            )
        ) {
          const endTime = currentTime
            .clone()
            .add(selectedService.duration, 'minutes');
          const isSlotInavailable = [...turnsList]
            .sort(function (left, right) {
              return moment(left.startDate).diff(moment(right.startDate));
            })
            .findIndex((slot, slotIndex, slotArray) => {
              const hasNextSlot = slotIndex + 1 < slotArray.length;
              let nextSlotValidation = false;
              if (hasNextSlot) {
                nextSlotValidation =
                  endTime
                    .clone()
                    .isBetween(
                      moment(slotArray[slotIndex + 1].startDate),
                      moment(slotArray[slotIndex + 1].endDate),
                    ) ||
                  currentTime
                    .clone()
                    .isBetween(
                      moment(slotArray[slotIndex + 1].startDate),
                      moment(slotArray[slotIndex + 1].endDate),
                    );
              }
              return (
                moment(slot.startDate).isBetween(currentTime, endTime) ||
                moment(slot.endDate).isBetween(currentTime, endTime) ||
                moment(currentTime).isBetween(slot.startDate, slot.endDate) ||
                nextSlotValidation ||
                endTime.isBetween(slot.startDate, slot.endDate) ||
                moment(slot.startDate).isSame(currentTime)
              );
            });
          if (isSlotInavailable < 0) {
            console.log('slot', currentTime.toDate());
            slots.push({
              startDate: currentTime.toDate(),
              endDate: endTime.toDate(),
            });
            currentTime = endTime;
          } else {
            if (
              moment(turnsList[isSlotInavailable].endDate).isAfter(currentTime)
            ) {
              console.log(
                'diff',
                currentTime,
                turnsList[isSlotInavailable].endDate,
                moment(turnsList[isSlotInavailable].endDate).diff(
                  currentTime,
                  'minutes',
                ),
              );
              currentTime = currentTime
                .clone()
                .add(
                  moment(turnsList[isSlotInavailable].endDate).diff(
                    currentTime,
                    'minutes',
                  ) + 1,
                  'minutes',
                );
            }

            turnsList = removeElementAt(turnsList, isSlotInavailable);
          }
        }

        setTurnList(slots);
        setShowTurnModal(true);
      }
    };

    if (selectedService && selectedDate && turns) {
      checkTurnForServiceTime();
    }
  }, [selectedDate, turns]);

  React.useEffect(() => {
    const unsubscribe = navigation.addListener('focus', async () => {
      refetch();
      refetchTurns();
    });

    return unsubscribe;
  }, [navigation]);

  const handleAddTurn = async (turn: TurnSelectItem) => {
    if (selectedService && user) {
      const handleRequest = async () => {
        return addTurnRequest({
          data: {
            type: selectedService._id,
            name: selectedService.name,
            barber:
              user?.role === 'barber' || user?.role === 'admin-barber'
                ? user?._id
                : id,
            user: user?.role === 'user' ? user?._id : null,
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
          title: `¡Deseas agendar este turno ${moment(turn.startDate)
            .utc()
            .utcOffset(3, true)
            .format('hh:mm')}?`,
          type: 'info',
          hasCancel: true,
          cancelCb: () => {},
          hasSubmit: true,
          submitCb: async () => {
            try {
              const res = await handleRequest();
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
                dispatch(setUserTurn({...res.turn}));

              setSelectedService(null);
              setShowTurnModal(false);
              navigation.navigate('UserWaitingRoom', {turnId: res.turn._id});
              socket?.emit('set-turn', {
                barber: {
                  _id: id,
                },
                turnData: res.turn,
              });
            } catch (error) {
              dispatch(hideInfoModal());
              dispatch(
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
                  submitCb: () => {
                    dispatch(hideInfoModal());
                    setShowTurnModal(false);
                    refetchTurns();
                  },
                  hideOnAnimationEnd: false,
                  cancelData: null,
                }),
              );
            }
          },
          hideOnAnimationEnd: false,
          submitData: {
            text: 'Agendar',
            background: '$green500',
            hasLoader: true,
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
  const handleServiceSelect = (e: Service) => {
    setSelectedService(e);
  };
  useEffect(() => {
    if (selectedService) {
      setShowCalendarModal(true);
    }
  }, [selectedService]);

  useEffect(() => {
    if (service) {
      setSelectedService(service);
    }
  }, [service]);

  useEffect(() => {
    const interval = setInterval(() => {

      if (moment().utc().utcOffset(3, true).isAfter(restartTime)) {
        const day = moment().get('date');
        setRestartTime(
          moment()
            .set({date: day + 1, hour: 23, minute: 59, second: 59})
            .utc()
            .utcOffset(3, true),
        );
        
        if (turns.length > 0) {
          dispatch(resetAllturns());
        }
      }
    }, 1000);
    return () => clearInterval(interval);
  }, [restartTime]);
  
  React.useEffect(() => {
    const unsubscribe = navigation.addListener('focus', async () => {
      console.log('focus');
      if(turnsData){
        refetch();
      }
    });

    return unsubscribe;
  }, [navigation]);

  React.useEffect(() => {
    if (turnsData) {
      dispatch(initTurns(turnsData));
    }
  }, [fulfilledTimeStamp]);

  useEffect(()=>{
    if(showTurnModal){
      setSelectedDate(null)

    }
  }, [showTurnModal])

  console.log("turns", turnsData)

  if (isLoading || isLoadingTurns) {
    return <Loader />;
  }



  return (
    <LinearGradient
      style={{flex: 1}}
      colors={['#fff', '#f1e2ca']}
      start={{x: 0, y: 0.6}}
      end={{x: 0, y: 1}}>
      <Box flex={1} position="relative">
        <Header
          title="Servicios disponibles"
          width={width}
          viewGoBack={true}
          viewClock={false}
        />
      
          <>
          <Box p="$4" mt={"$16"}>
            <BarberAvatar barber={barberData?.barber[0] || null} />
          </Box>
              <FlatList
                contentContainerStyle={{paddingBottom: 50, paddingHorizontal: 16}}                
                data={services}
                renderItem={(props: ListRenderItemInfo<any>) => {
                  const {item} = props;
                  return (
                    <Pressable onPress={() => handleServiceSelect(item)}>
                      <UserServiceCard data={item} />
                    </Pressable>
                  );
                }}
                ItemSeparatorComponent={() => {
                  return (
                    <Box
                      style={{
                        height: 15,
                        width: '100%',
                      }}
                    />
                  );
                }}
              />
            {showCalendarModal && (
              <CalendarModal
                show={showCalendarModal}
                onClose={() => setShowCalendarModal(false)}
                onSelect={e => {
                  setShowCalendarModal(false);
                  setSelectedDate(e);
                }}
              />
            )}
           { showTurnModal && <SelectTurnModal
            date={selectedDate!}
              onSelect={handleAddTurn}
              turns={turnList}
              show={showTurnModal}
              onClose={() => {
                setShowTurnModal(false);
                setSelectedService(null);
              }}
            />}
          </>

      </Box>
    </LinearGradient>
  );
}
