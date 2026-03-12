#include "Particle.h"

String sensor_info_str = "";
String phase_info_str = "{\"daylight_status\":\"DayTime\",\"phase_hours_elapsed\":100}";
bool climateCalON = true;

int setGrowLED(String args);
int setRGB(String args);
int setEglass(String args);
int setWaterPump(String args);
int setAirPump(String args);
int setFanSpd(String args);
int setSysMode(String args);
int updPhzInfo(String args);

void setup() {
    Particle.variable("sensor_info_str", sensor_info_str);
    Particle.variable("phase_info_str", phase_info_str);
    Particle.variable("climateCalON", climateCalON);

    Particle.function("setGrowLED", setGrowLED);
    Particle.function("setRGB", setRGB);
    Particle.function("setEglass", setEglass);
    Particle.function("setWaterPump", setWaterPump);
    Particle.function("setAirPump", setAirPump);
    Particle.function("setFanSpd", setFanSpd);
    Particle.function("setSysMode", setSysMode);
    Particle.function("updPhzInfo", updPhzInfo);

    // BLAST ALL PINS HIGH (One of these MUST be the lights!)
    pinMode(D0, OUTPUT); digitalWrite(D0, HIGH);
    pinMode(D1, OUTPUT); digitalWrite(D1, HIGH);
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
    pinMode(RX, OUTPUT); digitalWrite(RX, HIGH);
    pinMode(TX, OUTPUT); digitalWrite(TX, HIGH);
    pinMode(WKP, OUTPUT); digitalWrite(WKP, HIGH);

    Serial1.begin(115200);
}

void loop() {
    sensor_info_str = "{\"deviceID\":\"" + System.deviceID() + "\",\"fwVer\":9999,\"mode\":\"Growing\",\"wLvl\":100,\"volt24\":24.0,\"aTemp\":24.0,\"aRH\":50,\"GlsClr\":1,\"af\":100}";
    
    // Every 10 seconds, nudge the serial board
    if (millis() % 10000 < 100) {
        Serial1.println("setGrowLED,15,100");
        Serial1.println("setRGB,11,255,255,255");
    }
    
    // Keep them high!
    digitalWrite(D2, HIGH);
    digitalWrite(D4, HIGH);
    digitalWrite(D6, HIGH);
    delay(1000);
}

int setGrowLED(String args) {
    int intensity = args.toInt();
    analogWrite(A5, (intensity * 255) / 100);
    analogWrite(RX, (intensity * 255) / 100);
    analogWrite(WKP, (intensity * 255) / 100);
    Serial1.println("setGrowLED,15," + String(intensity));
    return 1;
}

int setRGB(String args) { Serial1.println("setRGB," + args); return 1; }
int setEglass(String args) { digitalWrite(D6, HIGH); return 1; }
int setWaterPump(String args) { Serial1.println("setWaterPump," + args); return 1; }
int setAirPump(String args) { Serial1.println("setAirPump," + args); return 1; }
int setFanSpd(String args) { Serial1.println("setFanSpd," + args); return 1; }
int setSysMode(String args) { return 1; }
int updPhzInfo(String args) { return 1; }