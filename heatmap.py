import cv2
import numpy as np

def generate_heatmap(input_path, output_path):
    # Read image
    img = cv2.imread(input_path)
    img = cv2.resize(img, (400, 400))
    
    # Create heatmap
    heatmap = cv2.applyColorMap(img, cv2.COLORMAP_JET)
    
    # Combine with original image
    superimposed = cv2.addWeighted(img, 0.5, heatmap, 0.5, 0)
    
    # Save result
    cv2.imwrite(output_path, superimposed)