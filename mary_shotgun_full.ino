#include "Particle.h"

void setup() {
    int allPins[] = {D0, D1, D2, D3, D4, D5, D6, D7, A0, A1, A2, A3, A4, A5, WKP, RX, TX};
    for(int i=0; i<17; i++) {
        pinMode(allPins[i], OUTPUT);
        digitalWrite(allPins[i], HIGH);
    }
    // Also try to wake STM32
    Serial1.begin(115200);
    delay(1000);
    Serial1.println("setSysMode,1");
    Serial1.println("setGrowLED,15,100");
}

void loop() {
    // Keep everything pinned HIGH
    int allPins[] = {D0, D1, D2, D3, D4, D5, D6, D7, A0, A1, A2, A3, A4, A5, WKP, RX, TX};
    for(int i=0; i<17; i++) { digitalWrite(allPins[i], HIGH); }
    delay(1000);
}
