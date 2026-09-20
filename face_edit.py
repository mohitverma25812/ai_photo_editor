import sys
import cv2

input_path = sys.argv[1]
output_path = sys.argv[2]

try:
    # Image read karna
    img = cv2.imread(input_path)
    if img is None:
        raise Exception("Image read nahi ho payi")
    
    # Bilateral Filter se face retouching/smoothing effect (skin smooth, edges sharp)
    smoothed_img = cv2.bilateralFilter(img, d=15, sigmaColor=75, sigmaSpace=75)
    
    # Processed image ko save karna
    cv2.imwrite(output_path, smoothed_img)
    print("Success")
except Exception as e:
    print(f"Error: {e}")