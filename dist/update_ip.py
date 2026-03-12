import os
import sys
import subprocess

def patch_apk(new_ip):
    source_dir = "/home/brad/Downloads/Mary_Extracted/mary_source"
    
    # 1. Update Smali
    smali_file = os.path.join(source_dir, "smali_classes2/com/mary/BuildConfig.smali")
    with open(smali_file, 'r') as f:
        content = f.read()
    
    # Simple replacement (assuming previous IP was 192.168.1.28)
    new_content = content.replace("192.168.1.28", new_ip)
    
    with open(smali_file, 'w') as f:
        f.write(new_content)
        
    # 2. Update Strings.xml
    strings_file = os.path.join(source_dir, "res/values/strings.xml")
    with open(strings_file, 'r') as f:
        content = f.read()
    
    new_content = content.replace("192.168.1.28", new_ip)
    
    with open(strings_file, 'w') as f:
        f.write(new_content)

    print(f"Patched Smali and Resources with IP: {new_ip}")
    
    # 3. Rebuild
    print("Rebuilding APK...")
    subprocess.run(["apktool", "b", source_dir, "-o", "mary_patched.apk"])
    
    # 4. Align
    print("Aligning...")
    subprocess.run(["zipalign", "-f", "-v", "4", "mary_patched.apk", "mary_patched_aligned.apk"])
    
    # 5. Sign
    print("Signing...")
    subprocess.run([
        "apksigner", "sign", 
        "--ks", "/home/brad/my-release-key.jks", 
        "--ks-pass", "pass:password",
        "--out", "mary_shadow_cloud_v1.apk",
        "mary_patched_aligned.apk"
    ])
    
    print("
SUCCESS! Your custom APK is ready: mary_shadow_cloud_v1.apk")

if __name__ == "__main__":
    if len(sys.argv) < 2:
        print("Usage: python3 update_ip.py <YOUR_PC_IP>")
    else:
        patch_apk(sys.argv[1])
