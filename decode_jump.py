import struct

def decode_bl(pc, instruction):
    # Thumb-2 BL decoding
    # instruction is a 4-byte bytes object: e.g. b'\x1f\xf7\x67\x50' -> 0xF71F 0x5067
    
    word1 = struct.unpack('<H', instruction[0:2])[0]
    word2 = struct.unpack('<H', instruction[2:4])[0]
    
    s = (word1 >> 10) & 1
    j1 = (word2 >> 13) & 1
    j2 = (word2 >> 11) & 1
    i1 = not (j1 ^ s)
    i2 = not (j2 ^ s)
    
    offset_s = (word1 & 0x7FF) << 12
    offset_j1 = i1 << 23
    offset_j2 = i2 << 22
    offset_word2 = word2 & 0x7FF
    
    offset = (-(s << 24)) | offset_j1 | offset_j2 | offset_s | (offset_word2 << 1)
    
    target = pc + 4 + offset
    return target

# File offset 66334 = 0x1031E
# Base address 0x080A0000 (User Flash)
# PC = 0x080A0000 + 0x1031E = 0x080B031E
pc = 0x080B031E
instr = b'\x1f\xf7\x67\x50'

target = decode_bl(pc, instr)
print(f"Call from PC {hex(pc)} jumps to {hex(target)}")
print(f"File Offset of Target: {hex(target - 0x080A0000)}")
