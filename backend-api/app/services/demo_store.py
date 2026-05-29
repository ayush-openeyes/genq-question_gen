from __future__ import annotations

import asyncio
from dataclasses import dataclass, field
from secrets import compare_digest
from uuid import uuid4


DEFAULT_PASSWORD = "demo1234"


@dataclass
class DemoStore:
    organizations: list[dict] = field(default_factory=list)
    users: list[dict] = field(default_factory=list)
    roles: list[dict] = field(default_factory=list)
    projects: list[dict] = field(default_factory=list)
    questions: list[dict] = field(default_factory=list)
    notifications: list[dict] = field(default_factory=list)
    audit_log: list[dict] = field(default_factory=list)
    assessments: list[dict] = field(default_factory=list)
    integrations: list[dict] = field(default_factory=list)
    api_keys: list[dict] = field(default_factory=list)
    generation_sessions: dict[str, dict] = field(default_factory=dict)
    refresh_tokens: dict[str, str] = field(default_factory=dict)

    def seed(self) -> None:
        if self.users:
            return
        self.organizations = [
            {"id": "org1", "name": "Acme Corp", "admin": "Morgan Lee", "plan": "Enterprise", "users": 24, "questions": 482, "storage": "1.2 GB", "status": "Active", "created": "2024-01-15"},
            {"id": "org-platform", "name": "OpenEyes Technologies", "admin": "Alex Carter", "plan": "Platform", "users": 6, "questions": 1949, "storage": "5.7 GB", "status": "Active", "created": "2024-01-01"},
        ]
        self.users = [
            {"id": "u1", "name": "Alex Carter", "email": "alex@genque.io", "role": "SA", "status": "Active", "avatar": "AC", "projects": 12, "lastLogin": "1 hour ago", "dateJoined": "2024-01-10", "org": "OpenEyes Technologies", "orgId": "org-platform"},
            {"id": "u2", "name": "Morgan Lee", "email": "morgan@acme.com", "role": "OA", "status": "Active", "avatar": "ML", "projects": 5, "lastLogin": "3 hours ago", "dateJoined": "2024-02-15", "org": "Acme Corp", "orgId": "org1"},
            {"id": "u3", "name": "Jordan Smith", "email": "jordan@acme.com", "role": "PM", "status": "Active", "avatar": "JS", "projects": 5, "lastLogin": "2 hours ago", "dateJoined": "2024-03-01", "org": "Acme Corp", "orgId": "org1"},
            {"id": "u4", "name": "Taylor Brown", "email": "taylor@acme.com", "role": "SME", "status": "Active", "avatar": "TB", "projects": 3, "lastLogin": "5 hours ago", "dateJoined": "2024-03-10", "org": "Acme Corp", "orgId": "org1"},
            {"id": "u5", "name": "Casey Wilson", "email": "casey@acme.com", "role": "RE", "status": "Active", "avatar": "CW", "projects": 4, "lastLogin": "1 day ago", "dateJoined": "2024-04-01", "org": "Acme Corp", "orgId": "org1"},
            {"id": "u6", "name": "Riley Evans", "email": "riley@acme.com", "role": "VI", "status": "Active", "avatar": "RE", "projects": 2, "lastLogin": "2 days ago", "dateJoined": "2024-04-15", "org": "Acme Corp", "orgId": "org1"},
        ]
        self.roles = [
            {"id": "SA", "name": "Super Admin", "system": True},
            {"id": "OA", "name": "Org Admin", "system": True},
            {"id": "PM", "name": "Project Manager", "system": True},
            {"id": "SME", "name": "Subject Matter Expert", "system": True},
            {"id": "RE", "name": "Reviewer/Editor", "system": True},
            {"id": "VI", "name": "Viewer/Stakeholder", "system": True},
        ]
        self.projects = [
            {"id": "p1", "name": "Nursing Certification Exam 2025", "status": "Active", "pm": "Jordan Smith", "pmAvatar": "JS", "description": "Level 2 cardiac physiology question bank for certification body.", "progress": 72, "target": 200, "approved": 144, "inReview": 18, "drafts": 24, "overdue": 4, "dueDate": "2025-08-15", "lastActivity": "2 hours ago", "teamSize": 8, "tags": ["nursing", "certification"], "orgId": "org1"},
            {"id": "p2", "name": "HR Onboarding Assessment", "status": "In Review", "pm": "Jordan Smith", "pmAvatar": "JS", "description": "Entry-level HR professional competency assessment.", "progress": 45, "target": 80, "approved": 36, "inReview": 22, "drafts": 12, "overdue": 1, "dueDate": "2025-07-01", "lastActivity": "1 day ago", "teamSize": 5, "tags": ["hr", "onboarding"], "orgId": "org1"},
            {"id": "p5", "name": "Technical Interview Bank", "status": "Active", "pm": "Jordan Smith", "pmAvatar": "JS", "description": "Full-stack developer technical screening questions.", "progress": 58, "target": 120, "approved": 70, "inReview": 15, "drafts": 25, "overdue": 2, "dueDate": "2025-08-01", "lastActivity": "5 hours ago", "teamSize": 6, "tags": ["technical", "interview"], "orgId": "org1"},
        ]
        self.questions = [
            {"id": "Q-00142", "stem": "Which of the following best describes the primary function of the sinoatrial (SA) node in cardiac physiology?", "format": "MCQ", "difficulty": "Medium", "status": "Approved", "project": "Nursing Certification Exam 2025", "projectId": "p1", "createdBy": "Taylor Brown", "lastModified": "2 days ago", "bloomsLevel": "Understand", "options": ["A. It controls blood pressure regulation", "B. It acts as the natural pacemaker generating electrical impulses", "C. It prevents backflow of blood between chambers", "D. It regulates oxygen exchange in the lungs"], "correct": "B", "explanation": "The SA node generates the electrical impulse that initiates each heartbeat, making it the primary pacemaker of the heart.", "orgId": "org1"},
            {"id": "Q-00143", "stem": "A patient presents with an irregular heartbeat and reduced cardiac output. Which condition is most likely?", "format": "MCQ", "difficulty": "Hard", "status": "Pending Review", "project": "Nursing Certification Exam 2025", "projectId": "p1", "createdBy": "Taylor Brown", "lastModified": "1 day ago", "bloomsLevel": "Apply", "options": ["A. Tachycardia", "B. Atrial fibrillation", "C. Hypertension", "D. Bradycardia"], "correct": "B", "explanation": "Atrial fibrillation is characterized by irregular electrical signals and reduced ventricular filling.", "orgId": "org1"},
            {"id": "Q-00146", "stem": "Which HR competency is most critical for successful employee onboarding?", "format": "MCQ", "difficulty": "Easy", "status": "Draft", "project": "HR Onboarding Assessment", "projectId": "p2", "createdBy": "Taylor Brown", "lastModified": "1 hour ago", "bloomsLevel": "Remember", "options": ["A. Payroll processing", "B. Cultural integration and role clarity", "C. Benefits negotiation", "D. Performance appraisal design"], "correct": "B", "explanation": "Cultural integration and role clarity are foundational to successful onboarding.", "orgId": "org1"},
        ]
        self.notifications = [
            {"id": "n1", "type": "success", "title": "Question Approved", "message": "Question Q-00142 in Nursing Certification Exam 2025 was approved by Casey Wilson.", "timestamp": "2 hours ago", "read": False, "link": "/questions/Q-00142/edit"},
            {"id": "n2", "type": "warning", "title": "Revision Required", "message": "Question Q-00147 requires revision.", "timestamp": "4 hours ago", "read": False, "link": "/questions/Q-00147/edit"},
        ]
        self.audit_log = [
            {"id": "al1", "timestamp": "2026-05-25T10:10:00Z", "actor": "Casey Wilson", "actorRole": "RE", "action": "Question Approved", "entity": "Question", "entityId": "Q-00142", "entityName": "SA node question", "outcome": "Success", "ip": "127.0.0.1"},
            {"id": "al2", "timestamp": "2026-05-25T10:12:00Z", "actor": "Jordan Smith", "actorRole": "PM", "action": "Project Created", "entity": "Project", "entityId": "p5", "entityName": "Technical Interview Bank", "outcome": "Success", "ip": "127.0.0.1"},
        ]
        self.assessments = [
            {"id": "a1", "name": "Module 1 Compliance Quiz", "project": "Compliance Training Module", "status": "Finalized", "questionCount": 20, "createdDate": "2025-04-28", "createdBy": "Jordan Smith"},
            {"id": "a2", "name": "Cardiac Physiology Mock Exam", "project": "Nursing Certification Exam 2025", "status": "Draft", "questionCount": 45, "createdDate": "2025-05-10", "createdBy": "Jordan Smith"},
        ]
        self.integrations = [
            {"id": "int1", "name": "Canvas LMS", "description": "Export assessments directly to Canvas courses.", "status": "Connected", "connectedSince": "2024-11-01", "lastSync": "2 hours ago", "syncStatus": "Success"},
            {"id": "int5", "name": "Custom LMS via API", "description": "Connect any LMS that supports QTI or REST APIs.", "status": "Not Connected", "connectedSince": None, "lastSync": None, "syncStatus": None},
        ]
        self.api_keys = [
            {"id": "k1", "name": "Production Integration", "key": "********************************7a3f", "created": "2025-01-10", "lastUsed": "1 hour ago", "scope": ["read:questions", "read:projects"], "status": "Active"},
        ]

    def _authenticate_sync(self, email: str, password: str) -> dict | None:
        if not compare_digest(password, DEFAULT_PASSWORD):
            return None
        return next((user for user in self.users if user["email"].lower() == email.lower()), None)

    async def authenticate(self, email: str, password: str) -> dict | None:
        return await asyncio.to_thread(self._authenticate_sync, email, password)

    def get_user(self, user_id: str) -> dict | None:
        return next((user for user in self.users if user["id"] == user_id), None)

    def remember_refresh(self, token: str, user_id: str) -> None:
        self.refresh_tokens[token] = user_id

    def rotate_refresh(self, token: str, replacement: str) -> dict | None:
        user_id = self.refresh_tokens.pop(token, None)
        if not user_id:
            return None
        self.refresh_tokens[replacement] = user_id
        return self.get_user(user_id)

    def create_generation_session(self, payload: dict, user: dict) -> dict:
        session_id = f"gs_{uuid4().hex[:12]}"
        questions = []
        for idx in range(payload.get("quantity", 3)):
            questions.append(
                {
                    "id": f"gq_{uuid4().hex[:8]}",
                    "format": payload.get("formats", ["MCQ"])[idx % len(payload.get("formats", ["MCQ"]))],
                    "difficulty": payload.get("difficulty", "Mixed"),
                    "stem": f"{payload['topic']} practice question {idx + 1}",
                    "options": ["Option A", "Option B", "Option C", "Option D"],
                    "correct": 1,
                }
            )
        session = {"id": session_id, "status": "completed", "payload": payload, "userId": user["id"], "questions": questions}
        self.generation_sessions[session_id] = session
        return session

    def save_generated(self, session_id: str, selected_ids: list[str] | None = None) -> list[dict]:
        session = self.generation_sessions[session_id]
        selected = selected_ids or [question["id"] for question in session["questions"]]
        saved = []
        project = next((item for item in self.projects if item["id"] == session["payload"]["projectId"]), self.projects[0])
        for question in session["questions"]:
            if question["id"] not in selected:
                continue
            saved_question = {
                **question,
                "id": f"Q-{len(self.questions) + 142:05d}",
                "status": "Draft",
                "project": project["name"],
                "projectId": project["id"],
                "createdBy": "AI Generator",
                "lastModified": "just now",
                "bloomsLevel": "Apply",
                "orgId": project["orgId"],
            }
            self.questions.append(saved_question)
            saved.append(saved_question)
        return saved


demo_store = DemoStore()
demo_store.seed()
