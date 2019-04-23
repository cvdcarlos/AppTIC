import React, { Component } from 'react';
import {
  Platform,
  StyleSheet,
  Text,
  View,
  AppState,
  FlatList,
  UIManager,
  Switch,
  PanResponder,
  TouchableOpacity,
  ToastAndroid,
  TimePickerAndroid,
  LayoutAnimation,
  Animated,
  Dimensions
} from 'react-native';

import { Card, ListItem, Button} from 'react-native-elements';

import BluetoothSerial from 'react-native-bluetooth-serial';

import CountDown from 'react-native-countdown-component';
import Icon from 'react-native-vector-icons/FontAwesome5';
import PushNotification from 'react-native-push-notification';
import PushController from './PushController.js'; //The push controller created earlier

import { AnimatedCircularProgress } from 'react-native-circular-progress';

const CustomLayoutAnimation = { 
  duration: 500, 
  create: { type: 'easeIn', property: 'opacity'}, 
  update: { type: 'easeInEaseOut' }, 
  delete: { type: 'easeOut', property: 'opacity' } 
};

const { width, height } = Dimensions.get('window')

export default class HomeScreen extends Component {
    constructor (props) {
        super(props);
        //this.circularProgress.animate(100, 8000, Easing.quad); // Will fill the progress bar linearly in 8 seconds
        
        this.state = {
          connected: false,
          LightOnCount: 0,
          CargaBateria: 100,
          tiempoAtras: false,
          horaview: '',
          minutoview: '',
          switchActivo: false,
          tituloSwitch: 'Manual',
          timer_run: false,
          datee: '',
          horas_o_hora: 'horas',
          minutos_o_minuto: 'minutos',
          colorPrenderBomba: '',
          isHidden: false,
          index: 1,
          
          Porcentajebateria: 90,
          temperatura: '21',
          humedad: '60',
          
          size_bateria:260

        }
        
        if (Platform.OS === 'android') {
          UIManager.setLayoutAnimationEnabledExperimental(true)
          
        }
      };

      
      
      static navigationOptions = {
        title: 'Home',
        headerStyle: {
            backgroundColor: 'steelblue',
          },
        headerTintColor: 'white',
        headerTitleStyle: {
            fontWeight: 'bold',
            textAlign: 'center',
            width: '90%'
            
          }
    }
    
    /*start = () => {
      console.log(`${h}:${m}`);
      console.log("esperando...");
      this.tiempo = setTimeout(() => {
        // Your code
        console.log('se acabo');
    
    
        }, 1000 * 10);
    }*/

    _Agrandar = () => {
      // Animate the update
      LayoutAnimation.spring();
      this.setState({size_bateria: 260})
    }
    _Achicar = () => {
      // Animate the update
      LayoutAnimation.spring();
      this.setState({size_bateria: 185})
    }

    desactivarBomba(){
      console.log('desactivarBomba');
      
      BluetoothSerial.write("D").then((res) => {
        
        console.log('Apagar bomba');
        ToastAndroid.show(`Bomba Desactivada`, ToastAndroid.SHORT);
        this.setState({ connected: true });
        this.switchtest(false);
      
      })
      .catch((err) => console.log(err.message))
     }
    ActivarBomba(){
        BluetoothSerial.write("T").then((res) => {
          
          console.log('Activar Bomba')
          ToastAndroid.show(`Bomba Activada`, ToastAndroid.SHORT);
          this.setState({ connected: true })
        
        })
        .catch((err) => console.log(err.message))
    }
    readData(){
        BluetoothSerial.readFromDevice().
        then((res) => {                       // Arreglar para mostrar numero q se quiera.
          const strArr = res.split(";");
          const LightOnCount = strArr[strArr.length - 2];
          const finalCount = LightOnCount.substring(0, LightOnCount.length);
          this.setState({ LightOnCount: finalCount })
        })
        .catch((err) => console.log(err.message))
    }
    readData2(){
        BluetoothSerial.readFromDevice().
        then((res) => {                       // Arreglar para mostrar numero q se quiera.
          const strArr = res.split(";");
          const LightOnCount = strArr[strArr.length - 2];
          const finalCount = LightOnCount.substring(0, LightOnCount.length);
          const n = Number(finalCount);
          this.setState({ CargaBateria: n })
        })
        .catch((err) => console.log(err.message))
    }
    
    async mostrar_reloj(){
        try {
            const {action, hour, minute} = await TimePickerAndroid.open({
              hour: 0,
              minute: 1,
              is24Hour: true, 
              mode: 'spinner'
            });
            if(minute===1){
                this.setState({minutos_o_minuto: 'minuto'});
                
            }
            if(hour===1){
              this.setState({horas_o_hora: 'hora'});
            }
            if (action !== TimePickerAndroid.dismissedAction) {
              // Selected hour (0-23), minute (0-59)
                //console.log(`${hour}:${minute}`);
                
                this.setState({horaview: hour});
                this.setState({minutoview: minute});
                this.setState({timer_run: true});            // no mostrar la alerta de termino al principio
                /*this.tiempo = setTimeout(() => {
                  // Your code
                  //console.log('se acabo');

                  
                  this.hour=0;
                  this.minute=0;
                  this.setState({minutoview:0});
                  this.setState({horaview:0});
                  

                  

              
                }, 1000 * 59 * minute + 1000 * 60 * 60 * hour);*/
                
                if (minute !== 0 || hour !== 0 ){
                PushNotification.localNotificationSchedule({
                  id:'123',
                  title: "Bomba Desactivada", 
                  message: `La bomba estuvo activada: ${hour} ${this.state.horas_o_hora} y ${minute} ${this.state.minutos_o_minuto}`, // (required)
                  autoCancel: true,
                  date: new Date(Date.now() + (minute * 59 * 1000) + (hour * 60 * 60 * 1000)), 
                  
                });
                }
                
                
                

                /*this.tiempo = setTimeout(() => {
                    // Your code
                    this.setState({ tiempoAtras: false });
                    
                    console.log('fin');
                  }, 1000 * 60 * m);*/

              /*let date = new Date();

                let hours = date.getHours();
                let minutes = date.getMinutes();
                //let seconds = date.getSeconds();
                console.log(`${hours}:${minutes}`);
                console.log(`${hour}:${minute}`);
                if(hours===hour && minutes == hour){
                    this.toggleSwitch();
                }*/
              //this.toggleSwitch();
              
            }else{
              this.switchtest(false);
            }
          } catch ({code, message}) {
            console.warn('Cannot open time picker', message);
          }
        
    }
    /*componentDidMount() {
      AppState.addEventListener('change', this.handleAppStateChange);
    };
    
    componentWillUnmount() {
      AppState.removeEventListener('change', this.handleAppStateChange);
    };
    
    // This will notify the user in 3 seconds after sending the app to the 
    // background (like after pressing the home button or switching apps)
    handleAppStateChange(appState) {
      if (appState === 'background') {
        // Schedule a notification
        PushNotification.localNotificationSchedule({
          title: "Bomba Desactivada", 
          message: 'La bomba estuvo activada: n minutos', // (required)
          date: new Date(Date.now() + (this.state.minutoview * 60 * 1000)), // in 3 secs
          autoCancel: true
        });
      }
    };
  
    sendNotification() {
      PushNotification.localNotification({
        message: 'You pushed the notification button!'
      });
    };*/

    /*function makeTwoDigits (time) {
        const timeString = `${time}`;
        if (timeString.length === 2) return time
        return `0${time}`
    }*/
    
    onPress(index) {

      // Uncomment to animate the next state change.
      LayoutAnimation.configureNext(LayoutAnimation.Presets.spring);
  
      // Or use a Custom Layout Animation
      //LayoutAnimation.configureNext(CustomLayoutAnimation);
  
      this.setState({index: index});
    }
    
    parartimeout(){
      console.log('PARARTIEMPO');
      clearTimeout(this.tiempo);
    }
    switchtest(value){
      if(value===true){
          console.log("true");
          this.setState({tituloSwitch: 'Automatico'});
          this.setState({switchActivo: true});
          this.mostrar_reloj();
          this._Achicar();
          this.onPress(0);
  
      }else{
          console.log("false");
          
          this.setState({tituloSwitch: 'Manual'});
          this.setState({switchActivo: false});
          this.setState({minutoview:0});
          this.setState({horaview:0});
          PushNotification.cancelLocalNotifications({id: '123'});
          //this.parartimeout();
          
          this.onPress(1);
          this._Agrandar();
      }
     }
    /*parar_reloj(){

      this.setState({minutoview: 0});
      this.setState({horaview: 0});
    }
    
    componentDidMount() {
      var that = this;
      var date = new Date().getDate(); //Current Date
      var month = new Date().getMonth() + 1; //Current Month
      var year = new Date().getFullYear(); //Current Year
      var hours = new Date().getHours(); //Current Hours
      var min = new Date().getMinutes(); //Current Minutes
      var sec = new Date().getSeconds(); //Current Seconds
      that.setState({
        //Setting the value of the date time
        datee:
          year + '/' + month + '/' + date + ' ' + hours + ':' + min,
      });
    }*/
    /*fincron(){
      ()=> alert('Bomba Desactivada');
      
    }*/
    render() {
      var LayoutSwitch = this.state.index === 0 ? { flexDirection:'column',height:160} : {};
      var LayoutSensores = {height:100};
      var Layoutbateria = {height:166,top: 30};
      var cronstyle = this.state.index === 0 ? {top:18} : {display:'none'};
      var reloj = this.state.index  === 0 ? {justifyContent:'center', alignItems: 'center'} : {display:'none'};


      //var cronstyle = this.state.index === 0 ? {display: 'flex', top: 40} : {display: 'none', width: 400};
      //var reloj = this.state.index === 0 ? {position:'absolute', right: 165, top: 90} : {display: 'none'};
      var power = this.state.index === 0 ? {display:'none'} : {justifyContent:'center', alignItems: 'center', bottom:95};
      
      //var middleStyle = this.state.index === 2 ? {width: 40} : {flex: 1};
      //var rightStyle = {flex: 1};

      var whiteHeight = this.state.index * 80;
      
      const fill = this.state.Porcentajebateria;
        return (

          <View style={styles.container} >
          <PushController/>

            <View style={styles.toolbar}>
              <Text style={styles.toolbarTitle}>{this.state.tituloSwitch}</Text>
                <View style={styles.toolbarButton}>
                    <Switch
                      value={this.state.switchActivo}
                      onValueChange={(val) => this.switchtest(val)}
                      trackColor={{true: 'white', false: 'white'}}
                      style={{ transform: [{ scaleX: 1.3 }, { scaleY: 1.3 }] }}
                      //trackColor="#FFFF"
                      //tintColor="#ffff"
                      //thumbColor="#FFFF"
                      //onTintColor="#FFFF"
                    
                    />
                  </View>
             </View>
              
        
              <View style={styles.content}>
                <View style={[LayoutSwitch, {backgroundColor: 'skyblue'}]}>
                    <View style={[cronstyle]}>
                        <CountDown
                          size={35}
                          until={this.state.minutoview * 60 + 60 * 60* this.state.horaview}
                          onFinish={this.desactivarBomba.bind(this)}
                          digitStyle={{backgroundColor: '#FFF', borderWidth: 2, borderColor: 'steelblue'}}
                          digitTxtStyle={{color: 'steelblue'}}
                          timeLabelStyle={{color: 'red', fontWeight: 'bold'}}
                          separatorStyle={{color: 'steelblue'}}
                          timeToShow={['H', 'M', 'S']}
                          timeLabels={{m: null, s: null}}
                          showSeparator
                          running = {this.state.timer_run}
                          />

                      </View>
                
                  </View>
                <View style={[LayoutSensores, {backgroundColor: 'steelblue'}]}>
                  <Text style={styles.textotemperatura}>{this.state.temperatura}º</Text> 
                  <Text style={styles.textohumedad}>{this.state.humedad}%</Text> 
                </View>

                {/*<View style={[reloj]}>
                          <Icon.Button
                              name="stopwatch"
                              color = 'steelblue'
                              size = {60}
                              backgroundColor="skyblue"
                              onPress={this.mostrar_reloj.bind(this)}
                            >
                              
                          </Icon.Button>

                          

                            

                </View>*/}
                <View style={[power]}>
                  <Button
                        icon={
                          <Icon
                            name="power-off"
                            size={70}
                            color="#7CFC00"
                          />
                        }
                        type="clear"
                        onPress={this.ActivarBomba.bind(this)}
                      />
                      </View>

                      
                {/*<View style={{height: 100, backgroundColor: 'steelblue'}}>*/}
                
                {/*<View style={[Layoutbateria, {backgroundColor: 'steelblue'}]}>
                
                </View>*/}
                
                
                  <View style={styles.speedom}>

                  <AnimatedCircularProgress
                      size={this.state.size_bateria}
                      width={4}
                      duration={2000}
                      fill={fill}
                      tintColor="#00e0ff"
                      backgroundColor="#3d5875"
                    >
                      {fill => <Text style={styles.points}>{Math.round((fill))}%</Text>}
                    </AnimatedCircularProgress>

                  {/*<AnimatedCircularProgress
                      
                      size={155}
                      width={3}
                      fill={this.state.fill}
                      tintColor="#7CFC00"
                      duration={1500}
                      prefill={0}
                      
                      
                      rotation={190}
                      arcSweepAngle={340}
                      backgroundColor="#3d5875">
                    
                      {
                        (fill) => (
                          <Text style={styles.points}>
                            { this.state.fill }%
                          </Text>
                        )
                      }
                      
                      
                    </AnimatedCircularProgress>*/}
                  </View>

                  {/*<View style={[styles.box, {width: this.state.w, height: this.state.h}]} 
                  
                  />*/}
                   {/*<Button title="agrandar" 
                    onPress={this._Agrandar.bind(this)}
                    color="#1881cc"
                    
            />

                    <Button title="achicar" 
                                        onPress={this._Achicar.bind(this)}
                                        color="#1881cc"
                                        
                                />*/}

                
                
              </View> 
              
              {/*<View style={[power]}>
                      <Icon.Button
                      name="power-off"
                      color = "#0fa528"
                      size = {70}
                      backgroundColor='skyblue'
                      onPress={this.toggleSwitch.bind(this)}
                      >
                      </Icon.Button>
              </View>     */}        
              
              
                {/*<View style={{flexDirection: 'column', height: 200}}>
                  <View style={[SensoresLayout, {backgroundColor: 'skyblue'}]}>
                  
                  </View>
                
                
                
                
                  </View>*/}

                {/*<View style={{height: 100, backgroundColor: 'skyblue'}}>
                  
                  <Text style={styles.textotemperatura}>{this.state.temperatura}</Text>
                  <Text style={styles.textohumedad}>{this.state.humedad}</Text>
                </View>*/}
                 
              
              
                        
          
            

          </View>
            
        );
    }
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'skyblue'
  },
  content: {
    flex: 1,
    alignSelf: 'stretch',
  
  },
  speedom:{
    justifyContent:'center', 
    alignItems: 'center',
    top:5
    //width: width * 0.8, // 80% of screen's width
    //height: height * 0.8 // 20% of screen's height
    
  },
  textotemperatura: {
    color: 'white',
    fontSize: 60,
    left:10,
    top:10,
    
    
  },
  points:{
    fontSize:60,
    
  },
  textohumedad: {
    color: 'white',
    fontSize: 60,
    bottom:70,
    left:240
    
  
    
  },
  
  toolbarButton:{
    width: 50,
    marginTop: 8,
    right: 10
    
  },
  toolbar:{
    paddingTop:10,
    paddingBottom:10,
    flexDirection:'row',
    backgroundColor: 'skyblue',
  },
  toolbarTitle:{
    textAlign:'center',
    fontWeight:'bold',
    fontSize: 20,
    flex:1,
    marginTop:6,
    color: "white"
  },
  points: {
    textAlign: 'center',
    color: '#7591af',
    fontSize: 50,
    fontWeight: '100',
  },
});