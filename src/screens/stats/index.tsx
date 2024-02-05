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
import React, { useEffect, useState } from 'react';
import { RootState, useAppSelector } from '../../store';
import { Event } from '../../types/turns';
import Clock from 'react-live-clock';
import { LineChart } from 'react-native-chart-kit';
import { useGetWeekStatsQuery } from '../../api/statsApi';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useNavigation } from '@react-navigation/native';
import moment from 'moment';
import Loader from '../../components/shared/loader';
import { Dimensions } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import WeekPicker from '../../components/shared/weekPicker';
import "moment/locale/es"
moment.locale("es")

const chartConfig = {
  backgroundGradientFrom: '#fff',
  backgroundGradientFromOpacity: 1,
  backgroundGradientTo: '#fff',
  backgroundGradientToOpacity: 1,
  borderColor: "rgba(152,222,217,0.2)",
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
const { width } = Dimensions.get('window');

export default function Stats() {
  const navigation = useNavigation<NativeStackNavigationProp<any>>();

  const { turns } = useAppSelector((state: RootState) => state.turns);
  const { user } = useAppSelector((state: RootState) => state.auth);

  const [mappedData, setMappedData] = useState<any>();
  const [startOfWeek, setStartOfWeek] = useState<moment.Moment>(moment().startOf('isoWeek'))
  const [endOfWeek, setEndOfWeek] = useState<moment.Moment>(moment().startOf('isoWeek').add(5, "days"))
  const { data: statsData, isLoading, refetch } = useGetWeekStatsQuery({
    id: user ? user._id : null,
    from: startOfWeek.toDate(),
    to: endOfWeek.toDate()
  }, { skip: !user ? true : false });

  const handlePrevWeek = () => {

    setStartOfWeek(startOfWeek.clone().subtract(7, "days"))
    setEndOfWeek(endOfWeek.clone().subtract(7, "days"))
  }
  const handleNextWeek = () => {

    setStartOfWeek(startOfWeek.clone().add(7, "days"))
    setEndOfWeek(endOfWeek.clone().add(7, "days"))
  }

  useEffect(() => {
    if (statsData) {
      const dataWithDates = [...statsData.data].map(e => ({
        ...e,
        date: moment(e.date).utc().utcOffset(3, true)
          .format('dddd')
      }));
      console.log("dataWithDates", dataWithDates)
      const data = {
        labels: daysOfWeek,
        datasets: [
          {
            data: daysOfWeek.map((dayOfWeek: string) => {
              const target = dataWithDates.find(e => e.date === dayOfWeek);
              if (target) {
                return target.dayTotalAmount;
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
      console.log("dateset", data.datasets)
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


  return (
    <LinearGradient
      style={{ flex: 1 }}
      colors={['#fff', '#f1e2ca']}
      start={{ x: 0, y: 0.6 }}
      end={{ x: 0, y: 1 }}>
      <Box position="relative" flex={1}>
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

        <VStack mt={'$4'} width={'100%'} justifyContent="center" alignItems='center'>
          <Clock
            format={'hh:mm:ss'}
            ticking={true}
            element={Text}
            style={{ fontSize: 22, color: '#1f3d56' }}
          />
          <Heading textAlign="center" color="$textDark500">
            Estadisticas
          </Heading>
        </VStack>
        <Box flex={1}>
          <ScrollView flex={1} mt="$10">

          <Heading textAlign="center" color="$textDark500">
            Resumen del día de hoy
          </Heading>
            {mappedData && (
              <Box p="$4">
                <Box
                  hardShadow={'1'}
                  p="$4"
                  mb="$4"
                  borderRadius="$lg"
                  bg="$white">
                  <Text color="$textDark500">
                    Cortes realizados el día de hoy:{' '}
                    <Text color="$textDark500" fontWeight="bold">
                      {
                        turns.filter(
                          (turn: Event) => turn.status === 'COMPLETE',
                        ).length
                      }
                    </Text>
                  </Text>
                  <HStack alignItems="center">
                    <Text color="$textDark500">Total el día de hoy: </Text>
                    <Text color="$textDark500" fontWeight="bold">
                      {[...turns].reduce((accumulator, object) => {
                        return object.status === 'COMPLETE'
                          ? accumulator + object.price
                          : accumulator;
                      }, 0) * (user?.commission ? user?.commission/ 100 : 1)}
                      {" "}Pesos
                    </Text>

                  </HStack>
                  <HStack>
                    <Text color="$textDark500">Comisión: </Text>
                    <Text color="$textDark500" fontWeight="bold">
                      {user?.commission}
                    </Text>
                  </HStack>
                  <Text color="$textDark500">
                    Cortes pendientes el día de hoy:{' '}
                    <Text color="$textDark500" fontWeight="bold">
                      {
                        turns.filter(
                          (turn: Event) => turn.status !== 'COMPLETE',
                        ).length
                      }
                    </Text>
                  </Text>
                </Box>
                <Box mb="$2" mt="$4">
                  <WeekPicker handlePrevWeek={handlePrevWeek} handleNextWeek={handleNextWeek} endOfWeek={endOfWeek.clone()} startOfWeek={startOfWeek.clone()} />

                </Box>
                <Box mt={'$4'} position="relative" hardShadow='1' bg="$white" borderRadius="$lg" overflow='hidden'>
                  <LineChart
                    data={mappedData}
                    width={350}
                    height={350}
                    chartConfig={chartConfig}
                    verticalLabelRotation={30}
                    bezier
                    renderDotContent={({ x, y, index, indexData }) => {
                      console.log('Index data', indexData);
                      return (
                        <Text
                          position="absolute"
                          color="$textDark500"
                          top={y}
                          left={x}>
                          {user?.commission ? indexData * user?.commission/ 100 : indexData}
                        </Text>
                      );
                    }}
                    fromZero
                  />
                </Box>
                <Box mt="$6">
                  {statsData && [...statsData.data].sort((a, b) => moment(a.date).diff(moment(b.date)))
                    .map(e => {
                      const item = {
                        ...e,
                        date: moment(e.date).utc().utcOffset(3, true)
                          .format('dddd')
                      }
                      console.log("ITEM", item)
                      return (
                        <Box
                          key={item.date}
                          hardShadow={'1'}
                          p="$4"
                          mb="$6"
                          borderRadius="$lg"
                          bg="$white">
                          <Text color="$textDark500">
                            {`Total para el día ${item.date}: `}
                            <Text color="$textDark500" fontWeight="bold">
                              {user?.commission && item?.dayTotalAmount * user?.commission/ 100 | 0}
                            </Text>
                          </Text>
                          <Text color="$textDark500">
                            cortes realizados:{' '}
                            <Text color="$textDark500" fontWeight="bold">
                              {item?.dayTotalServices | 0}
                            </Text>
                          </Text>
                          <Text color="$textDark500">
                            Total para el barbero:{' '}
                            <Text color="$textDark500" fontWeight="bold">
                              {item?.dayTotalServices | 0}
                            </Text>
                          </Text>
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
