#include "Particle.h"

// Baud rates to try
long bauds[] = {9600, 14400, 19200, 28800, 38400, 57600, 115200};
int currentBaudIndex = 0;
unsigned long lastChange = 0;

void setup() {
    Particle.function("setBaud", setBaud);
    // Start with the first baud rate
    Serial1.begin(bauds[0]);
}

void loop() {
    // Every 5 seconds, switch baud rate and try to wake the board
    if (millis() - lastChange > 5000) {
        lastChange = millis();
        currentBaudIndex = (currentBaudIndex + 1) % 7;
        
        Serial1.end();
        Serial1.begin(bauds[currentBaudIndex]);
        
        // Try to wake it up
        Serial1.println("setSysMode,1"); 
        Serial1.println("setGrowLED,15,100");
        Serial1.println("setRGB,11,255,255,255");
        
        // Log to Cloud so we know what we are trying
        Particle.publish("baud_hunt", String(bauds[currentBaudIndex]));
    }
}

int setBaud(String args) {
    int b = args.toInt();
    Serial1.end();
    Serial1.begin(b);
    Serial1.println("setSysMode,1");
    Serial1.println("setGrowLED,15,100");
    return 1;
}
