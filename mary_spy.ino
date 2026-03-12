#include "Particle.h"

// Dual-Serial Multi-Baud Sniffer
void setup() {
    Serial.begin(115200);
    Serial1.begin(28800);
}

void loop() {
    if (Serial1.available()) {
        Serial.print("[S1]: ");
        while(Serial1.available()) {
            Serial.write(Serial1.read());
        }
        Serial.println();
    }
    
    static uint32_t lastH = 0;
    if (millis() - lastH > 2000) {
        String hb = "{\"deviceID\":\"" + System.deviceID() + "\",\"fwVer\":4009,\"mode\":\"Growing\"}";
        Serial1.println(hb);
        lastH = millis();
    }
}