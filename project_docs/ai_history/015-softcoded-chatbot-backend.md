# 015 - Softcoded AI Chatbot Backend

**Date:** January 25, 2026  
**Task:** Build fully softcoded RAG chatbot backend with hybrid intelligence

## Overview

Created a complete Python/FastAPI backend for the AI chatbot. The implementation is **100% softcoded** and uses a **hybrid intelligence** approach:
- **RoBERTa** (word-level understanding) for precise sentiment analysis.
- **LLM** (Deep understanding) for intent detection and context routing.
- **Local Source Scraping** to bypass SPA/React rendering issues.

## Key Features

- **Hybrid Analysis** - RoBERTa for sentiment + Groq LLM for intent (no regex/hardcoded rules).
- **Smart Data Ingestion** - Scraper reads local `src/pages/*.tsx` files directly to ensure 100% content coverage for React SPAs.
- **RAG pipeline** - LangGraph orchestrates analyze → retrieve → generate workflow.
- **High-Quality Embeddings** - Uses **BAAI/bge-m3** (multilingual, 1024 dim) for superior retrieval.
- **In-Memory Vector Store** - Uses **Qdrant** in memory mode (no external database required).
- **GCP ready** - Dockerfile and cloudbuild.yaml for Cloud Run deployment.

## Architecture

```
User Message
    ↓
RoBERTa Sentiment Analysis (Word-level)
    ↓
LLM Intent Analyzer (Softcoded) → [Needs Context?]
    ↓
Qdrant Vector Search (BAAI/bge-m3) ← Knowledge from local source files
    ↓
LLM Response Generation
```

## Files Created

| File | Purpose |
|------|---------|
| `Chatbot/main.py` | FastAPI application |
| `Chatbot/config.py` | Environment configuration |
| `Chatbot/sentiment.py` | Hybrid Analyzer (RoBERTa + LLM) |
| `Chatbot/rag_pipeline.py` | LangGraph RAG workflow |
| `Chatbot/scraper.py` | Smart scraper with local source file reading |
| `Chatbot/embeddings.py` | BGE-M3 embedding manager |
| `Chatbot/vector_store.py` | Qdrant vector store operations |
| `Chatbot/utils.py` | Text utilities |
| `Chatbot/Dockerfile` | GCP container config |
| `Chatbot/requirements.txt` | Python dependencies |

## Frontend Update

Updated `src/components/Chatbot.tsx` to use POST request to `/chat` endpoint.

## Technology Stack

- FastAPI + Uvicorn
- LangGraph + LangChain
- **Qdrant** (Vector Store)
- **RoBERTa** (Sentiment Analysis)
- **Groq API** (Llama 3.3 70B)
- **BAAI/bge-m3** (Embeddings)

## Next Steps

1. Add GROQ_API_KEY to `.env`
2. Run backend: `uvicorn main:app --reload` (auto-ingests content)
3. Deploy to GCP Cloud Run
