#include "Particle.h"

void setup() {
    Serial.begin(115200);
}

void loop() {
    long bauds[] = {115200, 19200, 57600, 9600};
    
    for(int b = 0; b < 4; b++) {
        Serial.print("--- SCANNING BAUD: "); 
        Serial.print(bauds[b]); 
        Serial.println(" ---");
        
        Serial1.begin(bauds[b]);
        
        // Send a few variations of the "Wake Up" command
        Serial1.println("setSysMode,1");
        delay(100);
        Serial1.println("setGrowLED,15,100");
        delay(100);
        Serial1.println("setRGB,11,255,255,255");
        
        // Listen for 5 seconds for ANY response
        unsigned long start = millis();
        while(millis() - start < 5000) {
            if (Serial1.available()) {
                char c = Serial1.read();
                Serial.write(c); // Pass it to USB
            }
            if (Serial.available()) {
                Serial1.write(Serial.read()); // Allow manual typing from PC
            }
        }
        Serial1.end();
    }
}