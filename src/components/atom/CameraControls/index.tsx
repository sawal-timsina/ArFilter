import {
  Image,
  Linking,
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {ProgressBar} from 'react-native-paper';
import Icon from 'react-native-vector-icons/dist/FontAwesome';
import React, {FC} from 'react';
import CameraChange from '~/assets/icons/cameraChange.svg';
import {Filter} from '../../../interfaces/filter';

interface Props {
  latestImage: string;
  switchCamera: () => void;
  currentFilter: Filter;
}

const CameraControls: FC<Props> = ({
  latestImage,
  switchCamera,
  currentFilter,
}) => {
  return (
    <View style={[styles.bottomBar]}>
      <TouchableOpacity
        style={{
          overflow: 'hidden',
          margin: 6,
          borderWidth: 2,
          borderColor: 'white',
          borderRadius: 8,
          height: 32,
          width: 32,
        }}
        onPress={() => {
          Linking.openURL(
            Platform.select({
              android: 'content://media/internal/images/media',
              ios: 'photos-redirect://',
            }) || '',
          );
        }}>
        {latestImage ? (
          <Image
            source={{uri: latestImage}}
            style={{width: '100%', height: '100%'}}
          />
        ) : (
          <ProgressBar style={{width: '100%', height: '100%'}} />
        )}
      </TouchableOpacity>

      <View style={[styles.filterDetails]}>
        <TouchableOpacity style={{padding: 8}} onPress={() => {}}>
          <Icon name="bookmark" size={20} color="#aaa" />
        </TouchableOpacity>

        <View style={{alignItems: 'center', flex: 1}}>
          <Text style={{color: '#aaa'}}>{currentFilter.title}</Text>
          <Text style={{color: '#aaa'}}>{currentFilter.title}</Text>
        </View>

        <TouchableOpacity style={{padding: 8}} onPress={() => {}}>
          <Icon name="close" size={20} color="#aaa" />
        </TouchableOpacity>
      </View>

      <TouchableOpacity style={{padding: 8}} onPress={switchCamera}>
        <CameraChange width={28} height={28} fill={'#fff'} />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  bottomBar: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
    paddingLeft: 16,
    paddingRight: 16,
  },
  filterDetails: {
    alignSelf: 'center',
    flex: 1,
    height: 48,
    borderRadius: 24,
    backgroundColor: 'rgba(100,100,100,0.5)',
    marginLeft: 16,
    marginRight: 16,
    paddingLeft: 16,
    paddingRight: 16,
    alignItems: 'center',
    flexDirection: 'row',
  },
});

export {CameraControls};
