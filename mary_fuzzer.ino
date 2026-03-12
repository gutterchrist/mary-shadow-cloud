#include "Particle.h"

void setup() {
    Serial.begin(115200);
    Serial1.begin(115200);
    pinMode(D6, OUTPUT);
}

void loop() {
    Serial.println("--- STARTING FUZZ CYCLE ---");

    // Try Standard Newline
    Serial.println("Testing: CRLF (println)");
    Serial1.println("setSysMode,1");
    Serial1.println("setGrowLED,15,100");
    delay(2000);
    digitalWrite(D6, HIGH); delay(100); digitalWrite(D6, LOW);

    // Try Carriage Return Only
    Serial.println("Testing: CR Only");
    Serial1.print("setSysMode,1\r");
    Serial1.print("setGrowLED,15,100\r");
    delay(2000);
    digitalWrite(D6, HIGH); delay(100); digitalWrite(D6, LOW);

    // Try Line Feed Only
    Serial.println("Testing: LF Only");
    Serial1.print("setSysMode,1\n");
    Serial1.print("setGrowLED,15,100\n");
    delay(2000);
    digitalWrite(D6, HIGH); delay(100); digitalWrite(D6, LOW);

    // Try No Endings
    Serial.println("Testing: RAW (No Endings)");
    Serial1.print("setSysMode,1");
    Serial1.print("setGrowLED,15,100");
    delay(2000);
    digitalWrite(D6, HIGH); delay(100); digitalWrite(D6, LOW);
    
    delay(1000);
}