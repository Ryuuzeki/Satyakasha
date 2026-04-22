# d:\satyakasha\ai\main.py
import io
import os
import sqlite3
import imagehash
import easyocr
from fastapi import FastAPI, File, UploadFile
from fastapi.responses import JSONResponse
from PIL import Image
from fuzzywuzzy import fuzz

# Inisialisasi Aplikasi FastAPI
app = FastAPI(
    title="DuplicateGuard API", 
    description="Microservice Satyakasha MVP untuk deteksi duplikasi dokumen via Computer Vision dan NLP.",
    version="1.0.0"
)

# Setup EasyOCR Reader
# (Model akan di-load ke memori sekali saat startup)
try:
    reader = easyocr.Reader(['en', 'id'], gpu=False)
except Exception as e:
    print(f"Peringatan: Gagal memuat EasyOCR reader: {e}")
    reader = None

# Setup SQLite Database Ringan (MVP Storage)
DB_PATH = "duplicates.db"

def init_db():
    conn = sqlite3.connect(DB_PATH)
    cursor = conn.cursor()
    # Menyimpan hash visual dan teks hasil ekstraksi untuk dicocokkan nanti
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS documents (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            filename TEXT,
            phash TEXT,
            extracted_text TEXT
        )
    ''')
    conn.commit()
    conn.close()

init_db()

def get_db_connection():
    return sqlite3.connect(DB_PATH)

def extract_features(image_bytes: bytes):
    """Mengekstrak Perceptual Hash (Visual) dan Teks (NLP) dari gambar."""
    # 1. Visual Feature: ImageHash (pHash)
    image = Image.open(io.BytesIO(image_bytes)).convert('RGB')
    phash = str(imagehash.phash(image))
    
    # 2. Text Feature: EasyOCR
    extracted_text = ""
    if reader:
        # EasyOCR dapat memproses array bytes secara langsung
        ocr_result = reader.readtext(image_bytes, detail=0)
        # Gabungkan semua baris teks, hapus case sensitivity
        extracted_text = " ".join(ocr_result).lower()
    
    return phash, extracted_text

def calculate_similarity(phash1: str, text1: str, phash2: str, text2: str):
    """
    Menghitung skor kemiripan antara dokumen baru dan dokumen di DB.
    - Bobot: Visual (40%), Teks (60%)
    """
    # --- 1. Visual Similarity (ImageHash Hamming Distance) ---
    hash1 = imagehash.hex_to_hash(phash1)
    hash2 = imagehash.hex_to_hash(phash2)
    hamming_distance = hash1 - hash2
    
    # Hamming distance ImageHash bernilai maksimum 64 (karena hash 64-bit).
    # Konversi ke persentase kemiripan: distance 0 -> 100%, 64 -> 0%
    visual_score = max(0.0, 100.0 - (hamming_distance * (100.0 / 64.0)))
    
    # --- 2. Textual Similarity (FuzzyWuzzy Token Set Ratio) ---
    if not text1 and not text2:
        text_score = 100.0  # Keduanya kosong/tidak ada tulisan
    elif not text1 or not text2:
        text_score = 0.0    # Salah satu kosong
    else:
        # fuzzywuzzy mengembalikan nilai 0-100 otomatis
        text_score = float(fuzz.token_set_ratio(text1, text2))
        
    # --- 3. Decision Engine ---
    # Bobot: 60% NLP, 40% Visual
    final_score = (0.4 * visual_score) + (0.6 * text_score)
    
    return final_score, visual_score, text_score

@app.post("/api/ai/duplicate-check")
async def check_duplicate(file: UploadFile = File(...)):
    # Saat ini mendukung image. Untuk PDF perlu PDF2Image conversion.
    if not file.content_type.startswith("image/"):
        return JSONResponse(
            status_code=400, 
            content={"error": "Hanya file gambar (JPEG/PNG) yang didukung untuk MVP versi Alpha."}
        )
        
    file_bytes = await file.read()
    
    try:
        new_phash, new_text = extract_features(file_bytes)
    except Exception as e:
        return JSONResponse(status_code=500, content={"error": f"Ekstraksi fitur AI gagal: {str(e)}"})
    
    # Ambil semua record dokumen dari database
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute("SELECT id, filename, phash, extracted_text FROM documents")
    existing_docs = cursor.fetchall()
    
    highest_score = 0.0
    best_match = None
    
    # Iterasi pencocokan O(N) linier terhadap riwayat (bisa dioptimasi dengan Vector DB seperti Pinecone nanti)
    for doc in existing_docs:
        doc_id, filename, saved_phash, saved_text = doc
        score, vis_score, txt_score = calculate_similarity(new_phash, new_text, saved_phash, saved_text)
        
        if score > highest_score:
            highest_score = score
            best_match = {
                "id": doc_id,
                "filename": filename,
                "visual_score": round(vis_score, 2),
                "text_score": round(txt_score, 2),
                "final_score": round(score, 2)
            }
            
    # Parameter ambang batas (Threshold) Duplikasi
    is_duplicate = highest_score > 85.0
    
    # Simpan state dokumen ini jika bukan duplikat
    if not is_duplicate:
        cursor.execute(
            "INSERT INTO documents (filename, phash, extracted_text) VALUES (?, ?, ?)",
            (file.filename, new_phash, new_text)
        )
        conn.commit()
        
    conn.close()
    
    return {
        "status": "success",
        "isDuplicate": is_duplicate,
        "confidenceScore": round(highest_score, 2),
        "details": {
            "bestMatch": best_match,
            "extractedHash": new_phash,
            "extractedTextPreview": new_text[:100] + "..." if len(new_text) > 100 else new_text
        }
    }
