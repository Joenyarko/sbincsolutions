import os
from PIL import Image
import sys

def optimize_images(directory):
    if not os.path.exists(directory):
        print(f"Directory not found: {directory}")
        return

    print(f"Scanning {directory}...")
    
    # Supported formats
    exts = ['.jpg', '.jpeg', '.png', '.heic']
    
    for filename in os.listdir(directory):
        filepath = os.path.join(directory, filename)
        
        if not os.path.isfile(filepath):
            continue
            
        base, ext = os.path.splitext(filename)
        if ext.lower() not in exts:
            continue
            
        size_mb = os.path.getsize(filepath) / (1024 * 1024)
        
        # Only process if > 1MB
        if size_mb > 1.0:
            print(f"Optimizing {filename} ({size_mb:.2f} MB)...")
            
            try:
                with Image.open(filepath) as img:
                    # Convert RGBA to RGB if saving as JPEG
                    if img.mode in ('RGBA', 'P') and ext.lower() in ['.jpg', '.jpeg']:
                        img = img.convert('RGB')
                    
                    # Resize if too large (max dimension 1920)
                    max_dim = 1920
                    if max(img.size) > max_dim:
                        ratio = max_dim / max(img.size)
                        new_size = (int(img.width * ratio), int(img.height * ratio))
                        img = img.resize(new_size, Image.Resampling.LANCZOS)
                        print(f"  Resized to {new_size}")
                    
                    # Save optimized version
                    # Convert PNGs to JPG if they are photos (usually large PNGs are)
                    # Use a heuristic: if PNG > 1MB, try converting to high quality JPG
                    target_ext = ext.lower()
                    if ext.lower() == '.png' and size_mb > 1.5:
                         # Check if it has transparency
                        if img.mode == 'RGBA':
                             # Keep as PNG but optimize? Or composite on white?
                             # For now, just optimize PNG
                             pass 
                        else:
                             # Convert to JPG
                             target_ext = '.jpg'
                             img = img.convert('RGB')

                    output_path = os.path.join(directory, base + target_ext)
                    
                    # Quality setting
                    quality = 85
                    
                    if target_ext in ['.jpg', '.jpeg']:
                        img.save(output_path, "JPEG", quality=quality, optimize=True)
                    elif target_ext == '.png':
                        img.save(output_path, "PNG", optimize=True)
                        
                    # Calculate savings
                    new_size_mb = os.path.getsize(output_path) / (1024 * 1024)
                    print(f"  Saved as {os.path.basename(output_path)} ({new_size_mb:.2f} MB)")
                    
                    # If we changed extension, we might need to update references... 
                    # But implementing that automatically is risky. 
                    # For now, let's just optimize in place if ext is same, or verify references.
                    
            except Exception as e:
                print(f"  Error optimizing {filename}: {e}")

if __name__ == "__main__":
    optimize_images(r"c:\Users\joeny\OneDrive\Desktop\Sbinc\images\pictures")
