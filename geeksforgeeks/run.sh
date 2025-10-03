#!/bin/bash

# Healthcare Triage Bot - Quick Run Script

echo "🏥 Starting Healthcare Triage Bot..."

# Check if Python is installed
if ! command -v python3 &> /dev/null; then
    echo "❌ Python 3 is not installed. Please install Python 3.8 or later."
    exit 1
fi

# Check if pip is installed
if ! command -v pip3 &> /dev/null; then
    echo "❌ pip3 is not installed. Please install pip."
    exit 1
fi

# Create virtual environment if it doesn't exist
if [ ! -d "venv" ]; then
    echo "📦 Creating virtual environment..."
    python3 -m venv venv
fi

# Activate virtual environment
echo "🔌 Activating virtual environment..."
source venv/bin/activate

# Install dependencies
echo "📥 Installing dependencies..."
pip install -r requirements.txt

# Set default environment variables if not set
export PORT=${PORT:-8000}
export HOST=${HOST:-0.0.0.0}

# Optional: Set OpenAI API key for enhanced explanations
if [ -n "$OPENAI_API_KEY" ]; then
    echo "🤖 OpenAI API key detected - enhanced explanations will be available"
else
    echo "ℹ️  No OpenAI API key set - using template explanations (set OPENAI_API_KEY for AI-generated explanations)"
fi

echo "🚀 Starting server on http://$HOST:$PORT"
echo "📖 API Documentation: http://$HOST:$PORT/docs"
echo "🔍 Health Check: http://$HOST:$PORT/api/health"
echo ""
echo "Demo endpoints:"
echo "  - GET  /api/demo - List demo scenarios"
echo "  - GET  /api/demo/{id} - Get demo payload"
echo "  - POST /api/triage - Main triage endpoint"
echo ""
echo "Press Ctrl+C to stop the server"
echo "=========================="

# Start the server
uvicorn triage:app --host $HOST --port $PORT --reload