import struct

# Common Baud Rates to search for in ARM little-endian machine code
bauds = {
    9600: b'\x80\x25',
    14400: b'\x40\x38',
    19200: b'\x00\x4B',
    28800: b'\x80\x70',
    38400: b'\x00\x96',
    57600: b'\x00\xE1',
    115200: b'\x00\xC2\x01'
}

with open('mary-shadow-cloud/good_firmware.bin', 'rb') as f:
    data = f.read()

print("--- Scanning Firmware for Baud Rate Constants ---")
for rate, pattern in bauds.items():
    offsets = []
    index = 0
    while True:
        index = data.find(pattern, index)
        if index == -1:
            break
        # Check if it looks like a valid instruction (aligned)
        if index % 2 == 0:
            offsets.append(hex(index))
        index += 1
    
    if offsets:
        print(f"Found {rate} baud at offsets: {offsets}")
    else:
        print(f"Did not find {rate}")
