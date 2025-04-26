#!/bin/bash

MODELS_DIR="public/models"
BASE_URL="https://raw.githubusercontent.com/justadudewhohacks/face-api.js/master/weights"

# Create models directory if it doesn't exist
mkdir -p $MODELS_DIR

# Download required models
wget -O "$MODELS_DIR/tiny_face_detector_model-weights_manifest.json" "$BASE_URL/tiny_face_detector_model-weights_manifest.json"
wget -O "$MODELS_DIR/tiny_face_detector_model-shard1" "$BASE_URL/tiny_face_detector_model-shard1"
wget -O "$MODELS_DIR/face_expression_model-weights_manifest.json" "$BASE_URL/face_expression_model-weights_manifest.json"
wget -O "$MODELS_DIR/face_expression_model-shard1" "$BASE_URL/face_expression_model-shard1"

echo "Models downloaded successfully!" 