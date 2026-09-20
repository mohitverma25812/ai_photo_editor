import sys
import cv2
import numpy as np

input_path = sys.argv[1]
output_path = sys.argv[2]

try:
    # cv2.IMREAD_UNCHANGED lagane se transparent background delete nahi hota
    img = cv2.imread(input_path, cv2.IMREAD_UNCHANGED)
    if img is None:
        raise Exception("Image read nahi ho payi")
    
    # Agar image pehle se transparent hai (4 channels)
    if len(img.shape) == 3 and img.shape[2] == 4:
        bgr = img[:, :, :3]  # Sirf image color liya
        alpha = img[:, :, 3] # Transparency alag ki
        
        # Edit sirf face par apply kiya
        smoothed_bgr = cv2.bilateralFilter(bgr, d=15, sigmaColor=75, sigmaSpace=75)
        
        # Edit hone ke baad transparency wapas jod di
        smoothed_img = np.dstack([smoothed_bgr, alpha])
    else:
        # Normal bina transparency wali photo ke liye
        smoothed_img = cv2.bilateralFilter(img, d=15, sigmaColor=75, sigmaSpace=75)
    
    cv2.imwrite(output_path, smoothed_img)
    print("Success")
except Exception as e:
    print(f"Error: {e}")