#include "Particle.h"

void setup() {
    Serial.begin(115200);
    Serial1.begin(115200);
    // Set all pins to output
    for(int i=0; i<=7; i++) { pinMode(D0+i, OUTPUT); pinMode(A0+i, OUTPUT); }
}

void loop() {
    int pins[] = {D0, D1, D2, D3, D4, D5, D6, D7, A0, A1, A2, A3, A4, A5, A6, A7};
    char* names[] = {"D0", "D1", "D2", "D3", "D4", "D5", "D6", "D7", "A0", "A1", "A2", "A3", "A4", "A5", "A6", "A7"};

    for(int p=0; p<16; p++) {
        Serial.print("--- TESTING PIN: "); Serial.println(names[p]);
        
        // Try HIGH
        digitalWrite(pins[p], HIGH);
        Serial1.println("setSysMode,1");
        Serial1.println("setGrowLED,15,100");
        delay(2000);
        
        // Try LOW
        digitalWrite(pins[p], LOW);
        delay(1000);
    }
}
