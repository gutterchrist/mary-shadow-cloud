#include "Particle.h"

void setup() {
    Serial.begin(115200);
    Serial1.begin(28800); 
    
    pinMode(D2, OUTPUT); analogWrite(D2, 127, 1000); 
    pinMode(D3, OUTPUT); analogWrite(D3, 127, 1000);
    pinMode(D4, OUTPUT); analogWrite(D4, 127, 1000);
    pinMode(D5, OUTPUT); analogWrite(D5, 127, 1000);
    pinMode(D6, OUTPUT); analogWrite(D6, 127, 1000);
    pinMode(D7, OUTPUT); analogWrite(D7, 127, 1000);
    pinMode(A0, OUTPUT); analogWrite(A0, 127, 1000);
    pinMode(A1, OUTPUT); analogWrite(A1, 127, 1000);
    pinMode(A4, OUTPUT); analogWrite(A4, 127, 1000);
    pinMode(A5, OUTPUT); analogWrite(A5, 127, 1000);
}

void loop() {
    if (Serial1.available()) {
        char c = Serial1.read();
        Serial1.write(c); 
        Serial.write(c);  
    }

    static uint32_t lastCmd = 0;
    if (millis() - lastCmd > 500) {
        Serial1.print("setSysMode,1\r\n");
        Serial1.print("setGrowLED,15,100\r\n");
        lastCmd = millis();
    }
}