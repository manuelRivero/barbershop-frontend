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
  'Domingo',
  'Lunes',
  'Martes',
  'Miercoles',
  'Jueves',
  'Viernes',
  'Sabado',
];
const {width} = Dimensions.get('window');

export default function Stats() {
  const navigation = useNavigation<NativeStackNavigationProp<any>>();

  const {turns} = useAppSelector((state: RootState) => state.turns);
  const {data: statsData, isLoading, refetch} = useGetWeekStatsQuery();
  const [mappedData, setMappedData] = useState<any>();

  console.log('statsData', statsData);
  useEffect(() => {
    if (statsData) {
      const actualDateOfWeek = moment().weekday();
      const sortedData = statsData.data.sort((a, b) => a._id - b._id);
      const dataWithDates = sortedData.map(e => ({
        date: moment()
          .utc()
          .utcOffset(3, true)
          .set({day: e._id, hour: 0, minutes: 0})
          .format('dddd'),
        ...e,
      }));
      const data = {
        turns: daysOfWeek
          .filter((e, index) => index < actualDateOfWeek && index > 0)
          .map((dayOfWeek: string) => {
            const target = dataWithDates.find(e => e.date === dayOfWeek);
            if (target) {
              return target.dayTotalServices;
            } else {
              return 0;
            }
          }),
        labels: daysOfWeek.filter(
          (e, index) => index < actualDateOfWeek && index > 0,
        ),
        datasets: [
          {
            data: daysOfWeek
              .filter((e, index) => index < actualDateOfWeek && index > 0)
              .map((dayOfWeek: string) => {
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
      console.log('data', data);
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
  console.log("mapped data", mappedData)
  return (
    <LinearGradient
      style={{flex: 1}}
      colors={['#fff', '#f1e2ca']}
      start={{x: 0, y: 0.6}}
      end={{x: 0, y: 1}}>
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
            style={{fontSize: 22, color: '#1f3d56'}}
          />
          <Heading textAlign="center" color="$textDark500">
            Estadisticas
          </Heading>
        </VStack>
        <Box flex={1}>
          <ScrollView flex={1} mt="$10">
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
                      {turns.reduce((accumulator, object) => {
                        return object.status === 'COMPLETE'
                          ? accumulator + object.price
                          : accumulator;
                      }, 0)}{' '}
                      Pesos
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

                <Box mt={'$4'} position="relative" hardShadow='1' bg="$white" borderRadius="$lg" overflow='hidden'>
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
                        <Text
                          position="absolute"
                          color="$textDark500"
                          top={y}
                          left={x}>
                          {indexData}
                        </Text>
                      );
                    }}
                    fromZero
                  />
                </Box>
                <Box mt="$6">
                  {daysOfWeek
                    .filter(
                      (e, index) => index < moment().weekday() && index > 0,
                    )
                    .map((dayOfWeek: string) => {
                      const target = statsData?.data
                        .sort((a, b) => a._id - b._id)
                        .map(e => ({
                          date: moment()
                            .utc()
                            .utcOffset(3, true)
                            .set({day: e._id, hour: 0, minutes: 0})
                            .format('dddd'),
                          ...e,
                        }))
                        .find(e => e.date === dayOfWeek);
                      return (
                        <Box
                          key={dayOfWeek}
                          hardShadow={'1'}
                          p="$4"
                          mb="$6"
                          borderRadius="$lg"
                          bg="$white">
                          <Text color="$textDark500">
                            {`Total para el día ${dayOfWeek}: `}
                            <Text color="$textDark500" fontWeight="bold">
                              {target?.dayTotalAmount | 0}
                            </Text>
                          </Text>
                          <Text color="$textDark500">
                            cortes realizados:{' '}
                            <Text color="$textDark500" fontWeight="bold">
                              {target?.dayTotalServices | 0}
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
