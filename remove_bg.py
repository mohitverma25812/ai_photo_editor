import sys
from rembg import remove
from PIL import Image

# Node.js se input (original image) aur output (transparent image) ka path lena
input_path = sys.argv[1]
output_path = sys.argv[2]

try:
    # Image open karna
    input_image = Image.open(input_path)
    
    # Background remove karna (pehle run mein AI model download hoga, isliye thoda time lag sakta hai)
    output_image = remove(input_image)
    
    # Nayi PNG image save karna
    output_image.save(output_path, format="PNG")
    print("Success")
except Exception as e:
    print(f"Error: {e}")