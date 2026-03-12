#include "Particle.h"

// Mary Control Finder - Multi-Pin Test
int testCombo(String args) {
    int val = args.toInt();
    // Common combo for Mary Grow Lights
    pinMode(D2, OUTPUT); digitalWrite(D2, (val > 0) ? HIGH : LOW);
    pinMode(D4, OUTPUT); digitalWrite(D4, (val > 0) ? HIGH : LOW);
    pinMode(D6, OUTPUT); digitalWrite(D6, (val > 0) ? HIGH : LOW);
    return 1;
}

void setup() {
    Particle.function("testCombo", testCombo);
    // Start LOW
    pinMode(D2, OUTPUT); digitalWrite(D2, LOW);
    pinMode(D4, OUTPUT); digitalWrite(D4, LOW);
    pinMode(D6, OUTPUT); digitalWrite(D6, LOW);
}

void loop() {}
