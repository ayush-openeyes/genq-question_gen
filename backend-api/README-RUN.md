# GenQue Backend API

Standalone FastAPI backend package.

## Run without Docker
1. Install Python 3.12+.
2. Open a terminal in this folder.
3. Run:

```powershell
python -m venv .venv
.\.venv\Scripts\Activate.ps1
pip install -e .
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

Health check:
http://localhost:8000/healthz

API docs:
http://localhost:8000/api/docs

## Demo login
POST http://localhost:8000/api/v1/auth/login

Body:
```json
{
  "email": "taylor@acme.com",
  "password": "demo1234"
}
```
