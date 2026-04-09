import time
import random
import threading
import json
import sys
from flask import Flask, jsonify
from flask_cors import CORS # This allows React to talk to Python

# --- WINDOWS LOGGING SETUP ---
# Only load Windows libraries if we are actually on Windows
IS_WINDOWS = sys.platform.startswith('win')
if IS_WINDOWS:
    try:
        import win32evtlog
        import win32evtlogutil
        import win32con
    except ImportError:
        IS_WINDOWS = False

app = Flask(__name__)
CORS(app) # Enable Cross-Origin Resource Sharing

# Global Data Storage (In-memory database)
# In a real app, you might use SQLite, but this is faster for live dashboards
SYSTEM_DATA = {
    "logs": [],
    "stats": {
        "total": 0,
        "threats": 0,
        "warnings": 0,
        "success": 0,
        "network_speed": 0
    }
}

def fetch_logs_loop():
    """Background thread that constantly reads Windows Logs"""
    print(f"[*] Log Monitor Started. Windows Mode: {IS_WINDOWS}")
    
    server = 'localhost'
    log_type = 'Security'
    
    while True:
        if IS_WINDOWS:
            try:
                # Open Windows Event Log
                hand = win32evtlog.OpenEventLog(server, log_type)
                flags = win32evtlog.EVENTLOG_BACKWARDS_READ | win32evtlog.EVENTLOG_SEQUENTIAL_READ
                events = win32evtlog.ReadEventLog(hand, flags, 0)
                
                if events:
                    for event in events:
                        # Process the log
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
                        
                        # Add to our global storage
                        SYSTEM_DATA["logs"].insert(0, log_entry)
                        
                # Keep storage clean (only last 50 logs)
                if len(SYSTEM_DATA["logs"]) > 50:
                    SYSTEM_DATA["logs"] = SYSTEM_DATA["logs"][:50]
                    
            except Exception as e:
                print(f"Error reading logs: {e}")
        else:
            # --- MOCK DATA FOR NON-ADMIN/NON-WINDOWS ---
            # This ensures your dashboard still looks alive if the real logs fail
            sources = ['Security', 'System', 'Application', 'Firewall']
            levels = ['INFO', 'WARN', 'ERROR']
            new_log = {
                "id": random.randint(10000, 99999),
                "timestamp": time.strftime("%H:%M:%S"),
                "level": random.choice(levels),
                "source": random.choice(sources),
                "eventID": random.randint(4600, 5000),
                "message": "Simulated system event for demonstration."
            }
            SYSTEM_DATA["logs"].insert(0, new_log)
            if len(SYSTEM_DATA["logs"]) > 50: SYSTEM_DATA["logs"].pop()

        # Update Stats based on real data
        SYSTEM_DATA["stats"]["total"] = len(SYSTEM_DATA["logs"]) + 1200 # +1200 base for visuals
        SYSTEM_DATA["stats"]["threats"] = sum(1 for x in SYSTEM_DATA["logs"] if x['level'] == 'ERROR')
        SYSTEM_DATA["stats"]["warnings"] = sum(1 for x in SYSTEM_DATA["logs"] if x['level'] == 'WARN')
        SYSTEM_DATA["stats"]["success"] = sum(1 for x in SYSTEM_DATA["logs"] if x['level'] == 'INFO')
        SYSTEM_DATA["stats"]["network_speed"] = random.randint(30, 90) # Simulated speed

        time.sleep(2) # Wait 2 seconds before checking again

# --- API ROUTES (This is what React calls) ---

@app.route('/api/data')
def get_data():
    return jsonify(SYSTEM_DATA)

if __name__ == '__main__':
    # Start the background log fetcher
    t = threading.Thread(target=fetch_logs_loop)
    t.daemon = True
    t.start()
    
    # Start the Flask Web Server
    print("🚀 Backend running on http://localhost:5000")
    app.run(port=5000, debug=False)