#include "Particle.h"

// Simple Bit-Bang Serial Receiver for D0 (RX) at 28800 baud
// 28800 baud = 34.72 microseconds per bit

int rxPin = D0;
int txPin = D1;
int bitDelay = 34; // approx for 28800

void setup() {
    Serial.begin(115200);
    pinMode(rxPin, INPUT);
    pinMode(txPin, OUTPUT);
    digitalWrite(txPin, HIGH); // Idle High
    Serial.println("--- BIT BANG SNIFFER ACTIVE (28800 on D0) ---");
}

void loop() {
    // Wait for start bit (LOW)
    if (digitalRead(rxPin) == LOW) {
        delayMicroseconds(bitDelay + (bitDelay / 2)); // Wait 1.5 bits to sample center of first data bit
        
        byte val = 0;
        for (int i = 0; i < 8; i++) {
            val |= (digitalRead(rxPin) << i);
            delayMicroseconds(bitDelay);
        }
        
        Serial.write(val); // Send to USB
        
        // Wait for stop bit
        delayMicroseconds(bitDelay); 
    }
}