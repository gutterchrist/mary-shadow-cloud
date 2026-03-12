#include "Particle.h"

// OpenMary v2.0
void setup() {
    Serial.begin(115200);
    Serial1.begin(28800);
    pinMode(D6, OUTPUT);
    digitalWrite(D6, HIGH); 

    delay(3000);
    Serial1.print("setSysMode,1\r\n");
    Serial1.print("setGrowLED,15,100\r\n");
}

void loop() {
    Serial1.print("setGrowLED,15,100\r\n");
    delay(1000);
}