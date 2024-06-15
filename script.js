// MQTT configuration
const broker = "andromeda.lasdpc.icmc.usp.br"; // Replace with your broker address
const clientID = 'mqtt_dashboard_' + Math.random().toString(16).substr(2, 8);

//const broker = 'test.mosquitto.org'; // Replace with your broker address
//const clientID = 'mqtt_dashboard_' + Math.random().toString(16).substr(2, 8);

const client = new Paho.MQTT.Client(broker,Number(7065), clientID);
//const client = new Paho.MQTT.Client(broker, Number(1883), clientID);
//const client = new Paho.MQTT.Client("test.mosquitto.org", Number(1883), "clientId");


client.onConnectionLost = onConnectionLost;
client.onMessageArrived = onMessageArrived;

// Connecting to MQTT broker
client.connect({
	onSuccess: onConnect, 
	userName : "mqtt",
	password : "mqtt"
});

function onConnect() {
    console.log("Connected to MQTT broker");
    client.subscribe('iot/smart_lab/from_esp32/board1/temperature');
    client.subscribe('iot/smart_lab/from_esp32/board1/humidity');
    client.subscribe('iot/smart_lab/from_esp32/board2/temperature');
    client.subscribe('iot/smart_lab/from_esp32/board2/humidity');
    client.subscribe('iot/smart_lab/from_esp32/board3/temperature');
    client.subscribe('iot/smart_lab/from_esp32/board3/humidity');
}

function onFailure(message) {
    console.log("Connection failed: " + message.errorMessage);
}

function onConnectionLost(responseObject) {
    if (responseObject.errorCode !== 0) {
        console.log("onConnectionLost:" + responseObject.errorMessage);
    }
}

function onMessageArrived(message) {
    const topic = message.destinationName;
    const payload = parseFloat(message.payloadString);
    console.log(`Message arrived: ${topic} - ${payload}`);

    if (topic === 'iot/smart_lab/from_esp32/board1/temperature') {
        temperatureGauges.room1.set(payload);
    } else if (topic === 'iot/smart_lab/from_esp32/board1/humidity') {
        humidityGauges.room1.set(payload);
    } else if (topic === 'iot/smart_lab/from_esp32/board2/temperature') {
        temperatureGauges.room2.set(payload);
    } else if (topic === 'iot/smart_lab/from_esp32/board2/humidity') {
        humidityGauges.room2.set(payload);
    } else if (topic === 'iot/smart_lab/from_esp32/board3/temperature') {
        temperatureGauges.room3.set(payload);
    } else if (topic === 'iot/smart_lab/from_esp32/board3/humidity') {
        humidityGauges.room3.set(payload);
    }
}


// Gauge configurations

const gaugeOptions = {
    angle: -0.3, // The span of the gauge arc
    lineWidth: 0.1, // The line thickness
    radiusScale: 1, // Relative radius
    pointer: {
        length: 0.35, // // Relative to gauge radius
        strokeWidth: 0.035, // The thickness
        color: '#000000' // Fill color
      },
    limitMax: false,     // If false, max value increases automatically if value > maxValue
    limitMin: false,     // If true, the min value of the gauge will be fixed
    percentColors: [[0.0, "#a9d70b"], [0.50, "#f9c802"], [1.0, "#ff0000"]],
    colorStart: '#6F6EA0',   // Colors
    colorStop: '#C0C0DB',    // just experiment with them
    strokeColor: '#EEEEEE',  // to see which ones work best for you
    generateGradient: true,
    highDpiSupport: true,     // High resolution support
    //staticLabels: {
    //    font: "10px sans-serif",  // Specifies font
    //    labels: [100, 130, 150, 220.1, 260, 300],  // Print labels at these values
    //    color: "#000000",  // Optional: Label text color
    //    fractionDigits: 0  // Optional: Numerical precision. 0=round off.
    //},
};

const temperatureGauges = {
    room1: new Gauge(document.getElementById('temperatureGaugeRoom1')).setOptions(gaugeOptions),
    room2: new Gauge(document.getElementById('temperatureGaugeRoom2')).setOptions(gaugeOptions),
    room3: new Gauge(document.getElementById('temperatureGaugeRoom3')).setOptions(gaugeOptions),
};

const humidityGauges = {
    room1: new Gauge(document.getElementById('humidityGaugeRoom1')).setOptions(gaugeOptions),
    room2: new Gauge(document.getElementById('humidityGaugeRoom2')).setOptions(gaugeOptions),
    room3: new Gauge(document.getElementById('humidityGaugeRoom3')).setOptions(gaugeOptions),
};

// Setting max values for gauges
Object.values(temperatureGauges).forEach(gauge => gauge.maxValue = 50); // Max temperature
Object.values(humidityGauges).forEach(gauge => gauge.maxValue = 100); // Max humidity


// Theme toggle functionality
const themeToggle = document.getElementById('theme-toggle');
themeToggle.addEventListener('click', () => {
    document.body.classList.toggle('dark-mode');
    if (document.body.classList.contains('dark-mode')) {
        themeToggle.textContent = 'Light Mode';
    } else {
        themeToggle.textContent = 'Dark Mode';
    }
});