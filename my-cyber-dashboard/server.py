import time
import threading
import json
import sys
import sqlite3
import os
import google.generativeai as genai
from flask import Flask, jsonify, request
from flask_cors import CORS

# --- CONFIGURATION ---
GEMINI_API_KEY = "PASTE_YOUR_KEY_HERE"
DB_PATH = "cerelox_logs.db"

# Configure AI (graceful fallback if key is invalid/missing)
AI_READY = False
if GEMINI_API_KEY and GEMINI_API_KEY != "PASTE_YOUR_KEY_HERE":
    try:
        genai.configure(api_key=GEMINI_API_KEY)
        model = genai.GenerativeModel('gemini-2.5-flash')
        AI_READY = True
    except Exception as e:
        print(f"Failed to initialize AI: {e}")

# Check OS
IS_WINDOWS = sys.platform.startswith('win')
if IS_WINDOWS:
    try:
        import win32evtlog
        import win32evtlogutil
        import win32con
    except ImportError:
        IS_WINDOWS = False

app = Flask(__name__)
CORS(app)

# --- DATABASE SETUP ---
def init_db():
    conn = sqlite3.connect(DB_PATH)
    cursor = conn.cursor()
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS logs (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            record_id INTEGER,
            timestamp TEXT,
            level TEXT,
            source TEXT,
            eventID INTEGER,
            message TEXT
        )
    ''')
    # Use config table for persistent stats
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS stats (
            key TEXT PRIMARY KEY,
            value INTEGER
        )
    ''')
    # Initialize stats if not exist
    cursor.execute("INSERT OR IGNORE INTO stats (key, value) VALUES ('total', 0), ('threats', 0), ('warnings', 0), ('success', 0)")
    conn.commit()
    conn.close()

init_db()

SESSION_START_TIME = time.strftime("%I:%M %p")

# In-memory buffer for the frontend dashboard to poll quickly
LOG_BUFFER = []

def save_log_to_db(log_entry):
    try:
        conn = sqlite3.connect(DB_PATH)
        cursor = conn.cursor()
        
        # Check if log already exists (by record_id for deduplication) to avoid spamming the DB in case of re-reads
        cursor.execute("SELECT 1 FROM logs WHERE record_id = ?", (log_entry.get("id"),))
        if cursor.fetchone() is None:
            cursor.execute('''
                INSERT INTO logs (record_id, timestamp, level, source, eventID, message)
                VALUES (?, ?, ?, ?, ?, ?)
            ''', (
                log_entry.get("id"),
                log_entry.get("timestamp"),
                log_entry.get("level"),
                log_entry.get("source"),
                log_entry.get("eventID"),
                log_entry.get("message")
            ))
            
            # Update stats securely in database
            category = log_entry.get("level")
            cursor.execute("UPDATE stats SET value = value + 1 WHERE key = 'total'")
            if category == "ERROR":
                cursor.execute("UPDATE stats SET value = value + 1 WHERE key = 'threats'")
            elif category == "WARN":
                cursor.execute("UPDATE stats SET value = value + 1 WHERE key = 'warnings'")
            else:
                cursor.execute("UPDATE stats SET value = value + 1 WHERE key = 'success'")
                
            conn.commit()
            return True
    except Exception as e:
        print(f"DB Error: {e}")
    finally:
        if 'conn' in locals():
            conn.close()
    return False

def fetch_logs_loop():
    """Background thread to fetch new logs."""
    global LOG_BUFFER
    print(f"[*] Log Monitor Started. Windows Mode: {IS_WINDOWS}")
    
    server = 'localhost'
    log_type = 'Security'
    
    while True:
        if IS_WINDOWS:
            try:
                hand = win32evtlog.OpenEventLog(server, log_type)
                flags = win32evtlog.EVENTLOG_BACKWARDS_READ | win32evtlog.EVENTLOG_SEQUENTIAL_READ
                events = win32evtlog.ReadEventLog(hand, flags, 0)
                
                if events:
                    for event in events:
                        event_id = event.EventID & 0xFFFF
                        category = "INFO"
                        if event.EventType == win32con.EVENTLOG_ERROR_TYPE: category = "ERROR"
                        elif event.EventType == win32con.EVENTLOG_WARNING_TYPE: category = "WARN"
                        elif event_id == 4625: category = "ERROR" # Failed Login
                        
                        log_entry = {
                            "id": event.RecordNumber,
                            "timestamp": event.TimeGenerated.strftime("%H:%M:%S"),
                            "level": category,
                            "source": event.SourceName,
                            "eventID": event_id,
                            "message": str(event.StringInserts[0]) if event.StringInserts else "Event Logged"
                        }
                        
                        is_new = save_log_to_db(log_entry)
                        if is_new:
                            LOG_BUFFER.insert(0, log_entry)

                if len(LOG_BUFFER) > 50:
                    del LOG_BUFFER[50:]
                    
            except Exception as e:
                print(f"Error reading Windows logs: {e}")
        else:
            # Mock Data logic for Linux/Mac/Unprivileged testing
            import random
            sources = ['Security', 'System', 'Application']
            levels = ['INFO', 'WARN', 'ERROR']
            log_id = int(time.time() * 1000)
            new_log = {
                "id": log_id,
                "timestamp": time.strftime("%H:%M:%S"),
                "level": random.choice(levels),
                "source": random.choice(sources),
                "eventID": random.randint(4600, 5000),
                "message": f"Simulated test event {log_id}"
            }
            is_new = save_log_to_db(new_log)
            if is_new:
                LOG_BUFFER.insert(0, new_log)
                if len(LOG_BUFFER) > 50: 
                    LOG_BUFFER.pop()

        time.sleep(3) 

# --- API ROUTES ---

@app.route('/api/data')
def get_data():
    conn = sqlite3.connect(DB_PATH)
    cursor = conn.cursor()
    cursor.execute("SELECT key, value FROM stats")
    stats_data = dict(cursor.fetchall())
    conn.close()
    
    stats_data['start_time'] = SESSION_START_TIME
    
    return jsonify({
        "logs": LOG_BUFFER,
        "stats": stats_data
    })

@app.route('/api/chat', methods=['POST'])
def chat_with_ai():
    if not AI_READY:
        return jsonify({"response": "I am not connected yet! Please add a valid Gemini API Key to server.py to activate AI features."})

    data = request.json
    user_msg = data.get('message', '')
    
    context = f"""
    You are CereloX AI, a security analyst. 
    User Question: {user_msg}
    Keep answer brief and professional.
    """
    
    try:
        response = model.generate_content(context)
        return jsonify({"response": response.text})
    except Exception as e:
        return jsonify({"response": f"AI Error: {str(e)}"})

@app.route('/api/summarize', methods=['POST'])
def summarize_log():
    if not AI_READY:
        return jsonify({"summary": "AI not connected."})
    data = request.json
    log_text = data.get('log_data', '')
    prompt = f"Explain this Windows Event Log simply for a beginner. What happened? Is it dangerous?\nLog: {log_text}"
    try:
        response = model.generate_content(prompt)
        return jsonify({"summary": response.text})
    except Exception as e:
        return jsonify({"summary": "Could not analyze log."})

@app.route('/api/generate_report', methods=['POST'])
def generate_report():
    if not AI_READY:
        return jsonify({"report": "AI not connected."})
    prompt = f"""
    Write a Professional Security Report based on the most recent logs.
    Format:
    1. Executive Summary
    2. Threat Analysis
    3. Recommendations
    """
    try:
        response = model.generate_content(prompt)
        return jsonify({"report": response.text})
    except Exception as e:
        return jsonify({"report": "Error generating report."})

if __name__ == '__main__':
    t = threading.Thread(target=fetch_logs_loop)
    t.daemon = True
    t.start()
    app.run(port=5000, debug=False)