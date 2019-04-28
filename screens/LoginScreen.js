import React, { Component } from 'react';
import {
  Platform,
  StyleSheet,
  Text,
  View,
  Button,
  FlatList,
  Switch,
  TouchableOpacity,
  ToastAndroid,
  Dimensions
} from 'react-native';
var _ = require('lodash');
import BluetoothSerial from 'react-native-bluetooth-serial'
var window = Dimensions.get('window');
export default class LoginScreen extends Component {
  constructor (props) {
    super(props)
    this.state = {
      isEnabled: false,
      discovering: false,
      devices: [],
      unpairedDevices: [],
      connected: false,
    }
  }
  
  static navigationOptions = {
    title: 'Caudal Solar',
    headerStyle: {
        backgroundColor: 'steelblue',
        height: window.height*0.1
      },
    headerTintColor: 'white',
    headerTitleStyle: {
      fontWeight: 'bold',
      textAlign:"center", 
      flex:1,
      fontSize:30
       
        
      }
  }
  componentWillMount(){

    Promise.all([
      BluetoothSerial.isEnabled(),
      BluetoothSerial.list()
    ])
    .then((values) => {
      const [ isEnabled, devices ] = values

      this.setState({ isEnabled, devices })
    })

    BluetoothSerial.on('bluetoothEnabled', () => {

      Promise.all([
        BluetoothSerial.isEnabled(),
        BluetoothSerial.list()
      ])
      .then((values) => {
        const [ isEnabled, devices ] = values
        this.setState({  devices })
      })

      BluetoothSerial.on('bluetoothDisabled', () => {

         this.setState({ devices: [] })

      })
      BluetoothSerial.on('error', (err) => console.log(`Error: ${err.message}`))

    })

  }
  connect (device) {
    this.setState({ connecting: true })
    BluetoothSerial.connect(device.id)
    .then((res) => {
      console.log(`Connected to device ${device.name}`);
      
      ToastAndroid.show(`Connected to device ${device.name}`, ToastAndroid.SHORT);
      this.props.navigation.replace('Home');
    })
    .catch((err) => console.log((err.message)))
  }
  _renderItem(item){

    return(<TouchableOpacity onPress={() => this.connect(item.item)}>
            <View style={styles.deviceNameWrap}>
              <Text style={styles.deviceName}>{ item.item.name ? item.item.name : item.item.id }</Text>
            </View>
          </TouchableOpacity>)
  }
  enable () {
    BluetoothSerial.enable()
    .then((res) => this.setState({ isEnabled: true }))
    .catch((err) => Toast.showShortBottom(err.message))
  }

  disable () {
    BluetoothSerial.disable()
    .then((res) => this.setState({ isEnabled: false }))
    .catch((err) => Toast.showShortBottom(err.message))
  }

  toggleBluetooth (value) {
    if (value === true) {
      this.enable()
    } else {
      this.disable()
    }
  }
  /*discoverAvailableDevices () {
    
    if (this.state.discovering) {
      return false
    } else {
      this.setState({ discovering: true })
      BluetoothSerial.discoverUnpairedDevices()
      .then((unpairedDevices) => {
        const uniqueDevices = _.uniqBy(unpairedDevices, 'id');
        console.log(uniqueDevices);
        this.setState({ unpairedDevices: uniqueDevices, discovering: false })
      })
      .catch((err) => console.log(err.message))
    }
  }*/
  
  render() {

    return (
      <View style={styles.container}>
      <View style={styles.toolbar}>
            <Text style={styles.toolbarTitle}>Dispositivos Bluetooth</Text>
            <View style={styles.toolbarButton}>
              <Switch
                value={this.state.isEnabled}
                onValueChange={(val) => this.toggleBluetooth(val)}
                trackColor={{true: 'white', false: 'white'}}
                style={{ transform: [{ scaleX: 1.3 }, { scaleY: 1.3 }] }}
                //trackColor="#FFFF"
                //tintColor="#ffff"
                //thumbColor="#FFFF"
                //onTintColor="#FFFF"
              
              />
            </View>
      </View>
        <FlatList
          style={{flex:1}}
          data={this.state.devices}
          keyExtractor={item => item.id}
          renderItem={(item) => this._renderItem(item)}
        />
      <View style={styles.botonprueba}>
            
          
            <Button title="ir al home(Boton Prueba)" 
                    onPress={()=>this.props.navigation.replace('Home')}
                    color="#1881cc"
                    
            />
      </View>
        <View style={styles.bottombar}>
          <Text style={styles.bottomTitle}>Eliga su Dispositivo</Text>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  toolbar:{
    
    flexDirection:'row',
    backgroundColor: 'skyblue',
    height: window.height*0.1
  },
  toolbarButton:{
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'flex-end',
    marginRight: 10,
    marginBottom: 15
    
  },
  toolbarTitle:{
    textAlign:'right',
    fontWeight:'bold',
    fontSize: 20,
    flex:1,
    marginTop:6,
    color: "white"
  },
  deviceName: {
    fontSize: 17,
    color: "black"
  },
  deviceNameWrap: {
    margin: 10,
    borderBottomWidth:1
  },
  bottombar:{
    paddingBottom:10,
    flexDirection:'row',
    backgroundColor: 'steelblue',
  },
  bottomTitle:{
    textAlign:'center',
    fontWeight:'bold',
    fontSize: 18,
    flex:1,
    marginTop: 6,
    color: "white"
  },
  botonprueba:{
    width: 200,
    marginBottom:100,

  
  
  }
});