#include "Particle.h"

void setup() {
    Serial.begin(115200);
    Serial1.begin(28800);
    
    pinMode(A1, OUTPUT);
    digitalWrite(A1, LOW); 
    
    pinMode(D6, OUTPUT);
    digitalWrite(D6, HIGH);

    delay(3000);
}

void loop() {
    Serial1.print("setSysMode,1\r\n");
    Serial1.print("setGrowLED,15,100\r\n");
    
    String hb = "{\"deviceID\":\"" + System.deviceID() + "\",\"fwVer\":4009,\"mode\":\"Growing\",\"wLvl\":100}";
    Serial1.print(hb + "\r\n");
    
    delay(1000);
}