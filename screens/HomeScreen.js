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
  Dimensions,
  ImageBackground,
  Image
  
} from 'react-native';

import { Card, ListItem, Button, Badge, Divider} from 'react-native-elements';

import BluetoothSerial from 'react-native-bluetooth-serial';

import CountDown from 'react-native-countdown-component';
import Icon from 'react-native-vector-icons/FontAwesome5';
import PushNotification from 'react-native-push-notification';
import PushController from './PushController.js'; //The push controller created earlier
import AnimatedEllipsis from 'react-native-animated-ellipsis';
import BackgroundJob from 'react-native-background-job';
import BackgroundTimer from 'react-native-background-timer';


 const regularJobKey = "regularJobKey";
const exactJobKey = "exactJobKey";
const foregroundJobKey = "foregroundJobKey";

 const everRunningJobKey = "everRunningJobKey";
 
 /*BackgroundJob.register({
  jobKey: foregroundJobKey,
  job: () => console.log(`Exact Job fired!. Key = ${foregroundJobKey}`)
});
BackgroundJob.schedule({
  jobKey: foregroundJobKey,
  //period: 1000,
  //exact: true,
  allowExecutionInForeground: true
});*/
//BackgroundJob.cancel({jobKey: 'foregroundJobKey'});
//BackgroundJob.cancelAll();
const CustomLayoutAnimation = { 
  duration: 300, 
  //create: { type: 'easeInEaseOut', property: 'scaleY'}, 
  update: { type: 'easeInEaseOut', property: 'scaleY' }, 
 // delete: { type: 'easeInEaseOut', property: 'scaleY' }, 
};

//const { width, height } = Dimensions.get('window')
var window = Dimensions.get('window');


export default class HomeScreen extends Component {
    constructor (props) {
        super(props);
        //this.circularProgress.animate(100, 8000, Easing.quad); // Will fill the progress bar linearly in 8 seconds
        
        this.state = {
          connected: false,
          LightOnCount: 0,
          LightOnCount2: 0,
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
          
          size_bateria: 0,
          size_power: 0,
          posicion_temp: 0,
          posicion_hum: 0,

          margin: 0,
          flag: 0,

          testt:0,

          valorTemp:14,
          valorHum:61,

          posi_temp_arriba:0,
          posi_temp__abajo:0,
          posi_hum_arriba:0,
          posi_hum__abajo:0,
          cuentaatras:2,

          esta_prendido: false,
          size_countdown:0,
          status:'error',
          labeloffon:'OFF',
        
          
          
          


         

        }
        
        
        if (Platform.OS === 'android') {
          UIManager.setLayoutAnimationEnabledExperimental(true)
          UIManager.setLayoutAnimationEnabledExperimental;
          
        }
      };

      
      
      static navigationOptions = {
        title: 'Home',
        headerStyle: {
            backgroundColor: "#208eed",
            height: window.height*0.1,
            
          },
        headerTintColor: 'white',
        headerTitleStyle: {
          fontWeight: 'bold',
          textAlign:"center", 
          flex:1,
          fontSize:30
           
            
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
    algo(){
      console.log('algo');
    }
    componentWillUnmount(){
      clearInterval(this.intervalo);
      
    
    }
    componentDidMount() {
      this.intervalo = setInterval(() => {
        this.readData(); 
    }, 10000);

     
    
      if (window.height > 600){
        this.setState({size_bateria: 370})
        this.setState({size_power: 95})
        
        this.setState({margin: 420})
        this.setState({size_countdown: 40})

        //this.setState({posi_temp_arriba: 100})
        //this.setState({posi_hum_arriba: 215})

        //this.setState({posi_temp_abajo: 105})
        //this.setState({posi_temp_abajo: 105})



        //this.setState({posicion_temp: 105})
        //this.setState({posicion_hum: 185})

      }else if(window.height >550 && window.height <= 600) {
        this.setState({size_bateria: 300})
        this.setState({size_power: 82})
        this.setState({margin: 358})
        this.setState({size_countdown: 35})

        //this.setState({posicion_temp: 100})
        //this.setState({posicion_hum: 180})
      }else{
        this.setState({size_bateria: 260})
        this.setState({size_power: 73});
        this.setState({margin: 320})
        this.setState({size_countdown: 30})

        //this.setState({posicion_temp: 95})
        //this.setState({posicion_hum: 175})
      }
      
    };

    /*_Bajar_sensores = () =>{
      if (window.height > 600){
         this.setState({posicion_temp: -10})
        this.setState({posicion_hum: 70})

      }else if(window.height >550 && window.height <= 600) {
        this.setState({posicion_temp: -5})
        this.setState({posicion_hum: 75})
      }else{
        this.setState({posicion_temp: 0})
        this.setState({posicion_hum: 80})
      }

    }
    _Subir_sensores = () =>{
      if (window.height > 600){
        this.setState({posicion_temp: 105})
        this.setState({posicion_hum: 185})
      }else if(window.height >550 && window.height <= 600) {
        this.setState({posicion_temp: 100})
        this.setState({posicion_hum: 180})
      }else{
        this.setState({posicion_temp: 95})
        this.setState({posicion_hum: 175})
      }

    }
    _Agrandar = () => {
      // Animate the update
      LayoutAnimation.spring();
      if (window.height > 600){
        this.setState({size_bateria: 370})

      }else if(window.height >550 && window.height <= 600) {
        this.setState({size_bateria: 300})
      }else{
        this.setState({size_bateria: 260})
      }
      
      
      
    }
    _Achicar = () => {
      // Animate the update
      LayoutAnimation.spring();
      if (window.height > 600){
        this.setState({size_bateria: 260})

      }else if(window.height >550 && window.height <= 600) {
        this.setState({size_bateria: 220})
      }else{
        this.setState({size_bateria: 200})
      }
    }*/
    ActivarBomba(){
      BluetoothSerial.write("A").then((res) => {
        console.log('activ');
        ToastAndroid.showWithGravityAndOffset(
          'Bomba Activada',
          ToastAndroid.SHORT,
          ToastAndroid.BOTTOM,
          0,
          25,
        );
        this.setState({esta_prendido: true});
        this.setState({labeloffon: 'ON'});
        this.setState({status: 'success'});
      })
      .catch((err) => console.log(err.message))
    }
    DesactivarBomba(){
      BluetoothSerial.write("D").then((res) => {
        console.log('desac');
        ToastAndroid.showWithGravityAndOffset(
          'Bomba Desactivada',
          ToastAndroid.SHORT,
          ToastAndroid.BOTTOM,
          0,
          25,
        );
        this.setState({esta_prendido: false});
        this.setState({labeloffon: 'OFF'});
        this.setState({status: 'error'});
        //this.switchtest(false);
      })
      .catch((err) => console.log(err.message))
     }
    Activar_o_Desactivar(){
      if(this.state.esta_prendido === false){
        this.ActivarBomba();
      }else if (this.state.esta_prendido === true){
        this.DesactivarBomba();
      }
      
    } 
    
    readData(){
      BluetoothSerial.readFromDevice().
      then((res) => {
        //console.log('res',res);
        const strArr = res.split(";");
        //console.log(strArr);
        //console.log('str',strArr);
        //console.log('largo',strArr.length);
        
        if(strArr!=''){
          var temp = strArr[0];
          var hum = strArr[1];
          var temp= Number.parseInt(temp,10);
          if(temp >= 3){
          var temp = temp-3;
          }
          var hum = Number.parseInt(hum,10);

          this.setState({ valorTemp: temp });
          this.setState({ valorHum: hum });
          
          //console.log('hum',hum);
          //console.log('temp',temp);
          
        }else{
          //console.log('No se recibe data');
          //this.setState({ valorTemp: 23 });
          //this.setState({ valorHum: 44 });
        }
      })
      .catch((err) => console.log(err.message))
    }


    /*readData2(){
        BluetoothSerial.readFromDevice().
        then((res) => {                       // Arreglar para mostrar numero q se quiera.
          const strArr = res.split(";");
          const LightOnCount = strArr[strArr.length - 2];
          const finalCount = LightOnCount.substring(0, LightOnCount.length);
          const n = Number(finalCount);
          this.setState({ CargaBateria: n })
        })
        .catch((err) => console.log(err.message))
    }*/
    
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
                this.onPress(0);
                if(this.state.esta_prendido === false){
                  this.ActivarBomba();
                }
                this.timeoutId = BackgroundTimer.setTimeout(() => {
                  // this will be executed once after 10 seconds
                  // even when app is the the background
                  this.hour=0;
                  this.minute=0;
                  this.setState({minutoview:0});
                  this.setState({horaview:0});
                  //this.DesactivarBomba();
                  console.log('termina timeout')
                  //this.DesactivarBomba();
                  this.switchtest(false);
                }, 1000 * 60 * minute + 1000 * 60 * 60 * hour);
                /*this.tiempo = setTimeout(() => {
                  // Your code
                  //console.log('se acabo');

                  
                  this.hour=0;
                  this.minute=0;
                  this.setState({minutoview:0});
                  this.setState({horaview:0});
                  //this.DesactivarBomba();
                  console.log('termina timeout')
                  //this.DesactivarBomba();
                  this.switchtest(false);
                  

                  

                  

              
                }, 1000 * 60 * minute + 1000 * 60 * 60 * hour);*/
                
                if (minute !== 0 || hour !== 0 ){
                PushNotification.localNotificationSchedule({
                  id:'123',
                  title: "Bomba Desactivada", 
                  message: `La bomba estuvo activada: ${hour} ${this.state.horas_o_hora} y ${minute} ${this.state.minutos_o_minuto}`, // (required)
                  autoCancel: true,
                  date: new Date(Date.now() + (minute * 60 * 1000) + (hour * 60 * 60 * 1000)), 
                  
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
              //this.switchtest(false);
              this.setState({tituloSwitch: 'Manual'});
              this.setState({switchActivo: false});
              //this.desactivarBomba();
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
      //LayoutAnimation.configureNext(LayoutAnimation.Presets.spring);
  
      // Or use a Custom Layout Animation
      //LayoutAnimation.configureNext(CustomLayoutAnimation);
  
      this.setState({index: index});
    }
    
    parartimeout(){
      //console.log('PARARTIEMPO');
      //clearTimeout(this.tiempo);
      console.log('paarar');
      //this.clearTimeout(this.timer)
      BackgroundTimer.clearTimeout(this.timeoutId);
    }
    switchtest(value){
      if(value===true){
          console.log("true");
          this.setState({tituloSwitch: 'Automatico'});
          this.setState({switchActivo: true});
          this.mostrar_reloj();
          //this._Achicar();
          //this._Bajar_sensores();
          //this.onPress(0);
  
      }else if (value === false){
        this.DesactivarBomba();
        console.log('entra aqui');
      
          //console.log("false");
          
          this.setState({tituloSwitch: 'Manual'});
          this.setState({switchActivo: false});
          this.setState({minutoview:0});
          this.setState({horaview:0});
          PushNotification.cancelLocalNotifications({id: '123'});
          this.parartimeout();
          //this._Agrandar();
          //this._Subir_sensores();
          //this.onPress(1);
          this.onPress(1);
          
      }
     }
     /*pararbomba(){
      this.DesactivarBomba();
      console.log('entra aqui');
    
        //console.log("false");
        this.onPress(1);
        this.setState({tituloSwitch: 'Manual'});
        this.setState({switchActivo: false});
        this.setState({minutoview:0});
        this.setState({horaview:0});
        PushNotification.cancelLocalNotifications({id: '123'});
        //this.parartimeout();
        this._Agrandar();
        //this._Subir_sensores();
        //this.onPress(1);
     }*/
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
      var LayoutSwitch = this.state.index === 0 ? {flexDirection:'column',height: window.height*0.2, borderRadius:50,justifyContent:'center', alignItems: 'center', marginLeft:10, marginRight:10} : {};
      var LayoutPower = this.state.index === 0 ? {}:{flexDirection:'column',height: window.height*0.2, borderRadius:50,justifyContent:'center', alignItems: 'center', marginLeft:10, marginRight:10};
      var LayoutBateria = this.state.index === 0 ? {height: window.height*0.43, justifyContent:'center', alignItems: 'center'} : {height: window.height*0.61, justifyContent:'center', alignItems: 'center'};
      var cronstyle = this.state.index === 0 ? {flexDirection:'column',height: window.height*0.2, borderRadius:50,justifyContent:'center', alignItems: 'center', marginLeft:10, marginRight:10} : {display:'none'};
      var reloj = this.state.index  === 0 ? {justifyContent:'center', alignItems: 'center'} : {display:'none'};


      //var cronstyle = this.state.index === 0 ? {display: 'flex', top: 40} : {display: 'none', width: 400};
      //var reloj = this.state.index === 0 ? {position:'absolute', right: 165, top: 90} : {display: 'none'};
      var power = this.state.index === 0 ? {height:0,width:0} : {justifyContent:'center', alignItems: 'center'};
      var botonPower = this.state.index === 0 ?  {display:'none'}:{};
      var test = this.state.index === 0 ? {alignSelf:"flex-start",bottom:175/*this.state.posi_temp_arriba*/}:{bottom:190,alignSelf:"flex-start"};
      var test2 = this.state.index === 0 ? {bottom:255, alignSelf:"flex-end"}:{bottom:270,alignSelf:"flex-end"};
      var Layoutsensoress = {flex: 1, flexDirection: 'row', justifyContent: 'space-between',height:50};
      var toolbarTitle = this.state.tituloSwitch === 'Manual' ? {textAlign:'right',fontWeight:'bold',fontSize: 20,flex:1,marginLeft:85,color: "white", alignSelf:'center'}:{textAlign:'right',fontWeight:'bold',fontSize: 20,flex:1,marginLeft:110,color: "white",alignSelf:'center'};
      const resizeMode = 'center';
      var powerbadge = this.state.index === 0 ? {display:'none'}:{}
      var layoutArena = {flexDirection: 'row',backgroundColor:'steelblue',justifyContent:'center', alignItems: 'center', alignSelf:'center',marginTop:20};
     
      var badge2 = {height:100,alignSelf:'flex-end',flexDirection: 'row',backgroundColor:'skyblue'};
      //var badge4 = this.state.cuentaatras === 2 ? {}:{};
      //var middleStyle = this.state.index === 2 ? {width: 40} : {flex: 1};
      //var rightStyle = {flex: 1};

      //var whiteHeight = this.state.index * 80;
      
      //const fill = this.state.Porcentajebateria;
      console.log(this.state.index);
        return (

          //<ImageBackground source={require('./cool-background.png')} style={styles.container} >
          <View style={styles.container}> 
          <PushController/>

            <View style={styles.toolbar}>
            <Text style={toolbarTitle}>{this.state.tituloSwitch}</Text>
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
                <ImageBackground source={require('./cool-background-2.png')} imageStyle={styles.imagepower2} style={[LayoutSwitch]}>
                    <View style={[cronstyle]}>
                        <CountDown
                          size={33}
                          //style={[cronstyle]}
                          until={this.state.minutoview * 60 + 60 * 60* this.state.horaview}
                          digitStyle={{backgroundColor: '#FFF', borderWidth: 2, borderColor: 'white'}}
                          digitTxtStyle={{color: 'steelblue'}}
                          timeLabelStyle={{color: 'red', fontWeight: 'bold'}}
                          separatorStyle={{color: 'white'}}
                          timeToShow={['H', 'M', 'S']}
                          timeLabels={{m: null, s: null}}
                          showSeparator
                          running = {this.state.timer_run}
                          />
                        </View> 
                 </ImageBackground>
            <ImageBackground source={require('./cool-background-2.png')} imageStyle={styles.imagepower} style={[LayoutPower]}>
                <Badge
                  value={this.state.labeloffon}
                  status={this.state.status}
                  containerStyle={{ position:'absolute', right:100,top:20}}
                  badgeStyle = {[powerbadge]}
                />
                <Button
                  icon={
                  <Icon
                  name="power-off"
                  size={this.state.size_power}
                  color='skyblue'  
                            
                  />
                  
                  }
                  type="clear"
                  onPress={this.Activar_o_Desactivar.bind(this)}
                  buttonStyle = {[botonPower]}
                  
                  
                />
                
            </ImageBackground>
            
            <View style={styles.content2}>
            
            

          <ImageBackground source={require('./cool-background-2.png')} imageStyle={styles.image} style={{marginLeft:10,marginRight:10, width: (window.width/2)-20, height: window.height*0.35, alignSelf:'center', justifyContent:'center',alignItems:'center',borderRadius:20}}>
            <Text style={{fontSize: 70, color: 'white',alignSelf:'center',marginTop:30}} >{this.state.valorTemp}º</Text>
           
            {/*<Badge
              value={this.state.cuentaatras}
              status="success"
              containerStyle={{ position: 'absolute', top: -4, right: -4 }}
            />*/}
            
            <AnimatedEllipsis />

          </ImageBackground>
          
          <ImageBackground source={require('./cool-background-2.png')} imageStyle={styles.image} style={{marginRight:10, marginLeft:10, width: (window.width/2)-20, height: window.height*0.35,alignSelf:'center', justifyContent:'center',alignItems:'center',borderRadius:20}}>
          
            <Text style={{fontSize: 65, color: 'white',alignSelf: 'center',marginTop:30}} >{this.state.valorHum}%</Text>
            {/*<Badge
              value={this.state.cuentaatras}
              status="success"
              containerStyle={{ position: 'absolute', top: -4, right: -4 }}
            />*/}
            <AnimatedEllipsis />
              
            
          </ImageBackground>
          
        </View>
        
        

      </View>

         
      
      

          {/*<Text style={{fontSize: 60, color: 'white', marginRight:10}} >{this.state.valorHum}%</Text>
          <Text style={{fontSize: 60, color:'white', marginLeft:10}}>{this.state.valorTemp}º</Text>*/}

            

                          
          
          </View> 

        
            
        );
    }
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor:'skyblue'
    
  },
  menuItem:{
    width:'33.3333%',
    height: '50%',
    padding:20
  },
  image:{
    width:'100%',
    height:'100%',
    borderRadius:20,
    

  },
  imagepower:{
    width:'100%',
    height:'100%',
    borderRadius:50,
    

  },
  imagepower2:{
    width:'100%',
    height:'100%',
    borderRadius:50
    
    

  },
  content: {
    flex: 1,
    alignSelf: 'stretch',
    
  
  },
  content2:{
    flex: 1,
    flexDirection: 'row',
    
    
    
        
  },
  linearGradient: {
    flex: 1,
    paddingLeft: 15,
    paddingRight: 15,
    borderRadius: 5
  },
  speedom:{
    justifyContent:'center', 
    alignItems: 'center',
    
    
    //width: width * 0.8, // 80% of screen's width
    //height: height * 0.8 // 20% of screen's height
    
  },
  toolbarButton:{
    flex: 1,
    
    alignSelf:'center',
    marginRight: 20
    
  },
  toolbar:{
    
    flexDirection:'row',
    backgroundColor: 'skyblue',
    height: window.height*0.09
  },
  
  points: {
    textAlign: 'center',
    color: 'white',
    fontSize: 85,
    fontWeight: '100',
  },
});