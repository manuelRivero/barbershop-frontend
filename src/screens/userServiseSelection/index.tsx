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

import moment from 'moment-timezone';
import {getDateByTimeZone} from '../../helpers';
import LinearGradient from 'react-native-linear-gradient';
import {ChevronLeftIcon} from 'lucide-react-native';
import socket from '../../socket';
import Header from '../../components/header';

moment.tz.setDefault(moment.tz.guess());
const {width} = Dimensions.get('window');

export default function UserServiceSelection({route}: any) {
  const [businessHoursStart, setBusinessHoursStart] = useState<moment.Moment>(
    moment().set({hour: 9, minute: 0, second: 0}).utc().utcOffset(3, true),
  );
  const [businessHoursEnd, setBusinessHoursEnd] = useState<moment.Moment>(
    moment().set({hour: 20, minute: 0, second: 0}).utc().utcOffset(3, true),
  );
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
  const {
    data: turnsData,
    refetch: refetchTurns,
    isLoading: isLoadingTurns,
    fulfilledTimeStamp: turnsFulfilledTimeStamp,
  } = useGetTurnsQuery(
    {id},
    {
      skip: moment().utc().utcOffset(3, true).isBefore(businessHoursStart)
        ? true
        : false,
    },
  );
  const [addTurnRequest, {isLoading: isLoadingAddTurn}] = useAddTurnMutation();

  const [selectedService, setSelectedService] = useState<Service | null>(null);
  const [showTurnModal, setShowTurnModal] = useState<boolean>(false);
  const [turnList, setTurnList] = useState<TurnSelectItem[]>([]);
  const [isSunday, setIsSunday] = useState<boolean>(false);
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
      if (selectedService) {
        const slots = [];
        let turnsList = [...turns];
        console.log('turnsList', turnsList);
        let currentTime = moment().utc().utcOffset(3, true).add(1, 'hour');

        if (currentTime.isBefore(businessHoursStart)) {
          // const diff = currentTime.clone().diff(businessHoursStart, 'minutes');
          const diff = businessHoursStart.clone().diff(currentTime, 'minutes');
          currentTime = currentTime.add(diff, 'minutes');
        }
        while (
          currentTime
            .clone()
            .add(selectedService.duration, 'minutes')
            .isBefore(businessHoursEnd)
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
                endTime.isBetween(slot.startDate, slot.endDate)
              );
            });
          if (isSlotInavailable < 0) {
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

    if (selectedService) {
      checkTurnForServiceTime();
    }
  }, [selectedService]);

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
    if (service) {
      setSelectedService(service);
    }
  }, [service]);

  console.log('service', service);

  useEffect(() => {
    const interval = setInterval(() => {
      const sunday = moment().get('day') === 0;

      if (sunday && !isSunday) {
        setIsSunday(true);
      } else if (!sunday && !isSunday) {
        setIsSunday(false);
      }

      if (moment().utc().utcOffset(3, true).isAfter(restartTime)) {
        const day = moment().get('date');
        setRestartTime(
          moment()
            .set({date: day + 1, hour: 23, minute: 59, second: 59})
            .utc()
            .utcOffset(3, true),
        );
        setBusinessHoursStart(
          moment()
            .set({date: day + 1, hour: 9, minute: 0})
            .utc()
            .utcOffset(3, true),
        );
        setBusinessHoursEnd(
          moment()
            .set({date: day + 1, hour: 11, minute: 0})
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
      refetch();
    });

    return unsubscribe;
  }, [navigation]);

  React.useEffect(() => {
    if (turnsData) {
      dispatch(initTurns(turnsData));
    }
  }, [fulfilledTimeStamp]);

  if (isLoading || isLoadingTurns) {
    return <Loader />;
  }

  console.log('restart time', restartTime.clone().get('day'));
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
        {isSunday ? (
          <Box flex={1} mt={'$20'}>
            <Heading textAlign="center" color="$textDark500">
              Hoy es domingo y la barberìa se encuentra cerrada
            </Heading>
          </Box>
        ) : (
          <>
            <ScrollView flex={1}>
              <FlatList
                contentContainerStyle={{paddingBottom: 50}}
                p="$4"
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
            </ScrollView>
            <SelectTurnModal
              businessHoursEnd={businessHoursEnd}
              onSelect={handleAddTurn}
              turns={turnList}
              show={showTurnModal}
              onClose={() => {
                setShowTurnModal(false);
                setSelectedService(null);
              }}
            />
          </>
        )}
      </Box>
    </LinearGradient>
  );
}
