const BlockType = require('../../extension-support/block-type');
const ArgumentType = require('../../extension-support/argument-type');
const TargetType = require('../../extension-support/target-type');

class Scratch3MQTT {
    constructor(runtime) {
        this.runtime = runtime;
        this.client = null;

        // Dynamically import MQTT to avoid issues with Webpack
        import('mqtt')
            .then((mqttModule) => {
                this.mqtt = mqttModule.default || mqttModule;
                console.log('MQTT module loaded successfully');
                this.initMQTT();
            })
            .catch((error) => {
                console.error('Error loading MQTT module:', error);
            });
    }

    /**
     * Initialize MQTT connection
     */
    initMQTT() {
        try {
            if (!this.mqtt) {
                console.error('MQTT module is not loaded yet.');
                return;
            }



        } catch (error) {
            console.error('Error initializing MQTT:', error);
        }
    }

    /**
     * Connect to the MQTT broker
     */
    connectToBroker(brokerUrl, options) {
        try {
            if (!this.mqtt) {
                throw new Error('MQTT module is not available.');
            }

            this.client = this.mqtt.connect(brokerUrl, options);

            this.client.on('connect', () => {
                console.log('Connected to MQTT broker:', brokerUrl);
            });

            this.client.on('error', (err) => {
                console.error('MQTT Connection Error:', err);
                this.client.end();
            });

            this.client.on('close', () => {
                console.log('MQTT Connection Closed');
            });

            this.client.on('reconnect', () => {
                console.log('Reconnecting to MQTT broker...');
            });

            this.client.on('message', (topic, message) => {
                console.log(`Received message on ${topic}:`, message.toString());
            });
        } catch (error) {
            console.error('Error connecting to MQTT broker:', error);
        }
    }

    /**
     * Subscribe to an MQTT topic
     */
    subscribe(topic) {
        if (this.client) {
            this.client.subscribe(topic, (err) => {
                if (err) {
                    console.error(`Failed to subscribe to ${topic}:`, err);
                } else {
                    console.log(`Subscribed to ${topic}`);
                }
            });
        }
    }

    /**
     * Publish a message to an MQTT topic
     */
    publish(topic, message) {
        if (this.client) {
            this.client.publish(topic, message, (err) => {
                if (err) {
                    console.error(`Failed to publish to ${topic}:`, err);
                } else {
                    console.log(`Message published to ${topic}:`, message);
                }
            });
        }
    }

    /**
     * Disconnect from MQTT
     */
    disconnect() {
        if (this.client) {
            this.client.end(() => {
                console.log('Disconnected from MQTT broker');
            });
        }
    }

    /**
     * Define the blocks for Scratch
     */
    getInfo() {
        return {
            id: 'yourScratchExtension',
            name: 'Demo',
            color1: '#000099',
            color2: '#660066',
            blocks: [
                {
                    opcode: 'connectMqtt',
                    blockType: BlockType.COMMAND,
                    text: 'Connect to MQTT using Websocket [URL] with [USERNAME] and [PASSWORD]',
                    arguments: {
                        URL: {
                            
                            type: ArgumentType.STRING,
                            defaultValue: 'wss://myserver:8883'
                        },
                        USERNAME: {
                            type: ArgumentType.STRING,
                            defaultValue: 'Username'
                        },
                        PASSWORD: {
                            type: ArgumentType.STRING,
                            defaultValue: 'Password'
                        }
                    }
                },
                {
                    opcode: 'lightTurnOn',
                    blockType: BlockType.COMMAND,
                    text: 'Turn [LAMP] on in [TRANSITION] seconds',
                    arguments: {
                        LAMP: {
                            type: ArgumentType.STRING,
                            menu: 'LAMP_MENU'
                        },
                        TRANSITION: {
                            type: ArgumentType.STRING,
                            defaultValue: '0'
                        }
                    }
                },
                {
                    opcode: 'setLightBrightness',
                    blockType: BlockType.COMMAND,
                    text: 'Set [LAMP] to [BRIGHTNESS] Brightness in [TRANSITION] seconds',
                    arguments: {
                        LAMP: {
                            type: ArgumentType.STRING,
                            menu: 'LAMP_MENU'
                        },
                        BRIGHTNESS: {
                            type: ArgumentType.STRING,
                            menu: 'BRIGHTNESS_MENU'
                        },
                        TRANSITION: {
                            type: ArgumentType.STRING,
                            defaultValue: '0'
                        }
                    }
                },                 
                {
                    opcode: 'lightTurnOff',
                    blockType: BlockType.COMMAND,
                    text: 'Turn [LAMP] off in [TRANSITION] seconds',
                    arguments: {
                        LAMP: {
                            type: ArgumentType.STRING,
                            menu: 'LAMP_MENU'
                        },
                        TRANSITION: {
                            type: ArgumentType.STRING,
                            defaultValue: '0'
                        }
                    }
                },                  
                {
                    opcode: 'lightSetColor',
                    blockType: BlockType.COMMAND,
                    text: 'Set [LAMP] to color [COLOR] in [TRANSITION] seconds',
                    arguments: {
                        LAMP: {
                            type: ArgumentType.STRING,
                            menu: 'LAMP_MENU'
                        },
                        COLOR: {
                            type: ArgumentType.STRING,
                            menu: 'COLOR_MENU'
                        },
                        TRANSITION: {
                            type: ArgumentType.STRING,
                            defaultValue: '0'
                        }
                    }
                },     
                
                {
                    opcode: 'mqttSend',
                    blockType: BlockType.COMMAND,
                    text: 'Send MQTT message [MESSAGE] to topic [TOPIC]',
                    arguments: {
                        MESSAGE: {
                            type: ArgumentType.STRING,
                            defaultValue: 'Hello MQTT'
                        },
                        TOPIC: {
                            type: ArgumentType.STRING,
                            defaultValue: 'home/test'
                        }
                    }
                },
                {
                    opcode: 'mqttSubscribe',
                    blockType: BlockType.COMMAND,
                    text: 'Subscribe to topic [TOPIC]',
                    arguments: {
                        TOPIC: {
                            type: ArgumentType.STRING,
                            defaultValue: 'home/test'
                        }
                    }
                },
                {
                    opcode: 'mqttDisconnect',
                    blockType: BlockType.COMMAND,
                    text: 'Disconnect from MQTT'
                }
            ],
            menus: {
                BRIGHTNESS_MENU: {
                  acceptReporters: true,
                  items: [
                    {
                      text: '100 %',
                      value: '{"brightness": 255}'
                    },
                    {
                        text: ' 75 %',
                        value: '{"brightness": 196}'
                      },
                    {
                        text: ' 50 %',
                        value: '{"brightness": 128}'
                      },
                      {
                        text: ' 25 %',
                        value: '{"brightness": 64}'
                      }
  
                ]
              },
                COLOR_MENU: {
                  acceptReporters: true,
                  items: [
                    {
                      text: 'White',
                      value: '{"color":{"r":255,"g":255,"b":255}}'
                    },
                    {
                      text: 'Blue',
                      value: '{"color":{"r":0,"g":0,"b":255}}'
                    },
                    {
                      text: 'Green',
                      value: '{"color":{"r":0,"g":255,"b":0}}'
                    },
                    {
                      text: 'Orange',
                      value: '{"color":{"r":255,"g":170,"b":100}}'
                    },
                    {
                      text: 'Purple',
                      value: '{"color":{"r":200,"g":6,"b":255}}'
                    },
                    {
                      text: 'Red',
                      value: '{"color":{"r":255,"g":0,"b":0}}'
                    },
                    {
                      text: 'Yellow',
                      value: '{"color":{"r":255,"g":234,"b":0}}'
                    }
                ]
              },
              LAMP_MENU: {
                acceptReporters: true,
                items: [
                    {
                        text: 'All QRB',
                        value: 'qrb'
                      },
                      {  text: 'Block 1',
                      value: 'QRB Block 1'
                    },                      
                    {  text: 'Block 2',
                        value: 'QRB Block 2'
                      },                      
                      {  text: 'Block 3',
                        value: 'QRB Block 3'
                      },        
                      {  text: 'Ganze Ständerlampe',
                        value: 'Staenderlampe'
                      },               
                        {
                    text: 'Lamp 01',
                    value: 'Wohnzimmer QRB111 01'
                  },
                  {
                    text: 'Lamp 02',
                    value: 'Wohnzimmer QRB111 02'
                  },
                  {
                    text: 'Lamp 03',
                    value: 'Wohnzimmer QRB111 03'
                  },
                  {
                    text: 'Lamp 04',
                    value: 'Wohnzimmer QRB111 04'
                  },
                  {
                    text: 'Lamp 05',
                    value: 'Wohnzimmer QRB111 05'
                  },
                  {
                    text: 'Lamp 06',
                    value: 'Wohnzimmer QRB111 06'
                  },
                  {
                    text: 'Lamp 07',
                    value: 'Wohnzimmer QRB111 07'
                  },
                  {
                    text: 'Lamp 08',
                    value: 'Wohnzimmer QRB111 08'
                  },
                  {
                    text: 'Lamp 09',
                    value: 'Wohnzimmer QRB111 09'
                  },
                  {
                    text: 'Lamp 10',
                    value: 'Wohnzimmer QRB111 10'
                  },
                  {
                    text: 'Lamp 11',
                    value: 'Wohnzimmer QRB111 11'
                  },
                  {
                    text: 'Lamp 12',
                    value: 'Wohnzimmer QRB111 12'
                  },
                  {  text: 'Ständerlampe Oben',
                    value: 'Staenderlampe Oben'
                  },                      
                  {  text: 'Ständerlampe Mitte',
                    value: 'Staenderlampe Mitte'
                  },                    
                   {  text: 'Ständerlampe Unten',
                    value: 'Staenderlampe Unten'
                  }
              ]
            },             
            }
          };
        }

        connectMqtt({ URL,USERNAME,PASSWORD }) {
            try {
                if (!this.mqtt) {
                    console.error('MQTT module is not loaded yet.');
                    return;
                }
    
                const options = {
                    username: USERNAME,
                    password: PASSWORD,
                    rejectUnauthorized: false
                };
    
                // Use WebSockets for browser compatibility
                const brokerUrl = URL;
    
                this.connectToBroker(brokerUrl, options);
            } catch (error) {
                console.error('Error initializing MQTT:', error);
            }
        }

    addTransition(colorString, transitionValue) {
            try {
                // Parse the input JSON string
                let colorObject = JSON.parse(colorString);
        
                // Add the transition key
                colorObject.transition = Number(transitionValue); // Ensure it's a number
        
                // Convert back to a JSON string
                return JSON.stringify(colorObject);
            } catch (error) {
                console.error("Invalid JSON input:", error);
                return null; // Return null or handle error appropriately
            }
        }        

    setLightBrightness({ LAMP,BRIGHTNESS,TRANSITION }) {
        if (this.client) {

            this.mqttSend({ MESSAGE, TOPIC })
            const TOPIC = 'zigbee2mqtt/'.concat(LAMP).concat('/set');
            const MESSAGE = this.addTransition(BRIGHTNESS, TRANSITION);
            this.mqttSend({ MESSAGE, TOPIC })
            var start = new Date().getTime();
            for (var i = 0; i < 1e7; i++) {
              if ((new Date().getTime() - start) > Number(TRANSITION) * 1000 ){
                break;
              }
            }

            return  'helloWorld'
        }
    }

    lightSetColor({ LAMP,COLOR,TRANSITION }) {
            if (this.client) {
    
                const TOPIC = 'zigbee2mqtt/'.concat(LAMP).concat('/set');
                const MESSAGE = this.addTransition(COLOR, TRANSITION);
    
                return  this.mqttSend({ MESSAGE, TOPIC })
            }
        }

    lightTurnOn({ LAMP,TRANSITION }) {
        if (this.client) {

            const TOPIC = 'zigbee2mqtt/'.concat(LAMP).concat('/set');
            const MESSAGE = this.addTransition('{"state": "ON"}', TRANSITION);

            return  this.mqttSend({ MESSAGE, TOPIC })
        }
    }

    lightTurnOff({ LAMP,TRANSITION }) {
        if (this.client) {

            const TOPIC = 'zigbee2mqtt/'.concat(LAMP).concat('/set');
            const MESSAGE = this.addTransition('{"state": "OFF"}', TRANSITION);

            return  this.mqttSend({ MESSAGE, TOPIC })
        }
    }

    /**
     * Implementation of the "Send MQTT Message" block
     */
    mqttSend({ MESSAGE, TOPIC }) {
        if (this.client) {
            this.publish(TOPIC, MESSAGE);
            return 'Sent';
        } else {
            console.error('MQTT Client is not connected.');
            return 'Error';
        }
    }

    /**
     * Implementation of the "Subscribe to Topic" block
     */
    mqttSubscribe({ TOPIC }) {
        if (this.client) {
            this.subscribe(TOPIC);
        } else {
            console.error('MQTT Client is not connected.');
        }
    }

    /**
     * Implementation of the "Disconnect MQTT" block
     */
    mqttDisconnect() {
        this.disconnect();
    }
}

// Attach to Scratch
module.exports = Scratch3MQTT;
