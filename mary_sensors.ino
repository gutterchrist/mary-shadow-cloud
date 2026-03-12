#include "Particle.h"

// Mary AG Sensor Sniffer
void setup() {
    Serial.begin(115200);
}

void loop() {
    Serial.println("--- Mary Analog Sensor Values ---");
    Serial.print("A0: "); Serial.println(analogRead(A0));
    Serial.print("A1: "); Serial.println(analogRead(A1));
    Serial.print("A2: "); Serial.println(analogRead(A2));
    Serial.print("A3: "); Serial.println(analogRead(A3));
    Serial.print("A4: "); Serial.println(analogRead(A4));
    Serial.print("A5: "); Serial.println(analogRead(A5));
    Serial.print("A6: "); Serial.println(analogRead(A6));
    Serial.print("A7: "); Serial.println(analogRead(A7));
    
    Serial.println("--- Digital State (Door/Safety) ---");
    pinMode(D2, INPUT_PULLUP); Serial.print("D2: "); Serial.println(digitalRead(D2));
    pinMode(D3, INPUT_PULLUP); Serial.print("D3: "); Serial.println(digitalRead(D3));
    pinMode(D4, INPUT_PULLUP); Serial.print("D4: "); Serial.println(digitalRead(D4));
    pinMode(D5, INPUT_PULLUP); Serial.print("D5: "); Serial.println(digitalRead(D5));
    
    delay(2000);
}