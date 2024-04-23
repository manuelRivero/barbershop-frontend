import {
  Box,
  FlatList,
  HStack,
  Heading,
  Icon,
  ScrollView,
  Text,
  VStack,
} from '@gluestack-ui/themed';
import React, {useEffect, useState} from 'react';
import {RootState, useAppSelector} from '../../store';
import {Event} from '../../types/turns';
import Clock from 'react-live-clock';
import {LineChart} from 'react-native-chart-kit';
import {useGetWeekStatsQuery} from '../../api/statsApi';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {useNavigation} from '@react-navigation/native';
import moment from 'moment';
import Loader from '../../components/shared/loader';
import {Dimensions} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import WeekPicker from '../../components/shared/weekPicker';
import 'moment/locale/es';
import CustomHeading from '../../components/shared/heading';
import CustomText from '../../components/shared/text';
import Header from '../../components/header';
moment.locale('es');

const chartConfig = {
  backgroundGradientFrom: '#fff',
  backgroundGradientFromOpacity: 1,
  backgroundGradientTo: '#fff',
  backgroundGradientToOpacity: 1,
  borderColor: 'rgba(152,222,217,0.2)',
  color: () => '#367187',
  strokeWidth: 2, // optional, default 3
  barPercentage: 0.5,
  useShadowColorFromDataset: false, // optional
};
const daysOfWeek = [
  'lunes',
  'martes',
  'miércoles',
  'jueves',
  'viernes',
  'sábado',
];
const {width} = Dimensions.get('window');

export default function Stats() {
  const navigation = useNavigation<NativeStackNavigationProp<any>>();

  const {turns} = useAppSelector((state: RootState) => state.turns);
  const {user} = useAppSelector((state: RootState) => state.auth);

  const [mappedData, setMappedData] = useState<any>();
  const [startOfWeek, setStartOfWeek] = useState<moment.Moment>(
    moment()
      .startOf('isoWeek')
      .set('hour', 0)
      .set('minutes', 0)
      .utc()
      .utcOffset(3, true),
  );
  const [endOfWeek, setEndOfWeek] = useState<moment.Moment>(
    moment()
      .startOf('isoWeek')
      .add(5, 'days')
      .set('hour', 23)
      .set('minutes', 59)
      .utc()
      .utcOffset(3, true),
  );
  console.log('endOfWeek', endOfWeek);
  const {
    data: statsData,
    isLoading,
    refetch,
  } = useGetWeekStatsQuery(
    {
      id: user ? user._id : null,
      from: startOfWeek.toDate(),
      to: endOfWeek.toDate(),
    },
    {skip: !user ? true : false},
  );

  const handlePrevWeek = () => {
    setStartOfWeek(startOfWeek.clone().subtract(7, 'days'));
    setEndOfWeek(endOfWeek.clone().subtract(7, 'days'));
  };
  const handleNextWeek = () => {
    setStartOfWeek(startOfWeek.clone().add(7, 'days'));
    setEndOfWeek(endOfWeek.clone().add(7, 'days'));
  };

  useEffect(() => {
    if (statsData) {
      const dataWithDates = [...statsData.data].map(e => ({
        ...e,
        date: moment(e.date).utc().utcOffset(3, true).format('dddd'),
      }));
      const data = {
        labels: daysOfWeek,
        datasets: [
          {
            data: daysOfWeek.map((dayOfWeek: string) => {
              const target = dataWithDates.find(e => e.date === dayOfWeek);
              if (target) {
                return user?.commission
                  ? (target.dayTotalAmount * user.commission) / 100
                  : target.dayTotalAmount;
              } else {
                return 0;
              }
            }),
            color: (opacity = 1) => `#367187`, // optional
            strokeWidth: 2, // optional
          },
        ],
      };
      setMappedData(data);
      console.log('dateset', data.datasets);
    }
  }, [statsData]);

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', async () => {
      console.log('focus');
      refetch();
    });

    return unsubscribe;
  }, [navigation]);
  if (isLoading) {
    return <Loader />;
  }

  console.log('data', statsData?.data);
  return (
    <LinearGradient
      style={{flex: 1}}
      colors={['#fff', '#f1e2ca']}
      start={{x: 0, y: 0.6}}
      end={{x: 0, y: 1}}>
      <Box position="relative" flex={1}>
        <Header
          title="Estadísticas"
          viewClock={true}
          viewGoBack={false}
          width={width}
        />
        <Box flex={1}>
          <ScrollView flex={1} mt="$16">
            <CustomHeading textAlign="center">
              Resumen del día de hoy
            </CustomHeading>
            {mappedData && (
              <Box p="$4">
                <Box
                  hardShadow={'1'}
                  p="$4"
                  mb="$4"
                  borderRadius="$lg"
                  bg="$white">
                  <CustomText>
                    Cortes realizados el día de hoy:{' '}
                    <CustomText fontWeight="bold">
                      {
                        turns.filter(
                          (turn: Event) => turn.status === 'COMPLETE',
                        ).length
                      }
                    </CustomText>
                  </CustomText>
                  <HStack alignItems="center">
                    <CustomText>Total el día de hoy: </CustomText>
                    <CustomText fontWeight="bold">
                      {[...turns].reduce((accumulator, object) => {
                        return object.status === 'COMPLETE'
                          ? accumulator + object.price
                          : accumulator;
                      }, 0) *
                        (user?.commission ? user?.commission / 100 : 1)}{' '}
                      Pesos
                    </CustomText>
                  </HStack>
                  <HStack>
                    <CustomText>Comisión: </CustomText>
                    <CustomText fontWeight="bold">
                      {user?.commission} %
                    </CustomText>
                  </HStack>
                  <CustomText>
                    Cortes pendientes el día de hoy:{' '}
                    <CustomText fontWeight="bold">
                      {
                        turns.filter(
                          (turn: Event) => turn.status !== 'COMPLETE',
                        ).length
                      }
                    </CustomText>
                  </CustomText>
                  <HStack alignItems="center">
                    <CustomText>Cortes cancelados el día de hoy: </CustomText>
                    <Text fontWeight="bold">
                      {[...turns].reduce((accumulator, object) => {
                        return object.status === 'CANCELED'
                          ? accumulator + 1
                          : accumulator;
                      }, 0)}
                    </Text>
                  </HStack>
                </Box>
                <Box mb="$2" mt="$4">
                  <WeekPicker
                    handlePrevWeek={handlePrevWeek}
                    handleNextWeek={handleNextWeek}
                    endOfWeek={endOfWeek.clone()}
                    startOfWeek={startOfWeek.clone()}
                  />
                </Box>
                <Box
                  mt={'$4'}
                  position="relative"
                  hardShadow="1"
                  bg="$white"
                  borderRadius="$lg"
                  overflow="hidden">
                  <LineChart
                    data={mappedData}
                    width={350}
                    height={350}
                    chartConfig={chartConfig}
                    verticalLabelRotation={30}
                    bezier
                    renderDotContent={({x, y, index, indexData}) => {
                      console.log('Index data', indexData);
                      return (
                        <Text position="absolute" top={y} left={x}>
                          {indexData}
                        </Text>
                      );
                    }}
                    fromZero
                  />
                </Box>
                <Box mt="$6">
                  {statsData &&
                    [...statsData.data]
                      .sort((a, b) => moment(a.date).diff(moment(b.date)))
                      .map(e => {
                        const item = {
                          ...e,
                          date: moment(e.date).format('DD/MM/yyyy'),
                          day: moment(e.date)
                            .utc()
                            .utcOffset(3, true)
                            .format('dddd'),
                        };
                        console.log('ITEM', item);
                        return (
                          <Box
                            key={item.date}
                            hardShadow={'1'}
                            p="$4"
                            mb="$6"
                            borderRadius="$lg"
                            bg="$white">
                            <CustomHeading textTransform="capitalize">
                              {item.day} - {item.date}
                            </CustomHeading>
                            <CustomText>
                              {`Total: `}
                              <CustomText fontWeight="bold">
                                {user?.commission &&
                                  ((item?.dayTotalAmount * user?.commission) /
                                    100) |
                                    0}
                              </CustomText>
                            </CustomText>
                            <CustomText>
                              Cortes realizados:{' '}
                              <CustomText fontWeight="bold">
                                {item?.dayCompleteServices | 0}
                              </CustomText>
                            </CustomText>
                            <CustomText>
                              Cortes cancelados:{' '}
                              <CustomText fontWeight="bold">
                                {item?.dayCanceledServices}
                              </CustomText>
                            </CustomText>
                            <HStack>
                              <CustomText>Comisión: </CustomText>
                              <CustomText fontWeight="bold">
                                {user?.commission} %
                              </CustomText>
                            </HStack>
                          </Box>
                        );
                      })}
                </Box>
              </Box>
            )}
          </ScrollView>
        </Box>
      </Box>
    </LinearGradient>
  );
}
