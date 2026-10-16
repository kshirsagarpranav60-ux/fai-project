import httpx
import json

client = httpx.Client(base_url="http://127.0.0.1:8000", timeout=30.0)

# 1. Health
h = client.get("/api/health").json()
print("1. Health Check:", h)

# 2. Occupations
occs = client.get("/api/occupations").json()
print(f"2. Occupations Count: {len(occs)} (First: {occs[0]['title']})")

# 3. Skills
skills = client.get("/api/skills").json()
print(f"3. Skills Count: {len(skills)} (First: {skills[0]['name']})")

# 4. Evaluation
eval_res = client.post("/api/assessments/evaluate", json={
    "occupation_id": 1,
    "skill_ratings": [{"skill_id": 1, "proficiency_level": 4}, {"skill_id": 15, "proficiency_level": 2}]
}).json()
print(f"4. Assessment Alignment: {eval_res['overall_alignment_score']}%, Status: {eval_res['status']}, Top Gap: {eval_res['top_gaps'][0]['skill_name']}")

# 5. Roadmap
rm = client.post("/api/roadmap/generate", json={
    "occupation_id": 1,
    "weekly_hours": 10,
    "skill_ratings": [{"skill_id": 1, "proficiency_level": 4}]
}).json()
print(f"5. Roadmap: {rm['total_estimated_weeks']} weeks, {len(rm['phases'])} phases")

# 6. Career Match
matches = client.post("/api/careers/match", json=[
    {"skill_id": 1, "proficiency_level": 4},
    {"skill_id": 5, "proficiency_level": 4}
]).json()
print(f"6. Best Career Fit: {matches[0]['title']} ({matches[0]['alignment_score']}%)")

# 7. Job Description Analysis
jd = client.post("/api/job/analyze", json={
    "job_title": "ML Engineer",
    "company": "Tech Corp",
    "raw_text": "We need Python, SQL, Docker, and Machine Learning.",
    "current_skill_ratings": [{"skill_id": 1, "proficiency_level": 4}, {"skill_id": 5, "proficiency_level": 3}]
}).json()
print(f"7. Job Match Score: {jd['match_score']}%, Matched: {jd['matched_skills']}, Missing: {jd['missing_skills']}")

# 8. AI Assistant Chat
chat = client.post("/api/ai/chat", json={
    "occupation_id": 1,
    "query": "What should I study this week?"
}).json()
print(f"8. AI Advisor ({chat['source']}): {chat['answer'][:100]}...")

# 9. Demo Mode
demo = client.get("/api/demo").json()
print(f"9. Demo User: {demo['user']['name']}, Readiness: {demo['assessment']['overall_alignment_score']}%, Delta: +{demo['reassessment']['score_delta']}%")
print("\n>>> ALL 9 CORE PIPELINE TESTS PASSED COMPLETELY! <<<")
