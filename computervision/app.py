import easyocr
import cv2
import re
from datetime import datetime
import csv
import os

# Initialize the EasyOCR reader (English language, GPU optional)
reader = easyocr.Reader(['en'], gpu=False)  # Set gpu=True if you have a GPU

def capture_image_from_camera():
    """Capture an image from the laptop/phone camera."""
    cap = cv2.VideoCapture(0)  # 0 is the default camera (use 1 or higher if multiple cameras)
    if not cap.isOpened():
        print("Error: Could not open camera.")
        return None
    
    print("Press 's' to capture the label image, 'q' to quit.")
    while True:
        ret, frame = cap.read()
        if not ret:
            print("Error: Could not read frame.")
            break
        
        cv2.imshow('Camera Feed', frame)
        key = cv2.waitKey(1) & 0xFF
        if key == ord('s'):  # Press 's' to save the image
            cv2.imwrite('label_image.jpg', frame)
            print("Image captured and saved as 'label_image.jpg'")
            break
        elif key == ord('q'):  # Press 'q' to quit without saving
            print("Capture cancelled.")
            cap.release()
            cv2.destroyAllWindows()
            return None
    
    cap.release()
    cv2.destroyAllWindows()
    return 'label_image.jpg'

def extract_text_from_image(image_path):
    """Extract text from the captured image using EasyOCR."""
    try:
        results = reader.readtext(image_path)
        extracted_text = [text for (_, text, _) in results]
        return extracted_text
    except Exception as e:
        print(f"Error processing image: {e}")
        return []

def process_text(text_list):
    """Process extracted text to find item name and expiry date."""
    item_name = "Unknown Item"
    expiry_date = "Unknown Expiry"
    
    # Regular expression for common date formats (e.g., MM/DD/YYYY, DD-MM-YYYY)
    date_pattern = r'(\d{1,2}[/-]\d{1,2}[/-]\d{2,4})'
    
    for text in text_list:
        date_match = re.search(date_pattern, text)
        if date_match:
            expiry_date = date_match.group(0)
            try:
                parsed_date = datetime.strptime(expiry_date, '%m/%d/%Y')
                expiry_date = parsed_date.strftime('%m/%d/%Y')
            except ValueError:
                try:
                    parsed_date = datetime.strptime(expiry_date, '%d-%m-%Y')
                    expiry_date = parsed_date.strftime('%m/%d/%Y')
                except ValueError:
                    pass
        elif not re.search(date_pattern, text) and item_name == "Unknown Item":
            item_name = text.strip()
    
    return item_name, expiry_date

def store_inventory_data(item_name, expiry_date):
    """Store item name and expiry date in a CSV file."""
    try:
        file_path = 'visual.csv'
        file_exists = os.path.isfile(file_path)
        with open(file_path, mode='a', newline='') as file:
            writer = csv.writer(file)
            if not file_exists:
                writer.writerow(['Item Name', 'Expiry Date', 'Timestamp'])
            timestamp = datetime.now().strftime('%Y-%m-%d %H:%M:%S')
            writer.writerow([item_name, expiry_date, timestamp])
        print(f"Data successfully stored in '{file_path}': {item_name}, {expiry_date}")
    except PermissionError:
        print("Error: No permission to write to 'visual.csv'. Check file access rights.")
    except Exception as e:
        print(f"Error storing data in CSV: {e}")

def main():
    """Main function to run the Visual Inventory Tracking system in a loop."""
    print("Visual Inventory Tracking System")
    while True:
        print("\nOptions:")
        print("1: Capture image from camera")
        print("2: Use an existing image file")
        print("3: Exit")
        choice = input("Enter 1, 2, or 3: ").strip()

        if choice == '1':
            image_path = capture_image_from_camera()
            if not image_path:
                print("No image captured. Returning to menu.")
                continue
        elif choice == '2':
            image_path = input("Enter the path to your image file (e.g., 'label.jpg'): ").strip()
            if not os.path.exists(image_path):
                print(f"Error: File '{image_path}' not found.")
                continue
        elif choice == '3':
            print("Exiting the Visual Inventory Tracking System.")
            break
        else:
            print("Invalid choice. Please enter 1, 2, or 3.")
            continue

        # Extract text from the image
        print("\nScanning label...")
        text_list = extract_text_from_image(image_path)
        if not text_list:
            print("No text found in the image.")
            continue

        # Process the text to get item name and expiry date
        item_name, expiry_date = process_text(text_list)

        # Display results
        print("\nResults:")
        print(f"Item Name: {item_name}")
        print(f"Expiry Date: {expiry_date}")

        # Store the item name and expiry date
        store_inventory_data(item_name, expiry_date)

if __name__ == "__main__":
    main()