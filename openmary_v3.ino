#include "Particle.h"

// Define the pointer to the factory setup function
typedef void (*FactoryFunc)();
FactoryFunc factory_setup = (FactoryFunc)0x080ADACC;

void setup() {
    Serial.begin(115200);
    
    // Call the factory setup to turn on the hardware!
    factory_setup();
    
    Serial1.begin(28800);
    delay(1000);
    Serial1.print("setSysMode,1\r\n");
}

void loop() {
    // We stay in a simple loop to keep the system OS alive
    delay(1000);
}