import React, {PureComponent} from 'react';
import {RNCamera} from 'react-native-camera';

class Camera extends PureComponent {
  camera: any;
  constructor(props: {} | Readonly<{}>) {
    super(props);
  }

  render() {
    return (
      <RNCamera
        ref={ref => {
          this.camera = ref;
        }}
        captureAudio={true}
        style={{flex: 1, width: '100%', height: '100%', backgroundColor: 'red'}}
        type={RNCamera.Constants.Type.back}
        androidCameraPermissionOptions={{
          title: 'Permission to use camera',
          message: 'We need your permission to use your camera',
          buttonPositive: 'Ok',
          buttonNegative: 'Cancel',
        }}
      />
    );
  }
}

export {Camera};
