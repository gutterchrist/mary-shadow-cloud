#include "Particle.h"

// OpenMary Transparent Bridge v4 - Sniffer Mode
// - Dumps raw Serial1 data to debug_str

String sensor_info_str = "{}";
String debug_str = "Waiting...";
char rxBuffer[64];
int rxIdx = 0;

int genericCommand(String cmd, String args) {
    String packet = cmd + "," + args;
    Serial1.println(packet);
    debug_str = "Sent: " + packet; // Overwrite debug with sent cmd temporarily
    return 1;
}

int resetDebug(String args) {
    debug_str = "";
    return 1;
}

int setGrowLED(String args) { return genericCommand("setGrowLED", args); }
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
    Particle.function("resetDebug", resetDebug);

    pinMode(D6, OUTPUT);
    digitalWrite(D6, HIGH);

    Serial1.begin(115200);
    delay(100);
    Serial1.println("setSysMode,1"); 
}

void loop() {
    while (Serial1.available()) {
        char c = Serial1.read();
        
        // Append raw char to debug_str for inspection
        // Filter non-printable chars to avoid breaking the JSON response of 'particle get'
        if (c < 32 && c != '\n' && c != '\r') {
            debug_str += "[x" + String(c, HEX) + "]";
        } else {
            debug_str += c;
        }

        // Limit size
        if (debug_str.length() > 600) {
            debug_str = debug_str.substring(debug_str.length() - 600);
        }
    }
}
