#include "Particle.h"

// Diagnostic Sniffer for Mary Power Board
void setup() {
    Serial.begin(9600); // USB Debug
    pinMode(D6, OUTPUT); 
}

void loop() {
    long bauds[] = {115200, 19200, 57600, 9600};
    
    for(int b = 0; b < 4; b++) {
        Serial.print("--- TESTING BAUD: ");
        Serial.print(bauds[b]);
        Serial.println(" ---");
        
        Serial1.begin(bauds[b]);
        delay(1000);

        // Hardware Check
        Serial.println("Testing Pin D6 (Glass)...");
        digitalWrite(D6, HIGH); delay(1000); digitalWrite(D6, LOW);

        // Test Sequence 1
        Serial.println("Testing Format: setSysMode,1");
        Serial1.println("setSysMode,1"); 
        delay(500);
        Serial1.println("setGrowLED,15,100");
        delay(2000);

        // Test Sequence 2
        Serial.println("Testing Format: setRGB,255,255,255");
        Serial1.println("setRGB,255,255,255");
        delay(2000);

        Serial1.end();
    }
    
    Serial.println("--- CYCLE COMPLETE - RESTARTING ---");
    delay(5000);
}