import os
import uuid
import numpy as np
import cv2
import torch
import torch.nn as nn
from PIL import Image
from app.ai.model_loader import get_model

class GradCAM:
    def __init__(self, model: nn.Module, target_layer: nn.Module):
        self.model = model
        self.target_layer = target_layer
        self.gradients = None
        self.activations = None

        self.target_layer.register_forward_hook(self._save_activations)
        self.target_layer.register_full_backward_hook(self._save_gradients)

    def _save_activations(self, module, input, output):
        self.activations = output

    def _save_gradients(self, module, grad_input, grad_output):
        self.gradients = grad_output[0]

    def generate(self, input_tensor: torch.Tensor, target_class_idx: int = None) -> np.ndarray:
        """
        Generates Grad-CAM heatmap array of shape (H, W) with values normalized to [0, 1].
        """
        self.model.zero_grad()
        
        # Ensure tensor requires grad
        input_tensor = input_tensor.requires_grad_(True)
        
        output = self.model(input_tensor)

        if target_class_idx is None:
            target_class_idx = torch.argmax(output, dim=1).item()

        score = output[0, target_class_idx]
        score.backward()

        gradients = self.gradients.detach().cpu().numpy()[0]   # [C, H, W]
        activations = self.activations.detach().cpu().numpy()[0] # [C, H, W]

        # Global average pooling of gradients
        weights = np.mean(gradients, axis=(1, 2)) # [C]

        # Weighted sum of activations
        cam = np.zeros(activations.shape[1:], dtype=np.float32)
        for i, w in enumerate(weights):
            cam += w * activations[i]

        # Apply ReLU
        cam = np.maximum(cam, 0)

        # Normalize to [0, 1]
        if cam.max() > 0:
            cam = cam / cam.max()
        else:
            cam = np.zeros_like(cam)

        return cam

def generate_and_save_gradcam(
    input_tensor: torch.Tensor,
    pil_image: Image.Image,
    upload_dir: str = "./uploads"
) -> tuple[str, str]:
    """
    Generates Grad-CAM overlay and saves both original ultrasound and Grad-CAM image.

    Returns:
        tuple: (original_image_relative_path, gradcam_image_relative_path)
    """
    model, class_names, device = get_model()
    target_layer = model.layer4[-1] # Last basic block of ResNet18

    gradcam = GradCAM(model, target_layer)
    tensor_input = input_tensor.to(device)

    # Get target class index
    with torch.no_grad():
        logits = model(tensor_input)
        target_idx = int(torch.argmax(logits, dim=1).item())

    cam = gradcam.generate(tensor_input, target_class_idx=target_idx)

    # Convert original PIL image to RGB numpy array
    orig_np = np.array(pil_image)
    orig_h, orig_w = orig_np.shape[:2]

    # Resize CAM to original image size
    cam_resized = cv2.resize(cam, (orig_w, orig_h))
    cam_uint8 = np.uint8(255 * cam_resized)

    # Apply Jet color map (BGR format)
    heatmap_bgr = cv2.applyColorMap(cam_uint8, cv2.COLORMAP_JET)
    heatmap_rgb = cv2.cvtColor(heatmap_bgr, cv2.COLOR_BGR2RGB)

    # Blend original image with heatmap (0.6 original, 0.4 heatmap)
    overlay_rgb = cv2.addWeighted(orig_np, 0.6, heatmap_rgb, 0.4, 0)

    # Ensure directories exist
    ultrasound_dir = os.path.join(upload_dir, "ultrasound")
    gradcam_dir = os.path.join(upload_dir, "gradcam")
    os.makedirs(ultrasound_dir, exist_ok=True)
    os.makedirs(gradcam_dir, exist_ok=True)

    file_id = uuid.uuid4().hex[:12]
    orig_filename = f"ultrasound_{file_id}.png"
    gradcam_filename = f"gradcam_{file_id}.png"

    orig_filepath = os.path.join(ultrasound_dir, orig_filename)
    gradcam_filepath = os.path.join(gradcam_dir, gradcam_filename)

    # Save images using PIL
    pil_image.save(orig_filepath, format="PNG")
    Image.fromarray(overlay_rgb).save(gradcam_filepath, format="PNG")

    rel_orig_path = f"uploads/ultrasound/{orig_filename}"
    rel_gradcam_path = f"uploads/gradcam/{gradcam_filename}"

    return rel_orig_path, rel_gradcam_path
