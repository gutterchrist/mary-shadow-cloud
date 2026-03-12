#include "Particle.h"

void setup() {
    Serial.begin(115200);
    Serial1.begin(115200);
}

void loop() {
    // If the Power Board says ANYTHING, reply immediately with the Heartbeat
    if (Serial1.available()) {
        while(Serial1.available()) Serial.write(Serial1.read()); // Log to USB
        
        String heartbeat = "{"deviceID":"" + System.deviceID() + "","fwVer":4009,"mode":"Growing","wLvl":100,"volt24":24.0,"GlsClr":1,"af":100}";
        Serial1.println(heartbeat);
        Serial1.println("setSysMode,1");
        Serial1.println("setGrowLED,15,100");
        
        Serial.println("--- Replied to Challenge ---");
    }

    // Every 2 seconds, try to poke it anyway
    static uint32_t lastPoke = 0;
    if (millis() - lastPoke > 2000) {
        Serial1.println("setSysMode,1");
        lastPoke = millis();
    }
}
