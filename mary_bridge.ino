#include "Particle.h"

// Mary Serial Bridge
// P1 acts as a middleman between the Power Board (Serial1) and USB
void setup() {
    Serial.begin(115200);  // USB to PC
    Serial1.begin(115200); // P1 to Power Board
    Serial.println("--- MARY BRIDGE ACTIVE ---");
}

void loop() {
    // Forward Power Board -> PC
    if (Serial1.available()) {
        Serial.write(Serial1.read());
    }
    
    // Forward PC -> Power Board
    if (Serial.available()) {
        Serial1.write(Serial.read());
    }
}
