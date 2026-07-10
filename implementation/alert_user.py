import sys
import json
import winsound

def main():
    if len(sys.argv) < 2:
        print(json.dumps({"status": "error", "message": "Usage: python alert_user.py <status> [message]"}))
        sys.exit(1)
        
    status = sys.argv[1]
    message = sys.argv[2] if len(sys.argv) > 2 else ""
    
    # Eseguiamo un suono diverso in base allo "status"
    if status.lower() == "error":
        # Suono di errore (Windows)
        winsound.MessageBeep(winsound.MB_ICONHAND)
    elif status.lower() == "success":
        # Suono di successo/info (Windows)
        winsound.MessageBeep(winsound.MB_ICONASTERISK)
    else:
        # Suono di default
        winsound.MessageBeep(winsound.MB_OK)

    output = {
        "status": status,
        "message": message
    }
    
    print(json.dumps(output))

if __name__ == "__main__":
    main()
