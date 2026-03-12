#include "Particle.h"

typedef void (*FactoryFunc)();
FactoryFunc factory_setup = (FactoryFunc)0x080ADACC;

int mySetGrowLED(String args) {
    Serial1.print("setGrowLED,15," + args + "\r\n");
    return 1;
}

void setup() {
    factory_setup();
    Particle.function("setGrowLED", mySetGrowLED);
    Serial1.begin(28800); 
}

void loop() {
    delay(1000);
}