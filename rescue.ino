#include "Particle.h"

void setup() {
    // Enable all possible power and control pins for Mary hardware
    pinMode(D2, OUTPUT); digitalWrite(D2, HIGH);
    pinMode(D3, OUTPUT); digitalWrite(D3, HIGH);
    pinMode(D4, OUTPUT); digitalWrite(D4, HIGH);
    pinMode(D5, OUTPUT); digitalWrite(D5, HIGH);
    pinMode(D6, OUTPUT); digitalWrite(D6, HIGH); // Glass Clear
    pinMode(A4, OUTPUT); digitalWrite(A4, HIGH);
    pinMode(A5, OUTPUT); digitalWrite(A5, HIGH); // Grow Lights
    
    // Wake up the Serial1 bridge to the power controller
    Serial1.begin(115200);
    delay(1000);
    Serial1.println("setGrowLED,15,100");
    Serial1.println("setRGB,11,255,255,255");
}

void loop() {
    // Keep everything forced HIGH
    digitalWrite(D2, HIGH);
    digitalWrite(D4, HIGH);
    digitalWrite(D6, HIGH);
    delay(5000);
}
