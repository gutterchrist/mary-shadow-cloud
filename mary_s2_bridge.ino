#include "Particle.h"

void setup() {
    Serial.begin(115200);
    Serial2.begin(28800); 
    pinMode(D6, OUTPUT);
    digitalWrite(D6, HIGH); // Glass
}

void loop() {
    if (Serial2.available()) {
        Serial.print("[S2]: ");
        while(Serial2.available()) {
            Serial.write(Serial2.read());
        }
        Serial.println();
    }
    
    static uint32_t lastH = 0;
    if (millis() - lastH > 2000) {
        String hb = "{\"deviceID\":\"" + System.deviceID() + "\",\"fwVer\":4009,\"mode\":\"Growing\"}";
        Serial2.println(hb);
        Serial2.println("setGrowLED,15,100");
        lastH = millis();
    }
}