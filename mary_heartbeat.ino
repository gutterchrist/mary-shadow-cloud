#include "Particle.h"

// Ultimate Heartbeat Firmware
void setup() {
    Serial.begin(115200);
    Serial1.begin(115200);
    pinMode(D6, OUTPUT);
    
    // Initial Wakeup
    delay(2000);
    Serial1.println("setSysMode,1");
    Serial1.println("setGrowLED,15,100");
}

void loop() {
    // Factory-style Telemetry String
    String heartbeat = "{\"deviceID\":\"" + System.deviceID() + "\",\"fwVer\":4009,\"mode\":\"Growing\",\"wLvl\":100,\"volt24\":24.0,\"GlsClr\":1,\"af\":100}";
    
    Serial1.println(heartbeat);
    Serial.println("Heartbeat sent: " + heartbeat);
    
    digitalWrite(D6, HIGH);
    
    delay(1000);
}