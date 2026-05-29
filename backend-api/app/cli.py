from __future__ import annotations

import json

from app.services.demo_store import demo_store


def main() -> None:
    print(json.dumps({"seeded": True, "users": len(demo_store.users), "questions": len(demo_store.questions)}))


if __name__ == "__main__":
    main()
