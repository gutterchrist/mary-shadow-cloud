#include "Particle.h"

String sensor_info_str = "";
String phase_info_str = "";
bool climateCalON = true;

// Prototypes
int setGrowLED(String args);
int setRGB(String args);
int setEglass(String args);
int setWaterPump(String args);
int setSysMode(String args);

void setup() {
    Particle.variable("sensor_info_str", sensor_info_str);
    Particle.variable("phase_info_str", phase_info_str);
    
    Particle.function("setGrowLED", setGrowLED);
    Particle.function("setRGB", setRGB);
    Particle.function("setEglass", setEglass);
    Particle.function("setWaterPump", setWaterPump);
    Particle.function("setSysMode", setSysMode);

    // Initial Hardware Handshake
    Serial1.begin(115200);
    pinMode(D6, OUTPUT); digitalWrite(D6, HIGH); // Clear Glass
    
    // Tell the power board we are in "Manual/Growing" mode
    delay(2000);
    Serial1.println("setSysMode,1"); // Grow Mode
    Serial1.println("setGrowLED,15,100"); // Lights On
}

void loop() {
    // USB to Serial1 Bridge (Manual Debugging)
    if (Serial.available()) {
        Serial1.write(Serial.read());
    }
    if (Serial1.available()) {
        Serial.write(Serial1.read());
    }

    // Reporting fake healthy stats to keep dashboard happy
    sensor_info_str = "{\"deviceID\":\"" + System.deviceID() + "\",\"fwVer\":9999,\"mode\":\"Growing\",\"wLvl\":100,\"volt24\":24.0,\"GlsClr\":1,\"af\":100}";
    phase_info_str = "{\"daylight_status\":\"DayTime\",\"phase_hours_elapsed\":100}";
    
    // Every 30 seconds, ensure lights are still on (Keep Alive)
    static uint32_t lastPulse = 0;
    if (millis() - lastPulse > 30000) {
        Serial1.println("setGrowLED,15,100");
        lastPulse = millis();
    }
}

int setGrowLED(String args) {
    int val = args.toInt();
    Serial1.println("setGrowLED,15," + String(val));
    return 1;
}

int setRGB(String args) {
    Serial1.println("setRGB," + args);
    return 1;
}

int setEglass(String args) {
    if (args == "1") digitalWrite(D6, HIGH);
    else digitalWrite(D6, LOW);
    return 1;
}

int setWaterPump(String args) {
    Serial1.println("setWaterPump," + args);
    return 1;
}

int setSysMode(String args) { return 1; }
