import Carousel from 'react-native-snap-carousel';
import {
  Dimensions,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {Filter, FilterProps} from '../../../interfaces/filter';
import React, {FC, useEffect, useRef, useState} from 'react';

interface Props {
  filters: Filter[];
  setCurrentFilter: (index: number) => void;
  takePicture: () => void;
}

const Filters: FC<Props> = ({setCurrentFilter, filters, takePicture}) => {
  const courRef = useRef<Carousel<Filter>>(null);
  const [currentIndex, setCurrentIndex] = useState<number>(0);

  useEffect(() => {
    setCurrentFilter(currentIndex);
  }, [currentIndex, setCurrentFilter]);

  return (
    <View style={{paddingBottom: 16, backgroundColor: 'transparent'}}>
      <Carousel
        ref={courRef}
        itemWidth={70}
        sliderHeight={84}
        layout={'default'}
        inactiveSlideScale={0.8}
        inactiveSlideOpacity={1}
        slideStyle={[styles.circle]}
        activeAnimationType={'decay'}
        onSnapToItem={setCurrentIndex}
        sliderWidth={Dimensions.get('screen').width}
        data={filters}
        renderItem={({item, index}: FilterProps) => {
          return (
            <TouchableOpacity
              key={index}
              onPress={takePicture}
              disabled={index !== currentIndex}>
              <View
                style={[
                  styles.filterCard,
                  styles.circle,
                  styles.offRing,
                  {backgroundColor: item.background},
                ]}>
                {!index && !currentIndex ? <Text /> : <Text>{item.title}</Text>}
              </View>
            </TouchableOpacity>
          );
        }}
      />
      <View
        style={[
          StyleSheet.absoluteFill,
          styles.filterCard,
          {width: '100%', height: '100%'},
        ]}
        pointerEvents={'none'}>
        <View style={[styles.filterCard, styles.circle, styles.ring]} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  circle: {
    borderRadius: 40,
    height: 70,
    width: 70,
  },
  filterCard: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  ring: {
    borderWidth: 4,
    borderColor: 'white',
  },
  offRing: {borderWidth: 6, borderColor: 'transparent'},
});

export {Filters};
