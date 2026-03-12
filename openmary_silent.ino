#include "Particle.h"

// OpenMary Silent
SYSTEM_MODE(MANUAL); 

void setup() {
    Serial1.begin(28800);
    pinMode(D6, OUTPUT);
    digitalWrite(D6, HIGH); 
    
    delay(3000);
    Serial1.print("setSysMode,1\r\n");
    Serial1.print("setGrowLED,15,100\r\n");
}

void loop() {
    String hb = "{\"deviceID\":\"" + System.deviceID() + "\",\"fwVer\":4009,\"mode\":\"Growing\",\"wLvl\":100}";
    Serial1.print(hb + "\r\n");
    delay(2000);
}