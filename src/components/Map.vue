<template>
    <div>
        <h1>Carrera de Bots</h1>
        
        <vs-row>
            <vs-col vs-type="flex" vs-justify="center" vs-align="center" vs-w="8">
                <GmapMap
                    :center="center"
                    :zoom="14"
                    map-type-id="roadmap"
                    v-bind:options="mapStyle"
                    style="width: 1100px; height: 700px"
                    ref="map"
                    id="map"
                    @click="addGoal"
                    >

                    <GmapMarker
                        :key="index"
                        v-for="(m, index) in markers"
                        :position="m.position"
                        :clickable="true"
                        :icon="m.markerOptions"
                        :title="m.label"
                        @click="openWindow"
                        
                     >
                     <gmap-polygon :paths="m.points" :options="{strokeWeight: 2.0,fillColor: 'green'}"></gmap-polygon>
                     
                    <gmap-info-window 
                        @closeclick="window_open=false" 
                        :opened="window_open" 
                        :position="m.position"
                    >
                        {{m.label}}
                        
                    </gmap-info-window>   
                     </GmapMarker>


                </GmapMap>    
            </vs-col>

            <vs-col  vs-justify="center" vs-align="center" vs-w="4">


                 <vs-card  class="info-bot">
                    <div slot="header">
                        <h3>
                          Bots competidores
                        </h3>
                    </div>
                    <div>

                      <vs-list>

                        <div>
                            <vs-list-item  v-for="(m, index) in markers" :key="index" >
                                
                            <div v-if="m.label !='Meta'" style="height:70px"> 
                                <h3>{{m.label}}</h3>
                                <h3>Distancia {{m.distance}}</h3>
                                <div v-if="m.baterry > 0">
                                <h3 v-if="m.baterry >=50" style="color:#A0EA8C;">Batería {{m.baterry}}%</h3>
                                <h3 v-if="m.baterry >=20 && m.baterry <50" style="color:#F1EF5B">Batería {{m.baterry}}%</h3>
                                <h3 v-if="m.baterry < 20" style="color:#C63F2C">Batería {{m.baterry}}%</h3>
                                </div>
                                <div v-else>
                                    <h3 style="color:#C63F2C">Batería 0%</h3>
                                    <h3 style="color:#A0EA8C;">Recargando...</h3>
                                </div>

                            </div> 
                                <template slot="avatar" v-if="m.label !='Meta'">
                                    <vs-avatar size="50px" :color="m.color" :src="imageBot" />
                                </template>
                            </vs-list-item>

                            <br>
                           
                        </div>

                    </vs-list>

                    </div>

                    </vs-card>

                     <vs-button color="success"  @click="startGame()"  type="filled" style="margin-left:10px">Iniciar juego</vs-button>
                            <vs-button color="primary"  @click="addBot()"  type="filled" style="margin-left:10px">Agregar bot</vs-button>
                            <vs-button color="warning" @click="restartGame()" type="filled" style="margin-left:10px">Reiniciar juego</vs-button>
            </vs-col>

        </vs-row>

            <vs-popup class="holamundo"  title="Se terminó el juego" :active.sync="popupActivo" >
                <center><vs-avatar size="100px"  :src="imageBot" /></center>
                <center><h3>El ganador es {{winner}}</h3></center>
            </vs-popup>
            

    </div>
</template>

<script>
// import {gmapApi} from 'vue2-google-maps'


    export default {
        data() {
            return {
              center: { lat: 3.53944, lng: -76.30361 },
              markers:[],
              imageBot: require('../assets/robot.png'),
              imageGoal: require('../assets/meta2.png'),
              latFinal:'',
              lngFinal:'',
              intervalId:'',
              activeConfirm:false,
              arrayDistance:[],
              popupActivo:false,
              winner:'',
              sound:'',
              soundwinner:'',
              max:0,
              min:999999,
              botmax:5,
              botmin:1,
              info_marker: null,
              infowindow: {lat: 10, lng: 10.0},
            window_open: false,
              mapStyle: {

                    scrollwheel: false,
                    minZoom :  13 ,
                    maxZoom :  17 ,

                    styles:   [

                                {
                        "elementType": "geometry",
                        "stylers": [
                        {
                            "color": "#f5f5f5"
                        }
                        ]
                    },
                    {
                        "elementType": "labels.icon",
                        "stylers": [
                        {
                            "visibility": "off"
                        }
                        ]
                    },
                    {
                        "elementType": "labels.text.fill",
                        "stylers": [
                        {
                            "color": "#616161"
                        }
                        ]
                    },
                    {
                        "elementType": "labels.text.stroke",
                        "stylers": [
                        {
                            "color": "#f5f5f5"
                        }
                        ]
                    },
                    {
                        "featureType": "administrative",
                        "elementType": "geometry",
                        "stylers": [
                        {
                            "visibility": "off"
                        }
                        ]
                    },
                    {
                        "featureType": "administrative.land_parcel",
                        "elementType": "labels.text.fill",
                        "stylers": [
                        {
                            "color": "#bdbdbd"
                        }
                        ]
                    },
                    {
                        "featureType": "poi",
                        "stylers": [
                        {
                            "visibility": "off"
                        }
                        ]
                    },
                    {
                        "featureType": "poi",
                        "elementType": "geometry",
                        "stylers": [
                        {
                            "color": "#eeeeee"
                        }
                        ]
                    },
                    {
                        "featureType": "poi",
                        "elementType": "labels.text.fill",
                        "stylers": [
                        {
                            "color": "#757575"
                        }
                        ]
                    },
                    {
                        "featureType": "poi.park",
                        "elementType": "geometry",
                        "stylers": [
                        {
                            "color": "#e5e5e5"
                        }
                        ]
                    },
                    {
                        "featureType": "poi.park",
                        "elementType": "labels.text.fill",
                        "stylers": [
                        {
                            "color": "#9e9e9e"
                        }
                        ]
                    },
                    {
                        "featureType": "road",
                        "elementType": "geometry",
                        "stylers": [
                        {
                            "color": "#ffffff"
                        }
                        ]
                    },
                    {
                        "featureType": "road",
                        "elementType": "labels.icon",
                        "stylers": [
                        {
                            "visibility": "off"
                        }
                        ]
                    },
                    {
                        "featureType": "road.arterial",
                        "elementType": "labels.text.fill",
                        "stylers": [
                        {
                            "color": "#757575"
                        }
                        ]
                    },
                    {
                        "featureType": "road.highway",
                        "elementType": "geometry",
                        "stylers": [
                        {
                            "color": "#dadada"
                        }
                        ]
                    },
                    {
                        "featureType": "road.highway",
                        "elementType": "labels.text.fill",
                        "stylers": [
                        {
                            "color": "#616161"
                        }
                        ]
                    },
                    {
                        "featureType": "road.local",
                        "elementType": "labels.text.fill",
                        "stylers": [
                        {
                            "color": "#9e9e9e"
                        }
                        ]
                    },
                    {
                        "featureType": "transit",
                        "stylers": [
                        {
                            "visibility": "off"
                        }
                        ]
                    },
                    {
                        "featureType": "transit.line",
                        "elementType": "geometry",
                        "stylers": [
                        {
                            "color": "#e5e5e5"
                        }
                        ]
                    },
                    {
                        "featureType": "transit.station",
                        "elementType": "geometry",
                        "stylers": [
                        {
                            "color": "#eeeeee"
                        }
                        ]
                    },
                    {
                        "featureType": "water",
                        "elementType": "geometry",
                        "stylers": [
                        {
                            "color": "#c9c9c9"
                        }
                        ]
                    },
                    {
                        "featureType": "water",
                        "elementType": "labels.text.fill",
                        "stylers": [
                        {
                            "color": "#9e9e9e"
                        }
                        ]
                    }


                        ]
            },

                locations:[]
            
            }
        },

        created(){
            this.generateBots()
            this.window_open = true
        },

        mounted(){
        
        
        },

        computed: {
            //  google: gmapApi
        },

        methods:{

            openWindow () {
            this.window_open = true
        },


           restartGame(){
               this.markers=[]
               this.generateBots()
               clearInterval(this.intervalId);
               this.max=0,
               this.min=999999
               if(this.sound){
                   this.sound.pause()
                }

               if(this.soundwinner){
                   this.soundwinner.pause()
                } 

            },
      

           startGame(){

               var meta = this.markers.find(item => item.label === 'Meta') 

              if(meta){


                console.log('latFinal',this.latFinal)
                console.log('lngFinal',this.lngFinal)

                this.sound = new Audio(require('../assets/sound.mp3'))
                this.sound.play()

             let me = this    

             me.intervalId = setInterval(function() {  

                //generar distancia que deben moverse de manera aleatoria
                for (var x = 0; x < me.markers.length; x++) {

                    var disRandom =  Math.floor(Math.random() * (100 - 50 + 1) + 50);

                    me.markers[x].move = disRandom
                }
                

                for (var i = 0; i < me.markers.length; i++) {

                    if(me.markers[i].label != 'Meta'){


                        //calcular distancia
                        var rad = function(x) {return x*Math.PI/180;}
                        var R = 6378.137; //Radio de la tierra en km 
                        var dLat = rad( me.latFinal - me.markers[i].position.lat );
                        var dLong = rad( me.lngFinal - me.markers[i].position.lng );
                        var a = Math.sin(dLat/2) * Math.sin(dLat/2) + Math.cos(rad(me.markers[i].position.lat)) * 
                        Math.cos(rad(me.latFinal)) * Math.sin(dLong/2) * Math.sin(dLong/2);
                        var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));

                        //aquí obtienes la distancia en metros por la conversion 1Km =1000m
                        var d = R * c * 1000; 
                        
                        console.log('distancia'+me.markers[i].label, parseInt(d))
                        me.markers[i].distance = parseInt(d)

                        //validar distancia
                        if(parseInt(d) > 50 ){

                            if(me.markers[i].baterry != 0 && !(me.markers[i].baterry < 0)){

                                
                                //generar gasto de bateria aleatorio
                                var baterryRandom =  Math.floor(Math.random() * (30 - 10 + 1) + 10);
                                var newbaterry = me.markers[i].baterry - baterryRandom

                                me.markers[i].baterry = newbaterry


                                //mover el bot hacia la meta
                                var deltaX = me.latFinal - me.markers[i].position.lat;
                                var deltaY = me.lngFinal - me.markers[i].position.lng;                                     
                                var angle = Math.atan2( deltaY, deltaX );


                                //validar el mas lejos y el mas cercano
                                
                                if(d >= me.max){
                                
                                    var anteriormax = me.markers.find(item => item.id === me.botmax)
                                    
                                    anteriormax.color = '#f6e769'
                                    anteriormax.markerOptions = {
                                        url: require('../assets/robotA.png'),
                                        size: {width: 60, height: 40, f: 'px', b: 'px',},
                                        scaledSize: {width: 40, height: 40, f: 'px', b: 'px',},
                                    } 

                                    me.max = d
                                    me.botmax = me.markers[i].id
                                    me.markers[i].color = '#ff3333'
                                    me.markers[i].markerOptions = {
                                        url: require('../assets/robotR.png'),
                                        size: {width: 60, height: 40, f: 'px', b: 'px',},
                                        scaledSize: {width: 40, height: 40, f: 'px', b: 'px',},
                                    } 

                                 }


                                 if(d <= me.min){
                                
                                    var anteriormin = me.markers.find(item => item.id === me.botmin)
                                    
                                    anteriormin.color = '#f6e769'
                                    anteriormin.markerOptions = {
                                        url: require('../assets/robotA.png'),
                                        size: {width: 60, height: 40, f: 'px', b: 'px',},
                                        scaledSize: {width: 40, height: 40, f: 'px', b: 'px',},
                                    } 

                                    me.min = d
                                    me.botmin = me.markers[i].id
                                    me.markers[i].color = '#7eca54'
                                    me.markers[i].markerOptions = {
                                        url: require('../assets/robotV.png'),
                                        size: {width: 60, height: 40, f: 'px', b: 'px',},
                                        scaledSize: {width: 40, height: 40, f: 'px', b: 'px',},
                                    } 

                                 }

                
                                var currentX = me.markers[i].position.lat +  Math.cos( angle ) * me.markers[i].move/100000;
                                var currentY = me.markers[i].position.lng +  Math.sin( angle ) * me.markers[i].move/100000;
                                
                                var newlat = currentX
                                var newlng = currentY

                                //agregar puntos de recorrido
                                var point = {
                                    lat: newlat,
                                    lng: newlng, 
                                }

                                me.markers[i].points.push(point) 
                                
                                me.markers[i].position.lat = newlat
                                me.markers[i].position.lng = newlng

                            }else{

                                var newtimer = me.markers[i].timer +1
                                me.markers[i].timer = newtimer
                                me.markers[i].reload = true

                              if(me.markers[i].reload == true && me.markers[i].timer == 6){
                                    me.markers[i].reload = false
                                    me.markers[i].timer = 0
                                    me.markers[i].baterry = 100

                                }


                            }


                        }else{
                            me.sound.pause() 
                            me.sound = new Audio(require('../assets/winner.mp3'))
                            me.sound.play()
                            me.winner = me.markers[i].label
                            me.markers[i].distance = 0
                            console.log('ya ganaron')
                            clearInterval(me.intervalId);
                            me.popupActivo=true
                            
                        }
                        


                    }
                }

                }, 1000);

                    console.log('this.markers',this.markers)


               }else{
                   this.$vs.notify({
                    color:'danger',
                    title:'Error',
                    text:'Debes escoger primero la meta, antes de iniciar'
                })
               }
           },

 

                acceptAlert(){
                    this.generateBots()

                },

           addBot(){
 
                    var latRandom =  Math.random() * (3.55555 - 3.50000) + 3.50000;
                    var lngRandom =  Math.random() * (-76.32000 - (-76.30000)) + (-76.30000);

                    // console.log('latRandom',latRandom)
                    // console.log('lngRandom',lngRandom)

                    var numbot = this.markers.length + 1

                    var marker = {
                         position:{
                            lat: latRandom,
                            lng: lngRandom, 
                         },
                         id: numbot,
                         label: 'Bot #' + numbot,
                         baterry: 100,
                         move: 0,
                         reload: false,
                         timer: 0,
                         distance: 0,
                         color:'#f6e769',
                         points:[
                             {
                                 lat: latRandom, 
                                 lng: lngRandom
                             }],
                         markerOptions: {
                            url: require('../assets/robotA.png'),
                            size: {width: 60, height: 40, f: 'px', b: 'px',},
                            scaledSize: {width: 40, height: 40, f: 'px', b: 'px',},
                         },
                    }

                    this.markers.push(marker);


           }, 

           addGoal(event){


            var meta = this.markers.find(item => item.label === 'Meta') 

               if(!meta){

               this.latFinal = event.latLng.lat()
               this.lngFinal = event.latLng.lng()

               var marker = {
                         position:{
                            lat: this.latFinal,
                            lng: this.lngFinal, 
                         },
                         label: 'Meta',
                         markerOptions: {
                            url: require('../assets/meta2.png'),
                            size: {width: 60, height: 40, f: 'px', b: 'px',},
                            scaledSize: {width: 40, height: 40, f: 'px', b: 'px',},
                         },
                    }

                this.markers.push(marker);  
             }  
            },
        
            generateBots(){

              var numBots =  Math.floor(Math.random() * (10 - 5 + 1) + 5);
 
                for (var i = 1; i <= numBots; i++) {

                    var latRandom =  Math.random() * (3.55555 - 3.50000) + 3.50000;
                    var lngRandom =  Math.random() * (-76.32000 - (-76.30000)) + (-76.30000);


                    var marker = {
                         position:{
                            lat: latRandom,
                            lng: lngRandom, 
                         },
                         id: i,
                         label: 'Bot #' + i,
                         baterry: 100,
                         move: 0,
                         reload: false,
                         timer: 0,
                         distance: 0,
                         color:'#f6e769',
                         points:[
                             {
                                 lat: latRandom, 
                                 lng: lngRandom
                             }],
                         markerOptions: {
                            url: require('../assets/robotA.png'),
                            size: {width: 60, height: 40, f: 'px', b: 'px',},
                            scaledSize: {width: 40, height: 40, f: 'px', b: 'px',},
                         },
                    }

                    this.markers.push(marker);

                }


              

            }
        }
    }

</script>

<style>

.info-bot{
    height:700px !important;
    overflow-y: scroll !important;
}
</style>