import os
import pickle
import torch
import torchvision.models as models
from typing import Tuple, List, Dict, Any

class ModelContainer:
    _instance = None

    def __init__(self):
        self.model = None
        self.device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
        self.class_names = [
            "complex_cyst",
            "dominant_follicle",
            "healthy",
            "poly_cyst",
            "simple_cyst"
        ]
        self.num_classes = 5
        self.image_size = 224

    @classmethod
    def get_instance(cls):
        if cls._instance is None:
            cls._instance = ModelContainer()
        return cls._instance

    def load_model(self, model_path: str = None):
        if self.model is not None:
            return self.model, self.class_names, self.device

        if model_path is None:
            from app.core.config import settings
            model_path = settings.MODEL_PATH

        if not os.path.isabs(model_path):
            base_dir = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", ".."))
            model_path = os.path.abspath(os.path.join(base_dir, model_path))

        if not os.path.exists(model_path):
            raise FileNotFoundError(f"ResNet18 model checkpoint not found at: {model_path}")

        print(f"[*] Loading ResNet18 model checkpoint from: {model_path}")
        with open(model_path, "rb") as f:
            checkpoint = pickle.load(f)

        if isinstance(checkpoint, dict):
            if "class_names" in checkpoint:
                self.class_names = checkpoint["class_names"]
            if "num_classes" in checkpoint:
                self.num_classes = checkpoint["num_classes"]
            if "image_size" in checkpoint:
                self.image_size = checkpoint["image_size"]
            state_dict = checkpoint.get("state_dict", checkpoint)
        else:
            state_dict = checkpoint

        # Recreate ResNet18 architecture
        model = models.resnet18(weights=None)
        model.fc = torch.nn.Linear(512, self.num_classes)
        model.load_state_dict(state_dict)
        model.to(self.device)
        model.eval()

        self.model = model
        print(f"[+] ResNet18 model successfully loaded on device: {self.device}")
        return self.model, self.class_names, self.device


def get_model(model_path: str = None):
    container = ModelContainer.get_instance()
    return container.load_model(model_path)
