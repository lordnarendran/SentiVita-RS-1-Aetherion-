from flask import Flask, request, jsonify
from flask_cors import CORS
from gpt4all import GPT4All
import time
import logging
import torch
from torchvision import transforms
from torchvision.models import resnet50
from PIL import Image
import cv2
import numpy as np
import base64
import os
import uuid
import json
from scipy.ndimage import gaussian_filter
from deepface import DeepFace
from datetime import datetime # Import datetime

app = Flask(__name__)
CORS(app)

logging.basicConfig(level=logging.INFO)

model_path = r"D:/ALL LLM Versions/LLM 3/Merged_Model.gguf"

try:
    model = GPT4All(model_path)
    logging.info("Model loaded successfully.")
except Exception as e:
    logging.error(f"Failed to load model: {e}")
    model = None

device = torch.device('cuda' if torch.cuda.is_available() else 'cpu')


models_info = [
    {
        "name": "Diabetic Retinopathy Dataset",
        "path": r"D:/SentiVita Backup/Resnet Trained Files/resnet50_Diabetic_Retinopathy_Dataset.pth",
        "num_classes": 5,
        "labels": ["Mild", "Moderate", "No_DR", "Proliferate_DR", "Severe"]
    },
    {
        "name": "Acne Level Classification",
        "path": r"D:/SentiVita Backup/Resnet Trained Files/resnet50_Acne_Level_Classification.pth",
        "num_classes": 3,
        "labels": ["Level_0", "Level_1", "Level_2"]
    },
    {
        "name": "Kvasir (GastroIntestinal)",
        "path": r"D:/SentiVita Backup/Resnet Trained Files/resnet50_Kvasir_Dataset_GastroIntestinal_Dataset.pth",
        "num_classes": 8,
        "labels": ["dyed-lifted-polyps", "dyed-resection-margins", "esophagitis", "normal-cecum", "normal-pylorus",
                   "normal-z-line", "polyps", "ulcerative-colitis"]
    },
    {
        "name": "Lung Cancer MRI Dataset",
        "path": r"D:/SentiVita Backup/Resnet Trained Files/resnet50_Lung_Cancer_Dataset.pth",
        "num_classes": 2,
        "labels": ["cancerous", "non-cancerous"]
    },
    {
        "name": "Brain Tumor MRI",
        "path": r"D:/SentiVita Backup/Resnet Trained Files/resnet50_Brain_Tumor_Dataset.pth",
        "num_classes": 2,
        "labels": ["no_tumor", "tumor"]
    },
    {
        "name": "Pneumonia X-Ray Dataset",
        "path": r"D:/SentiVita Backup/Resnet Trained Files/resnet50_Lung_Pneumonia_Dataset.pth",
        "num_classes": 2,
        "labels": ["NORMAL", "PNEUMONIA"]
    },
    {
        "name": "Covid 19 X Ray",
        "path": r"D:/SentiVita Backup/Resnet Trained Files/resnet50_Lung_Covid_Normal_Dataset.pth",
        "num_classes": 2,
        "labels": ["COVID19", "NORMAL"]
    },
    {
        "name": "Breast Cancer Ultrasound",
        "path": r"D:/SentiVita Backup/Resnet Trained Files/resnet50_Breast_Ultrasound_Benign_Malignant.pth",
        "num_classes": 2,
        "labels": ["benign", "malignant"]
    },
    {
        "name": "Tuberculosis Dataset",
        "path": r"D:/SentiVita Backup/Resnet Trained Files/resnet50_Tuberculosis_XRay.pth",
        "num_classes": 2,
        "labels": ["Normal", "Tuberculosis"]
    },
    {
        "name": "Skin Cancer Classification",
        "path": r"D:/SentiVita Backup/Resnet Trained Files/resnet50_Skin_Cancer_Classification.pth",
        "num_classes": 3,
        "labels": ["benign", "malignant", "no disease"]
    },
    {
        "name": "Augmented Skin Conditions",
        "path": r"D:/SentiVita Backup/Resnet Trained Files/resnet50_Augmented_Skin_Conditions.pth",
        "num_classes": 6,
        "labels": ["Acne", "Carcinoma", "Eczema", "Keratosis", "Milia", "Rosacea"]
    },
    {
        "name": "Alzheimer's MRI Scan",
        "path": r"D:/SentiVita Backup/Resnet Trained Files/resnet50_Alzheimers_Brain_MRI.pth",
        "num_classes": 4,
        "labels": ["Mild Impairment", "Moderate Impairment", "No Impairment", "Very Mild Impairment"]
    },
    {
        "name": "Breast Cancer Histopathology",
        "path": r"D:/SentiVita Backup/Resnet Trained Files/resnet50_Breast_Histopathology.pth",
        "num_classes": 2,
        "labels": ["benign", "malignant"]
    },
    {
        "name": "Advanced Brain Cancer Classification",
        "path": r"D:/SentiVita Backup/Resnet Trained Files/resnet50_Advanced_Brain_Cancer_Classification.pth",
        "num_classes": 4,
        "labels": ["glioma", "meningioma", "notumor", "pituitary"]
    }
]

model_classification = None
current_model_index = -1
labels = []

def load_model(model_index):
    global model_classification, labels, current_model_index
    if current_model_index != model_index:
        checkpoint = torch.load(models_info[model_index]["path"], map_location=device)
        model_classification = resnet50(num_classes=models_info[model_index]["num_classes"])
        model_classification.load_state_dict(checkpoint['model_state_dict'])
        model_classification = model_classification.to(device)
        model_classification.eval()
        labels = models_info[model_index]["labels"]
        current_model_index = model_index

REGISTRATION_DIR = r"D:\SentiVita Backup\Authentication Sentivita"
AUTHENTICATION_DIR = r"D:\SentiVita Backup\Registration SentiVita"
# Added a log directory for authentication logs
AUTH_LOG_DIR = r"D:\SentiVita Backup\Authentication_Logs"


# Create role-specific directories and auth log directory
ROLES = ['doctor', 'patient', 'receptionist', 'pharmacist']
for role in ROLES:
    os.makedirs(os.path.join(REGISTRATION_DIR, role), exist_ok=True)
    os.makedirs(os.path.join(AUTHENTICATION_DIR, role), exist_ok=True)
    os.makedirs(AUTH_LOG_DIR, exist_ok=True) # Create auth log dir

# ... (infer, predict, visualize, limb_reconstruction functions remain the same)
@app.route('/api/infer', methods=['POST'])
def infer():
    if model is None:
        return jsonify({'error': 'Model is not loaded. Please check the server logs.'}), 500

    input_data = request.json.get('input')
    max_tokens = request.json.get('max_tokens', 300)

    if not input_data or not isinstance(input_data, str):
        return jsonify({'error': 'Invalid input data. Input must be a non-empty string.'}), 400

    try:
        start_time = time.time()
        output = model.generate(input_data, max_tokens=max_tokens)
        elapsed_time = time.time() - start_time
        logging.info(f"Inference took {elapsed_time:.2f} seconds.")
        return jsonify({'output': output})
    except Exception as e:
        logging.error(f"Error during inference: {e}")
        return jsonify({'error': 'An error occurred during inference. Please try again.'}), 500

@app.route('/api/predict', methods=['POST'])
def predict():
    model_index = request.form.get('model_index', 0)

    try:
        model_index = int(model_index)
    except ValueError:
        logging.error('Invalid model index provided; it must be an integer.')
        return jsonify({'error': 'Invalid model index provided; it must be an integer.'}), 400

    if not (0 <= model_index < len(models_info)):
        return jsonify({'error': 'Invalid model index.'}), 400

    if 'image' not in request.files:
        return jsonify({'error': 'No image part in the request.'}), 400

    image_file = request.files['image']
    if image_file.filename == '':
        return jsonify({'error': 'No image file uploaded.'}), 400

    load_model(model_index)

    try:
        image = Image.open(image_file).convert("RGB")
        input_tensor = transforms.Compose([
            transforms.Resize((224, 224)),
            transforms.ToTensor(),
            transforms.Normalize(mean=[0.485, 0.456, 0.406], std=[0.229, 0.224, 0.225])
        ])(image).unsqueeze(0).to(device)

        with torch.no_grad():
            outputs = model_classification(input_tensor)
            _, predicted = torch.max(outputs, 1)

        result = labels[predicted.item()]
        return jsonify({'prediction': result})
    except Exception as e:
        logging.error(f"Error during prediction: {e}")
        return jsonify({'error': 'An error occurred during prediction.'}), 500

@app.route('/api/visualize', methods=['POST'])
def visualize():
    if 'image' not in request.files:
        return jsonify({'error': 'No image part in the request.'}), 400

    image_file = request.files['image']
    if image_file.filename == '':
        return jsonify({'error': 'No image file uploaded.'}), 400

    visualization_type = request.form.get('visualization_type')

    try:
        original_image = Image.open(image_file).convert("RGB")
        original_image = np.array(original_image)

        response = {}
        if visualization_type == "Edge Detection Visualization":
            gray = cv2.cvtColor(original_image, cv2.COLOR_RGB2GRAY)
            edges = cv2.Canny(gray, 100, 200)
            response['visualization'] = edges
        elif visualization_type == "Histogram Equalization Visualization":
            gray = cv2.cvtColor(original_image, cv2.COLOR_RGB2GRAY)
            equalized = cv2.equalizeHist(gray)
            response['visualization'] = equalized
        elif visualization_type == "Gradient Magnitude Visualization":
            gray = cv2.cvtColor(original_image, cv2.COLOR_RGB2GRAY)
            grad_x = cv2.Sobel(gray, cv2.CV_64F, 1, 0, ksize=3)
            grad_y = cv2.Sobel(gray, cv2.CV_64F, 0, 1, ksize=3)
            gradient_magnitude = np.sqrt(grad_x ** 2 + grad_y ** 2)
            gradient_magnitude = cv2.normalize(gradient_magnitude, None, 0, 255, cv2.NORM_MINMAX, cv2.CV_8U)
            response['visualization'] = gradient_magnitude
        elif visualization_type == "Region of Interest (ROI) Visualization":
            gray = cv2.cvtColor(original_image, cv2.COLOR_RGB2GRAY)
            _, thresholded = cv2.threshold(gray, 150, 255, cv2.THRESH_BINARY)
            contours, _ = cv2.findContours(thresholded, cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_SIMPLE)
            roi_visualization = original_image.copy()
            cv2.drawContours(roi_visualization, contours, -1, (0, 255, 0), 2)
            response['visualization'] = roi_visualization
        elif visualization_type == "Thermal Visualization":
            thermal_image = cv2.cvtColor(original_image, cv2.COLOR_RGB2GRAY)
            normalized_img = cv2.normalize(thermal_image, None, 0, 255, cv2.NORM_MINMAX)
            smoothed_img = cv2.GaussianBlur(normalized_img, (9, 9), 0)
            clahe = cv2.createCLAHE(clipLimit=3.0, tileGridSize=(8, 8))
            enhanced_img = clahe.apply(smoothed_img)
            thermal_img = cv2.applyColorMap(enhanced_img, cv2.COLORMAP_JET)
            response['visualization'] = thermal_img
        elif visualization_type == "3D Hologram Visualization":
            gray = cv2.cvtColor(original_image, cv2.COLOR_RGB2GRAY)
            normalized_img = cv2.normalize(gray, None, 0, 255, cv2.NORM_MINMAX, cv2.CV_8U)
            smoothed_img = gaussian_filter(normalized_img, sigma=2)
            edges = cv2.Canny(smoothed_img, 50, 150)
            intensity_based_depth = cv2.GaussianBlur(smoothed_img, (7, 7), 0)
            depth_map = cv2.addWeighted(edges, 0.7, intensity_based_depth, 0.3, 0)
            depth_map = cv2.dilate(depth_map, np.ones((3, 3), np.uint8), iterations=1)
            depth_map = cv2.erode(depth_map, np.ones((2, 2), np.uint8), iterations=1)
            depth_map = cv2.resize(depth_map, (50, 50))
            response['visualization_data'] = depth_map.flatten().tolist()

        if 'visualization' in response:
            visualization_image = np.array(response['visualization'], dtype=np.uint8)
            _, buffer = cv2.imencode('.png', visualization_image)
            img_base64 = base64.b64encode(buffer).decode('utf-8')
            return jsonify({'visualization': f'data:image/png;base64,{img_base64}'})
        elif 'visualization_data' in response:
            return jsonify({'visualization_data': response['visualization_data']})
        else:
            return jsonify({'error': 'Invalid visualization type.'}), 400
    except Exception as e:
        logging.error(f"Error during visualization: {e}")
        return jsonify({'error': 'An error occurred during visualization.'}), 500


@app.route('/api/register_face', methods=['POST'])
def register_face():
    username = request.form.get('username')
    role = request.form.get('role')
    timestamp_str = request.form.get('timestamp') # Get timestamp string

    if not username:
        return jsonify({'error': 'Username is required.'}), 400
    if not role or role not in ROLES:
        return jsonify({'error': 'Valid role (doctor, patient, receptionist, pharmacist) is required.'}), 400
    if 'face_image' not in request.files:
        return jsonify({'error': 'No face image provided.'}), 400
    if not timestamp_str:
         return jsonify({'error': 'Timestamp is required.'}), 400

    # Validate timestamp format (optional but good practice)
    try:
        registration_time = datetime.fromisoformat(timestamp_str.replace('Z', '+00:00'))
    except ValueError:
        return jsonify({'error': 'Invalid timestamp format.'}), 400


    image_file = request.files['face_image']
    if image_file.filename == '':
        return jsonify({'error': 'No face image uploaded.'}), 400

    # Check if username already exists for the given role
    user_dir = os.path.join(REGISTRATION_DIR, role, username)
    if os.path.exists(user_dir):
        return jsonify({'error': f'Username "{username}" already registered for role "{role}".'}), 400

    try:
        image_stream = image_file.read()
        nparr = np.frombuffer(image_stream, np.uint8)
        image = cv2.imdecode(nparr, cv2.IMREAD_COLOR)

        if image is None:
             logging.error("Failed to decode image during registration.")
             return jsonify({'error': 'Failed to process image file.'}), 400

        try:
            # Ensure image is in the correct format for DeepFace (BGR)
            if image.shape[-1] == 3:
                # DeepFace expects BGR, cv2.imdecode gives BGR
                pass
            elif image.shape[-1] == 4: # Handle alpha channel if present
                 image = cv2.cvtColor(image, cv2.COLOR_BGRA2BGR)
            else: # Handle grayscale or other formats
                 image = cv2.cvtColor(image, cv2.COLOR_GRAY2BGR)

            faces = DeepFace.extract_faces(image, detector_backend='opencv')
            if not faces:
                logging.error("No face detected in registration image")
                return jsonify({'error': 'No face detected in the image.'}), 400
        except Exception as e:
            logging.error(f"Face detection failed during registration: {e}", exc_info=True)
            # Provide a more user-friendly error message
            if "face could not be detected" in str(e).lower():
                 return jsonify({'error': 'Face could not be detected. Please ensure your face is clearly visible.'}), 400
            else:
                 return jsonify({'error': 'An error occurred during face detection.'}), 500


        # Create user directory and save face image
        os.makedirs(user_dir, exist_ok=True)
        # Save the original captured image
        filename = f"registered_face_{uuid.uuid4().hex}.png"
        save_path = os.path.join(user_dir, filename)
        cv2.imwrite(save_path, image) # Save the potentially processed image

        # Save user info in JSON including registration time
        user_info = {
            'username': username,
            'role': role,
            'registration_time': timestamp_str # Save the ISO string
            # You could also add 'last_login_time': None initially
        }
        user_info_path = os.path.join(user_dir, 'user_info.json')
        with open(user_info_path, 'w') as f:
            json.dump(user_info, f, indent=4) # Use indent for readability

        logging.info(f"Face image and user info saved for {username} ({role}) at {save_path} with timestamp {timestamp_str}")
        return jsonify({'message': f'Face registered successfully for {username} as {role}.'})
    except Exception as e:
        logging.error(f"Error during face registration: {str(e)}", exc_info=True)
        return jsonify({'error': 'An error occurred during face registration.', 'details': str(e)}), 500


@app.route('/api/authenticate_face', methods=['POST'])
def authenticate_face():
    username = request.form.get('username')
    role = request.form.get('role')
    timestamp_str = request.form.get('timestamp') # Get timestamp string

    if not username:
        return jsonify({'error': 'Username is required.'}), 400
    if not role or role not in ROLES:
        return jsonify({'error': 'Valid role (doctor, patient, receptionist, pharmacist) is required.'}), 400
    if 'face_image' not in request.files:
        return jsonify({'error': 'No face image provided.'}), 400
    if not timestamp_str:
         return jsonify({'error': 'Timestamp is required.'}), 400

     # Validate timestamp format (optional but good practice)
    try:
        authentication_time = datetime.fromisoformat(timestamp_str.replace('Z', '+00:00'))
    except ValueError:
        return jsonify({'error': 'Invalid timestamp format.'}), 400


    image_file = request.files['face_image']
    if image_file.filename == '':
        return jsonify({'error': 'No face image uploaded.'}), 400

    try:
        image_stream = image_file.read()
        nparr = np.frombuffer(image_stream, np.uint8)
        captured_image = cv2.imdecode(nparr, cv2.IMREAD_COLOR)

        if captured_image is None:
            logging.error("Failed to decode image during authentication.")
            return jsonify({'error': 'Failed to process image file.'}), 400

        try:
             # Ensure image is in the correct format for DeepFace (BGR)
            if captured_image.shape[-1] == 3:
                # DeepFace expects BGR, cv2.imdecode gives BGR
                pass
            elif captured_image.shape[-1] == 4: # Handle alpha channel if present
                 captured_image = cv2.cvtColor(captured_image, cv2.COLOR_BGRA2BGR)
            else: # Handle grayscale or other formats
                 captured_image = cv2.cvtColor(captured_image, cv2.COLOR_GRAY2BGR)

            faces = DeepFace.extract_faces(captured_image, detector_backend='opencv')
            if not faces:
                logging.error("No face detected in captured image")
                return jsonify({'error': 'No face detected in the captured image.'}), 400
        except Exception as e:
            logging.error(f"Face detection failed during authentication: {e}", exc_info=True)
            # Provide a more user-friendly error message
            if "face could not be detected" in str(e).lower():
                 return jsonify({'error': 'No face detected in the captured image. Please ensure your face is clearly visible.'}), 400
            else:
                 return jsonify({'error': 'An error occurred during face detection.'}), 500


        # Verify username and role by checking for the user's registration directory
        user_dir = os.path.join(REGISTRATION_DIR, role, username)
        user_info_path = os.path.join(user_dir, 'user_info.json')

        if not os.path.exists(user_info_path):
            logging.warning(f"Authentication failed: User {username} with role {role} not registered.")
            return jsonify({'error': f'Username "{username}" not found for role "{role}".'}), 401

        # Load user info to confirm role (although directory structure implies it)
        try:
            with open(user_info_path, 'r') as f:
                user_info = json.load(f)
            if user_info.get('role') != role or user_info.get('username') != username:
                 # This case is unlikely if directory exists, but good for robustness
                 logging.error(f"Role or username mismatch in user_info.json for {username}: expected {role}, got {user_info.get('role')}")
                 return jsonify({'error': 'Username and role do not match registered data.'}), 401
        except Exception as e:
            logging.error(f"Error reading user_info.json for {username}: {e}", exc_info=True)
            return jsonify({'error': 'Error verifying user data.'}), 500


        # Perform face verification against all registered images for this user/role
        best_distance = float('inf')
        best_match_path = None

        registered_files = [f for f in os.listdir(user_dir) if f.endswith('.png')]

        if not registered_files:
            logging.error(f"No registered face images found for user {username} in role {role}.")
            return jsonify({'error': 'No registered face found for this user.'}), 404 # Or 401

        for registered_file in registered_files:
            registered_path = os.path.join(user_dir, registered_file)
            registered_image = cv2.imread(registered_path)

            if registered_image is None:
                logging.error(f"Failed to read registered image: {registered_path}")
                continue

            try:
                # Ensure registered image is BGR if necessary
                if registered_image.shape[-1] == 4:
                     registered_image = cv2.cvtColor(registered_image, cv2.COLOR_BGRA2BGR)
                elif registered_image.shape[-1] == 1:
                     registered_image = cv2.cvtColor(registered_image, cv2.COLOR_GRAY2BGR)


                result = DeepFace.verify(
                    img1_path=captured_image, # Use the captured image
                    img2_path=registered_image,
                    model_name='VGG-Face', # Or other suitable model
                    detector_backend='opencv', # Or other suitable detector
                    distance_metric='cosine' # Or 'euclidean', 'euclidean_l2'
                )
                distance = result['distance']
                is_verified = result.get('verified', False) # DeepFace verify returns 'verified' boolean
                logging.info(f"Comparing captured image with {registered_file} for {username} ({role}): Verified={is_verified}, Distance={distance}")

                # Use a threshold (cosine distance < 0.4 is common for VGG-Face)
                # You might need to tune this threshold based on your data
                verification_threshold = 0.4

                if distance < best_distance:
                    best_distance = distance
                    best_match_path = registered_path

                # If any verification is successful based on DeepFace's internal threshold
                # or your custom threshold, consider it a match
                if is_verified or distance < verification_threshold:
                    # Authentication successful against at least one image
                    # Save the authentication attempt details (success)
                    auth_log_path = os.path.join(AUTH_LOG_DIR, f"auth_log_{datetime.now().strftime('%Y%m%d')}.jsonl")
                    log_entry = {
                        'timestamp': timestamp_str,
                        'username': username,
                        'role': role,
                        'status': 'success',
                        'matched_image': registered_file,
                        'distance': float(distance),
                        'deepface_verified': is_verified # Include DeepFace's verification result
                    }
                    with open(auth_log_path, 'a') as f:
                        f.write(json.dumps(log_entry) + '\n')

                    # Optionally update last login time in user_info.json
                    try:
                        user_info['last_login_time'] = timestamp_str
                        with open(user_info_path, 'w') as f:
                            json.dump(user_info, f, indent=4)
                    except Exception as e:
                         logging.error(f"Error updating last_login_time for {username}: {e}", exc_info=True)


                    # Save the successful authentication image
                    auth_dir = os.path.join(AUTHENTICATION_DIR, role, username) # Save authenticated images under user's name
                    os.makedirs(auth_dir, exist_ok=True)
                    auth_filename = f"auth_success_{datetime.now().strftime('%Y%m%d%H%M%S')}_{uuid.uuid4().hex[:8]}.png"
                    auth_save_path = os.path.join(auth_dir, auth_filename)
                    cv2.imwrite(auth_save_path, captured_image)

                    return jsonify({
                        'message': f'Authentication successful for {username} as {role}.',
                        'confidence': float(1 - distance), # Simple confidence based on distance
                        'login_time': timestamp_str # Return the exact login time
                    })

            except Exception as e:
                logging.error(f"Verification failed for {registered_file} during authentication: {e}", exc_info=True)
                # Continue to the next registered image if verification fails for one

        # If loop finishes without returning, no match was found above the threshold
        logging.warning(f"Authentication failed for {username} ({role}): No sufficient match found. Best distance: {best_distance}")

        # Save the authentication attempt details (failure)
        auth_log_path = os.path.join(AUTH_LOG_DIR, f"auth_log_{datetime.now().strftime('%Y%m%d')}.jsonl")
        log_entry = {
            'timestamp': timestamp_str,
            'username': username,
            'role': role,
            'status': 'failed',
            'best_distance': float(best_distance) if best_distance != float('inf') else None,
            'error': 'No sufficient face match'
        }
        with open(auth_log_path, 'a') as f:
            f.write(json.dumps(log_entry) + '\n')

        # Save the failed authentication image
        auth_dir = os.path.join(AUTHENTICATION_DIR, role, username) # Save authenticated images under user's name
        os.makedirs(auth_dir, exist_ok=True)
        auth_filename = f"auth_failed_{datetime.now().strftime('%Y%m%d%H%M%S')}_{uuid.uuid4().hex[:8]}.png"
        auth_save_path = os.path.join(auth_dir, auth_filename)
        cv2.imwrite(auth_save_path, captured_image)


        return jsonify({
            'error': 'Authentication failed. Face does not match registered data.',
            'best_distance': float(best_distance) if best_distance != float('inf') else None
        }), 401

    except Exception as e:
        logging.error(f"Critical error during face authentication process for {username} ({role}): {str(e)}", exc_info=True)

        # Save the authentication attempt details (failure due to internal error)
        auth_log_path = os.path.join(AUTH_LOG_DIR, f"auth_log_{datetime.now().strftime('%Y%m%d')}.jsonl")
        log_entry = {
            'timestamp': timestamp_str,
            'username': username,
            'role': role,
            'status': 'error',
            'details': str(e)
        }
        with open(auth_log_path, 'a') as f:
            f.write(json.dumps(log_entry) + '\n')

        # Attempt to save the image even on error
        try:
            auth_dir = os.path.join(AUTHENTICATION_DIR, role, username)
            os.makedirs(auth_dir, exist_ok=True)
            auth_filename = f"auth_error_{datetime.now().strftime('%Y%m%d%H%M%S')}_{uuid.uuid4().hex[:8]}.png"
            auth_save_path = os.path.join(auth_dir, auth_filename)
            cv2.imwrite(auth_save_path, captured_image)
        except Exception as img_save_err:
             logging.error(f"Failed to save authentication image on error: {img_save_err}", exc_info=True)


        return jsonify({
            'error': 'An internal error occurred during face authentication.',
            'details': str(e)
        }), 500

# ... (limb_reconstruction function remains the same)
@app.route('/api/limb_reconstruction', methods=['POST'])
def limb_reconstruction():
    if 'image' not in request.files:
        return jsonify({'error': 'No image part in the request.'}), 400

    image_file = request.files['image']
    if image_file.filename == '':
        return jsonify({'error': 'No image file uploaded.'}), 400

    try:
        original_image = Image.open(image_file).convert("RGB")
        original_image = np.array(original_image)

        gray = cv2.cvtColor(original_image, cv2.COLOR_RGB2GRAY)
        normalized_img = cv2.normalize(gray, None, 0, 255, cv2.NORM_MINMAX, cv2.CV_8U)
        smoothed_img = cv2.bilateralFilter(normalized_img, d=9, sigmaColor=75, sigmaSpace=75)
        sobel_x = cv2.Sobel(smoothed_img, cv2.CV_64F, 1, 0, ksize=5)
        sobel_y = cv2.Sobel(smoothed_img, cv2.CV_64F, 0, 1, ksize=5)
        edges = cv2.magnitude(sobel_x, sobel_y)
        edges = cv2.normalize(edges, None, 0, 255, cv2.NORM_MINMAX, cv2.CV_8U)
        adaptive_thresh = cv2.adaptiveThreshold(
            smoothed_img, 255, cv2.ADAPTIVE_THRESH_GAUSSIAN_C, cv2.THRESH_BINARY_INV, 11, 2
        )
        intensity_based_depth = cv2.GaussianBlur(smoothed_img, (9, 9), 0)
        laplacian = cv2.Laplacian(smoothed_img, cv2.CV_64F)
        curvature = cv2.normalize(laplacian, None, 0, 255, cv2.NORM_MINMAX, cv2.CV_8U)
        depth_map = cv2.addWeighted(edges, 0.4, intensity_based_depth, 0.4, 0)
        depth_map = cv2.addWeighted(depth_map, 0.8, curvature, 0.2, 0)
        depth_map = cv2.addWeighted(depth_map, 0.7, adaptive_thresh, 0.3, 0)
        depth_map = cv2.dilate(depth_map, np.ones((3, 3), np.uint8), iterations=1)
        depth_map = cv2.erode(depth_map, np.ones((2, 2), np.uint8), iterations=1)
        depth_map_vis = cv2.normalize(depth_map, None, 0, 255, cv2.NORM_MINMAX, cv2.CV_8U)
        depth_map_colored = cv2.applyColorMap(depth_map_vis, cv2.COLORMAP_PLASMA)
        _, buffer = cv2.imencode('.png', depth_map_colored)
        img_base64 = base64.b64encode(buffer).decode('utf-8')
        depth_map_base64 = f'data:image/png;base64,{img_base64}'
        depth_map_small = cv2.resize(depth_map, (100, 100), interpolation=cv2.INTER_AREA)
        depth_array = depth_map_small.flatten().tolist()

        logging.info("Limb reconstruction completed successfully.")
        return jsonify({
            'reconstruction': depth_map_base64,
            'depth_data': depth_array
        })

    except Exception as e:
        logging.error(f"Error during limb reconstruction: {str(e)}", exc_info=True)
        return jsonify({
            'error': 'An error occurred during limb reconstruction.',
            'details': str(e)
        }), 500

if __name__ == "__main__":
    try:
        app.run(host='0.0.0.0', port=5000, debug=True) # Set debug=True for easier development
    except Exception as e:
        logging.error(f"Failed to start the Flask app: {e}")
