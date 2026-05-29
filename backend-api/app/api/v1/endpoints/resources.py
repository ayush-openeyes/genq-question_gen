from __future__ import annotations

from fastapi import APIRouter, Depends, HTTPException, Query

from app.core.rbac import require_permission
from app.core.security import get_current_user
from app.schemas.common import Page, page_items
from app.services.demo_store import demo_store

router = APIRouter()


@router.get("/organizations")
async def organizations(
    page: int = Query(1, ge=1),
    page_size: int = Query(25, alias="pageSize", ge=1, le=100),
    user: dict = Depends(require_permission("organizations.manage")),
) -> Page[dict]:
    items = demo_store.organizations if user["role"] == "SA" else [o for o in demo_store.organizations if o["id"] == user["orgId"]]
    return page_items(items, page, page_size)


@router.get("/users")
async def users(
    page: int = Query(1, ge=1),
    page_size: int = Query(25, alias="pageSize", ge=1, le=100),
    user: dict = Depends(require_permission("users.manage")),
) -> Page[dict]:
    items = demo_store.users if user["role"] == "SA" else [u for u in demo_store.users if u["orgId"] == user["orgId"]]
    return page_items(items, page, page_size)


@router.get("/roles")
async def roles(user: dict = Depends(require_permission("roles.manage"))) -> dict[str, list[dict]]:
    return {"items": demo_store.roles}


@router.get("/projects")
async def projects(
    page: int = Query(1, ge=1),
    page_size: int = Query(25, alias="pageSize", ge=1, le=100),
    user: dict = Depends(get_current_user),
) -> Page[dict]:
    items = demo_store.projects if user["role"] == "SA" else [p for p in demo_store.projects if p["orgId"] == user["orgId"]]
    return page_items(items, page, page_size)


@router.get("/questions")
async def questions(
    page: int = Query(1, ge=1),
    page_size: int = Query(25, alias="pageSize", ge=1, le=100),
    status: str | None = None,
    project_id: str | None = Query(None, alias="projectId"),
    user: dict = Depends(require_permission("questions.read")),
) -> Page[dict]:
    items = demo_store.questions if user["role"] == "SA" else [q for q in demo_store.questions if q["orgId"] == user["orgId"]]
    if status:
        items = [item for item in items if item["status"] == status]
    if project_id:
        items = [item for item in items if item.get("projectId") == project_id]
    return page_items(items, page, page_size)


@router.get("/questions/{question_id}")
async def question(question_id: str, user: dict = Depends(require_permission("questions.read"))) -> dict:
    item = next((q for q in demo_store.questions if q["id"] == question_id), None)
    if not item or (user["role"] != "SA" and item["orgId"] != user["orgId"]):
        raise HTTPException(status_code=404, detail="Question not found")
    return item


@router.post("/questions/{question_id}/submit-review")
async def submit_review(question_id: str, user: dict = Depends(require_permission("questions.edit"))) -> dict:
    item = next((q for q in demo_store.questions if q["id"] == question_id), None)
    if not item:
        raise HTTPException(status_code=404, detail="Question not found")
    item["status"] = "Pending Review"
    demo_store.audit_log.insert(0, {"id": f"al{len(demo_store.audit_log)+1}", "actor": user["name"], "actorRole": user["role"], "action": "Question Submitted", "entity": "Question", "entityId": question_id, "entityName": item["stem"][:80], "outcome": "Success", "ip": "api"})
    return item


@router.get("/review-queue")
async def review_queue(user: dict = Depends(require_permission("questions.review"))) -> dict[str, list[dict]]:
    org_questions = demo_store.questions if user["role"] == "SA" else [q for q in demo_store.questions if q["orgId"] == user["orgId"]]
    return {"items": [q for q in org_questions if q["status"] in {"Pending Review", "In Review"}]}


@router.post("/review-decisions")
async def review_decision(payload: dict, user: dict = Depends(require_permission("questions.review"))) -> dict:
    question_id = payload.get("questionId")
    decision = payload.get("decision")
    item = next((q for q in demo_store.questions if q["id"] == question_id), None)
    if not item:
        raise HTTPException(status_code=404, detail="Question not found")
    status_map = {"approve": "Approved", "revise": "Revision Required", "reject": "Rejected"}
    item["status"] = status_map.get(decision, item["status"])
    demo_store.audit_log.insert(0, {"id": f"al{len(demo_store.audit_log)+1}", "actor": user["name"], "actorRole": user["role"], "action": f"Question {item['status']}", "entity": "Question", "entityId": question_id, "entityName": item["stem"][:80], "outcome": "Success", "ip": "api"})
    return {"question": item, "feedback": payload.get("feedback", "")}


@router.get("/assessments")
async def assessments(user: dict = Depends(get_current_user)) -> dict[str, list[dict]]:
    return {"items": demo_store.assessments}


@router.get("/analytics")
async def analytics(user: dict = Depends(require_permission("analytics.read"))) -> dict:
    org_questions = demo_store.questions if user["role"] == "SA" else [q for q in demo_store.questions if q["orgId"] == user["orgId"]]
    return {
        "metrics": {
            "totalQuestions": len(org_questions),
            "approvedQuestions": len([q for q in org_questions if q["status"] == "Approved"]),
            "pendingReviews": len([q for q in org_questions if q["status"] in {"Pending Review", "In Review"}]),
            "activeProjects": len([p for p in demo_store.projects if p["status"] == "Active"]),
        }
    }


@router.get("/notifications")
async def notifications(user: dict = Depends(get_current_user)) -> dict[str, list[dict]]:
    return {"items": demo_store.notifications, "userId": user["id"]}


@router.get("/integrations")
async def integrations(user: dict = Depends(require_permission("integrations.manage"))) -> dict[str, list[dict]]:
    return {"items": demo_store.integrations}


@router.get("/api-keys")
async def api_keys(user: dict = Depends(require_permission("integrations.manage"))) -> dict[str, list[dict]]:
    return {"items": demo_store.api_keys}


@router.get("/audit-log")
async def audit_log(user: dict = Depends(require_permission("audit.read"))) -> dict[str, list[dict]]:
    return {"items": demo_store.audit_log}
