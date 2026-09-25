import torch
from PIL import Image
from typing import Dict, Any, Tuple
from app.ai.model_loader import get_model
from app.ai.preprocessing import load_and_preprocess_image

def predict_ultrasound(image_bytes: bytes) -> Tuple[Dict[str, Any], torch.Tensor, Image.Image]:
    """
    Runs deterministic ResNet18 inference on raw ultrasound image bytes.

    Returns:
        tuple: (prediction_dict, tensor_batch, pil_image_rgb)
        where prediction_dict contains:
        - prediction (str): name of top predicted class
        - confidence (float): percentage confidence of top class (0-100)
        - probabilities (dict): {class_name: float_percentage}
    """
    # Preprocess image
    tensor_batch, pil_img = load_and_preprocess_image(image_bytes)

    # Load model singleton
    model, class_names, device = get_model()

    tensor_input = tensor_batch.to(device)

    with torch.no_grad():
        logits = model(tensor_input)
        probabilities_tensor = torch.softmax(logits, dim=1)[0]

    # Convert to Python floats (percentages 0-100)
    prob_values = probabilities_tensor.cpu().numpy()
    
    prob_dict = {}
    for i, name in enumerate(class_names):
        pct = float(prob_values[i]) * 100.0
        prob_dict[name] = round(pct, 2)

    top_idx = int(torch.argmax(probabilities_tensor).item())
    top_class = class_names[top_idx]
    top_confidence = round(float(prob_values[top_idx]) * 100.0, 2)

    result = {
        "prediction": top_class,
        "confidence": top_confidence,
        "probabilities": prob_dict
    }

    return result, tensor_batch, pil_img
