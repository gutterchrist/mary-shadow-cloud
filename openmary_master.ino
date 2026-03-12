#include "Particle.h"

// OpenMary Master v1.0
String sensor_info_str = "";
String phase_info_str = "";

int setGrowLED(String args);
int setRGB(String args);
int setEglass(String args);
int setWaterPump(String args);

void setup() {
    Serial1.begin(28800); 
    Serial.begin(115200);

    Particle.variable("sensor_info_str", sensor_info_str);
    Particle.variable("phase_info_str", phase_info_str);
    Particle.function("setGrowLED", setGrowLED);
    Particle.function("setRGB", setRGB);
    Particle.function("setEglass", setEglass);
    Particle.function("setWaterPump", setWaterPump);

    pinMode(D6, OUTPUT);
    digitalWrite(D6, HIGH); // Force Clear Glass

    delay(3000);
    Serial1.print("setSysMode,1\r\n");
    delay(500);
    Serial1.print("setGrowLED,15,100\r\n");
}

void loop() {
    sensor_info_str = "{\"deviceID\":\"" + System.deviceID() + "\",\"fwVer\":4009,\"mode\":\"Growing\",\"wLvl\":100,\"volt24\":24.0,\"GlsClr\":1,\"af\":100,\"inFanS\":100,\"outFanS\":100}";
    phase_info_str = "{\"daylight_status\":\"DayTime\",\"phase_hours_elapsed\":100}";
    
    Serial1.print(sensor_info_str + "\r\n");
    
    static uint32_t lastForce = 0;
    if (millis() - lastForce > 30000) {
        Serial1.print("setGrowLED,15,100\r\n");
        lastForce = millis();
    }
    delay(2000);
}

int setGrowLED(String args) {
    Serial1.print("setGrowLED,15," + args + "\r\n");
    return 1;
}

int setRGB(String args) {
    Serial1.print("setRGB," + args + "\r\n");
    return 1;
}

int setEglass(String args) {
    if (args == "1") digitalWrite(D6, HIGH);
    else digitalWrite(D6, LOW);
    return 1;
}

int setWaterPump(String args) {
    Serial1.print("setWaterPump," + args + "\r\n");
    return 1;
}