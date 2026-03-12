#include "Particle.h"

// OpenMary KeepAlive Bridge
// - Transparent Command Bridge
// - Includes Heartbeat to keep STM32 Power Board Active
// - D6 High (Glass Clear)

String sensor_info_str = "{\"status\":\"Waiting for stream...\"}";
String debug_str = "Booting...";
char rxBuffer[1024];
int rxIdx = 0;

// Variables to track state so heartbeat doesn't override user
int currentLedVal = 100; 

int genericCommand(String cmd, String args) {
    String packet = cmd + "," + args;
    Serial1.println(packet);
    debug_str = "Sent: " + packet;
    return 1;
}

int setGrowLED(String args) {
    currentLedVal = args.toInt(); // Update our local state
    return genericCommand("setGrowLED", args); 
}

int setRGB(String args) { return genericCommand("setRGB", args); }
int setEglass(String args) { return genericCommand("setEglass", args); }
int setWaterPump(String args) { return genericCommand("setWaterPump", args); }
int setAirPump(String args) { return genericCommand("setAirPump", args); }
int setFanSpd(String args) { return genericCommand("setFanSpd", args); }
int setSysMode(String args) { return genericCommand("setSysMode", args); }
int updPhzInfo(String args) { return genericCommand("updPhzInfo", args); }

void setup() {
    Particle.variable("sensor_info_str", sensor_info_str);
    Particle.variable("debug_str", debug_str);
    
    Particle.function("setGrowLED", setGrowLED);
    Particle.function("setRGB", setRGB);
    Particle.function("setEglass", setEglass);
    Particle.function("setWaterPump", setWaterPump);
    Particle.function("setAirPump", setAirPump);
    Particle.function("setFanSpd", setFanSpd);
    Particle.function("setSysMode", setSysMode);
    Particle.function("updPhzInfo", updPhzInfo);

    // BLAST ALL PINS HIGH (Shotgun approach to ensure power is on)
    pinMode(D0, OUTPUT); digitalWrite(D0, HIGH);
    pinMode(D1, OUTPUT); digitalWrite(D1, HIGH);
    pinMode(D2, OUTPUT); digitalWrite(D2, HIGH);
    pinMode(D3, OUTPUT); digitalWrite(D3, HIGH);
    pinMode(D4, OUTPUT); digitalWrite(D4, HIGH);
    pinMode(D5, OUTPUT); digitalWrite(D5, HIGH);
    pinMode(D6, OUTPUT); digitalWrite(D6, HIGH); // Glass Clear
    pinMode(D7, OUTPUT); digitalWrite(D7, HIGH);

    Serial1.begin(115200);
    delay(100);
    
    // Initial Wake Sequence
    Serial1.println("setSysMode,1");
    delay(100);
    Serial1.println("setGrowLED,15,100");
}

void loop() {
    // 1. Heartbeat: Keep the board alive every 15 seconds
    static uint32_t lastPulse = 0;
    if (millis() - lastPulse > 15000) {
        // Send the LAST KNOWN led value to keep it alive without resetting to 100% if user changed it
        Serial1.println("setGrowLED,15," + String(currentLedVal));
        lastPulse = millis();
    }

    // 2. Read Serial Data
    while (Serial1.available()) {
        char c = Serial1.read();
        if (rxIdx < 1023) {
            rxBuffer[rxIdx++] = c;
            rxBuffer[rxIdx] = 0;
        } else {
            rxIdx = 0;
        }

        if (c == '}') {
            String fullData = String(rxBuffer);
            int lastStart = fullData.lastIndexOf('{');
            if (lastStart != -1) {
                String candidate = fullData.substring(lastStart, rxIdx);
                // Basic check for sensor data
                if (candidate.indexOf("deviceID") != -1 || candidate.indexOf("Temp") != -1) {
                    sensor_info_str = candidate;
                }
                rxIdx = 0;
            }
        }
    }
}
