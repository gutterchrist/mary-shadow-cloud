#include "Particle.h"

void setup() {
    Serial.begin(115200);
    Serial1.begin(38400); 
    
    pinMode(D2, OUTPUT); digitalWrite(D2, HIGH);
    pinMode(D3, OUTPUT); digitalWrite(D3, HIGH);
    pinMode(D4, OUTPUT); digitalWrite(D4, HIGH);
    pinMode(D5, OUTPUT); digitalWrite(D5, HIGH);
    pinMode(D6, OUTPUT); digitalWrite(D6, HIGH);
    pinMode(D7, OUTPUT); digitalWrite(D7, HIGH);
    pinMode(A0, OUTPUT); digitalWrite(A0, HIGH);
    pinMode(A1, OUTPUT); digitalWrite(A1, HIGH);
    pinMode(A2, OUTPUT); digitalWrite(A2, HIGH);
    pinMode(A3, OUTPUT); digitalWrite(A3, HIGH);
    pinMode(A4, OUTPUT); digitalWrite(A4, HIGH);
    pinMode(A5, OUTPUT); digitalWrite(A5, HIGH);

    delay(2000);
}

void loop() {
    Serial1.print("setSysMode,1\r\n");
    Serial1.print("setGrowLED,15,100\r\n");
    
    String hb = "{\"deviceID\":\"" + System.deviceID() + "\",\"fwVer\":4009,\"mode\":\"Growing\",\"wLvl\":100,\"volt24\":24.0}";
    Serial1.print(hb + "\r\n");
    
    delay(1000);
}