import torch
from torchvision import transforms
from PIL import Image
import io

# ImageNet normalization standard values
IMAGENET_MEAN = [0.485, 0.456, 0.406]
IMAGENET_STD = [0.229, 0.224, 0.225]

# Deterministic evaluation transform pipeline
eval_transform = transforms.Compose([
    transforms.Resize((224, 224)),
    transforms.ToTensor(),
    transforms.Normalize(mean=IMAGENET_MEAN, std=IMAGENET_STD)
])

def load_and_preprocess_image(image_bytes: bytes) -> tuple[torch.Tensor, Image.Image]:
    """
    Loads image from raw bytes, converts to RGB mode, applies standard 224x224
    Resize, ToTensor, and ImageNet normalization.

    Returns:
        tuple: (preprocessed_tensor, pil_image_rgb)
    """
    pil_img = Image.open(io.BytesIO(image_bytes)).convert("RGB")
    tensor_img = eval_transform(pil_img)
    # Add batch dimension [1, 3, 224, 224]
    tensor_batch = tensor_img.unsqueeze(0)
    return tensor_batch, pil_img
