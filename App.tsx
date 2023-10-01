import React, {useEffect, useState} from 'react';
import moment from 'moment-timezone';
import Timetable from 'react-native-calendar-timetable';
import {Button, Modal, ScrollView, View} from 'react-native';
import {config, GluestackUIProvider, Text} from '@gluestack-ui/themed';
import {Event, TurnSelectItem} from './src/types/turns';
import Clock from 'react-live-clock';
import SelectServiceModal from './src/components/selectServiceModal';
import {Service} from './src/types/services';
import SelectTurnModal from './src/components/selectTurnModal';

moment.tz.setDefault('America/Argentina/Buenos_Aires');

const hours = [
  1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22,
  23, 0, 1, 2,
];

export default function App() {
  const [showServiceModal, setShowServiceModal] = useState<boolean>(false);
  const [date] = React.useState(moment().toDate());

  const [showTurnModal, setShowTurnModal] = useState<boolean>(false);
  const [turnList, setTurnList] = useState<TurnSelectItem[]>([]);
  const [selectedService, setSelectedService] = useState<Service | null>(null);

  const [items, setItems] = React.useState<Event[]>([]);
  const addTurn = (turn: TurnSelectItem) => {
    if (selectedService) {
      setItems([
        ...items,
        {
          title: selectedService.name,
          startDate: moment(turn.startDate).toDate(),
          endDate: moment(turn.startDate)
            .add(selectedService.duration, 'minutes')
            .toDate(),
        },
      ]);
      setSelectedService(null);
      setShowTurnModal(false);
    }
  };

  useEffect(() => {
    const checkTurnForServiceTime = () => {
      let startDate = moment(new Date());
      const list: TurnSelectItem[] = [];
      hours.forEach(hour => {
        if (moment().hour() <= hour) return;
        const isUnavaibleIndex = items.findIndex((turn: Event) => {
        
          const clonedStartDate = startDate.clone();
          const startDateValidation =  clonedStartDate.isBetween(
            moment(turn.startDate),
            moment(turn.endDate),
          )
          const endDateValidation = clonedStartDate
          .add(selectedService?.duration, 'minutes')
          .isBetween(moment(turn.startDate), moment(turn.endDate))
          if(startDateValidation || endDateValidation){
            return true
          }else{
            return false
          }
        });
        if (isUnavaibleIndex < 0) {
          const clonedStartDate = startDate.clone();
          list.push({startDate: clonedStartDate.toDate()});
        }
        startDate = startDate.add(selectedService?.duration, 'minutes');
      });
      setTurnList(list);
      setShowTurnModal(true);
    };
    if (selectedService) {
      checkTurnForServiceTime();
    }
  }, [selectedService]);

  const handleServiceSelect = (e: Service) => {
    setSelectedService(e);
    setShowServiceModal(false);
  };
console.log("items", items)
  return (
    <>
      <GluestackUIProvider config={config.theme}>
        <SelectServiceModal
          show={showServiceModal}
          onSelect={handleServiceSelect}
          onClose={() => setShowServiceModal(false)}
        />
        <Button title="Agendar" onPress={() => setShowServiceModal(true)} />
        <Clock format={'hh:mm:ss'} ticking={true} element={Text} />
        <ScrollView>
          <Timetable
            // these two are required
            itemMinHeightInMinutes={100}
            hourHeight={100}
            is12Hour={true}
            items={items}
            renderItem={({style, item, daysTotal}) => {
              console.log("style element", style)

              return (
              <View style={style}>
                <Text style={{backgroundColor: '#000', width:"auto"}}>{item.title}</Text>
              </View>
            )}}
            // provide only one of these
            date={date}
          />
        </ScrollView>
        <SelectTurnModal
          onSelect={addTurn}
          turns={turnList}
          show={showTurnModal}
          onClose={() => setShowTurnModal(false)}
        />
      </GluestackUIProvider>
    </>
  );
}
